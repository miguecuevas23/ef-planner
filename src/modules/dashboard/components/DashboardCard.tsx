interface DashboardCardProps {
  title: string;
  icon: string;
  onClick: () => void;
}

function DashboardCard({ title, icon, onClick }: DashboardCardProps) {
  return (
    <button className="card" onClick={onClick}>
      <span className="card-icon">{icon}</span>
      <span className="card-title">{title}</span>
    </button>
  );
}

export default DashboardCard;
