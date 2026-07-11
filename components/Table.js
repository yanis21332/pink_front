"use client";

import { useState } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import { statutLabel, recurringNames } from "../lib/utils";
import { API } from "../lib/data";

const TableWrap = styled.div`
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow);
  padding: 6px;
`;

const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  overflow-x: auto;
  background: ${(props) =>
    props.$category === "hammam"
      ? "#ffefdd"
      : props.$category === "coloration"
        ? "#111"
        : props.$category === "mariees"
          ? "#f6f0ff"
          : props.$category === "esthetique"
            ? "#fff0f0"
            : props.$category === "onglerie"
              ? "#5a1a1a"
              : "#fff"};
  border-bottom: 1px solid var(--line);
`;

const TimeSlot = styled.div`
  min-width: 80px;

  font-family: var(--font-ibm-mono), "IBM Plex Mono", monospace;
  font-size: 13px;
  color: var(--ink-dim);
  text-align: start;
`;

const TableBody = styled.div`
  display: block;
  background: ${(props) =>
    props.$category === "hammam"
      ? "#fffbf6"
      : props.$category === "coloration"
        ? "#141211"
        : props.$category === "mariees"
          ? "#fbf8ff"
          : props.$category === "esthetique"
            ? "#fff5f5"
            : props.$category === "onglerie"
              ? "#4f1a1a"
              : "#fff"};
  padding: 12px 16px;
`;

const TimelineTrack = styled.div`
  position: relative;
  min-height: ${(props) => props.$height || 120}px;
  margin-top: 14px;
  border-radius: 12px;
  background: transparent;
  overflow: visible;
`;

const ApptCard = styled.button`
  position: absolute;
  top: 12px;
  height: 80px;
  border: none;
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  color: var(--ink);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 6px 18px rgba(27, 22, 19, 0.08);
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const ApptTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
`;

const ApptMeta = styled.div`
  font-size: 12px;
  opacity: 0.9;
`;

const EmptyState = styled.div`
  padding: 60px 32px;
  text-align: center;

  .display {
    font-size: 24px;
    margin-bottom: 12px;
    color: var(--ink);
  }

  div {
    color: var(--ink-dim);
    font-size: 14px;
  }
`;

const TableHeaderBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: ${(props) =>
    props.$category === "hammam"
      ? "#ffedd1"
      : props.$category === "coloration"
        ? "#111"
        : props.$category === "mariees"
          ? "#f6f0ff"
          : props.$category === "esthetique"
            ? "#fff0f0"
            : props.$category === "onglerie"
              ? "#581818"
              : "#111"};
  border-bottom: 1px solid var(--line);
`;

const HeaderInfo = styled.div`
  display: grid;
  gap: 4px;
`;

const HeaderTitle = styled.div`
  font-family: var(--font-fraunces), "Fraunces", serif;
  font-size: 1rem;
  font-weight: 700;
  color: ${(props) =>
    props.$category === "coloration" || props.$category === "onglerie"
      ? "var(--blanc)"
      : "var(--ink)"};
`;

const HeaderMeta = styled.div`
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 0.92rem;
  color: ${(props) =>
    props.$category === "coloration" || props.$category === "onglerie"
      ? "rgba(255,255,255,0.82)"
      : "var(--ink-dim)"};
`;

const DateNav = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const DateButton = styled.button`
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--paper);
  color: var(--ink);
  cursor: pointer;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-weight: 700;
  transition:
    border-color 0.15s,
    transform 0.15s ease;

  &:hover {
    border-color: var(--beige);
    transform: translateY(-1px);
  }
`;

const DatePickerInput = styled.input`
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--paper);
  color: var(--ink);
  cursor: pointer;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-weight: 700;
  transition: border-color 0.15s;

  &:hover {
    border-color: var(--beige);
  }

  &:focus {
    outline: none;
    border-color: var(--beige);
    background: var(--blanc);
  }
`;

const TodayButton = styled(DateButton)`
  background: var(--noir);
  color: var(--blanc);
  border-color: var(--noir);
`;

