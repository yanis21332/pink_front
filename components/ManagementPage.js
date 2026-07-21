"use client";

import { useState } from "react";
import styled from "styled-components";
import BillsTab from "./BillsTab";
import SpentsTab from "./SpentsTab";
import StatsTab from "./StatsTab";
import PersonnelTab from "./PersonnelTab";
import api from "../lib/axios";
import { API } from "../lib/data";

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  min-height: 100vh;
  background-color: #0e0b09 !important;

  p,
  h1,
  h2,
  h3,
  span,
  input,
  button,
  select,
  option {
    color: #fbf8f3 !important;
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const TabNavigation = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 12px;
  border-bottom: 1px solid rgba(251, 248, 243, 0.1);
  padding-bottom: 16px;

  @media (max-width: 768px) {
    align-items: center;
  }
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

const Hamburger = styled.button`
  display: none;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid #616161;
  background: #0e0b09;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    display: flex;
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


function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
export default function ManagementPage({
  menu,
  practitioners,
  onBillsChange,
  totalBillPages,
  onHamburgerClick,
  setCurrentBillPage,
  onPractitionersChange,
  onMenuChange,
}) {
  const [activeTab, setActiveTab] = useState("factures");
  
  return (
    <TabContainer>
      <TabNavigation>
        <Hamburger onClick={onHamburgerClick}>
          <MenuIcon />
        </Hamburger>
        <TabButton
          className={activeTab === "factures" ? "active" : ""}
          onClick={() => setActiveTab("factures")}
        >
          Factures
        </TabButton>
        <TabButton
          className={activeTab === "depenses" ? "active" : ""}
          onClick={() => setActiveTab("depenses")}
        >
          Dépenses
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
      <TabContent $active={activeTab === "depenses"}>
        <SpentsTab menu={menu} onBillsChange={onBillsChange} />
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
