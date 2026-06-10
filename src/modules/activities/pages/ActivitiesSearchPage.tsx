interface PageProps {
  onBack: () => void;
}

function ActivitiesSearchPage({ onBack }: PageProps) {
  return (
    <main className="container">
      <h1>Buscar actividades</h1>
      <button className="back-btn" onClick={onBack}>← Volver</button>
    </main>
  );
}

export default ActivitiesSearchPage;
