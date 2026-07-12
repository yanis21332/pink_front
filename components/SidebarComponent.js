"use client";

import styled from "styled-components";
import { SERVICES, CAT_KEYS } from "../lib/data";

const Brand = styled.div`
  padding: 4px 10px 26px 10px;
`;

const BrandMark = styled.div`
  font-family: var(--font-fraunces), "Fraunces", serif;
  font-style: italic;
  font-weight: 500;
  font-size: 26px;
  letter-spacing: 0.3px;
`;

const BrandSub = styled.div`
  font-family: var(--font-ibm-mono), "IBM Plex Mono", monospace;
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--beige-soft);
  opacity: 0.7;
  margin-top: 2px;
`;
const BrandCircle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
  background-size: cover;
  background-position: center;
  box-shadow: 0 0 0 2px rgba(251, 248, 243, 0.25);

  &.imgCircle{
    background-image: url('/imports/pink${props=>props.$imgI}.jpeg')
  }
  &.redCircle {
    background: linear-gradient(
      135deg,
      var(--beige),
      var(--rouge),
      var(--rose)
    );
  }
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  color: rgba(251, 248, 243, 0.72);
  transition:
    background 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
  border: 1px solid transparent;
  background: transparent;
  font-family: var(--font-manrope), "Manrope", sans-serif;

  &:hover {
    background: rgba(251, 248, 243, 0.06);
    color: var(--blanc);
  }

  &.active {
    background: rgba(251, 248, 243, 0.1);
    color: var(--blanc);
    border-color: rgba(251, 248, 243, 0.14);
  }
`;

const NavDot = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
  background-size: cover;
  background-position: center;
  box-shadow: 0 0 0 2px rgba(251, 248, 243, 0.25);
`;

const NavCount = styled.span`
  margin-left: auto;
  font-family: var(--font-ibm-mono), "IBM Plex Mono", monospace;
  font-size: 11px;
  opacity: 0.55;
`;

const SidebarFoot = styled.div`
  margin-top: auto;
  padding: 12px 10px 0 10px;
  font-size: 11px;
  color: rgba(251, 248, 243, 0.4);
  line-height: 1.5;
`;

export default function SidebarComponent({
  activeCategory,
  appts,
  onCategoryChange,
  onManagementClick,
}) {
  const countByCat = (cat) => {
    if(!cat) return;
    if(!appts) return;
    if (cat === "all") return appts.length;
    return appts.filter((a) => a.service === cat).length;
  };

  return (
    <>
      <Brand>
        <BrandMark>Pink Studio.</BrandMark>
        <BrandSub>Agenda & suivi clients</BrandSub>
      </Brand>

      {CAT_KEYS.map((key,i) => {
        const service = SERVICES[key];
        const count = countByCat(key);

        return (
          <NavItem
            key={key}
            className={activeCategory === key ? "active" : ""}
            onClick={() => onCategoryChange(key)}
          >
            <BrandCircle className="imgCircle" $imgI={i+1}></BrandCircle>
            <span>{service.label}</span>
          </NavItem>
        );
      })}

      <NavItem
        className={activeCategory === "gestion" ? "active" : ""}
        onClick={() => onManagementClick?.()}
        style={{ marginTop: "auto", marginBottom: "12px" }}
      >
        <BrandCircle className="redCircle"></BrandCircle>
        <span>Gestion</span>
      </NavItem>

      <SidebarFoot>
        Pink Studio v1.0
        <br />
        Gestion des rendez-vous
      </SidebarFoot>
    </>
  );
}
