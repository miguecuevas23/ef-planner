import { Activity } from "../types/activity";
import { CLASS_MOMENTS, PHYSICAL_CAPACITIES, INTENSITY_LEVELS, SPACES } from "../../../shared/constants/pedagogicalOptions";
import "./ActivityCard.css";

interface ActivityCardProps {
  activity: Activity;
  onViewDetail: (activity: Activity) => void;
}

function getLabel(options: { value: string; label: string }[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

function ActivityCard({ activity, onViewDetail }: ActivityCardProps) {
  return (
    <article className="activity-card">
      <div className="activity-card-header">
        <h3 className="activity-card-name">{activity.name}</h3>
        {activity.isFavorite && <span className="activity-card-favorite">⭐</span>}
      </div>

      <div className="activity-card-tags">
        <span className="tag">{getLabel(CLASS_MOMENTS, activity.classMoment)}</span>
        <span className="tag">{getLabel(PHYSICAL_CAPACITIES, activity.physicalCapacity)}</span>
        <span className="tag">{getLabel(INTENSITY_LEVELS, activity.intensity)}</span>
      </div>

      <div className="activity-card-details">
        <div className="detail">
          <span className="detail-label">Participantes</span>
          <span className="detail-value">{activity.minParticipants} – {activity.maxParticipants}</span>
        </div>
        <div className="detail">
          <span className="detail-label">Duración</span>
          <span className="detail-value">{activity.durationMinutes} min</span>
        </div>
        <div className="detail">
          <span className="detail-label">Espacio</span>
          <span className="detail-value">{getLabel(SPACES, activity.space)}</span>
        </div>
        <div className="detail">
          <span className="detail-label">Implementos</span>
          <span className="detail-value">{activity.equipment.length > 0 ? activity.equipment.join(", ") : "Ninguno"}</span>
        </div>
      </div>

      <p className="activity-card-description">{activity.description}</p>

      <button className="activity-card-button" onClick={() => onViewDetail(activity)}>
        Ver detalle
      </button>
    </article>
  );
}

export default ActivityCard;
