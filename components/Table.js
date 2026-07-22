"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import { statutLabel, recurringNames, getFiltered } from "../lib/utils";
import { API } from "../lib/data";
import api from "../lib/axios";

const CATEGORY_THEMES = {
  hammam: { headerBg: "#ffedd1", bodyBg: "#fffbf6", textDark: true },
  coloration: { headerBg: "#111", bodyBg: "#141211", textDark: false },
  mariees: { headerBg: "#f6f0ff", bodyBg: "#fbf8ff", textDark: true },
  esthetique: { headerBg: "#fedbdb", bodyBg: "#fff5f5", textDark: true },
  onglerie: { headerBg: "#581818", bodyBg: "#4f1a1a", textDark: false },
  default: { headerBg: "#ffffff", bodyBg: "#ffffff", textDark: true },
};

const getTheme = (cat) => CATEGORY_THEMES[cat] || CATEGORY_THEMES.default;

const TableWrap = styled.div`
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow);
  padding: 6px;
`;

const ScrollContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const InnerTimelineWrapper = styled.div`
  min-width: 800px;
  display: flex;
  flex-direction: column;
`;

const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${(props) => getTheme(props.$category).headerBg};
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
  background: ${(props) => getTheme(props.$category).bodyBg};
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
  padding-right: 18px;
`;

const ApptMeta = styled.div`
  font-size: 12px;
  opacity: 0.9;
`;

/* --- Bouton croix de suppression --- */
const DeleteBtn = styled.span`
  position: absolute;
  top: 6px;
  right: 8px;
  font-size: 14px;
  font-weight: bold;
  line-height: 1;
  color: rgba(0, 0, 0, 0.4);
  padding: 4px;
  border-radius: 50%;
  transition:
    color 0.15s,
    background 0.15s;

  &:hover {
    color: #e53e3e;
    background: rgba(229, 62, 62, 0.12);
  }
