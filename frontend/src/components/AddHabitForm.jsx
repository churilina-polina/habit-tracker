import { useState } from "react";

const CATEGORIES = [
  { value: "health", label: "💧 Здоровье" },
  { value: "study", label: "📚 Учёба" },
  { value: "productivity", label: "⚡ Продуктивность" },
  { value: "other", label: "✨ Другое" },
];

export default function AddHabitForm({ onCreate, onClose }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("other");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("09:00");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({
      title: title.trim(),
      category,
      reminder_enabled: reminderEnabled,
      reminder_time: reminderEnabled ? reminderTime : null,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal-card card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>Новая привычка</h2>
        <div className="field">
          <label>Название</label>
          <input
            className="input"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например, пить воду"
          />
        </div>
        <div className="field">
          <label>Категория</label>
          <div className="category-picker">
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.value}
                className={`category-chip ${category === c.value ? "active" : ""}`}
                onClick={() => setCategory(c.value)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="field reminder-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={reminderEnabled}
              onChange={(e) => setReminderEnabled(e.target.checked)}
            />
            Напоминать каждый день
          </label>
          {reminderEnabled && (
            <input
              type="time"
              className="input"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          )}
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="btn btn-primary">
            Создать
          </button>
        </div>
      </form>
    </div>
  );
}
