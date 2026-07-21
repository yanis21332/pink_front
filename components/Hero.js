"use client";

import styled from "styled-components";
import { SERVICES } from "../lib/data";
import { useEffect, useState } from "react";
import { API } from "../lib/data";

const HeroContainer = styled.div`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 28px;
  min-height: 200px;
  display: flex;
  align-items: flex-end;
  padding: 28px 32px;
  color: var(--blanc);
  animation: heroIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);

  @keyframes heroIn {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.99);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @media (max-width: 768px) {
    padding: 20px 24px;
    min-height: 160px;
  }
`;

const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position-x: center;
  filter: blur(3px) saturate(1.05);
  transform: scale(1);
  background-position-y: -16rem;
`;

const HeroVeil = styled.div`
  position: absolute;
  inset: 0;

  &.hammam {
    background: linear-gradient(
      180deg,
      rgb(247 239 228),
      rgb(255 223 188 / 99%)
    );
  }

  &.coloration {
    background: linear-gradient(
      180deg,
      rgba(27, 22, 19, 0.25),
      rgba(27, 22, 19, 0.82)
    );
  }

  &.mariees {
    background: linear-gradient(
      180deg,
      rgba(27, 22, 19, 0.35),
      rgba(251, 248, 243, 0.42)
    );
  }

  &.onglerie {
    background: linear-gradient(
      180deg,
      rgba(27, 22, 19, 0.15),
      rgba(178, 59, 59, 0.62)
    );
  }

  &.esthetique {
    background: linear-gradient(
      180deg,
      rgba(27, 22, 19, 0.2),
      rgba(231, 183, 190, 0.68)
    );
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;

  p,
  span,
  label,
  h1,
  h2,
  div,
  h3 {
    color: #ffdcc1 !important;
  }
`;

const Eyebrow = styled.div`
  font-family: var(--font-ibm-mono), "IBM Plex Mono", monospace;
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  opacity: 0.85;
  margin-bottom: 6px;

  &.alt-text {
    color: #2a2320;
    text-shadow: 0 1px 12px rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 768px) {
    font-size: 10px;
    letter-spacing: 2px;
  }
`;

const HeroTitle = styled.h2`
  font-family: var(--font-fraunces), "Fraunces", serif;
  font-size: 34px;
  font-weight: 500;
  letter-spacing: 0.2px;

  &.alt-text {
    color: #2a2320;
    text-shadow: 0 1px 12px rgba(255, 255, 255, 0.4);
  }

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const HeroCount = styled.div`
  font-family: var(--font-ibm-mono), "IBM Plex Mono", monospace;
  font-size: 12.5px;
  opacity: 0.9;
  margin-top: 8px;

  &.alt-text {
    color: #2a2320;
    text-shadow: 0 1px 12px rgba(255, 255, 255, 0.4);
  }

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

const HeroLabel = styled.div`
  font-family: "IBM Plex Mono", monospace;
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  opacity: 0.85;
  margin-bottom: 6px;
`;
const HeroAdditions = styled.p`
  font-family: "IBM Plex Mono", monospace;
  font-size: 12.5px;
  opacity: 0.9;
  margin-top: 8px;
`;
const HERO_ALT_TEXT_SERVICES = ["mariees", "esthetique"];

export default function Hero({ category, appts }) {
  const [mounted, setMounted] = useState(false);
  let count;
  useEffect(() => {
    setMounted(true);
  }, [appts]);
  useEffect(() => {
    if (mounted === true) {
      count = appts?.filter((a) => a.service === category).length;
    }
  }, [mounted]);
  const service = SERVICES[category];

  const isAltText = HERO_ALT_TEXT_SERVICES.includes(category);

  return (
    <HeroContainer>
      <HeroBg
        style={{
          backgroundImage: `url('${service.img}')`,
          zIndex: 1
        }}
      />
      <HeroVeil className={category} />
      <HeroContent>
        <Eyebrow className={isAltText ? "alt-text" : ""}>
          {service.eyebrow}
        </Eyebrow>
        <HeroTitle className={isAltText ? "alt-text" : ""}>
          {service.label}
        </HeroTitle>
        <HeroCount className={isAltText ? "alt-text" : ""}>
          {count && "0"} rendez-vous
        </HeroCount>
      </HeroContent>
    </HeroContainer>
  );
}
