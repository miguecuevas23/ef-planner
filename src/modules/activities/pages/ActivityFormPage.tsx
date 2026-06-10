interface PageProps {
  onBack: () => void;
}

function ActivityFormPage({ onBack }: PageProps) {
  return (
    <main className="container">
      <h1>Nueva actividad</h1>
      <button className="back-btn" onClick={onBack}>← Volver</button>
    </main>
  );
}

export default ActivityFormPage;
