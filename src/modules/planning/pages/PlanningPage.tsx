import HomeButton from "../../../shared/components/HomeButton";
import { FEATURES } from "../../../shared/constants/features";
import "../../activities/pages/ActivitiesSearchPage.css";
import "./PlanningComingSoonPage.css";

interface PageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

function PlanningPage({ onBack, onNavigate }: PageProps) {
  if (!FEATURES.planningSkillsExperimental) {
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

  return (
    <div className="search-page">
      <div className="search-page-header">
        <button className="back-btn" onClick={onBack}>← Volver</button>
        <HomeButton onClick={onBack} />
        <h1 className="search-page-title">Constructor de Objetivos</h1>
        <p className="search-page-subtitle">Módulo experimental de planificación</p>
      </div>

      <div className="planning-menu-grid">
        <button className="planning-menu-card" onClick={() => onNavigate("planning_builder")}>
          <span className="planning-menu-icon">✏️</span>
          <span className="planning-menu-label">Crear habilidad</span>
          <span className="planning-menu-desc">Construye un componente de habilidad usando la taxonomía de Bloom</span>
        </button>

        <button className="planning-menu-card" onClick={() => onNavigate("planning_library")}>
          <span className="planning-menu-icon">📚</span>
          <span className="planning-menu-label">Biblioteca de habilidades</span>
          <span className="planning-menu-desc">Explora, edita y organiza tus habilidades guardadas</span>
        </button>

        <div className="planning-menu-card planning-menu-disabled">
          <span className="planning-menu-icon">🧠</span>
          <span className="planning-menu-label">Próximamente: conocimientos</span>
          <span className="planning-menu-badge">Próximamente</span>
        </div>

        <div className="planning-menu-card planning-menu-disabled">
          <span className="planning-menu-icon">💪</span>
          <span className="planning-menu-label">Próximamente: actitudes</span>
          <span className="planning-menu-badge">Próximamente</span>
        </div>

        <div className="planning-menu-card planning-menu-disabled">
          <span className="planning-menu-icon">🎯</span>
          <span className="planning-menu-label">Próximamente: OA completos</span>
          <span className="planning-menu-badge">Próximamente</span>
        </div>

        <div className="planning-menu-card planning-menu-disabled">
          <span className="planning-menu-icon">📅</span>
          <span className="planning-menu-label">Próximamente: planificación de clases</span>
          <span className="planning-menu-badge">Próximamente</span>
        </div>
      </div>
    </div>
  );
}

export default PlanningPage;