`;

/* --- Overlay & Modal de confirmation de suppression --- */
const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ConfirmBox = styled.div`
  background: var(--paper, #fff);
  padding: 24px;
  border-radius: 16px;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 16px;

  h4 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--ink, #111);
  }

  p {
    margin: 0;
    font-size: 0.92rem;
    color: var(--ink-dim, #666);
  }
`;

const ConfirmActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
  background: ${(props) => getTheme(props.$category).headerBg};
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
    getTheme(props.$category).textDark ? "var(--ink)" : "var(--blanc)"};
`;

const HeaderMeta = styled.div`
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 0.92rem;
  color: ${(props) =>
    getTheme(props.$category).textDark ? "var(--ink)" : "var(--blanc)"};
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

/* --- STYLES SECTION DÉPLACEMENTS (SHIFTS) --- */

const ShiftsSection = styled.div`
  border-top: 2px dashed var(--line, #eee);
  background: ${(props) => getTheme(props.$category).bodyBg};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ShiftsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

const ShiftsTitle = styled.h3`
  font-family: var(--font-fraunces), "Fraunces", serif;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  color: ${(props) =>
    getTheme(props.$category).textDark ? "var(--ink)" : "var(--blanc)"};
`;

const CreateShiftBtn = styled.button`
  padding: 10px 16px;
  border-radius: 12px;
  background: var(--noir, #111);
  color: var(--blanc, #fff);
  border: none;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  transition:
    transform 0.15s,
    opacity 0.15s;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }
`;

const ShiftsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
`;

const ShiftCard = styled.div`
  background: var(--paper, #fff);
  border: 1px solid var(--line, #e2e8f0);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const ShiftPractitioner = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--ink, #111);
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ShiftMeta = styled.div`
  font-size: 0.85rem;
  color: var(--ink-dim, #666);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ShiftPrice = styled.span`
  font-weight: 700;
  color: #2b6cb0;
  background: #ebf8ff;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
`;

const ShiftNote = styled.div`
  font-size: 0.82rem;
  font-style: italic;
  color: var(--ink-dim, #777);
  background: rgba(0, 0, 0, 0.03);
  padding: 6px 10px;
  border-radius: 6px;
`;

const ShiftActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
`;

const ShiftActionButton = styled.button`
  border: none;
  background: transparent;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  color: ${(props) => (props.$danger ? "#e53e3e" : "var(--ink-dim, #555)")};

  &:hover {
    text-decoration: underline;
  }
`;

/* --- FORMULAIRE DANS LA POPUP SHIFT --- */
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--ink, #111);
  }

  input,
  select,
  textarea {
    padding: 10px;
    border-radius: 8px;
    border: 1px solid var(--line, #ccc);
    font-family: inherit;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: var(--noir, #111);
    }
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const ErrorBanner = styled.div`
  background: #fff5f5;
  border: 1px solid #fed7d7;
  color: #c53030;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
`;

export default function Table({
  appts,
  onApptChange,
  onApptDelete,
  lastMovedId,
  category,
  selectedDate,
  onSelectedDateChange,
  practitioners = [],
  allAppts = [],
}) {
  const recurring = recurringNames(appts);
  const [activeAppt, setActiveAppt] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [serverModalError, setServerModalError] = useState("");

  /* --- État pour la suppression de RDV --- */
  const [deletingAppt, setDeletingAppt] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /* --- États pour la gestion des Déplacements (Shifts) --- */
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState(null); // null = création, object = édition
  const [deletingShift, setDeletingShift] = useState(null);
  const [isShiftSubmitting, setIsShiftSubmitting] = useState(false);

  const [shiftFormData, setShiftFormData] = useState({
    practitioner: "",
    startTime: "09:00",
    endTime: "12:00",
    price: 0,
    note: "",
    clientName: "",
  });

  const shifts = getFiltered(allAppts, {
    cat: "deplacement",
    selectedDate: selectedDate,
  });

  const parseTime = (t) => {
    if (!t) return null;
    if (typeof t === "string" && t.includes("T")) {
      const [, timePart] = t.split("T");
      const [hh, mm] = timePart.split(":").map(Number);
      return hh * 60 + (mm || 0);
    }
    if (typeof t === "string") {
      const [hh, mm] = t.split(":").map(Number);
      return hh * 60 + (mm || 0);
    }
    return null;
  };

  const getEnd = (appt) => {
    if (appt.endTime) return parseTime(appt.endTime);
    if (appt.duration) return parseTime(appt.startTime) + Number(appt.duration);
    return parseTime(appt.startTime) + 60;
  };

  /* --- LOGIQUE DE DÉTECTION DE CONFLIT D'HORAIRES POUR LES SHIFTS --- */
  const checkShiftConflict = () => {
    const newStart = parseTime(shiftFormData.startTime);
    const newEnd = parseTime(shiftFormData.endTime);

    if (newStart === null || newEnd === null) return null;

    if (newStart >= newEnd) {
      return "L'heure de fin doit être strictement supérieure à l'heure de début.";
    }

    if (!shiftFormData.practitioner) return null;

    // Filtrer les RDV de la même date pour le même praticien
    const currentEditingId = editingShift?.id || editingShift?._id;
    const sameDayAppts = (allAppts || []).filter((a) => {
      const aId = a.id || a._id;
      if (currentEditingId && aId === currentEditingId) return false; // Ne pas se comparer à soi-même

      const pId = typeof a.practitioner === "object" ? a.practitioner?._id : a.practitioner;
      if (pId !== shiftFormData.practitioner) return false;

      // Vérifier si c'est la même date
      const aDate = a.startTime ? a.startTime.split("T")[0] : null;
      return aDate === selectedDate;
    });

    // Vérifier les chevauchements : (StartA < EndB) && (EndA > StartB)
    for (const item of sameDayAppts) {
      const itemStart = parseTime(item.startTime);
      const itemEnd = getEnd(item);

      if (itemStart !== null && itemEnd !== null) {
        if (newStart < itemEnd && newEnd > itemStart) {
          const formattedStart = item.startTime.includes("T")
            ? item.startTime.split("T")[1].substring(0, 5)
            : item.startTime;
          const formattedEnd = item.endTime && item.endTime.includes("T")
            ? item.endTime.split("T")[1].substring(0, 5)
            : "";

          return `Conflit d'horaire : Le praticien a déjà un rendez-vous / déplacement prévu (${formattedStart}${formattedEnd ? " - " + formattedEnd : ""}).`;
        }
      }
    }

    return null;
  };

  const shiftConflictError = checkShiftConflict();

  const totalAppts = appts?.length || 0;

  const formattedDate = selectedDate
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  const changeDate = (days) => {
    const [year, month, day] = (selectedDate || getTodayDate())
      .split("-")
      .map(Number);
    const current = new Date(year, month - 1, day);
    current.setDate(current.getDate() + days);
    const newDateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
    onSelectedDateChange(newDateStr);
  };

  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  };

  const goToday = () => {
    const todayStr = getTodayDate();
    onSelectedDateChange(todayStr);
  };

  const handleDeleteConfirm = async () => {
    if (onApptDelete) {
      onApptDelete(deletingAppt.id);
      setIsDeleting(false);
      setDeletingAppt(null);
      return;
    }
    if (!deletingAppt) return;
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await api.delete(
        `${API}/api/appointements/delete-appointement/${deletingAppt.id}`,
        { withCredentials: true },
      );
    } catch (err) {
      console.error("Erreur réseau lors de la suppression :", err);
    } finally {
      setIsDeleting(false);
      setDeletingAppt(null);
    }
  };

  /* --- HANDLERS DÉPLACEMENTS (SHIFTS) --- */
  const openCreateShiftModal = () => {
    setEditingShift(null);
    setShiftFormData({
      practitioner: practitioners[0]?._id || "",
      startTime: "09:00",
      endTime: "12:00",
      price: 0,
      note: "",
      service: "deplacement",
      status: "payé",
      clientName: "",
    });
    setShiftModalOpen(true);
  };

  const openEditShiftModal = (shift) => {
    setEditingShift(shift);

    const formatTime = (isoString) => {
      if (!isoString) return "09:00";
      if (isoString.includes("T")) {
        return isoString.split("T")[1].substring(0, 5);
      }
      return isoString;
    };

    setShiftFormData({
      practitioner:
        typeof shift.practitioner === "object"
          ? shift.practitioner?._id
          : shift.practitioner,
      startTime: formatTime(shift.startTime),
      endTime: formatTime(shift.endTime),
      price: shift.price || 0,
      note: shift.note || "",
      clientName: shift.clientName || "",
      service: "deplacement",
      status: shift.status || "payé",
    });
    setShiftModalOpen(true);
  };

  const handleShiftSubmit = async (e) => {
    e.preventDefault();
    if (isShiftSubmitting || shiftConflictError) return;

    try {
      setIsShiftSubmitting(true);

      const baseDate = selectedDate || getTodayDate();
      const startDateTime = `${baseDate}T${shiftFormData.startTime}:00.000Z`;
      const endDateTime = `${baseDate}T${shiftFormData.endTime}:00.000Z`;

      const payload = {
        practitioner: shiftFormData.practitioner,
        startTime: startDateTime,
        endTime: endDateTime,
        price: Number(shiftFormData.price),
        note: shiftFormData.note,
        service: shiftFormData.service || "deplacement",
        status: shiftFormData.status || "payé",
        clientName: shiftFormData.clientName,
      };

      if (editingShift) {
        await api.patch(
          `${API}/api/appointements/update-appointement/${editingShift.id || editingShift._id}`,
          payload,
          { withCredentials: true },
        );
      } else {
        await api.post(
          `${API}/api/appointements/create-appointement`,
          payload,
          { withCredentials: true },
        );
      }

      setShiftModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du déplacement :", err);
      alert(
        err?.response?.data?.message ||
          "Une erreur est survenue lors de l'enregistrement.",
      );
    } finally {
      setIsShiftSubmitting(false);
    }
  };

  const handleDeleteShiftConfirm = async () => {
    if (!deletingShift || isShiftSubmitting) return;

    try {
      setIsShiftSubmitting(true);
      const shiftId = deletingShift.id || deletingShift._id;

      await api.delete(
        `${API}/api/appointements/delete-appointement/${shiftId}`,
        { withCredentials: true },
      );

      setDeletingShift(null);
    } catch (err) {
      console.error("Erreur lors de la suppression du déplacement :", err);
      alert(
        err?.response?.data?.message ||
          "Impossible de supprimer ce déplacement.",
      );
    } finally {
      setIsShiftSubmitting(false);
    }
  };

  const getPractitionerName = (p) => {
    if (!p) return "Praticienne inconnue";
    if (typeof p === "object") return p.fullName || p.name || "Praticienne";
    const found = practitioners.find((item) => item._id === p);
    return found ? found.fullName : "Praticienne";
  };

  const formatShiftTime = (iso) => {
    if (!iso) return "--:--";
    if (iso.includes("T")) {
      return iso.split("T")[1].substring(0, 5);
    }
    return iso;
  };

  const times = (appts || []).map((a) => ({
    start: parseTime(a.startTime),
    end: getEnd(a),
  }));
  const minStart = times.length ? Math.min(...times.map((t) => t.start)) : 540;
  const maxEnd = times.length ? Math.max(...times.map((t) => t.end)) : 1080;
  const span = Math.max(60, Math.ceil(maxEnd / 60) * 60 - minStart);

  const slots = [];
  const startHour = Math.floor(minStart / 60);
  const endHour = Math.ceil(maxEnd / 60);
  for (let h = startHour; h <= endHour; h++) {
    slots.push(("0" + h).slice(-2) + ":00");
  }

  const apptLanes = {};
  const lanes = [];

  const sortedAppts = [...(appts || [])]
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
    <TableWrap>
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

      {!appts || appts.length === 0 ? (
        <EmptyState>
          <div className="display">Aucun rendez-vous</div>
          <div>Il n'y a pas de rendez-vous pour cette date.</div>
        </EmptyState>
      ) : (
        <ScrollContainer>
          <InnerTimelineWrapper>
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

                  const apptEndDate = appt.endTime
                    ? new Date(appt.endTime)
                    : null;
                  const isPast = apptEndDate ? apptEndDate < new Date() : false;
                  return (
                    <ApptCard
                      key={appt.id}
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        top: `${topVal}px`,
                        background: bg,
                        opacity: isPast ? 0.65 : 1,
                        color: textColor,
                      }}
                      onClick={() => {
                        setActiveAppt(appt);
                        setModalOpen(true);
                      }}
                      title={`${appt.clientName} — ${statutLabel(appt.status)}`}
                    >
                      <DeleteBtn
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingAppt(appt);
                        }}
                        title="Supprimer le rendez-vous"
                      >
                        ✕
                      </DeleteBtn>

                      <ApptTitle>{appt.clientName}</ApptTitle>
                      <ApptMeta>
                        {statutLabel(appt.status)}
                        {appt.price ? ` • ${appt.price} DA` : ""}
                        {appt.practitioner
                          ? ` • ${practitioners.find((p) => p._id === appt.practitioner)?.fullName || "Praticienne inconnue"}`
                          : ""}
                      </ApptMeta>
                    </ApptCard>
                  );
                })}
              </TimelineTrack>
            </TableBody>
          </InnerTimelineWrapper>
        </ScrollContainer>
      )}

      {category === "mariees" && (
        <ShiftsSection $category={category}>
          <ShiftsHeader>
            <ShiftsTitle $category={category}>
              Déplacements de la journée
            </ShiftsTitle>
            <CreateShiftBtn onClick={openCreateShiftModal}>
              + Créer un déplacement
            </CreateShiftBtn>
          </ShiftsHeader>

          {shifts.length === 0 ? (
            <div style={{ fontSize: "0.88rem", color: "var(--ink-dim)" }}>
              Aucun déplacement prévu pour cette journée.
            </div>
          ) : (
            <ShiftsGrid>
              {shifts.map((shift) => (
                <ShiftCard key={shift.id || shift._id}>
                  <ShiftPractitioner>
                    📍 {getPractitionerName(shift.practitioner)} (Indisponible)
                  </ShiftPractitioner>
                  <ShiftMeta>
                    🕒 {formatShiftTime(shift.startTime)} -{" "}
                    {formatShiftTime(shift.endTime)}
                    <ShiftPrice>{shift.price} DA</ShiftPrice>
                  </ShiftMeta>
                  {shift.note && <ShiftNote>"{shift.note}"</ShiftNote>}
                  <ShiftActions>
                    <ShiftActionButton
                      onClick={() => openEditShiftModal(shift)}
                    >
                      Modifier
                    </ShiftActionButton>
                    <ShiftActionButton
                      $danger
                      onClick={() => setDeletingShift(shift)}
                    >
                      Supprimer
                    </ShiftActionButton>
                  </ShiftActions>
                </ShiftCard>
              ))}
            </ShiftsGrid>
          )}
        </ShiftsSection>
      )}

      {/* Popup de confirmation de suppression de rendez-vous */}
      {deletingAppt && (
        <ConfirmOverlay onClick={() => setDeletingAppt(null)}>
          <ConfirmBox onClick={(e) => e.stopPropagation()}>
            <h4>Confirmer la suppression</h4>
            <p>
              Voulez-vous vraiment supprimer le rendez-vous de{" "}
              <strong>{deletingAppt.clientName}</strong> ?
            </p>
            <ConfirmActions>
              <DateButton onClick={() => setDeletingAppt(null)}>
                Annuler
              </DateButton>
              <TodayButton
                style={{ background: "#e53e3e", borderColor: "#e53e3e" }}
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "Suppression..." : "Supprimer"}
              </TodayButton>
            </ConfirmActions>
          </ConfirmBox>
        </ConfirmOverlay>
      )}

      {/* POPUP DE CONFIRMATION DE SUPPRESSION D'UN DÉPLACEMENT */}
      {deletingShift && (
        <ConfirmOverlay onClick={() => setDeletingShift(null)}>
          <ConfirmBox onClick={(e) => e.stopPropagation()}>
            <h4>Supprimer le déplacement</h4>
            <p>
              Voulez-vous vraiment supprimer le déplacement de{" "}
              <strong>
                {getPractitionerName(deletingShift.practitioner)}
              </strong>{" "}
              ?
            </p>
            <ConfirmActions>
              <DateButton onClick={() => setDeletingShift(null)}>
                Annuler
              </DateButton>
              <TodayButton
                style={{ background: "#e53e3e", borderColor: "#e53e3e" }}
                onClick={handleDeleteShiftConfirm}
                disabled={isShiftSubmitting}
              >
                {isShiftSubmitting ? "Suppression..." : "Supprimer"}
              </TodayButton>
            </ConfirmActions>
          </ConfirmBox>
        </ConfirmOverlay>
      )}

      {/* POPUP DE CRÉATION / MODIFICATION D'UN DÉPLACEMENT */}
      {shiftModalOpen && (
        <ConfirmOverlay onClick={() => setShiftModalOpen(false)}>
          <ConfirmBox onClick={(e) => e.stopPropagation()}>
            <h4>
              {editingShift
                ? "Modifier le déplacement"
                : "Créer un déplacement"}
            </h4>

            <Form onSubmit={handleShiftSubmit}>
              {shiftConflictError && (
                <ErrorBanner>{shiftConflictError}</ErrorBanner>
              )}

              <FormGroup>
                <label>Praticienne *</label>
                <select
                  required
                  value={shiftFormData.practitioner}
                  onChange={(e) =>
                    setShiftFormData({
                      ...shiftFormData,
                      practitioner: e.target.value,
                    })
                  }
                >
                  <option value="">Sélectionner une praticienne</option>
                  {practitioners.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.fullName || p.name}
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup>
                <label>Nom du Client / Motif</label>
                <input
                  type="text"
                  placeholder="Ex: Déplacement à domicile Mariée"
                  value={shiftFormData.clientName}
                  onChange={(e) =>
                    setShiftFormData({
                      ...shiftFormData,
                      clientName: e.target.value,
                    })
                  }
                />
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <label>Début *</label>
                  <input
                    type="time"
                    required
                    value={shiftFormData.startTime}
                    onChange={(e) =>
                      setShiftFormData({
                        ...shiftFormData,
                        startTime: e.target.value,
                      })
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <label>Fin *</label>
                  <input
                    type="time"
                    required
                    value={shiftFormData.endTime}
                    onChange={(e) =>
                      setShiftFormData({
                        ...shiftFormData,
                        endTime: e.target.value,
                      })
                    }
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <label>Tarif (DA)</label>
                <input
                  type="number"
                  min="0"
                  value={shiftFormData.price}
                  onChange={(e) =>
                    setShiftFormData({
                      ...shiftFormData,
                      price: e.target.value,
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <label>Note / Détails</label>
                <textarea
                  rows="3"
                  placeholder="Adresse, détails spécifiques..."
                  value={shiftFormData.note}
                  onChange={(e) =>
                    setShiftFormData({
                      ...shiftFormData,
                      note: e.target.value,
                    })
                  }
                />
              </FormGroup>

              <ConfirmActions>
                <DateButton
                  type="button"
                  onClick={() => setShiftModalOpen(false)}
                >
                  Annuler
                </DateButton>
                <TodayButton
                  type="submit"
                  disabled={isShiftSubmitting || !!shiftConflictError}
                  style={{
                    opacity: isShiftSubmitting || !!shiftConflictError ? 0.5 : 1,
                    cursor:
                      isShiftSubmitting || !!shiftConflictError
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {isShiftSubmitting
                    ? "Enregistrement..."
                    : editingShift
                      ? "Enregistrer"
                      : "Créer"}
                </TodayButton>
              </ConfirmActions>
            </Form>
          </ConfirmBox>
        </ConfirmOverlay>
      )}

      {/* Modal d'édition/affichage classique si un RDV est sélectionné */}
      {modalOpen && activeAppt && (
        <Modal
          appt={activeAppt}
          allAppts={allAppts}
          onClose={() => {
            setModalOpen(false);
            setActiveAppt(null);
          }}
          onApptChange={onApptChange}
          practitioners={practitioners}
        />
      )}
    </TableWrap>
  );
}