export default function Table({
  appts,
  onApptChange,
  onApptDelete,
  lastMovedId,
  category,
  selectedDate,
  onSelectedDateChange,
  practitioners,
  allAppts,
}) {
  const recurring = recurringNames(appts);
  const [activeAppt, setActiveAppt] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [serverModalError, setServerModalError] = useState('');

  const parseTime = (t) => {
    if (!t) return null;
    if (t.includes("T")) {
      const [, timePart] = t.split("T");
      const [hh, mm] = timePart.split(":").map(Number);
      return hh * 60 + (mm || 0);
    }
    const [hh, mm] = t.split(":").map(Number);
    return hh * 60 + (mm || 0);
  };

  const getEnd = (appt) => {
    if (appt.endTime) return parseTime(appt.endTime);
    if (appt.duration) return parseTime(appt.startTime) + Number(appt.duration);
    return parseTime(appt.startTime) + 60;
  };

  const totalAppts = appts?.length || 0;

  const formattedDate = selectedDate
    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  const changeDate = (days) => {
    const [year, month, day] = (selectedDate || getTodayDate()).split('-').map(Number);
    const current = new Date(year, month - 1, day);
    current.setDate(current.getDate() + days);
    const newDateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
    onSelectedDateChange(newDateStr);
  };

  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const goToday = () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    onSelectedDateChange(todayStr);
  };

  if (!appts || appts.length === 0) {
    return (
      <TableWrap>
        <TableHeaderBar>
          <HeaderInfo>
            <HeaderTitle>Planning</HeaderTitle>
            <HeaderMeta>{formattedDate}</HeaderMeta>
          </HeaderInfo>
          <DateNav>
            <DateButton onClick={() => changeDate(-1)}>‹</DateButton>
            <DatePickerInput
              type="date"
              value={selectedDate}
              onChange={(e) => onSelectedDateChange(e.target.value)}
            />
            <DateButton onClick={() => changeDate(1)}>›</DateButton>
            <TodayButton onClick={goToday}>Aujourd'hui</TodayButton>
          </DateNav>
        </TableHeaderBar>
        <EmptyState>
          <div className="display">Aucun rendez-vous</div>
          <div>Il n'y a pas de rendez-vous pour cette date.</div>
        </EmptyState>
      </TableWrap>
    );
  }

  const times = appts.map((a) => ({
    start: parseTime(a.startTime),
    end: getEnd(a),
  }));
  const minStart = Math.min(...times.map((t) => t.start));
  const maxEnd = Math.max(...times.map((t) => t.end));
  const span = Math.max(60, Math.ceil(maxEnd / 60) * 60 - minStart);

  const slots = [];
  const startHour = Math.floor(minStart / 60);
  const endHour = Math.ceil(maxEnd / 60);
  for (let h = startHour; h <= endHour; h++) {
    slots.push(("0" + h).slice(-2) + ":00");
  }

  const apptLanes = {};
  const lanes = [];

  const sortedAppts = [...appts]
    .map((appt) => ({
      ...appt,
      startVal: parseTime(appt.startTime) || minStart,
      endVal: getEnd(appt),
    }))
    .sort((a, b) => a.startVal - b.startVal);

  sortedAppts.forEach((appt) => {
    let assignedLane = 0;
    while (true) {
      if (
        lanes[assignedLane] === undefined ||
        lanes[assignedLane] <= appt.startVal
      ) {
        break;
      }
      assignedLane++;
    }
    lanes[assignedLane] = appt.endVal;
    apptLanes[appt.id] = assignedLane;
  });

  const maxLanes = lanes.length || 1;
  const trackHeight = Math.max(120, maxLanes * 92 + 12);

  const colorFor = (cat, id) => {
    const base =
      cat === "hammam"
        ? 39
        : cat === "coloration"
          ? 10
          : cat === "mariees"
            ? 270
            : cat === "esthetique"
              ? 340
              : cat === "onglerie"
                ? 355
                : 200;
    const seed =
      typeof id === "number"
        ? id
        : id
            ?.toString()
            .split("")
            .reduce((s, c) => s + c.charCodeAt(0), 0);
    const offset = (Number(seed) % 20) - 10;
    return `hsl(${base + offset} 70% 65%)`;
  };

  return (
    <TableWrap $category={category}>
      <TableHeaderBar $category={category}>
        <HeaderInfo>
          <HeaderTitle $category={category}>Planning</HeaderTitle>
          <HeaderMeta $category={category}>
            {formattedDate} — {totalAppts} rendez-vous
          </HeaderMeta>
        </HeaderInfo>
        <DateNav>
          <DateButton onClick={() => changeDate(-1)}>‹</DateButton>
          <DatePickerInput
            type="date"
            value={selectedDate}
            onChange={(e) => onSelectedDateChange(e.target.value)}
          />
          <DateButton onClick={() => changeDate(1)}>›</DateButton>
          <TodayButton onClick={goToday}>Aujourd'hui</TodayButton>
        </DateNav>
      </TableHeaderBar>

      <TimelineHeader $category={category}>
        {slots.map((s) => (
          <TimeSlot key={s}>{s}</TimeSlot>
        ))}
      </TimelineHeader>

      <TableBody $category={category}>
        <TimelineTrack $height={trackHeight}>
          {appts.map((appt) => {
            const start = parseTime(appt.startTime) || minStart;
            const end = getEnd(appt);
            const left = ((start - minStart) / span) * 94;
            const width = (Math.max(15, end - start) / span) * 100;
            const bg = colorFor(appt.service || category, appt.id);
            const textColor = "#111";
            const lane = apptLanes[appt.id] || 0;
            const topVal = 12 + lane * 92;

            return (
              <ApptCard
                key={appt.id}
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  top: `${topVal}px`,
                  background: bg,
                  color: textColor,
                }}
                onClick={() => {
                  setActiveAppt(appt);
                  setModalOpen(true);
                }}
                title={`${appt.clientName} — ${statutLabel(appt.statut)}`}
              >
                <ApptTitle>{appt.clientName}</ApptTitle>
                <ApptMeta>
                  {statutLabel(appt.statut)}
                  {appt.practitioner
                    ? ` • ${practitioners.find((p) => p._id === appt.practitioner)?.fullName || "Praticienne inconnue"}`
                    : ""}
                </ApptMeta>
              </ApptCard>
            );
          })}
        </TimelineTrack>
      </TableBody>

      <Modal
        open={modalOpen}
        activeCategory={category}
        initialData={activeAppt}
        isEditing={!!activeAppt}
        serverError={serverModalError}
        onClose={() => {
          setModalOpen(false);
          setServerModalError('');
        }}
        onSave={(data) => {
          if (!activeAppt) return;

          const keys = Object.keys(data);
          const values = Object.values(data);
          onApptChange(activeAppt.id, keys, values);
          setModalOpen(false);
          setServerModalError('');
        }}
        practitioners={practitioners}
        existingAppointments={allAppts}
      />
    </TableWrap>
  );
}
