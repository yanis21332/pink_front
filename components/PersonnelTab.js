"use client";

import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { API } from "../lib/data";

const allowedSpecialties = [
  "hammam",
  "coloration",
  "onglerie",
  "esthetique",
  "mariees",
];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.section`
  padding: 24px;
  border-radius: 20px;
  border: 1px solid rgba(251, 248, 243, 0.08);
  background: rgba(251, 248, 243, 0.03);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--blanc);
`;

const SectionDescription = styled.p`
  margin: 10px 0 0;
  color: rgba(251, 248, 243, 0.7);
  font-size: 14px;
  line-height: 1.6;
`;

const ActionButton = styled.button`
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid rgba(251, 248, 243, 0.18);
  background: rgba(237, 100, 166, 0.22);
  color: var(--blanc);
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.16s ease;

  &:hover {
    background: rgba(237, 100, 166, 0.32);
  }
`;

const Card = styled.div`
  border-radius: 16px;
  border: 1px solid rgba(251, 248, 243, 0.1);
  background: rgba(251, 248, 243, 0.04);
  padding: 18px;
  display: grid;
  gap: 14px;
  margin-top: 8px;
`;

const ItemRow = styled.div`
  display: grid;
  gap: 10px;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
`;

const ItemTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemName = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: var(--blanc);
`;

const ItemMeta = styled.span`
  font-size: 13px;
  color: rgba(251, 248, 243, 0.65);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(251, 248, 243, 0.15);
  background: ${(props) => (props.$danger ? "rgba(178, 59, 59, 0.12)" : "transparent")};
  color: ${(props) => (props.$danger ? "#ed96a6" : "var(--blanc)")};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.16s ease;

  &:hover {
    background: ${(props) => (props.$danger ? "rgba(178, 59, 59, 0.18)" : "rgba(251, 248, 243, 0.06)")};
  }
`;

const InlineForm = styled.div`
  display: grid;
  gap: 12px;
  border-radius: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.04);
  margin-top: 5px;
  border: 1px solid rgba(251, 248, 243, 0.08);
`;

const FieldRow = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 680px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: rgba(251, 248, 243, 0.75);
  font-size: 13px;
`;

const Input = styled.input`
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(251, 248, 243, 0.14);
  background: rgba(251, 248, 243, 0.05);
  color: var(--blanc);
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: var(--rose);
  }
`;

const CheckboxGrid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(251, 248, 243, 0.1);
  background: rgba(251, 248, 243, 0.02);
  cursor: pointer;
  font-size: 13px;
  color: rgba(251, 248, 243, 0.85);
  transition: all 0.16s ease;

  &:hover {
    border-color: rgba(237, 100, 166, 0.4);
    background: rgba(237, 100, 166, 0.08);
  }
`;

const CheckboxInput = styled.input`
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: var(--rose);
  cursor: pointer;
  flex-shrink: 0;
`;

const Note = styled.p`
  margin: 0;
  font-size: 13px;
  color: rgba(251, 248, 243, 0.65);
`;

const ErrorMessage = styled.span`
  display: block;
  margin-top: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(237, 150, 166, 0.35);
  background: rgba(178, 59, 59, 0.16);
  color: #ffd0da;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
`;

const CategoryCard = styled(Card)`
  display: grid;
`;

const ServiceRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(251, 248, 243, 0.08);

  &:last-child {
    border-bottom: none;
  }
`;

const ServiceMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ServiceName = styled.span`
  font-weight: 600;
  color: var(--blanc);
`;

const ServiceInfo = styled.span`
  font-size: 13px;
  color: rgba(251, 248, 243, 0.65);
`;

const ServiceActions = styled.div`
  display: flex;
  gap: 10px;
`;

const EmptyState = styled.div`
  padding: 18px;
  border-radius: 16px;
  background: rgba(251, 248, 243, 0.02);
  color: rgba(251, 248, 243, 0.65);
  font-size: 14px;
`;

const formatPrice = (value) => `${Number(value || 0).toLocaleString("fr-FR")} DA`;

