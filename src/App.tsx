import { useState } from "react";
import "./styles.css";

interface CardProps {
  title: string;
  icon: string;
  onClick: () => void;
}

function Card({ title, icon, onClick }: CardProps) {
  return (
    <button className="card" onClick={onClick}>
      <span className="card-icon">{icon}</span>
      <span className="card-title">{title}</span>
    </button>
  );
}

function App() {
  const [activeView, setActiveView] = useState<string | null>(null);

  const handleCardClick = (view: string) => {
    setActiveView(view);
  };

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">EF Planner</h1>
        <p className="subtitle">Biblioteca pedagógica para clases de Educación Física</p>
      </header>

      <section className="cards-grid">
        <Card title="Buscar actividades" icon="🔍" onClick={() => handleCardClick("search")} />
        <Card title="Nueva actividad" icon="➕" onClick={() => handleCardClick("new")} />
        <Card title="Favoritas" icon="⭐" onClick={() => handleCardClick("favorites")} />
        <Card title="Respaldos" icon="💾" onClick={() => handleCardClick("backups")} />
      </section>

      {activeView && (
        <div className="placeholder-view">
          <p>Vista: {activeView}</p>
          <button className="back-btn" onClick={() => setActiveView(null)}>
            ← Volver
          </button>
        </div>
      )}
    </main>
  );
}

export default App;