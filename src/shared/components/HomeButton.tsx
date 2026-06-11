interface HomeButtonProps {
  onClick: () => void;
}

function HomeButton({ onClick }: HomeButtonProps) {
  return (
    <button className="home-btn" onClick={onClick}>
      🏠 Inicio
    </button>
  );
}

export default HomeButton;
