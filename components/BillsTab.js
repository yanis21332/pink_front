"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import api from "../lib/axios";
import BillCard from "./BillCard";
import { API } from "../lib/data";
import BillFormModal from "./BillFormModal";

const BillsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--blanc) !important;
  margin: 0;
`;

const ControlsSection = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const SortSelect = styled.select`
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid rgba(251, 248, 243, 0.15);
  background: rgba(251, 248, 243, 0.05);
  color: var(--blanc) !important;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    border-color: rgba(251, 248, 243, 0.25);
    background: rgba(251, 248, 243, 0.08);
  }

  &:focus {
    outline: none;
    border-color: var(--rose);
    background: rgba(251, 248, 243, 0.1);
  }

  option {
    background: var(--noir);
    color: var(--blanc) !important;
  }
`;

const AddBillButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid rgba(251, 248, 243, 0.2);
  background: linear-gradient(135deg, var(--rose), var(--rose-light));
  color: var(--blanc) !important;
  font-weight: 600;
  font-size: 13px;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(237, 100, 166, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const BillsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(251, 248, 243, 0.15);
    border-radius: 3px;

    &:hover {
      background: rgba(251, 248, 243, 0.25);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(251, 248, 243, 0.5) !important;
  font-family: var(--font-manrope), "Manrope", sans-serif;

  p {
    margin: 0;
    font-size: 16px;
  }
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 20px;
  color: rgba(251, 248, 243, 0.6) !important;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 14px;
`;
export default function BillsTab({
  menu,
  onBillsChange,
}) {
  const [sortBy, setSortBy] = useState("date-desc");
  const [displayedBills, setDisplayedBills] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef(null);
  const [itemsPerPage] = useState(10);

  // Fonction unique de récupération de données depuis le serveur
  const fetchBillsFromServer = useCallback(
    async (pageToFetch, isNewSort = false) => {
      if (isLoading) return;
      setIsLoading(true);

      try {
        // Envoi des query params corrects au Back-end (page, limit, sort)
        const response = await api.get(
          `${API}/api/bills/get-bills?page=${pageToFetch}&limit=${itemsPerPage}&sort=${sortBy}`,
          { withCredentials: true },
        );

        const { bills: fetchedBills, pagination } = response.data;

        const mappedData = fetchedBills.map((bill) => ({
          ...bill,
          id: bill._id,
        }));

        setDisplayedBills((prevBills) => {
          // Si on change de tri, on remplace les données. Sinon, on les ajoute à la suite.
          const updated = isNewSort ? mappedData : [...prevBills, ...mappedData];
          
          return updated;
        });

        // Met à jour la présence ou non de pages supplémentaires
        setHasMore(pageToFetch < pagination.totalPages);
      } catch (err) {
        console.error("Erreur lors de la récupération des factures :", err);
      } finally {
        setIsLoading(false);
      }
    },
    [sortBy, itemsPerPage, isLoading, onBillsChange],
  );

  // Effet 1 : Déclenché uniquement lorsque le critère de tri change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchBillsFromServer(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  // Effet 2 : Un seul et unique Intersection Observer connecté au Scroll
  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchBillsFromServer(nextPage, false);
            return nextPage;
          });
        }
      },
      { threshold: 1.0 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasMore, isLoading, fetchBillsFromServer]);

  const handleCreateBill = async (billData) => {
    try {
      const response = await api.post(
        `${API}/api/bills/create-bill`,
        billData,
        { withCredentials: true },
      );

      setModalOpen(false);
      
      // Réinitialise le défilement et recharge depuis la première page pour voir le nouvel élément
      setPage(1);
      setHasMore(true);
      fetchBillsFromServer(1, true);
    } catch (error) {
      console.error("Erreur lors de la création de la facture :", error);
      throw error;
    }
  };

  return (
    <BillsContainer>
      <HeaderSection>
        <Title>Factures</Title>
        <ControlsSection>
          <SortSelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">Plus récentes d'abord</option>
            <option value="date-asc">Plus anciennes d'abord</option>
            <option value="amount-desc">Montant décroissant</option>
            <option value="amount-asc">Montant croissant</option>
            <option value="status">Payées en premier</option>
          </SortSelect>
          <AddBillButton onClick={() => setModalOpen(true)}>
            + Ajouter une facture
          </AddBillButton>
        </ControlsSection>
      </HeaderSection>

      {displayedBills.length === 0 && !isLoading ? (
        <EmptyState>
          <p>Aucune facture pour le moment</p>
        </EmptyState>
      ) : (
        <>
          <BillsList>
            {displayedBills.map((bill, i) => (
              <BillCard key={`${bill.id}x${i}`} bill={bill} menu={menu} />
            ))}
          </BillsList>

          {/* L'élément cible de l'observer s'affiche uniquement s'il reste des éléments à charger */}
          {hasMore && (
            <div ref={observerTarget} style={{ minHeight: "30px", margin: "10px 0" }}>
              {isLoading && <LoadingIndicator>Chargement...</LoadingIndicator>}
            </div>
          )}
        </>
      )}

      <BillFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCreateBill}
        menu={menu}
      />
    </BillsContainer>
  );
}