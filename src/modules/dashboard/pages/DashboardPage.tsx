import DashboardCard from "../components/DashboardCard";
import Logo from "../../../shared/components/Logo";
import "./DashboardPage.css";

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

function DashboardPage({ onNavigate }: DashboardPageProps) {
  return (
    <main className="container">
      <header className="header">
        <Logo size="large" />
        <p className="subtitle">Biblioteca pedagógica para clases de Educación Física</p>
      </header>

      <section className="cards-grid">
        <DashboardCard title="Buscar actividades" icon="🔍" onClick={() => onNavigate("search")} />
        <DashboardCard title="Nueva actividad" icon="➕" onClick={() => onNavigate("new")} />
        <DashboardCard title="Importar actividades" icon="📥" onClick={() => onNavigate("import")} />
        <DashboardCard title="Favoritas" icon="⭐" onClick={() => onNavigate("favorites")} />
        <DashboardCard title="Planificación" icon="📋" onClick={() => onNavigate("planning")} />
        <DashboardCard title="Respaldos" icon="💾" onClick={() => onNavigate("backups")} />
        <DashboardCard title="Configuración" icon="⚙️" onClick={() => onNavigate("settings")} />
      </section>
    </main>
  );
}

export default DashboardPage;