export default function PersonnelTab({ practitioners = [], onPractitionersChange, menu = [], onMenuChange }) {
  const [showPractitionerForm, setShowPractitionerForm] = useState(false);
  const [newPractitionerName, setNewPractitionerName] = useState("");
  const [newPractitionerSpecialties, setNewPractitionerSpecialties] = useState([]);
  const [editPractitionerId, setEditPractitionerId] = useState(null);
  const [editSpecialties, setEditSpecialties] = useState([]);
  const [practitionerError, setPractitionerError] = useState("");

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [serviceFormOpen, setServiceFormOpen] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({});
  const [serviceError, setServiceError] = useState("");

  const handleToggleSpecialty = (specialty, currentList, setter) => {
    if (currentList.includes(specialty)) {
      setter(currentList.filter((item) => item !== specialty));
    } else {
      setter([...currentList, specialty]);
    }
  };

  const handleCreatePractitioner = async () => {
    setPractitionerError("");
    if (!newPractitionerName.trim()) {
      setPractitionerError("Le nom complet est requis.");
      return;
    }
    if (newPractitionerSpecialties.length === 0) {
      setPractitionerError("Sélectionne au moins une spécialité.");
      return;
    }

    try {
      const response = await axios.post(
        `${API}/api/practitioner/create-practitioner`,
        {
          fullName: newPractitionerName.trim(),
          domain: newPractitionerSpecialties,
        },
        { withCredentials: true },
      );

      const created = response.data.practitioner || response.data;
      if (!created) {
        throw new Error("Impossible de créer la praticienne.");
      }
      const mapped = {
        ...created,
        id: created._id || created.id,
        fullName: created.fullName || created.name,
      };

      //onPractitionersChange((prev) => [...prev, mapped]);
      setNewPractitionerName("");
      setNewPractitionerSpecialties([]);
      setShowPractitionerForm(false);
    } catch (error) {
      setPractitionerError(error?.response?.data?.error || error.message || "Erreur lors de la création.");
    }
  };

  const handleUpdatePractitioner = async (practitioner) => {
    if (!editSpecialties.length) {
      setPractitionerError("La praticienne doit avoir au moins une spécialité.");
      return;
    }

    try {
      const response = await axios.patch(
        `${API}/api/practitioner/update-practitioner/${practitioner.id||practitioner._id}`,
        {
          domain: editSpecialties,
        },
        { withCredentials: true },
      );

      const updated = response.data.practitioner || response.data;
      const mapped = {
        ...practitioner,
        ...updated,
        id: updated._id || practitioner.id,
      };

      //onPractitionersChange((prev) => prev.map((item) => (item.id === practitioner.id ? mapped : item)));
      setEditPractitionerId(null);
      setEditSpecialties([]);
      setPractitionerError("");
    } catch (error) {
      setPractitionerError(error?.response?.data?.error || error.message || "Erreur lors de la mise à jour.");
    }
  };

  const handleDeletePractitioner = async (id) => {
    const confirmed = window.confirm("Supprimer cette praticienne ?");
    if (!confirmed) return;

    try {
      await axios.delete(
        `${API}/api/practitioner/delete-practitioner/${id}`,
        { withCredentials: true },
      );
      onPractitionersChange((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      setPractitionerError(error?.response?.data?.error || error.message || "Erreur lors de la suppression.");
    }
  };

  const handleCreateCategory = async () => {
    setCategoryError("");
    if (!newCategoryName.trim()) {
      setCategoryError("Le nom de la catégorie est requis.");
      return;
    }

    try {
      const response = await axios.post(
        `${API}/api/menu/create-category`,
        { categoryName: newCategoryName.trim() },
        { withCredentials: true },
      );

      const created = response.data.category || response.data;
      if (!created) {
        throw new Error("Impossible de créer la catégorie.");
      }
      const mapped = { ...created, id: created._id || created.id };
      //onMenuChange((prev) => [...prev, mapped]);
      setNewCategoryName("");
      setShowCategoryForm(false);
    } catch (error) {
      setCategoryError(error?.response?.data?.error || error.message || "Erreur lors de la création.");
    }
  };

  const handleDeleteCategory = async (id) => {
    const confirmed = window.confirm("Supprimer cette catégorie et tous ses services ?");
    if (!confirmed) return;

    try {
      await axios.delete(
        `${API}/api/menu/delete-category/${id}`,
        { withCredentials: true },
      );
      onMenuChange((prev) => prev.filter((category) => category.id !== id));
    } catch (error) {
      setCategoryError(error?.response?.data?.error || error.message || "Erreur lors de la suppression.");
    }
  };

  const handleOpenServiceForm = (categoryId) => {
    setServiceFormOpen(serviceFormOpen === categoryId ? null : categoryId);
    setServiceFormData((prev) => ({ ...prev, [categoryId]: { name: "", price: "", duration: "" } }));
    setServiceError("");
  };

  const handleServiceInputChange = (categoryId, field, value) => {
    setServiceFormData((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [field]: value,
      },
    }));
  };

  const handleAddService = async (categoryId) => {
    const current = serviceFormData[categoryId] || {};
    if (!current.name.trim()) {
      setServiceError("Le nom du service est requis.");
      return;
    }
    if (!current.price || Number(current.price) <= 0) {
      setServiceError("Le prix doit être supérieur à 0.");
      return;
    }

    try {
      const response = await axios.post(
        `${API}/api/menu/add-service/${categoryId}`,
        {
          name: current.name.trim(),
          price: Number(current.price),
          duration: current.duration ? current.duration.trim() : undefined,
        },
        { withCredentials: true },
      );

      const updated = response.data.category || response.data;
      if (!updated) {
        throw new Error("Impossible d'ajouter le service.");
      }
      const mappedCategory = { ...updated, id: updated._id || categoryId };
      //onMenuChange((prev) => prev?.map((item) => (item.id === categoryId ? mappedCategory : item)));
      setServiceFormOpen(null);
      setServiceError("");
    } catch (error) {
      setServiceError(error?.response?.data?.error || error.message || "Erreur lors de l'ajout du service.");
    }
  };

  const handleDeleteService = async (categoryId, serviceId) => {
    const confirmed = window.confirm("Supprimer ce service ?");
    if (!confirmed) return;

    try {
      const response = await axios.delete(
        `${API}/api/menu/delete-service/${categoryId}/${serviceId}`,
        { withCredentials: true },
      );
      const updated = response.data.category || response.data;
      if (!updated) {
        throw new Error("Impossible de supprimer le service.");
      }
      const mappedCategory = { ...updated, id: updated._id || categoryId };
      onMenuChange((prev) => prev.map((item) => (item.id === categoryId ? mappedCategory : item)));
    } catch (error) {
      setServiceError(error?.response?.data?.error || error.message || "Erreur lors de la suppression du service.");
    }
  };

  const startEditingPractitioner = (practitioner) => {
    if (editPractitionerId === practitioner.id) {
      setEditPractitionerId(null);
      setEditSpecialties([]);
      setPractitionerError("");
      return;
    }

    setEditPractitionerId(practitioner.id);
    setEditSpecialties(practitioner.specialties || practitioner.domain || []);
    setPractitionerError("");
  };

  return (
    <Container>
      <Section>
        <SectionHeader>
          <div>
            <SectionTitle>Praticiennes</SectionTitle>
            <SectionDescription>
              Gère les praticiennes de l'établissement, leurs domaines et leurs spécialités.
            </SectionDescription>
          </div>
          <ActionButton onClick={() => setShowPractitionerForm((prev) => !prev)}>
            {showPractitionerForm ? "Annuler" : "Nouvelle praticienne"}
          </ActionButton>
        </SectionHeader>

        {showPractitionerForm && (
          <InlineForm>
            <FieldRow>
              <Label>
                Nom complet
                <Input
                  type="text"
                  value={newPractitionerName}
                  onChange={(e) => setNewPractitionerName(e.target.value)}
                  placeholder="Nom complet"
                />
              </Label>
              <Label>
                Spécialités
                <CheckboxGrid>
                  {allowedSpecialties.map((specialty) => (
                    <CheckboxLabel key={specialty}>
                      <CheckboxInput
                        type="checkbox"
                        checked={newPractitionerSpecialties.includes(specialty)}
                        onChange={() =>
                          handleToggleSpecialty(
                            specialty,
                            newPractitionerSpecialties,
                            setNewPractitionerSpecialties,
                          )
                        }
                      />
                      {specialty}
                    </CheckboxLabel>
                  ))}
                </CheckboxGrid>
              </Label>
            </FieldRow>
            <ButtonGroup>
              <Button onClick={handleCreatePractitioner}>Créer</Button>
            </ButtonGroup>
            {practitionerError && <ErrorMessage>{practitionerError}</ErrorMessage>}
          </InlineForm>
        )}

        <Card>
          {(practitioners || []).length ? (
            practitioners.map((practitioner,i) => {
              const specialties = practitioner.specialties || practitioner.domain || [];
              return (
                <ItemRow key={i}>
                  <ItemHeader>
                    <ItemTitle>
                      <ItemName>{practitioner.fullName || practitioner.name || "Praticienne"}</ItemName>
                      <ItemMeta>
                        Spécialités : {specialties.length ? specialties.join(", ") : "Aucune"}
                      </ItemMeta>
                    </ItemTitle>
                    <ButtonGroup>
                      <Button onClick={() => startEditingPractitioner(practitioner)}>
                        {editPractitionerId === practitioner.id ? "Annuler" : "Modifier"}
                      </Button>
                      <Button $danger onClick={() => handleDeletePractitioner(practitioner.id||practitioner._id)}>
                        Supprimer
                      </Button>
                    </ButtonGroup>
                  </ItemHeader>

                  {editPractitionerId === practitioner.id && (
                    <InlineForm>
                      <Label>
                        Spécialités
                        <CheckboxGrid>
                          {allowedSpecialties.map((specialty) => (
                            <CheckboxLabel key={specialty}>
                              <CheckboxInput
                                type="checkbox"
                                checked={editSpecialties.includes(specialty)}
                                onChange={() =>
                                  handleToggleSpecialty(specialty, editSpecialties, setEditSpecialties)
                                }
                              />
                              {specialty}
                            </CheckboxLabel>
                          ))}
                        </CheckboxGrid>
                      </Label>
                      <ButtonGroup>
                        <Button onClick={() => handleUpdatePractitioner(practitioner)}>
                          Enregistrer
                        </Button>
                      </ButtonGroup>
                      {practitionerError && <ErrorMessage>{practitionerError}</ErrorMessage>}
                    </InlineForm>
                  )}
                </ItemRow>
              );
            })
          ) : (
            <EmptyState>Aucune praticienne enregistrée pour le moment.</EmptyState>
          )}
        </Card>
      </Section>

      <Section>
        <SectionHeader>
          <div>
            <SectionTitle>Menu des tarifs</SectionTitle>
            <SectionDescription>
              Ajoute ou supprime des catégories et des services. Chaque service peut être prix en DA.
            </SectionDescription>
          </div>
          <ActionButton onClick={() => setShowCategoryForm((prev) => !prev)}>
            {showCategoryForm ? "Annuler" : "Nouvelle catégorie"}
          </ActionButton>
        </SectionHeader>

        {showCategoryForm && (
          <InlineForm>
            <FieldRow>
              <Label>
                Nom de la catégorie
                <Input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Ex. hammam"
                />
              </Label>
            </FieldRow>
            <ButtonGroup>
              <Button onClick={handleCreateCategory}>Créer</Button>
            </ButtonGroup>
            {categoryError && <ErrorMessage>{categoryError}</ErrorMessage>}
          </InlineForm>
        )}

        <div style={{ display: "grid", gap: "16px",marginTop: "8px" }}>
          {(menu || []).length ? (
            menu.map((category,i) => (
              <CategoryCard key={category.id+i}>
                <ItemHeader>
                  <ItemTitle>
                    <ItemName>{category.categoryName || "Catégorie"}</ItemName>
                    <ItemMeta>{(category.services || []).length} service(s)</ItemMeta>
                  </ItemTitle>
                  <ButtonGroup>
                    <Button onClick={() => handleOpenServiceForm(category.id)}>
                      {serviceFormOpen === category.id ? "Fermer" : "Ajouter un service"}
                    </Button>
                    <Button $danger onClick={() => handleDeleteCategory(category.id||category._id)}>
                      Supprimer la catégorie
                    </Button>
                  </ButtonGroup>
                </ItemHeader>

                {(category.services || []).length ? (
                  (category.services || []).map((service) => (
                    <ServiceRow key={service._id || service.id}>
                      <ServiceMeta>
                        <ServiceName>{service.name || "Service"}</ServiceName>
                        <ServiceInfo>
                          {formatPrice(service.price)}
                          {service.duration ? ` • ${service.duration}` : ""}
                        </ServiceInfo>
                      </ServiceMeta>
                      <ServiceActions>
                        <Button $danger onClick={() => handleDeleteService(category.id, service._id || service.id)}>
                          Supprimer
                        </Button>
                      </ServiceActions>
                    </ServiceRow>
                  ))
                ) : (
                  <EmptyState>Aucun service dans cette catégorie.</EmptyState>
                )}

                {serviceFormOpen === category.id && (
                  <InlineForm>
                    <FieldRow>
                      <Label>
                        Nom du service
                        <Input
                          type="text"
                          value={serviceFormData[category.id]?.name || ""}
                          onChange={(e) => handleServiceInputChange(category.id, "name", e.target.value)}
                          placeholder="Ex. Gommage"
                        />
                      </Label>
                      <Label>
                        Prix (DA)
                        <Input
                          type="number"
                          min="0"
                          value={serviceFormData[category.id]?.price || ""}
                          onChange={(e) => handleServiceInputChange(category.id, "price", e.target.value)}
                          placeholder="1000"
                        />
                      </Label>
                    </FieldRow>
                    <Label>
                      Durée (optionnelle)
                      <Input
                        type="text"
                        value={serviceFormData[category.id]?.duration || ""}
                        onChange={(e) => handleServiceInputChange(category.id, "duration", e.target.value)}
                        placeholder="Ex. 45 min"
                      />
                    </Label>
                    <ButtonGroup>
                      <Button onClick={() => handleAddService(category.id)}>Ajouter le service</Button>
                    </ButtonGroup>
                    {serviceError && <ErrorMessage>{serviceError}</ErrorMessage>}
                  </InlineForm>
                )}
              </CategoryCard>
            ))
          ) : (
            <EmptyState>Aucune catégorie tarifaire disponible pour le moment.</EmptyState>
          )}
        </div>
      </Section>
    </Container>
  );
}
