import DashboardCard from "../components/DashboardCard";
import "./DashboardPage.css";

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

function DashboardPage({ onNavigate }: DashboardPageProps) {
  return (
    <main className="container">
      <header className="header">
        <h1 className="title">EF Planner</h1>
        <p className="subtitle">Biblioteca pedagógica para clases de Educación Física</p>
      </header>

      <section className="cards-grid">
        <DashboardCard title="Buscar actividades" icon="🔍" onClick={() => onNavigate("search")} />
        <DashboardCard title="Nueva actividad" icon="➕" onClick={() => onNavigate("new")} />
        <DashboardCard title="Favoritas" icon="⭐" onClick={() => onNavigate("favorites")} />
        <DashboardCard title="Respaldos" icon="💾" onClick={() => onNavigate("backups")} />
      </section>
    </main>
  );
}

export default DashboardPage;
