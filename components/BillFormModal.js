"use client";

import { useState, useMemo } from "react";
import styled from "styled-components";

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
  color: #ed96a6;
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

export default function BillFormModal({ open, onClose, onSave, menu }) {
  const [formData, setFormData] = useState({
    clientName: "",
    selectedCategory: "",
    servicesConsumed: [],
    paymentMethod: "espèces",
    isPaid: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = useMemo(
    () => menu?.filter((item) => item.services && item.services.length > 0),
    [menu],
  );

  const currentServices = useMemo(() => {
    if (!formData.selectedCategory) return [];
    const category = categoryOptions.find(
      (c) => c.id === formData.selectedCategory || c._id === formData.selectedCategory,
    );
    return category?.services || [];
  }, [formData.servicesConsumed, categoryOptions]);

  const calculateTotal = () => {
    return formData.servicesConsumed.reduce((sum, serviceId) => {
      const service = currentServices.find(
        (s) => s.id === serviceId || s._id === serviceId,
      );
      return sum + (service?.price || 0);
    }, 0);
  };

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

  const handleCategoryChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategory: e.target.value,
      servicesConsumed: [],
    }));
  };

  const handleServiceToggle = (serviceId) => {
    setFormData((prev) => ({
      ...prev,
      servicesConsumed: prev.servicesConsumed.includes(serviceId)
        ? prev.servicesConsumed.filter((id) => id !== serviceId)
        : [...prev.servicesConsumed, serviceId],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Le nom du client est requis";
    }

    if (formData.servicesConsumed.length === 0) {
      newErrors.services = "Au minimum 1 service doit être sélectionné";
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

    try {
      const billData = {
        clientName: formData.clientName.trim(),
        selectedServices: formData.servicesConsumed.map((serviceId) => {
          const service = currentServices.find(
            (s) => s.id === serviceId || s._id === serviceId,
          );
          return {
            serviceId,
            price: service?.price || 0,
          };
        }),
        paymentMethod: formData.paymentMethod,
        isPaid: formData.isPaid==="paid",
        date: new Date().toISOString(),
      };

      await onSave(billData);

      // Reset form
      setFormData({
        clientName: "",
        selectedCategory: "",
        servicesConsumed: [],
        paymentMethod: "espèces",
        isPaid: false,
      });
      setErrors({});
    } catch (error) {
      console.error("Erreur lors de la création :", error);
      setErrors({
        submit: "Une erreur est survenue lors de la création de la facture",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay $open={open} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>Créer une nouvelle facture</ModalHeader>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="clientName">Nom du Client *</Label>
            <Input
              id="clientName"
              name="clientName"
              type="text"
              placeholder="Ex: Ahmed Ben Ali"
              value={formData.clientName}
              onChange={handleInputChange}
            />
            {errors.clientName && (
              <ErrorMessage>{errors.clientName}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Services Consommés *</Label>
            <ServicesSection>
              <CategorySelect
                value={formData.selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">Sélectionner une catégorie...</option>
                {categoryOptions?.map((category) => (
                  <option
                    key={category.id || category._id}
                    value={category.id || category._id}
                  >
                    {category.categoryName}
                  </option>
                ))}
              </CategorySelect>

              {currentServices.length > 0 ? (
                <>
                  {currentServices.map((service) => (
                    <ServiceItem key={service.id || service._id}>
                      <Checkbox
                        type="checkbox"
                        id={`service-${service.id || service._id}`}
                        checked={
                          formData.servicesConsumed.includes(
                            service.id || service._id,
                          ) || false
                        }
                        onChange={() =>
                          handleServiceToggle(service.id || service._id)
                        }
                      />
                      <ServiceLabel
                        htmlFor={`service-${service.id || service._id}`}
                      >
                        <span>{service.name || service.label}</span>
                        <ServicePrice>{service.price} DT</ServicePrice>
                      </ServiceLabel>
                    </ServiceItem>
                  ))}

                  {formData.servicesConsumed.length > 0 && (
                    <SelectedServicesInfo>
                      {formData.servicesConsumed.length} service(s) sélectionné(s)
                      - Montant : {calculateTotal()} DT
                    </SelectedServicesInfo>
                  )}
                </>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "rgba(251, 248, 243, 0.5)",
                    fontSize: "13px",
                  }}
                >
                  Sélectionnez une catégorie pour voir les services disponibles
                </div>
              )}

              {errors.services && (
                <ErrorMessage>{errors.services}</ErrorMessage>
              )}
            </ServicesSection>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="paymentMethod">Méthode de Paiement *</Label>
            <Select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
            >
              <option value="espèces">Espèces</option>
              <option value="virement">Virement</option>
              <option value="carte">Carte</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="isPaid">Statut de la Facture *</Label>
            <Select
              id="isPaid"
              name="isPaid"
              value={formData.isPaid}
              onChange={handleInputChange}
            >
              <option value="unpaid">Non payée</option>
              <option value="paid">Payée</option>
            </Select>
          </FormGroup>

          {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}

          <FormFooter>
            <CancelButton type="button" onClick={onClose}>
              Annuler
            </CancelButton>
            <SaveButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer la facture"}
            </SaveButton>
          </FormFooter>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}
