"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { SERVICES, CAT_KEYS } from "../lib/data";
import { API } from "../lib/data";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(27, 22, 19, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;

  &.open {
    opacity: 1;
    visibility: visible;
  }

  @media (max-width: 768px) {
    align-items: flex-end;
  }
`;

const ModalBox = styled.div`
  background: var(--blanc);
  border-radius: 20px;
  padding: 32px;
  max-width: 420px;
  width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(27, 22, 19, 0.35);
  animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    border-radius: 24px 24px 0 0;
    padding: 24px;
  }
`;

const ModalTitle = styled.h2`
  font-family: var(--font-fraunces), "Fraunces", serif;
  font-size: 22px;
  margin-bottom: 19px;
  color: var(--ink);

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;

  label {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--ink-dim);
  }

  input,
  select {
    padding: 11px 12px;
    border-radius: 10px;
    border: 1px solid var(--line);
    font-family: var(--font-manrope), "Manrope", sans-serif;
    font-size: 14px;
    background: var(--paper);
    outline: none;
    transition: border-color 0.15s;

    &:focus {
      border-color: var(--beige);
      background: var(--blanc);
    }
  }
`;

const TimeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  div {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
  }
`;
const MoneyRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  div {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
    max-width: 173px;
  }
`;
const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 28px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 20px;
  border-radius: 10px;
  border: none;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &.primary {
    background: var(--noir);
    color: var(--blanc);

    &:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &.secondary {
    background: var(--paper);
    color: var(--ink);
    border: 1px solid var(--line);

    &:hover {
      border-color: var(--beige);
    }
  }

  @media (max-width: 768px) {
    padding: 11px 16px;
    font-size: 13px;
  }
`;

const CalendarContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-top: 10px;
`;

const CalendarDay = styled.button`
  padding: 8px 0;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--paper);
  color: var(--ink);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  font-weight: 600;

  &:hover:not(:disabled) {
    border-color: var(--beige);
    transform: translateY(-1px);
  }

  &:disabled {
    color: var(--ink-dim);
    background: rgba(0, 0, 0, 0.05);
    cursor: not-allowed;
  }

  &.selected {
    background: var(--noir);
    color: var(--blanc);
    border-color: var(--noir);
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const CalendarNav = styled.button`
  padding: 6px 12px;
  border: 1px solid var(--line);
  background: var(--paper);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: var(--beige);
  }
`;

export default function Modal({
  open,
  activeCategory,
  onClose,
  onSave,
  initialData,
  practitioners = [],
  existingAppointments = [],
  isEditing = false,
  serverError = "",
}) {
  const defaultData = {
    service: activeCategory !== "all" ? activeCategory : "hammam",
    clientName: "",
    startTime: "09:00",
    endTime: "10:00",
    price: "",
    statut: "impayé",
    note: "",
    exactDate: (() => {
      const today = new Date();
      return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    })(),
    practitioner: "",
  };

  const [formData, setFormData] = useState(
    initialData ? { ...initialData } : defaultData,
  );
  const [modalError, setModalError] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [showCalendar, setShowCalendar] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  };

  const getCurrentTimeInMinutes = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  };
  const estFormatHeure = (str) => {
    const regexHeure = /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    return regexHeure.test(str);
  };
  const normalizeDate = (value) => {
    if (!value) return null;
    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return value;
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const toMinutes = (value) => {
    if (!value) return null;
    let time = value;
    if (typeof time === "string" && time.includes("T")) {
      time = time.split("T")[1];
    }
    time = time.replace("Z", "").split(".")[0];
    const [hh, mm] = time.split(":").map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
    return hh * 60 + mm;
  };

  const getAppointmentDate = (appt) => {
    if (!appt) return null;
    if (appt.exactDate) return normalizeDate(appt.exactDate);
    if (appt.date) return normalizeDate(appt.date);
    if (appt.startTime?.includes("T")) {
      return normalizeDate(appt.startTime.split("T")[0]);
    }
    return null;
  };

  const getAppointmentRange = (appt) => {
    const start = toMinutes(appt.startTime || appt.start || appt.debut);
    if (start === null) return null;
    const end =
      toMinutes(appt.endTime || appt.end || appt.fin) ||
      start + Number(appt.duration || 60);
    return { start, end };
  };

  const getPractitionerLabel = (pr) =>
    pr?.name || pr?.practitioner || pr?.fullName || pr?.label || pr?.id;

  const availablePractitioners = (practitioners || []).filter(
    (pr) =>
      Array.isArray(pr.domain) &&
      pr.domain.includes(formData.service || activeCategory),
  );

  useEffect(() => {
    const category =
      activeCategory !== "all" ? activeCategory : defaultData.service;

    setFormData((prev) => {
      if (initialData) {
        return { ...initialData };
      }

      return {
        ...defaultData,
        service: category,
        exactDate: normalizeDate(prev.exactDate) || defaultData.exactDate,
        practitioner: prev.practitioner || "",
      };
    });
    setModalError("");
    setShowCalendar(false);
  }, [open, initialData, activeCategory, practitioners]);

  useEffect(() => {
    if (serverError) {
      setModalError(serverError);
    }
  }, [serverError]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Si le statut repasse à "impayé", on réinitialise le montant (price)
      if (field === "statut" && value === "impayé") {
        updated.price = "";
      }
      return updated;
    });
  };

  const handleSave = () => {
    if (!formData.clientName.trim()) {
      setModalError("Veuillez entrer un nom de client.");
      return;
    }

    if (!formData.practitioner) {
      setModalError("Veuillez sélectionner une praticienne.");
      return;
    }

    const rawStart = estFormatHeure(formData.startTime)
      ? formData.startTime
      : formData.startTime.split("T")[1]?.substring(0, 5) || "";

    const rawEnd = estFormatHeure(formData.endTime)
      ? formData.endTime
      : formData.endTime.split("T")[1]?.substring(0, 5) || "";

    const startMinutes = toMinutes(rawStart);
    const endMinutes = toMinutes(rawEnd);

    if (startMinutes === null || endMinutes === null) {
      setModalError("Veuillez entrer des heures de début et de fin valides.");
      return;
    }

    if (startMinutes >= endMinutes) {
      setModalError("L’heure de début doit être antérieure à l’heure de fin.");
      return;
    }

    const appointmentDate = normalizeDate(formData.exactDate);
    if (!appointmentDate) {
      setModalError("Veuillez sélectionner une date valide.");
      return;
    }

    const today = getTodayDate();
    if (appointmentDate < today) {
      setModalError(
        "La date du rendez-vous ne peut pas être antérieure à aujourd'hui.",
      );
      return;
    }

    if (appointmentDate === today) {
      const currentTime = getCurrentTimeInMinutes();
      if (startMinutes < currentTime) {
        setModalError(
          "L'heure de début ne peut pas être antérieure à l'heure actuelle.",
        );
        return;
      }
    }

    const concurrentAppointments = (existingAppointments || []).filter(
      (appt) => {
        if (!appt?.practitioner) return false;
        if (initialData?.id && appt.id === initialData.id) return false;
        if (appt.practitioner !== formData.practitioner) return false;

        const apptDate = getAppointmentDate(appt);
        if (!apptDate || apptDate !== appointmentDate) return false;

        const apptRange = getAppointmentRange(appt);
        if (!apptRange) return false;

        return startMinutes < apptRange.end && endMinutes > apptRange.start;
      },
    );

    const isNewAppointmentHammam = formData.service === "hammam";
    let conflict = false;

    if (isNewAppointmentHammam) {
      const hammamCount = concurrentAppointments.filter(
        (appt) => appt.service === "hammam",
      ).length;

      if (hammamCount >= 6) {
        conflict = true;
      }

      const hasOtherService = concurrentAppointments.some(
        (appt) => appt.service !== "hammam",
      );
      if (hasOtherService) {
        conflict = true;
      }
    } else {
      if (concurrentAppointments.length > 0) {
        conflict = true;
      }
    }

    if (conflict) {
      const currentPractitioner = practitioners.find(
        (pr) => pr.id === formData.practitioner,
      );
      const nameToDisplay = currentPractitioner
        ? currentPractitioner.fullName
        : "Ce praticien";

      const errorMessage = isNewAppointmentHammam
        ? `La praticienne ${nameToDisplay} a déjà atteint la capacité maximale de 6 rendez-vous simultanés pour le Hammam sur cette plage.`
        : `La praticienne ${nameToDisplay} est déjà occupée ou gère un groupe sur cette plage horaire.`;

      setModalError(errorMessage);
      return;
    }

    const finalStartTime = estFormatHeure(formData.startTime)
      ? `${formData.exactDate}T${formData.startTime}:00.000Z`
      : formData.startTime;

    const finalEndTime = estFormatHeure(formData.endTime)
      ? `${formData.exactDate}T${formData.endTime}:00.000Z`
      : formData.endTime;

    const finalData = {
      ...formData,
      startTime: finalStartTime,
      endTime: finalEndTime,
    };

    setModalError("");

    onSave(finalData);

    setFormData({
      ...defaultData,
      service: activeCategory !== "all" ? activeCategory : defaultData.service,
      practitioner: availablePractitioners[0]
        ? availablePractitioners[0].id
        : "",
    });
  };

  const formatTimeToInput = (timeValue) => {
    if (!timeValue) return "09:00";

    if (timeValue instanceof Date) {
      const hours = String(timeValue.getHours()).padStart(2, "0");
      const minutes = String(timeValue.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    }

    if (typeof timeValue === "string") {
      if (timeValue.includes("T")) {
        return timeValue.split("T")[1].split(":").slice(0, 2).join(":");
      }
      return timeValue;
    }

    return "09:00";
  };

  return (
    <Overlay
      id="overlay"
      className={open ? "open" : ""}
      onClick={(e) => e.target.id === "overlay" && onClose()}
    >
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalTitle>
          {isEditing ? "Modifier ce rendez-vous" : "Nouveau rendez-vous"}
        </ModalTitle>

        <FormGroup>
          <label>Prestation</label>
          <select
            value={formData.service}
            onChange={(e) => handleChange("service", e.target.value)}
          >
            {CAT_KEYS.map((key) => (
              <option key={key} value={key}>
                {SERVICES[key].label}
              </option>
            ))}
          </select>
        </FormGroup>

        <FormGroup>
          <label>Client</label>
          <input
            type="text"
            placeholder="Nom du client"
            value={formData.clientName}
            onChange={(e) => handleChange("clientName", e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <label>Praticienne</label>
          <select
            value={formData.practitioner}
            name="practitioner"
            id="practitionerSelect"
            onChange={(e) => {
              handleChange("practitioner", e.target.value);
            }}
          >
            <option value="" disabled>
              {availablePractitioners.length
                ? "Sélectionnez une praticienne"
                : "Aucune praticienne disponible"}
            </option>
            {availablePractitioners.map((pr) => {
              return (
                <option key={pr.id} value={pr.id}>
                  {getPractitionerLabel(pr)}
                </option>
              );
            })}
          </select>
        </FormGroup>

        <FormGroup>
          <TimeRow>
            <div>
              <label>Heure debut</label>
              <input
                type="time"
                value={formatTimeToInput(formData.startTime)}
                onChange={(e) => {
                  handleChange(
                    "startTime",
                    `${formData.exactDate}T${e.target.value}:00.000Z`,
                  );
                }}
              />
            </div>
            <div>
              <label>Heure fin</label>
              <input
                type="time"
                value={formatTimeToInput(formData.endTime)}
                onChange={(e) => {
                  handleChange(
                    "endTime",
                    `${formData.exactDate}T${e.target.value}:00.000Z`,
                  );
                }}
              />
            </div>
          </TimeRow>
        </FormGroup>

        <FormGroup>
          <MoneyRow>
            <div>
              <label>Date </label>
              <input
                type="date"
                placeholder="Date..."
                value={formData.exactDate}
                min={getTodayDate()}
                onClick={() => setShowCalendar(!showCalendar)}
                onChange={(e) => {
                  handleChange("exactDate", e.target.value);
                  handleChange(
                    "endTime",
                    `${e.target.value}T${formatTimeToInput(formData.endTime)}:00.000Z`,
                  );
                  handleChange(
                    "startTime",
                    `${e.target.value}T${formatTimeToInput(formData.startTime)}:00.000Z`,
                  );
                }}
              />
            </div>
            <div>
              <label>Statut</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="payé">Payé</option>
                <option value="impayé">Impayé</option>
                <option value="acompte">Acompte</option>
              </select>
            </div>
          </MoneyRow>
        </FormGroup>

        {/* AFFICHAGE CONDITIONNEL : Champ prix/acompte si statut est "payé" ou "acompte" */}
        {(formData.status === "payé" || formData.status === "acompte") && (
          <FormGroup>
            <label>
              {formData.status === "acompte" ? "Montant de l'acompte (DA)" : "Montant payé (DA)"}
            </label>
            <input
              type="number"
              min="0"
              placeholder="Ex: 2000"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
          </FormGroup>
        )}

        <FormGroup>
          <label>Commentaire</label>
          <input
            type="text"
            placeholder="Notes..."
            value={formData.note}
            onChange={(e) => handleChange("note", e.target.value)}
          />
        </FormGroup>

        {modalError && (
          <FormGroup>
            <span style={{ color: "#b23b3b", fontSize: "0.95rem" }}>
              {modalError}
            </span>
          </FormGroup>
        )}

        <ButtonRow>
          <Button className="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button className="primary" onClick={handleSave}>
            {isEditing ? "Modifier" : "Créer"}
          </Button>
        </ButtonRow>
      </ModalBox>
    </Overlay>
  );
}