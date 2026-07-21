"use client";

import { useState } from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: 1px solid rgba(251, 248, 243, 0.1);
  background: rgba(251, 248, 243, 0.02);
  overflow: hidden;
  transition: all 0.18s ease;

  &:hover {
    border-color: rgba(251, 248, 243, 0.15);
    background: rgba(251, 248, 243, 0.04);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const CardInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const SpentName = styled.h3`
  margin: 0;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--blanc);
`;

const SpentDate = styled.span`
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 13px;
  color: rgba(251, 248, 243, 0.6);
  padding: 4px 8px;
  background: rgba(251, 248, 243, 0.05);
  border-radius: 6px;
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  text-transform: uppercase;
  background: ${(props) =>
    props.$status === "paid"
      ? "rgba(31, 77, 31, 0.2)"
      : "rgba(178, 59, 59, 0.2)"};
  color: ${(props) => (props.$status === "paid" ? "#7bb783" : "#ed96a6")};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const Button = styled.button`
  padding: 8px 12px;
  border: 1px solid rgba(251, 248, 243, 0.2);
  border-radius: 6px;
  background: rgba(251, 248, 243, 0.05);
  color: rgba(251, 248, 243, 0.8);
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    background: rgba(251, 248, 243, 0.1);
    border-color: rgba(251, 248, 243, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const PrintButton = styled(Button)`
  background: linear-gradient(
    135deg,
    rgba(237, 100, 166, 0.1),
    rgba(237, 100, 166, 0.05)
  );
  border-color: rgba(237, 100, 166, 0.3);
  color: var(--rose);

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(237, 100, 166, 0.15),
      rgba(237, 100, 166, 0.1)
    );
    border-color: rgba(237, 100, 166, 0.4);
  }
`;

const DetailsButton = styled(Button)`
  color: var(--blanc);

  &:hover {
    border-color: var(--rose);
    color: var(--rose);
  }
`;

const DetailsSection = styled.div`
  display: ${(props) => (props.$open ? "block" : "none")};
  padding: 16px;
  border-top: 1px solid rgba(251, 248, 243, 0.08);
  background: rgba(251, 248, 243, 0.01);
  animation: slideDown 0.25s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
    }
    to {
      opacity: 1;
      max-height: 500px;
    }
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div``;

const DetailLabel = styled.span`
  display: block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(251, 248, 243, 0.5);
  margin-bottom: 6px;
  font-family: var(--font-ibm-mono), "IBM Plex Mono", monospace;
`;

const DetailValue = styled.span`
  display: block;
  font-size: 14px;
  color: var(--blanc);
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-weight: 500;
`;

const ServicesList = styled.div`
  margin-top: 16px;
`;

const ServicesTitle = styled.span`
  display: block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(251, 248, 243, 0.5);
  margin-bottom: 8px;
  font-family: var(--font-ibm-mono), "IBM Plex Mono", monospace;
`;

const ServiceItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 13px;
  color: rgba(251, 248, 243, 0.8);
  border-bottom: 1px solid rgba(251, 248, 243, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const TotalAmount = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  margin-top: 12px;
  border-top: 1px solid rgba(251, 248, 243, 0.1);
  font-weight: 600;
  color: var(--rose);
  font-size: 15px;
`;

const DeleteButton = styled.button`
  background: rgba(178, 59, 59, 0.15);
  border-color: rgba(178, 59, 59, 0.35);
  color: #ed96a6;
  border: 1px solid rgba(251, 248, 243, 0.2);
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: rgba(178, 59, 59, 0.25);
    border-color: rgba(178, 59, 59, 0.5);
    color: #f7b2bd;
  }
`;
const DetailsFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(251, 248, 243, 0.08);
`;
export default function SpentCard({ spent, onDeleteSucess }) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getServiceName = () => {
    return spent.name;
  };

  const [isDeleting,setIsDeleting] = useState(false);
  const handleDeleteSpent = async () => {
    const spentId = spent.id || spent._id;
    if(!spentId) return;
    setIsDeleting(true);
    if(onDeleteSucess){
        onDeleteSucess(spentId);
        setIsDeleting(false);
        return;
    }
  }
  return (
    <CardContainer>
      <CardHeader>
        <CardInfo>
          <div>
            <SpentName>{spent.name || "Client inconnu"}</SpentName>
            <SpentDate>{formatDate(spent.spentDate)}</SpentDate>
          </div>
        </CardInfo>
        <ActionButtons>
          <DetailsButton onClick={() => setDetailsOpen(!detailsOpen)}>
            {detailsOpen ? "Masquer" : "Détails"}
          </DetailsButton>
        </ActionButtons>
      </CardHeader>

      <DetailsSection $open={detailsOpen}>
        <DetailGrid>
          <DetailItem>
            <DetailLabel>Montant Total</DetailLabel>
            <DetailValue>{spent.value || 0} DA</DetailValue>
          </DetailItem>
          <DetailsFooter>
            <DeleteButton onClick={handleDeleteSpent} disabled={isDeleting}>
              {isDeleting ? "Suppression..." : "Supprimer la dépense"}
            </DeleteButton>
          </DetailsFooter>
        </DetailGrid>
      </DetailsSection>
    </CardContainer>
  );
}
