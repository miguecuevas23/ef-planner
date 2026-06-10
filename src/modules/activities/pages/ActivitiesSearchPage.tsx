import { useState, useMemo, useEffect } from "react";
import { Activity, PhysicalCapacity } from "../types/activity";
import { CLASS_MOMENTS, PHYSICAL_CAPACITIES } from "../../../shared/constants/pedagogicalOptions";
import { getAllActivities, testDatabaseConnection } from "../services/activityRepository";
import { seedActivities } from "../services/seedActivities";
import { mockActivities } from "../services/mockActivities";
import ActivityCard from "../components/ActivityCard";
import ActivityDetailPage from "./ActivityDetailPage";
import "./ActivitiesSearchPage.css";

type PhysicalCapacityFilter = PhysicalCapacity | "";

interface PageProps {
  onBack: () => void;
}

function ActivitiesSearchPage({ onBack }: PageProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchText, setSearchText] = useState("");
  const [filterMoment, setFilterMoment] = useState("");
  const [selectedPhysicalCapacity, setSelectedPhysicalCapacity] = useState<PhysicalCapacityFilter>("");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const dbOk = await testDatabaseConnection();
        if (!cancelled && dbOk) {
          await seedActivities();
          const data = await getAllActivities();
          if (!cancelled) setActivities(data);
        } else if (!cancelled) {
          setActivities([...mockActivities]);
          setErrorMessage(
            "No se pudo conectar con SQLite. Mostrando actividades de ejemplo temporalmente."
          );
        }
      } catch {
        if (!cancelled) {
          setActivities([...mockActivities]);
          setErrorMessage(
            "No se pudo conectar con SQLite. Mostrando actividades de ejemplo temporalmente."
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesText =
        searchText === "" ||
        activity.name.toLowerCase().includes(searchText.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchText.toLowerCase()) ||
        activity.tags.some((tag) => tag.toLowerCase().includes(searchText.toLowerCase()));

      const matchesMoment = filterMoment === "" || activity.classMoment === filterMoment;

      const matchesPhysicalCapacity =
        !selectedPhysicalCapacity ||
        activity.physicalCapacity === selectedPhysicalCapacity;

      return matchesText && matchesMoment && matchesPhysicalCapacity;
    });
  }, [searchText, filterMoment, selectedPhysicalCapacity, activities]);

  if (selectedActivity) {
    return (
      <ActivityDetailPage
        activity={selectedActivity}
        onBack={() => setSelectedActivity(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="search-page">
        <div className="search-page-header">
          <h1 className="search-page-title">Buscar actividades</h1>
        </div>
        <div className="search-empty">
          <p>Cargando actividades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="search-page-header">
        <h1 className="search-page-title">Buscar actividades</h1>
        <p className="search-page-subtitle">Encuentra actividades pedagógicas para tu clase</p>
      </div>

      {errorMessage && (
        <div className="search-empty" style={{ marginBottom: "1rem" }}>
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="search-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por nombre, descripción o etiqueta..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <div className="search-filters">
          <select
            className="search-filter"
            value={filterMoment}
            onChange={(e) => setFilterMoment(e.target.value)}
          >
            <option value="">Todos los momentos</option>
            {CLASS_MOMENTS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          <select
            className="search-filter"
            value={selectedPhysicalCapacity}
            onChange={(e) => setSelectedPhysicalCapacity(e.target.value as PhysicalCapacityFilter)}
          >
            <option value="">Todas las capacidades</option>
            {PHYSICAL_CAPACITIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="search-results-count">
        Mostrando {filteredActivities.length} actividad{filteredActivities.length !== 1 ? "es" : ""}
      </p>

      {filteredActivities.length === 0 ? (
        <div className="search-empty">
          <p>No se encontraron actividades con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="activities-list">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onViewDetail={setSelectedActivity}
            />
          ))}
        </div>
      )}

      <button className="back-btn" onClick={onBack}>← Volver</button>
    </div>
  );
}

export default ActivitiesSearchPage;
