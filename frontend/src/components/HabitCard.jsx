import { Link } from "react-router-dom";

const CATEGORY_META = {
  health: { icon: "💧", label: "Здоровье" },
  study: { icon: "📚", label: "Учёба" },
  productivity: { icon: "⚡", label: "Продуктивность" },
  other: { icon: "✨", label: "Другое" },
};

const WEEKDAYS = ["П", "В", "С", "Ч", "П", "С", "В"];

function WeekDots({ days }) {
  if (!days || days.length === 0) return null;
  const todayIndex = new Date().getDay();
  const startIndex = (todayIndex - (days.length - 1) + 7) % 7;

  return (
    <div className="habit-week">
      {days.map((done, i) => (
        <span
          key={i}
          className={`habit-dot ${done ? "filled" : ""}`}
          title={WEEKDAYS[(startIndex + i) % 7]}
        />
      ))}
    </div>
  );
}

export default function HabitCard({ habit, onToggle, onDelete }) {
  const meta = CATEGORY_META[habit.category] || CATEGORY_META.other;

  return (
    <div className={`habit-card card habit-category-${habit.category} ${habit.completed_today ? "done" : ""}`}>
      <button
        className={`habit-checkbox ${habit.completed_today ? "checked" : ""}`}
        onClick={() => onToggle(habit)}
        aria-label="Отметить выполнение"
      >
        {habit.completed_today && "✓"}
      </button>

      <Link to={`/habits/${habit.id}`} className="habit-info">
        <span className="habit-title">{habit.title}</span>
        <span className="habit-meta">
          <span className="habit-category">
            {meta.icon} {meta.label}
          </span>
          {habit.current_streak > 0 && (
            <span className="habit-streak">🔥 {habit.current_streak} дн.</span>
          )}
          {habit.reminder_enabled && habit.reminder_time && (
            <span className="habit-reminder">⏰ {habit.reminder_time.slice(0, 5)}</span>
          )}
        </span>
      </Link>

      <WeekDots days={habit.last_7_days} />

      <button className="habit-delete" onClick={() => onDelete(habit)} aria-label="Удалить">
        ✕
      </button>
    </div>
  );
}
