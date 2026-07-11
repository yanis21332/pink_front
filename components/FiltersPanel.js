'use client';

import styled from 'styled-components';

const FiltersPanelContainer = styled.div`
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, margin 0.3s ease, opacity 0.3s ease;
  opacity: 0;
  background: ${(props) =>
    props.$category === 'hammam'
      ? '#fff5e8'
      : props.$category === 'coloration'
        ? '#181717'
        : props.$category === 'mariees'
          ? '#f4efff'
          : props.$category === 'esthetique'
            ? '#fff1f2'
            : props.$category === 'onglerie'
              ? '#591717'
              : 'var(--blanc)'};
  border: 1px solid var(--line);
  border-radius: 14px;
  margin-bottom: 0;

  &.open {
    max-height: 220px;
    margin-bottom: 22px;
    opacity: 1;
  }
`;

const FiltersInner = styled.div`
  display: flex;
  gap: 26px;
  flex-wrap: wrap;
  padding: 20px 24px;

  @media (max-width: 768px) {
    gap: 16px;
    padding: 16px 20px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 160px;

  @media (max-width: 768px) {
    min-width: 140px;
  }

  label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: ${(props) =>
      props.$category === 'coloration' || props.$category === 'onglerie'
        ? 'var(--blanc)'
        : 'var(--ink-dim)'};
  }

  select,
  input[type='text'],
  input[type='time'],
  input[type='number'] {
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--line);
    font-family: var(--font-manrope), 'Manrope', sans-serif;
    font-size: 13.5px;
    background: var(--paper);
    outline: none;
    transition: border-color 0.15s;

    &:focus {
      border-color: var(--beige);
    }
  }
`;

const RangeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-ibm-mono), 'IBM Plex Mono', monospace;
  font-size: 12.5px;

  input {
    width: 80px;
  }
`;

const ChipRow = styled.div`
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
`;

const Chip = styled.button`
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid var(--line);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  background: var(--paper);
  transition: all 0.15s;
  font-family: var(--font-manrope), 'Manrope', sans-serif;

  &:hover {
    border-color: var(--beige);
  }

  &.on {
    background: var(--noir);
    color: var(--blanc);
    border-color: var(--noir);
  }
`;

export default function FiltersPanel({
  open,
  category,
  statuts,
  onStatutToggle,
}) {
  const statutOptions = [
    { key: 'payé', label: 'Payé' },
    { key: 'impayé', label: 'Impayé' },
    { key: 'acompte', label: 'Acompte' },
  ];

  return (
    <FiltersPanelContainer $category={category} className={open ? 'open' : ''}>
      <FiltersInner>
        <FilterGroup $category={category}>
          <label>Statut</label>
          <ChipRow>
            {statutOptions.map((opt) => (
              <Chip
                key={opt.key}
                className={statuts.includes(opt.key) ? 'on' : ''}
                onClick={() => onStatutToggle(opt.key)}
              >
                {opt.label}
              </Chip>
            ))}
          </ChipRow>
        </FilterGroup>
      </FiltersInner>
    </FiltersPanelContainer>
  );
}
