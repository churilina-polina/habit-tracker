import { Bell, Check, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { CATEGORY_META } from "../constants/categories";

export default function HabitCard({ habit, onToggle, onDelete }) {
  const meta = CATEGORY_META[habit.category] || CATEGORY_META.other;
  const Icon = meta.icon;

  return (
    <div className="habit-card card elev-sm">
      <button
        className={`habit-checkbox ${habit.completed_today ? "checked" : ""}`}
        onClick={() => onToggle(habit)}
        aria-label="Отметить выполнение"
      >
        {habit.completed_today && <Check size={16} color="var(--color-surface)" />}
      </button>

      <Link to={`/habits/${habit.id}`} className="habit-info">
        <span className="habit-title">{habit.title}</span>
        <span className="habit-meta">
          <span className={`tag ${meta.tagClass}`}>
            <Icon />
            {meta.label}
          </span>
          {habit.current_streak > 0 && (
            <span className="habit-streak">
              <Flame size={12} color="var(--color-accent-700)" /> {habit.current_streak} дн.
            </span>
          )}
          {habit.reminder_enabled && habit.reminder_time && (
            <span className="habit-reminder">
              <Bell size={12} /> {habit.reminder_time.slice(0, 5)}
            </span>
          )}
        </span>
      </Link>

      {habit.last_7_days?.length > 0 && (
        <div className="habit-week">
          {habit.last_7_days.map((done, i) => (
            <span key={i} className={`habit-dot ${done ? "filled" : ""}`} />
          ))}
        </div>
      )}

      <button className="habit-delete" onClick={() => onDelete(habit)} aria-label="Удалить">
        ✕
      </button>
    </div>
  );
}
