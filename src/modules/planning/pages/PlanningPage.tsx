import HomeButton from "../../../shared/components/HomeButton";
import "../../activities/pages/ActivitiesSearchPage.css";
import "./PlanningComingSoonPage.css";

interface PageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

function PlanningPage({ onBack, onNavigate }: PageProps) {
  return (
    <div className="search-page">
      <div className="search-page-header">
        <button className="back-btn" onClick={onBack}>← Volver</button>
        <HomeButton onClick={onBack} />
        <h1 className="search-page-title">Planificación</h1>
        <p className="search-page-subtitle">Construye Objetivos de Aprendizaje para tus clases</p>
      </div>

      <div className="planning-menu-grid">
        <button className="planning-menu-card" onClick={() => onNavigate("planning_knowledge")}>
          <span className="planning-menu-icon">📖</span>
          <span className="planning-menu-label">Conocimientos</span>
          <span className="planning-menu-desc">Saberes conceptuales para construir Objetivos de Aprendizaje</span>
        </button>

        <button className="planning-menu-card" onClick={() => onNavigate("planning_builder")}>
          <span className="planning-menu-icon">✏️</span>
          <span className="planning-menu-label">Habilidades</span>
          <span className="planning-menu-desc">Construye componentes de habilidad usando la taxonomía de Bloom</span>
        </button>

        <div className="planning-menu-card planning-menu-disabled">
          <span className="planning-menu-icon">💪</span>
          <span className="planning-menu-label">Actitudes</span>
          <span className="planning-menu-badge">Próximamente</span>
        </div>

        <div className="planning-menu-card planning-menu-disabled">
          <span className="planning-menu-icon">🎯</span>
          <span className="planning-menu-label">Objetivos de Aprendizaje</span>
          <span className="planning-menu-badge">Próximamente</span>
        </div>

        <div className="planning-menu-card planning-menu-disabled">
          <span className="planning-menu-icon">📅</span>
          <span className="planning-menu-label">Planificaciones</span>
          <span className="planning-menu-badge">Próximamente</span>
        </div>
      </div>
    </div>
  );
}

export default PlanningPage;
