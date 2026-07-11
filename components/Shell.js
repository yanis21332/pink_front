import styled from "styled-components";
import { API } from "../lib/data";

export const ShellContainer = styled.div`
  display: flex;
  min-height: 100vh;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Sidebar = styled.aside`
  width: 248px;
  flex-shrink: 0;
  background: var(--noir);
  color: var(--blanc);
  padding: 28px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 30;

  &.open {
    left: 0;
  }

  @media (max-width: 768px) {
    position: fixed;
    height: 100vh;
    left: -248px;
    transition: left 0.3s ease;
    z-index: 40;

    &.open {
      left: 0;
    }
  }
`;

export const Scrim = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 35;
    opacity: 0;
    transition: opacity 0.3s ease;

    &.open {
      display: block;
      opacity: 1;
    }
  }
`;

export const MainContent = styled.main`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background-color: ${(props) =>
    props.$category === "hammam"
      ? "#ffedd1"
      : props.$category === "coloration"
        ? "#0e0b09"
        : props.$category==="mariees"?"#f9f7ff": props.$category==="esthetique"?"#ffdcdc":props.$category==="onglerie"?"#601313":"#fff"};

  div,
  p,
  h1,
  h2,
  h3,
  input {
    ${(props) =>
      props.$category === "hammam" && "color: var(--ink) ;"}
  }
`;
