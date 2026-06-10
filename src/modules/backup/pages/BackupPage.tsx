interface PageProps {
  onBack: () => void;
}

function BackupPage({ onBack }: PageProps) {
  return (
    <main className="container">
      <h1>Respaldos</h1>
      <button className="back-btn" onClick={onBack}>← Volver</button>
    </main>
  );
}

export default BackupPage;
