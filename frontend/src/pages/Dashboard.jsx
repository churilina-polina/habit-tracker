import { Plus, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import AddHabitForm from "../components/AddHabitForm";
import HabitCard from "../components/HabitCard";
import Navbar from "../components/Navbar";
import ProgressRing from "../components/ProgressRing";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { CATEGORY_META, CATEGORY_ORDER } from "../constants/categories";

const QUOTES = [
  "Маленькие шаги каждый день складываются в большие перемены.",
  "Дисциплина — это выбор между тем, что хочется сейчас, и тем, что важно всегда.",
  "Привычка не требует мотивации — только повторения.",
  "Не важно, насколько медленно. Важно не останавливаться.",
  "Сегодняшний выбор — это привычка завтрашнего дня.",
];

const DAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

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
      prev.map((h) => (h.id === habit.id ? { ...h, completed_today: !h.completed_today } : h))
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
  const today = now.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" });
  const quote = QUOTES[now.getDate() % QUOTES.length];
  const firstName = user?.name?.split(" ")[0];

  const categoryProgress = CATEGORY_ORDER.map((cat) => {
    const list = habits.filter((h) => h.category === cat);
    if (!list.length) return null;
    const done = list.filter((h) => h.completed_today).length;
    return { ...CATEGORY_META[cat], pct: Math.round((done / list.length) * 100) };
  }).filter(Boolean);

  const weekBars = DAY_LABELS.map((label, i) => {
    const offset = 6 - i;
    const date = new Date(now);
    date.setDate(now.getDate() - offset);
    const sum = habits.reduce((s, h) => {
      const done = h.last_7_days?.[i];
      return s + (done ? 1 : 0);
    }, 0);
    const pct = habits.length ? Math.round((sum / habits.length) * 100) : 0;
    return { label, pct, isToday: offset === 0, isFuture: date > now };
  });

  return (
    <>
      <Navbar />
      <main className="container dashboard">
      <div className="dashboard-grid">
        <div className="dashboard-main">
          <section className="hero card elev-md">
            <div className="hero-blob" />
            <div className="hero-content">
              <p className="text-muted hero-date">{today}</p>
              <h1>
                {getGreeting(now.getHours())}
                {firstName ? `, ${firstName}` : ""}!
              </h1>
              <p className="hero-quote">«{quote}»</p>
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="hero-stat-value">
                    {completedCount}/{habits.length || 0}
                  </span>
                  <span className="hero-stat-label">выполнено сегодня</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat">
                  <span className="hero-stat-value hero-stat-streak">🔥 {bestStreak}</span>
                  <span className="hero-stat-label">лучший стрик</span>
                </div>
              </div>
            </div>
            <ProgressRing percent={percent} label={`${percent}%`} sublabel="сегодня" size={140} stroke={12} />
          </section>

          <div className="section-heading">
            <h2>Мои привычки</h2>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <Plus size={15} />
              Добавить
            </button>
          </div>

          {loading && <p className="empty-state">Загрузка...</p>}

          {!loading && habits.length === 0 && (
            <div className="empty-state card">
              <p>Пока нет ни одной привычки — начни с малого.</p>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                Создать первую
              </button>
            </div>
          )}

          <div className="habit-list">
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
          </div>
        </div>

        <aside className="dashboard-aside">
          {categoryProgress.length > 0 && (
            <div className="card elev-sm aside-card">
              <h3>Категории</h3>
              {categoryProgress.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.label} className="category-progress">
                    <div className="category-progress-head">
                      <span>
                        <Icon size={12} /> {cat.label}
                      </span>
                      <span className="text-muted">{cat.pct}%</span>
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: `${cat.pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="card elev-sm aside-card">
            <h3>Неделя</h3>
            <div className="week-bars">
              {weekBars.map((day) => (
                <div key={day.label} className="week-bar-col">
                  <div
                    className="week-bar"
                    style={{ height: `${Math.max(6, (day.pct / 100) * 60)}px` }}
                  />
                  <span className={`text-muted ${day.isToday ? "week-bar-today" : ""}`}>
                    {day.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card elev-sm aside-card aside-tip">
            <div className="aside-tip-head">
              <Sparkles size={16} color="var(--color-accent-700)" />
              <h3>Совет дня</h3>
            </div>
            <p>Начни с самой сложной привычки — пока энергии больше всего.</p>
          </div>
        </aside>
      </div>

      {showForm && <AddHabitForm onCreate={handleCreate} onClose={() => setShowForm(false)} />}
      </main>
    </>
  );
}
