"use client";

import { useState, useMemo } from "react";
import styled from "styled-components";
import { API } from "../lib/data";

const ModalOverlay = styled.div`
  display: ${(props) => (props.$open ? "flex" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: var(--noir);
  border-radius: 12px;
  border: 1px solid rgba(251, 248, 243, 0.1);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 24px;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(251, 248, 243, 0.15);
    border-radius: 3px;

    &:hover {
      background: rgba(251, 248, 243, 0.25);
    }
  }
`;

const ModalHeader = styled.h2`
  margin: 0 0 24px 0;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--blanc);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(251, 248, 243, 0.7);
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(251, 248, 243, 0.15);
  background: rgba(251, 248, 243, 0.05);
  color: var(--blanc);
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 14px;
  transition: all 0.18s ease;

  &::placeholder {
    color: rgba(251, 248, 243, 0.4);
  }

  &:focus {
    outline: none;
    border-color: var(--rose);
    background: rgba(251, 248, 243, 0.08);
    box-shadow: 0 0 0 3px rgba(237, 100, 166, 0.1);
  }
`;

const Select = styled.select`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(251, 248, 243, 0.15);
  background: rgba(251, 248, 243, 0.05);
  color: var(--blanc);
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.18s ease;

  &:focus {
    outline: none;
    border-color: var(--rose);
    background: rgba(251, 248, 243, 0.08);
  }

  option {
    background: var(--noir);
    color: var(--blanc);
  }
`;

const ServicesSection = styled.div`
  border: 1px solid rgba(251, 248, 243, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
`;

const CategorySelect = styled(Select)`
  margin-bottom: 12px;
`;

const ServiceItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 6px;
  background: rgba(251, 248, 243, 0.03);
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.18s ease;
  border: 1px solid transparent;

  &:hover {
    background: rgba(251, 248, 243, 0.06);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  margin-right: 12px;
  cursor: pointer;
  accent-color: var(--rose);
`;

const ServiceLabel = styled.label`
  flex: 1;
  cursor: pointer;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 14px;
  color: var(--blanc);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ServicePrice = styled.span`
  font-size: 13px;
  color: rgba(251, 248, 243, 0.6);
`;

const SelectedServicesInfo = styled.div`
  background: rgba(237, 100, 166, 0.1);
  border: 1px solid rgba(237, 100, 166, 0.2);
  border-radius: 6px;
  padding: 12px;
  margin-top: 12px;
  font-size: 13px;
  color: var(--rose) !important;
  font-family: var(--font-manrope), "Manrope", sans-serif;
`;

const ErrorMessage = styled.div`
  color: #ed96a6 !important;
  font-size: 12px;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  margin-top: 4px;
`;

const FormFooter = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid rgba(251, 248, 243, 0.1);
`;

const Button = styled.button`
  padding: 12px 20px;
  border-radius: 8px;
  border: 1px solid rgba(251, 248, 243, 0.2);
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CancelButton = styled(Button)`
  background: rgba(251, 248, 243, 0.05);
  color: rgba(251, 248, 243, 0.8);
  border-color: rgba(251, 248, 243, 0.2);

  &:hover {
    background: rgba(251, 248, 243, 0.1);
    border-color: rgba(251, 248, 243, 0.3);
  }
`;

const SaveButton = styled(Button)`
  background: linear-gradient(135deg, var(--rose), var(--rose-light));
  color: var(--blanc);
  border-color: var(--rose);

  &:hover {
    box-shadow: 0 4px 12px rgba(237, 100, 166, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const getTodayDate = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};

export default function BillFormModal({ open, onClose, onSave }) {
  const [formData, setFormData] = useState({
    spentName: "",
    spentDate: getTodayDate(),
    spentValue: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.spentName.trim()) {
      newErrors.spentName = "Le nom de la dépense est requis";
    }
    if (!formData.spentValue.trim()) {
      newErrors.spentValue = "La valeur de la dépense est requis";
    }
    if (!formData.spentDate.trim()) {
      newErrors.spentDate = "La date de la dépense est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const dateObj = new Date(formData.spentDate)
    try {
      const spentData = {
        name: formData.spentName.trim(),
        value: formData.spentValue.trim(),
        spentDate: dateObj.toISOString(),
      };

      await onSave(spentData);

      // Reset form
      setFormData({
        spentName: "",
        spentDate: new Date(),
        spentValue: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Erreur lors de la création de la dépense:", error);
      setErrors({
        submit: "Une erreur est survenue lors de la création de la dépense",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay $open={open} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>Créer une nouvelle dépense</ModalHeader>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="spentName">Nom de la dépense</Label>
            <Input
              id="spentName"
              name="spentName"
              type="text"
              placeholder="Ex: Achat de produites laitiers."
              value={formData.spentName}
              onChange={handleInputChange}
            />
            {errors.spentName && (
              <ErrorMessage>{errors.spentName}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="spentValue">Montant de la Dépense *</Label>
            <Input
              id="spentValue"
              name="spentValue"
              type="number"
              placeholder="Ex: 3000 DA"
              value={formData.spentValue}
              onChange={handleInputChange}
            />
            {errors.spentValue && (
              <ErrorMessage>{errors.spentValue}</ErrorMessage>
            )}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="spentDate">La date de la dépense.</Label>
            <Input
              id="spentDate"
              name="spentDate"
              min={getTodayDate()}
              type="date"
              value={formData.spentDate}
              onChange={handleInputChange}
            />
            {errors.spentDate && (
              <ErrorMessage>{errors.spentDate}</ErrorMessage>
            )}
          </FormGroup>

          {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}

          <FormFooter>
            <CancelButton type="button" onClick={onClose}>
              Annuler
            </CancelButton>
            <SaveButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer la dépense"}
            </SaveButton>
          </FormFooter>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}
