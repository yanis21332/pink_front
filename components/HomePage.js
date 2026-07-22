"use client";

import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import api from "../lib/axios"; // Importer axios pour les requêtes HTTP

import { getFiltered } from "../lib/utils";
import {
  ShellContainer,
  Sidebar,
  MainContent,
  Scrim,
} from "../components/Shell";
import SidebarComponent from "../components/SidebarComponent";
import Topbar from "../components/Topbar";
import Hero from "../components/Hero";
import FiltersPanel from "../components/FiltersPanel";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { socket } from "../lib/socket";
import ManagementPage from "../components/ManagementPage";
import { API } from "../lib/data";

const Content = styled.div`
  padding: 32px;
  flex: 1;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const AlertBox = styled.div`
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 26px;
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 14px;
  color: ${(props) => (props.type === "success" ? "#1f4d1f" : "#7a1a1a")};
  background: ${(props) =>
    props.type === "success" ? "#e6f4ea" : "rgba(178, 59, 59, 0.12)"};
  border: 1px solid
    ${(props) => (props.type === "success" ? "#7bb783" : "#b23b3b")};
`;

// Configuration de base d'Axios (à adapter selon l'URL de votre serveur)
const API_URL = `${API || "http://localhost:5000"}/api/appointements`;

export default function HomePage() {
  // On commence avec un tableau vide, en attendant les données du serveur
  const [appts, setAppts] = useState([]);
  const [prcts, setPrcts] = useState([]);
  const [bills, setBills] = useState([]);
  const [menu, setMenu] = useState([]);
  const [category, setCategory] = useState("hammam");
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastMovedId, setLastMovedId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  });
  const [alert, setAlert] = useState({ type: "", message: "" });

  const [currentPage, setCurrentPage] = useState("appointments");

  const [serverModalError, setServerModalError] = useState("");

  const [filters, setFilters] = useState({
    statuts: [],
  });

  const state = {
    cat: category,
    search,
    selectedDate,
    ...filters,
  };

  const filteredAppts = getFiltered(appts, state);

  const currentMonthStr = useMemo(() => {
    if (!selectedDate) return "";
    return selectedDate.substring(0, 7); // Extrait "YYYY-MM" depuis "YYYY-MM-DD"
  }, [selectedDate]);

  useEffect(() => {
    if (lastMovedId !== null) {
      const timer = setTimeout(() => setLastMovedId(null), 900);
      return () => clearTimeout(timer);
    }
  }, [lastMovedId]);

  // 1. CHARGEMENT INITIAL (HTTP REST)
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 6000);
  };

  useEffect(() => {
    if (!currentMonthStr) return;
    const fetchAppointments = async () => {
      try {
        const [year, month] = currentMonthStr.split("-").map(Number);

        // Premier jour du mois à 00:00:00
        const startDate = new Date(
          Date.UTC(year, month - 1, 1, 0, 0, 0, 0),
        ).toISOString();

        // Dernier jour du mois à 23:59:59
        const endDate = new Date(
          Date.UTC(year, month, 0, 23, 59, 59, 999),
        ).toISOString();

        const response = await api.get(
          `${API_URL}/get-all-appointements?startDate=${startDate}&endDate=${endDate}`,
          {
            withCredentials: true,
          },
        );

        const mappedData = response.data.appointements.map((appt) => ({
          ...appt,
          id: appt._id,
          status: appt.status,
          date:
            appt.date ||
            appt.exactDate ||
            (appt.startTime?.includes("T")
              ? appt.startTime.split("T")[0]
              : undefined),
        }));
        setAppts(mappedData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des rendez-vous :",
          error,
        );
        showAlert(
          "error",
          error?.response?.data?.error ||
            "Impossible de charger les rendez-vous.",
        );
      }
    };
    fetchAppointments();
  }, [currentMonthStr]);
  useEffect(() => {
    const fetchPractitioners = async () => {
      try {
        const response = await api.get(
          `${API}/api/practitioner/get-practitioners`,
          { withCredentials: true },
        );
        const mappedData = response.data.practitioners.map((pr) => ({
          ...pr,
          id: pr._id,
        }));
        setPrcts(mappedData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des praticiennes :",
          error,
        );
        showAlert(
          "error",
          error?.response?.data?.error ||
            "Impossible de charger les praticiennes.",
        );
      }
    };

    const fetchMenu = async () => {
      try {
        const response = await api.get(`${API}/api/menu/get-menu`, {
          withCredentials: true,
        });
        const mappedData = response.data.menu.map((m) => ({
          ...m,
          id: m._id,
        }));
        setMenu(mappedData);
      } catch (err) {
        console.error("Erreur lors de la récuperation du menu !");
        showAlert(
          "error",
          error?.response?.data?.error ||
            "Impossible de charger le menu des tarifs.",
        );
      }
    };

    fetchPractitioners();
    fetchMenu();
  }, []);

  // 2. GESTION DU TEMPS RÉEL (Socket.IO)
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {});

    socket.on("bill_created", (bill) => {
      const mappedBill = { ...bill.newBill, id: bill.newBill._id };
      setBills((prev) => [...prev, mappedBill]);
    });
    socket.on("bill_deleted", (deletedId) => {
      setBills((prev) => prev.filter((b) => b.id !== deletedId.id));
    });

    socket.on("category_created", (category) => {
      const mappedCategory = {
        ...category.category,
        id: category.category._id,
      };
      setMenu((prev) => [...prev, mappedCategory]);
    });
    socket.on("category_changed", (data) => {
      // data correspond à l'objet reçu { type: "POST", category: category }
      const updatedCategory = data.category;

      setMenu((prevMenu) => {
        // Le return ici est obligatoire pour que React mette à jour l'état
        return prevMenu.map((c) => {
          // Comparaison stricte sur les _id de MongoDB
          if (c._id === updatedCategory._id) {
            return updatedCategory;
          }
          return c;
        });
      });
    });
    socket.on("category_deleted", (data) => {
      const targetId = data.id;

      setMenu((prevMenu) =>
        prevMenu.filter((category) => category._id !== targetId),
      );
    });
    socket.on("service_deleted", (data) => {
      // data contient { type: "DELETE", serviceId: "..." }
      const deletedId = data.serviceId;

      setMenu((prevMenu) => {
        // prevMenu est le tableau de toutes vos catégories [ { categoryName, services: [...] }, ... ]
        return prevMenu.map((category) => {
          return {
            ...category,
            // On filtre le tableau de services de CHAQUE catégorie pour retirer celui qui a été supprimé
            services: category.services.filter(
              (service) => service._id !== deletedId,
            ),
          };
        });
      });
    });

    socket.on("prct_created", (newPrct) => {
      const mappedPrct = { ...newPrct.newPrct, id: newPrct.newPrct._id };
      setPrcts((prev) => [...prev, mappedPrct]);
    });
    socket.on("prct_updated", (data) => {
      const practitioner = data.updatedPrct;

      setPrcts((prevPrcts) => {
        // Le return ici est obligatoire pour mettre à jour l'état React
        return prevPrcts.map((p) => {
          // Comparaison stricte et saine avec le _id de MongoDB
          if ((p._id || p.id) === (practitioner._id || practitioner.id)) {
            return practitioner;
          }
          return p;
        });
      });
    });

    socket.on("prct_deleted", (deletedId) => {
      setPrcts((prev) => prev.filter((prct) => prct.id !== deletedId.id));
    });

    // Écoute de l'ajout d'un rendez-vous par un autre client ou l'admin
    socket.on("appt_created", (newAppt) => {
      const mappedAppt = { ...newAppt.newAppt, id: newAppt.newAppt._id };
      setAppts((prev) => [...prev, mappedAppt]);
      setLastMovedId(mappedAppt.id);
    });

    // Écoute de la mise à jour d'un rendez-vous
    socket.on("appt_updated", (updatedAppt) => {
      const mappedAppt = {
        ...updatedAppt.updatedAppt,
        id: updatedAppt.updatedAppt._id,
      };
      setAppts((prev) =>
        prev.map((appt) => {
          if (appt.id === mappedAppt.id) {
            return mappedAppt;
          } else {
            return appt;
          }
        }),
      );
    });

    // Écoute de la suppression d'un rendez-vous
    socket.on("appt_deleted", (deletedId) => {
      setAppts((prev) => prev.filter((appt) => appt.id !== deletedId.id));
    });

    return () => {
      socket.off("connect");
      socket.off("appt_created");
      socket.off("appt_updated");
      socket.off("appt_deleted");
      socket.off("prct_created");
      socket.off("prct_updated");
      socket.off("prct_deleted");
      socket.off("category_created");
      socket.off("category_changed");
      socket.off("category_deleted");
      socket.off("service_deleted");
      socket.off("bill_created");
      socket.off("bill_deleted");
      socket.disconnect();
    };
  }, []);

  // 3. ACTIONS UTILISATEUR (Envois au Backend)
  const handleApptChange = async (id, field, value) => {
    try {
      const currentAppt = appts.find((a) => a.id === id);
      let updatedFields = {};
      if (Array.isArray(field)) {
        updatedFields = { ...currentAppt };
        field.forEach((f, index) => {
          updatedFields[f] = value[index];
        });
      } else {
        updatedFields = { ...currentAppt, [field]: value };
      }

      await api.patch(`${API_URL}/update-appointement/${id}`, updatedFields, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Erreur lors de la modification du rendez-vous :", error);
      showAlert(
        "error",
        error?.response?.data?.error ||
          "Une erreur est survenue lors de la mise à jour.",
      );
    }
  };

  const handleLocalApptChange = (id, field, value) => {
    setAppts((prev) => {
      prev.map((appt) => {
        if (!appt) return;

        if (appt.id === id) {
          return { ...appt, [field]: value };
        } else {
          return appt;
        }
      });
    });
  };

  const handleApptDelete = async (id) => {
    try {
      await api.delete(`${API_URL}/delete-appointement/${id}`, {
        withCredentials: true,
      });
      setAppts((prev) => prev.filter((appt) => appt.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression du rendez-vous :", error);
      showAlert(
        "error",
        error?.response?.data?.error ||
          "Impossible de supprimer le rendez-vous.",
      );
    }
  };

  const handleCreateAppt = async (data) => {
    try {
      const apptToSend = {
        ...data,
        price: Number(data.price) || 0,
        date:
          data.exactDate ||
          data.date ||
          (data.startTime?.includes("T")
            ? data.startTime.split("T")[0]
            : undefined),
        status: data.status || data.statut,
      };

      const response = await api.post(
        `${API_URL}/create-appointement`,
        apptToSend,
        { withCredentials: true },
      );
      const createdAppt = {
        ...response.data,
        id: response.data._id,
        statut:
          response.data.statut || response.data.status || apptToSend.statut,
        date: response.data.date || apptToSend.date,
      };

      setAppts((prev) => [...prev, createdAppt]);
      setLastMovedId(createdAppt.id);
      setModalOpen(false);
      setServerModalError("");
      showAlert("success", "Rendez-vous créé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la création du rendez-vous :", error);
      const errorMsg =
        error?.response?.data?.error ||
        "Une erreur est survenue pendant la création.";
      setServerModalError(errorMsg);
      showAlert("error", errorMsg);
    }
  };

  const handleStatutToggle = (statut) => {
    setFilters((prev) => ({
      ...prev,
      statuts: prev.statuts.includes(statut)
        ? prev.statuts.filter((s) => s !== statut)
        : [...prev.statuts, statut],
    }));
  };

  return (
    <ShellContainer>
      <Sidebar id="sidebar" className={sidebarOpen ? "open" : ""}>
        <SidebarComponent
          activeCategory={currentPage === "management" ? "gestion" : category}
          appts={appts}
          className="sideBarComponent"
          onCategoryChange={(cat) => {
            setCategory(cat);
            setCurrentPage("appointments");
            setSidebarOpen(false);
          }}
          onManagementClick={() => {
            setCurrentPage("management");
            setSidebarOpen(false);
          }}
        />
      </Sidebar>
      <Scrim
        id="scrim"
        className={sidebarOpen ? "open" : ""}
        onClick={() => setSidebarOpen(false)}
      />
      <MainContent className={`${category}Content`} $category={category}>
        {currentPage === "management" ? (
          <ManagementPage
            menu={menu}
            practitioners={prcts}
            onBillsChange={setBills}
            onPractitionersChange={setPrcts}
            onMenuChange={setMenu}
            onHamburgerClick={() => setSidebarOpen(true)}
          />
        ) : (
          <>
            <Topbar
              category={category}
              searchValue={search}
              onSearchChange={setSearch}
              filterOpen={filterOpen}
              onFilterToggle={() => setFilterOpen(!filterOpen)}
              onNewClick={() => setModalOpen(true)}
              onHamburgerClick={() => setSidebarOpen(true)}
            />
            <Content>
              {alert.message && (
                <AlertBox type={alert.type}>{alert.message}</AlertBox>
              )}
              <Hero category={category} appts={appts} />
              <FiltersPanel
                open={filterOpen}
                category={category}
                statuts={filters.statuts}
                onStatutToggle={handleStatutToggle}
              />
              <Table
                appts={filteredAppts}
                onApptChange={handleApptChange}
                onApptDelete={handleApptDelete}
                lastMovedId={lastMovedId}
                category={category}
                selectedDate={selectedDate}
                onSelectedDateChange={setSelectedDate}
                practitioners={prcts}
                allAppts={appts}
              />
            </Content>
          </>
        )}
      </MainContent>

      <Modal
        open={modalOpen}
        activeCategory={category}
        onClose={() => {
          setModalOpen(false);
          setServerModalError("");
        }}
        onSave={handleCreateAppt}
        practitioners={prcts}
        existingAppointments={appts}
        serverError={serverModalError}
      />
    </ShellContainer>
  );
}
