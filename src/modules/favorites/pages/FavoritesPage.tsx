import { useState, useEffect, useMemo } from "react";
import { Activity } from "../../activities/types/activity";
import { getAllActivities } from "../../activities/services/activityRepository";
import ActivityCard from "../../activities/components/ActivityCard";
import ActivityDetailPage from "../../activities/pages/ActivityDetailPage";
import HomeButton from "../../../shared/components/HomeButton";
import "../../activities/pages/ActivitiesSearchPage.css";

interface PageProps {
  onBack: () => void;
}

function FavoritesPage({ onBack }: PageProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  async function load() {
    setIsLoading(true);
    try {
      const data = await getAllActivities();
      setActivities(data);
    } catch (error) {
      console.error("[Favorites] Error al cargar actividades:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const favorites = useMemo(
    () => activities.filter((a) => a.isFavorite),
    [activities]
  );

  if (selectedActivity) {
    return (
      <ActivityDetailPage
        activity={selectedActivity}
        onBack={() => {
          setSelectedActivity(null);
          load();
        }}
        onEdit={() => {}}
        onDeleted={async () => {
          setSelectedActivity(null);
          await load();
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="search-page">
        <div className="search-page-header">
        <HomeButton onClick={onBack} />
        <h1 className="search-page-title">Favoritas</h1>
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
        <h1 className="search-page-title">Favoritas</h1>
        <p className="search-page-subtitle">Tus actividades marcadas como favoritas</p>
      </div>

      <p className="search-results-count">
        Mostrando {favorites.length} actividad{favorites.length !== 1 ? "es" : ""} favorita{favorites.length !== 1 ? "s" : ""}
      </p>

      {favorites.length === 0 ? (
        <div className="search-empty">
          <p>Aún no tienes actividades favoritas.</p>
        </div>
      ) : (
        <div className="activities-list">
          {favorites.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} onViewDetail={setSelectedActivity} />
          ))}
        </div>
      )}

      <button className="back-btn" onClick={onBack}>← Volver</button>
    </div>
  );
}

export default FavoritesPage;
