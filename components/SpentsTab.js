"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import api from "../lib/axios";
import { API } from "../lib/data";
import SpentFormModal from "./SpentFormModal";
import SpentCard from "./SpentCard";

const SpentsContainer = styled.div`
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

const AddSpentButton = styled.button`
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

const SpentsList = styled.div`
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
const SearchSpace = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  border: 1px solid #81818188;
  background: #0e0b09;
  padding-left: 10px;

  input {
    padding: 10px 16px;
    background: #0e0b09;
    border: none;
    &:focus {
      outline: none;
    }
  }

  button {
    cursor: pointer;
    padding: 0px 9px;
    background: #1a1715;
    border: none;
    text-transform: uppercase;
    font-size: 11px;
    border-radius: 5px;
    letter-spacing: 1.2px;
    opacity: ${(props) => (props.$isLoading ? "0.6" : "1")};
  }
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 20px;
  color: rgba(251, 248, 243, 0.6) !important;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 14px;
`;

const ResetB = styled.button`
  outline: none;
  cursor: pointer;
  border: none;
  background: transparent;
  color: gray !important;
  letter-spacing: 1.2px;
  font-weight: 600;
  text-align: end;
  text-transform: uppercase;
  opacity: 0.69;
  font-size: 11px;
`;

export default function BillsTab({ menu, onSpentsChange }) {
  const [sortBy, setSortBy] = useState("date-desc");
  const [displayedSpents, setDisplayedSpents] = useState([]);
  const [searchedSpents, setSearchedSpents] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef(null);
  const [itemsPerPage] = useState(10);

  // Fonction unique de récupération de données depuis le serveur
  const fetchSpentsFromServer = useCallback(
    async (pageToFetch, isNewSort = false) => {
      if (isLoading) return;
      setIsLoading(true);

      try {
        // Envoi des query params corrects au Back-end (page, limit, sort)
        const response = await api.get(
          `${API}/api/spents/get-spents?page=${pageToFetch}&limit=${itemsPerPage}&sort=${sortBy}`,
          { withCredentials: true },
        );

        const { spents: fetchedSpents, pagination } = response.data;

        const mappedData = fetchedSpents.map((spent) => ({
          ...spent,
          id: spent._id,
        }));

        setDisplayedSpents((prevSpents) => {
          // Si on change de tri, on remplace les données. Sinon, on les ajoute à la suite.
          const updated = isNewSort
            ? mappedData
            : [...prevSpents, ...mappedData];

          return updated;
        });

        // Met à jour la présence ou non de pages supplémentaires
        setHasMore(pageToFetch < pagination.totalPages);
      } catch (err) {
        console.error("Erreur lors de la récupération des dépenses :", err);
      } finally {
        setIsLoading(false);
      }
    },
    [sortBy, itemsPerPage, isLoading, onSpentsChange],
  );

  // Effet 1 : Déclenché uniquement lorsque le critère de tri change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchSpentsFromServer(1, true);
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
            fetchSpentsFromServer(nextPage, false);
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
  }, [hasMore, isLoading, fetchSpentsFromServer]);

  const handleDeleteSpent = async (id) => {
    if (!id) return;

    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette dépense ?",
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`${API}/api/spents/delete-spent/${id}`);
      setDisplayedSpents((prev) => prev.filter((bill) => bill.id !== id));
      setSearchedSpents((prev) => prev.filter((bill) => bill.id !== id));
      if (isSearchMode === true) {
        setIsSearchMode(false);
        setQuerySearch("");
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de la dépense :", err);
      alert("Une erreur est survenue lors de la suppression de la dépense.");
    }
  };
  const handleCreateSpent = async (spentData) => {
    try {
      const response = await api.post(
        `${API}/api/spents/create-spent`,
        spentData,
        { withCredentials: true },
      );

      setModalOpen(false);

      // Réinitialise le défilement et recharge depuis la première page pour voir le nouvel élément
      setPage(1);
      setHasMore(true);
      fetchSpentsFromServer(1, true);
    } catch (error) {
      console.error("Erreur lors de la création de la facture :", error);
      throw error;
    }
  };

  const [querySearch, setQuerySearch] = useState("");

  const handleSave = async () => {
    if (querySearch === "") {
      return;
    }
    setIsSearchMode(true);
    setIsLoading(true);
    try {
      const response = await api.get(
        `${API}/api/spents/search?q=${querySearch}`,
      );

      const sSpents = response.data.spents;

      setSearchedSpents(sSpents);
      setIsLoading(false);
    } catch (err) {
      console.error("Erreur lors de la recherche de la facture :", error);
      setIsLoading(false);
      throw error;
    }
  };

  return (
    <SpentsContainer>
      <HeaderSection>
        <Title>Dépenses</Title>
        <ControlsSection>
          <SortSelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">Plus récentes d'abord</option>
            <option value="date-asc">Plus anciennes d'abord</option>
            <option value="amount-desc">Montant décroissant</option>
            <option value="amount-asc">Montant croissant</option>
          </SortSelect>
          <AddSpentButton onClick={() => setModalOpen(true)}>
            + Ajouter une dépense
          </AddSpentButton>
        </ControlsSection>
      </HeaderSection>
      <SearchSpace $isLoading={isLoading}>
        <input
          type="input"
          placeholder="Rechercher par nom..."
          value={querySearch}
          onChange={(e) => setQuerySearch(e.target.value)}
        />
        <button onClick={() => !isLoading && handleSave()}>
          {isLoading === true ? "Recherche..." : "Rechercher"}
        </button>
      </SearchSpace>
      {isSearchMode === true && (
        <ResetB
          onClick={() => {
            setIsSearchMode(false);
            setQuerySearch("");
          }}
        >
          Réinitialiser X
        </ResetB>
      )}
      {displayedSpents.length === 0 && !isLoading ? (
        <EmptyState>
          <p>Aucune dépense pour le moment</p>
        </EmptyState>
      ) : (
        <>
          <SpentsList>
            {isSearchMode === false
              ? displayedSpents.map((spent, i) => (
                  <SpentCard key={`${spent.id}x${i}`} spent={spent} onDeleteSucess={handleDeleteSpent} />
                ))
              : searchedSpents.map((spent, i) => (
                  <SpentCard key={`${spent.id}x${i}`} spent={spent} onDeleteSucess={handleDeleteSpent}  />
                ))}
          </SpentsList>

          {/* L'élément cible de l'observer s'affiche uniquement s'il reste des éléments à charger */}
          {hasMore && (
            <div
              ref={observerTarget}
              style={{ minHeight: "30px", margin: "10px 0" }}
            >
              {isLoading && <LoadingIndicator>Chargement...</LoadingIndicator>}
            </div>
          )}
        </>
      )}

      <SpentFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCreateSpent}
        menu={menu}
      />
    </SpentsContainer>
  );
}
