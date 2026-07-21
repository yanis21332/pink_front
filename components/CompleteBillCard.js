"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
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

const ClientName = styled.h3`
  margin: 0;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--blanc);
`;

const BillDate = styled.span`
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

const Separator = styled.div`
  width: 100%;
  height: 1px;
  background: #7a7a7a94;
  margin-bottom: 18px;
  margin-top: 18px;
`;

const TicketContainer = styled.div`
  width: 80mm;
  padding: 4mm;
  font-family: "Courier New", Courier, monospace;
  font-size: 12px;
  line-height: 1.2;
  color: #000;
  background: #fff;

  @media print {
    @page {
      size: 80mm auto;
      margin: 0;
    }

    body {
      margin: 0;
      padding: 0;
    }
  }
`;

const TicketHeader = styled.div`
  text-align: center;
  margin-bottom: 8px;
  border-bottom: 1px dashed #000;
  padding-bottom: 8px;

  h2 {
    font-size: 16px;
    font-weight: bold;
    margin: 0 0 4px 0;
    text-transform: uppercase;
  }

  p {
    margin: 2px 0;
    font-size: 10px;
  }
`;

const TicketBody = styled.div`
  margin-bottom: 8px;
`;

const LineItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 4px 0;
`;

const Divider = styled.div`
  border-top: 1px dashed #000;
  margin: 6px 0;
`;

const TicketTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: bold;
  margin-top: 6px;
`;

const TicketFooter = styled.div`
  text-align: center;
  margin-top: 12px;
  font-size: 10px;
  border-top: 1px dashed #000;
  padding-top: 8px;
`;

export default function CompleteBillCard({ bill, menu, onDeleteSuccess }) {
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

  const getServiceName = (serviceId) => {
    for (const category of menu) {
      if (category.services && Array.isArray(category.services)) {
        const service = category.services.find(
          (s) => s.id === serviceId || s._id === serviceId,
        );
        if (service) {
          return service.name || service.label || "Service inconnu";
        }
      }
    }
    return "Service inconnu";
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteBill = async (b) => {
    const billId = b._id || b.id;
    if (!billId) return;
    setIsDeleting(true);
    if (onDeleteSuccess) {
      onDeleteSuccess(billId);
      setIsDeleting(false);
      return;
    }

    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette facture 2 ?",
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`${API}/api/bills/delete-bill/${billId}`);
      if (onDeleteSuccess) {
        onDeleteSuccess(billId);
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de la facture :", err);
      alert("Une erreur est survenue lors de la suppression de la facture.");
    } finally {
      setIsDeleting(false);
    }
  };

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  const BillPrintable = React.forwardRef(({ bill }, ref) => (
    <TicketContainer ref={ref}>
      <TicketHeader>
        <h2>Pink Studio • Institut de Beauté</h2>
        <p>Rue Frères Belhadj, Tizi Ouzou 15000</p>
        <p>Tél : 0550 71 74 91</p>
        <p>
          Date :{" "}
          {new Date(bill?.createdAt || Date.now()).toLocaleDateString("fr-FR")}
        </p>
      </TicketHeader>

      <TicketBody>
        <p style={{ margin: "4px 0" }}>
          <strong>Client :</strong> {bill?.clientName || "Passage"}
        </p>
        <Divider />

        {/* Exécution des prestations / services */}
        {bill?.servicesConsumed?.map((item, idx) => (
          <LineItem key={idx}>
            <span>{item.serviceName || item.serviceId}</span>
            <span>{item.priceAtPurchase} DA</span>
          </LineItem>
        ))}

        <Divider />

        <TicketTotal>
          <span>TOTAL</span>
          <span>{bill?.totalAmount || 0} DA</span>
        </TicketTotal>

        <p style={{ fontSize: "10px", margin: "4px 0 0 0" }}>
          Paiement : {bill?.paymentMethod || "Espèces"} (
          {bill?.isPaid ? "Payé" : "Non payé"})
        </p>
      </TicketBody>

      <TicketFooter>
        <p>Merci pour votre visite !</p>
        <p>À bientôt</p>
      </TicketFooter>
    </TicketContainer>
  ));
  return (
    <CardContainer>
      <CardHeader>
        <CardInfo>
          <div>
            <ClientName>{bill.commonClientName || "Client inconnu"}</ClientName>
            <BillDate>{bill.list.length} factures trouvées !</BillDate>
          </div>
        </CardInfo>
        <ActionButtons>
          <DetailsButton onClick={() => setDetailsOpen(!detailsOpen)}>
            {detailsOpen ? "Masquer" : "Détails"}
          </DetailsButton>
        </ActionButtons>
      </CardHeader>

      <DetailsSection $open={detailsOpen}>
        {bill.list.map((b, i) => (
          <React.Fragment key={`${b._id || b.id}-${i}`}>
            <DetailGrid key={`${b._id}-${i}`}>
              <DetailItem>
                <DetailLabel>Montant Total</DetailLabel>
                <DetailValue>{b.totalAmount || 0} DA</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Méthode de Paiement</DetailLabel>
                <DetailValue>{b.paymentMethod || "N/A"}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Statut</DetailLabel>
                <DetailValue>
                  {b.isPaid === true ? "Payée" : "Non payée"}
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Date</DetailLabel>
                <DetailValue>{formatDate(b.createdAt)}</DetailValue>
              </DetailItem>
              <PrintButton onClick={handlePrint}>Imprimer</PrintButton>
              <div style={{ display: "none" }}>
                <BillPrintable ref={componentRef} bill={bill} />
              </div>
              <DeleteButton
                onClick={() => handleDeleteBill(b)}
                disabled={isDeleting}
              >
                {isDeleting ? "Suppression..." : "Supprimer la facture"}
              </DeleteButton>
            </DetailGrid>
            <Separator />
          </React.Fragment>
        ))}

        {bill.services && bill.services.length > 0 && (
          <ServicesList>
            <ServicesTitle>Services facturés</ServicesTitle>
            {bill.services.map((service, idx) => (
              <ServiceItem key={idx}>
                <span>{getServiceName(service.serviceId)}</span>
                <span>{service.price} DA</span>
              </ServiceItem>
            ))}
            <TotalAmount>
              <span>Total</span>
              <span>{bill.totalAmount || 0} DA</span>
            </TotalAmount>
          </ServicesList>
        )}
      </DetailsSection>
    </CardContainer>
  );
}
