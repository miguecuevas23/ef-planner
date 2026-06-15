import HomeButton from "../../../shared/components/HomeButton";
import "../../activities/pages/ActivitiesSearchPage.css";
import "./PlanningComingSoonPage.css";

interface PageProps {
  onBack: () => void;
}

function PlanningComingSoonPage({ onBack }: PageProps) {
  return (
    <div className="search-page">
      <div className="search-page-header">
        <button className="back-btn" onClick={onBack}>← Volver</button>
        <HomeButton onClick={onBack} />
        <h1 className="search-page-title">Planificación</h1>
        <p className="search-page-subtitle">Próximamente</p>
      </div>

      <div className="planning-coming-soon">
        <div className="planning-coming-soon-icon">📋</div>

        <div className="planning-coming-soon-badge">En desarrollo</div>

        <h2 className="planning-coming-soon-title">Estamos preparando el planificador</h2>

        <p className="planning-coming-soon-text">
          Una herramienta para organizar objetivos de aprendizaje, momentos de la
          clase, actividades, tiempos y adaptaciones.
        </p>

        <p className="planning-coming-soon-eta">
          El planificador estará disponible en <strong>EF Planner 2.0</strong>.
        </p>
      </div>
    </div>
  );
}

export default PlanningComingSoonPage;
