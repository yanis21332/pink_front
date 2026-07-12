"use client";

import { useState } from "react";
import styled from "styled-components";
import BillsTab from "./BillsTab";
import StatsTab from "./StatsTab";
import PersonnelTab from "./PersonnelTab";

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  min-height: 100vh;
  background-color: #0e0b09 !important;

  p,h1,h2,h3,span,input,button,select,option{
    color: #fbf8f3 !important;
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const TabNavigation = styled.div`
  display: flex;
  gap: 12px;
  border-bottom: 1px solid rgba(251, 248, 243, 0.1);
  padding-bottom: 16px;
`;

const TabButton = styled.button`
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: rgba(251, 248, 243, 0.6);
  font-weight: 600;
  font-size: 14px;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    color: rgba(251, 248, 243, 0.8);
  }

  &.active {
    color: var(--blanc);
    border-bottom-color: var(--rose);
  }
`;

const TabContent = styled.div`
  display: ${(props) => (props.$active ? "block" : "none")};
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export default function ManagementPage({  menu, practitioners, onBillsChange,totalBillPages,setCurrentBillPage, onPractitionersChange, onMenuChange }) {
  const [activeTab, setActiveTab] = useState("factures");

  return (
    <TabContainer>
      <TabNavigation>
        <TabButton
          className={activeTab === "factures" ? "active" : ""}
          onClick={() => setActiveTab("factures")}
        >
          Factures
        </TabButton>
        <TabButton
          className={activeTab === "stats" ? "active" : ""}
          onClick={() => setActiveTab("stats")}
        >
          Stats
        </TabButton>
        <TabButton
          className={activeTab === "personnel" ? "active" : ""}
          onClick={() => setActiveTab("personnel")}
        >
          Mon Personel
        </TabButton>
      </TabNavigation>

      <TabContent $active={activeTab === "factures"}>
        <BillsTab menu={menu} onBillsChange={onBillsChange} />
      </TabContent>

      <TabContent $active={activeTab === "stats"}>
        <StatsTab />
      </TabContent>

      <TabContent $active={activeTab === "personnel"}>
        <PersonnelTab
          practitioners={practitioners}
          onPractitionersChange={onPractitionersChange}
          menu={menu}
          onMenuChange={onMenuChange}
        />
      </TabContent>
    </TabContainer>
  );
}
