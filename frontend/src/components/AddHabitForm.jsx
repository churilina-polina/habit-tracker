import { useState } from "react";
import { CATEGORY_META, CATEGORY_ORDER } from "../constants/categories";

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
    <div className="dialog-backdrop" onClick={onClose}>
      <form className="dialog card elev-lg" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2 className="dialog-title">Новая привычка</h2>
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
            {CATEGORY_ORDER.map((value) => {
              const meta = CATEGORY_META[value];
              const Icon = meta.icon;
              return (
                <button
                  type="button"
                  key={value}
                  className={`category-chip ${category === value ? "active" : ""}`}
                  onClick={() => setCategory(value)}
                >
                  <Icon size={13} />
                  {meta.label}
                </button>
              );
            })}
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
        <div className="dialog-actions">
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
