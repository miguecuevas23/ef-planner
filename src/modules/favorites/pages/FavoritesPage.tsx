interface PageProps {
  onBack: () => void;
}

function FavoritesPage({ onBack }: PageProps) {
  return (
    <main className="container">
      <h1>Favoritas</h1>
      <button className="back-btn" onClick={onBack}>← Volver</button>
    </main>
  );
}

export default FavoritesPage;
