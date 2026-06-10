import { useState, useMemo } from "react";
import { mockActivities } from "../services/mockActivities";
import { Activity } from "../types/activity";
import { CLASS_MOMENTS, PHYSICAL_CAPACITIES } from "../../../shared/constants/pedagogicalOptions";
import ActivityCard from "../components/ActivityCard";
import ActivityDetailPage from "./ActivityDetailPage";
import "./ActivitiesSearchPage.css";

interface PageProps {
  onBack: () => void;
}

function ActivitiesSearchPage({ onBack }: PageProps) {
  const [searchText, setSearchText] = useState("");
  const [filterMoment, setFilterMoment] = useState("");
  const [filterCapacity, setFilterCapacity] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const filteredActivities = useMemo(() => {
    return mockActivities.filter((activity) => {
      const matchesText =
        searchText === "" ||
        activity.name.toLowerCase().includes(searchText.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchText.toLowerCase()) ||
        activity.tags.some((tag) => tag.toLowerCase().includes(searchText.toLowerCase()));

      const matchesMoment = filterMoment === "" || activity.classMoment === filterMoment;
      const matchesCapacity = filterCapacity === "" || activity.physicalCapacity === filterCapacity;

      return matchesText && matchesMoment && matchesCapacity;
    });
  }, [searchText, filterMoment, filterCapacity]);

  if (selectedActivity) {
    return (
      <ActivityDetailPage
        activity={selectedActivity}
        onBack={() => setSelectedActivity(null)}
      />
    );
  }

  return (
    <div className="search-page">
      <div className="search-page-header">
        <h1 className="search-page-title">Buscar actividades</h1>
        <p className="search-page-subtitle">Encuentra actividades pedagógicas para tu clase</p>
      </div>

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
            value={filterCapacity}
            onChange={(e) => setFilterCapacity(e.target.value)}
          >
            <option value="">Todas las capacidades</option>
            {PHYSICAL_CAPACITIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="search-results-count">
        {filteredActivities.length} actividad{filteredActivities.length !== 1 ? "es" : ""} encontrada{filteredActivities.length !== 1 ? "s" : ""}
      </p>

      {filteredActivities.length === 0 ? (
        <div className="search-empty">
          <p>No se encontraron actividades con esos filtros.</p>
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
