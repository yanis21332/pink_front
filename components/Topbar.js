'use client';

import styled from 'styled-components';

const TopbarContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(246, 241, 233, 0.88);
  background: ${(props)=>props.$category==="hammam"?"rgba(246, 241, 233, 0.88)":props.$category==="coloration"?"#0e0b09":props.$category==="mariees"?"#f9f7ff":props.$category==="esthetique"?"#ffdcdc":props.$category==="onglerie"?"#601313":"#fff"};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
  padding: 16px 32px;
  display: flex;
  align-items: center;
  gap: 14px;

  @media (max-width: 768px) {
    padding: 12px 16px;
    gap: 10px;
  }
`;

const Hamburger = styled.button`
  display: none;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--blanc);
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

const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  max-width: 340px;

  input {
    width: 100%;
    padding: 10px 14px 10px 36px;
    border-radius: 10px;
    border: 1px solid var(--line);
    background: ${(props) =>
      props.$category === 'hammam'
        ? '#fff4e5'
        : props.$category === 'coloration'
          ? '#1c1c1c'
          : props.$category === 'mariees'
            ? '#f7f2ff'
            : props.$category === 'esthetique'
              ? '#fff1f1'
              : props.$category === 'onglerie'
                ? '#531616'
                : 'var(--blanc)'};
    color: ${(props) =>
      props.$category === 'coloration' || props.$category === 'onglerie'
        ? 'var(--blanc)'
        : 'var(--ink)'};
    font-family: var(--font-manrope), 'Manrope', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.15s;

    &:focus {
      border-color: var(--beige);
    }
  }

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    opacity: 0.45;
  }
`;

const FilterBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--blanc);
  font-family: var(--font-manrope), 'Manrope', sans-serif;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: var(--beige);
  }

  &.active {
    background: var(--noir);
    color: var(--blanc);
    border-color: var(--noir);
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

const BtnNew = styled.button`
  background: var(--noir);
  color: var(--blanc);
  border: none;
  padding: 11px 20px;
  border-radius: 10px;
  font-family: var(--font-manrope), 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 13.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 9px 14px;
    font-size: 12px;
  }
`;

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export default function Topbar({
  searchValue,
  onSearchChange,
  filterOpen,
  onFilterToggle,
  onNewClick,
  onHamburgerClick,
  category
}) {
  return (
    <TopbarContainer $category={category}>
      <Hamburger onClick={onHamburgerClick}>
        <MenuIcon />
      </Hamburger>

      <SearchWrap $category={category}>
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <SearchIcon />
      </SearchWrap>

      <FilterBtn
        className={filterOpen ? 'active' : ''}
        onClick={onFilterToggle}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="8" y1="12" x2="16" y2="12"></line><line x1="11" y1="18" x2="13" y2="18"></line></svg>
        Filtres
      </FilterBtn>

      <Spacer />

      <BtnNew onClick={onNewClick}>
       <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Nouveau
      </BtnNew>
    </TopbarContainer>
  );
}
