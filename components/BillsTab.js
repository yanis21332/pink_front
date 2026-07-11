"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";
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

export default function BillsTab({ bills, menu, onBillsChange }) {
  const [sortBy, setSortBy] = useState("date-desc");
  const [displayedBills, setDisplayedBills] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef(null);
  const [itemsPerPage] = useState(10);
  const [totalLoaded, setTotalLoaded] = useState(itemsPerPage);

  // Tri des factures
  const sortBills = useCallback(
    (billsToSort) => {
      const sorted = [...billsToSort];

      switch (sortBy) {
        case "date-desc":
          sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          break;
        case "date-asc":
          sorted.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
          break;
        case "amount-desc":
          sorted.sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0));
          break;
        case "amount-asc":
          sorted.sort((a, b) => (a.totalAmount || 0) - (b.totalAmount || 0));
          break;
        case "status":
          sorted.sort((a, b) => Number(b.isPaid) - Number(a.isPaid));
          break;
        default:
          break;
      }

      return sorted;
    },
    [sortBy],
  );

  // Affichage initial
  useEffect(() => {
    const sorted = sortBills(bills);
    setDisplayedBills(sorted.slice(0, itemsPerPage));
    setTotalLoaded(itemsPerPage);
  }, [bills, sortBy, sortBills, itemsPerPage]);

  // Intersection Observer pour le lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && totalLoaded < bills.length) {
          setIsLoading(true);
          setTimeout(() => {
            const sorted = sortBills(bills);
            const newTotal = Math.min(totalLoaded + itemsPerPage, bills.length);
            setDisplayedBills(sorted.slice(0, newTotal));
            setTotalLoaded(newTotal);
            setIsLoading(false);
          }, 300);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [totalLoaded, bills, sortBills, itemsPerPage]);

  const handleCreateBill = async (billData) => {
    try {
      const response = await axios.post(
        `${API}/api/bills/create-bill`,
        billData,
        { withCredentials: true },
      );

      const newBill = {
        ...response.data,
        id: response.data._id,
      };

      setModalOpen(false);
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
            {displayedBills.map((bill) => (
              <BillCard key={bill.id} bill={bill} menu={menu} />
            ))}
          </BillsList>

          {totalLoaded < bills.length && (
            <div ref={observerTarget}>
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
