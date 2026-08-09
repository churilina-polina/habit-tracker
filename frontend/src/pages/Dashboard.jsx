import { useEffect, useState } from "react";
import AddHabitForm from "../components/AddHabitForm";
import HabitCard from "../components/HabitCard";
import Navbar from "../components/Navbar";
import ProgressRing from "../components/ProgressRing";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

const QUOTES = [
  "Маленькие шаги каждый день складываются в большие перемены.",
  "Дисциплина — это выбор между тем, что хочется сейчас, и тем, что важно всегда.",
  "Привычка не требует мотивации — только повторения.",
  "Не важно, насколько медленно. Важно не останавливаться.",
  "Сегодняшний выбор — это привычка завтрашнего дня.",
];

function getGreeting(hour) {
  if (hour < 6) return "Доброй ночи";
  if (hour < 12) return "Доброе утро";
  if (hour < 18) return "Добрый день";
  return "Добрый вечер";
}

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const load = async () => {
    const { data } = await client.get("/habits");
    setHabits(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggle = async (habit) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habit.id ? { ...h, completed_today: !h.completed_today } : h
      )
    );
    const { data } = await client.post(`/habits/${habit.id}/toggle`);
    setHabits((prev) => prev.map((h) => (h.id === habit.id ? data : h)));
  };

  const handleDelete = async (habit) => {
    if (!confirm(`Удалить привычку «${habit.title}»?`)) return;
    await client.delete(`/habits/${habit.id}`);
    setHabits((prev) => prev.filter((h) => h.id !== habit.id));
  };

  const handleCreate = async (payload) => {
    const { data } = await client.post("/habits", payload);
    setHabits((prev) => [data, ...prev]);
    setShowForm(false);
  };

  const completedCount = habits.filter((h) => h.completed_today).length;
  const percent = habits.length ? Math.round((completedCount / habits.length) * 100) : 0;
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.current_streak), 0);
  const now = new Date();
  const today = now.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const quote = QUOTES[now.getDate() % QUOTES.length];
  const firstName = user?.name?.split(" ")[0];

  return (
    <>
      <Navbar />
      <main className="container dashboard">
        <section className="hero card">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-content">
            <p className="hero-date">{today}</p>
            <h1>
              {getGreeting(now.getHours())}
              {firstName ? `, ${firstName}` : ""}!
            </h1>
            <p className="hero-quote">«{quote}»</p>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">{completedCount}/{habits.length || 0}</span>
                <span className="hero-stat-label">выполнено сегодня</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value">🔥 {bestStreak}</span>
                <span className="hero-stat-label">лучший стрик</span>
              </div>
            </div>
          </div>
          <ProgressRing percent={percent} label={`${percent}%`} sublabel="сегодня" size={120} />
        </section>

        <div className="section-heading">
          <h2>Мои привычки</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Добавить
          </button>
        </div>

        {loading && <p className="empty-state">Загрузка...</p>}

        {!loading && habits.length === 0 && (
          <div className="empty-state card">
            <div className="empty-illustration">
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <circle cx="36" cy="36" r="34" stroke="#cfe4f7" strokeWidth="2" strokeDasharray="6 6" />
                <path
                  d="M24 37l8 8 16-18"
                  stroke="#4fa3e3"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            <p>Пока нет ни одной привычки — начни с малого.</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Создать первую
            </button>
          </div>
        )}

        <div className="habit-list">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>

      {showForm && <AddHabitForm onCreate={handleCreate} onClose={() => setShowForm(false)} />}
    </>
  );
}
