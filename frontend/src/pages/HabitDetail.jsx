import { ArrowLeft, Flame, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import Navbar from "../components/Navbar";
import client from "../api/client";
import { CATEGORY_META } from "../constants/categories";

export default function HabitDetail() {
  const { id } = useParams();
  const [habit, setHabit] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([client.get("/habits"), client.get(`/habits/${id}/stats`)]).then(
      ([habitsRes, statsRes]) => {
        setHabit(habitsRes.data.find((h) => h.id === Number(id)));
        setStats(statsRes.data);
      }
    );
  }, [id]);

  if (!stats) {
    return (
      <>
        <Navbar />
        <main className="container">
          <p className="empty-state">Загрузка...</p>
        </main>
      </>
    );
  }

  const meta = CATEGORY_META[habit?.category] || CATEGORY_META.other;
  const Icon = meta.icon;

  const chartData = stats.history.map((h) => ({
    date: h.date.slice(5),
    value: h.completed ? 1 : 0,
  }));

  return (
    <>
      <Navbar />
      <main className="container detail-page">
        <Link to="/" className="back-link">
          <ArrowLeft size={15} /> Назад
        </Link>

        <div className="detail-header">
          <div className="detail-icon">
            <Icon size={24} color="var(--color-accent-700)" />
          </div>
          <div>
            <h1>{habit?.title}</h1>
            <span className={`tag ${meta.tagClass}`}>
              <Icon />
              {meta.label}
            </span>
          </div>
        </div>

        <div className="stat-grid">
          <div className="stat-card card">
            <span className="stat-value">
              <Flame size={18} color="var(--color-accent-700)" /> {stats.current_streak}
            </span>
            <span className="stat-label">Текущий стрик</span>
          </div>
          <div className="stat-card card">
            <span className="stat-value">
              <Trophy size={18} color="var(--color-accent-700)" /> {stats.longest_streak}
            </span>
            <span className="stat-label">Лучший стрик</span>
          </div>
          <div className="stat-card card">
            <span className="stat-value">{stats.completion_rate_7d}%</span>
            <span className="stat-label">За 7 дней</span>
          </div>
          <div className="stat-card card">
            <span className="stat-value">{stats.completion_rate_30d}%</span>
            <span className="stat-label">За 30 дней</span>
          </div>
        </div>

        <div className="card elev-sm chart-card">
          <h3>Динамика за 28 дней</h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8fa073" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#8fa073" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                axisLine={false}
                tickLine={false}
                interval={3}
              />
              <Tooltip
                formatter={(v) => (v ? "Выполнено" : "Пропущено")}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--color-divider)",
                  fontFamily: "var(--font-body)",
                }}
              />
              <Area
                type="stepAfter"
                dataKey="value"
                stroke="var(--color-accent)"
                strokeWidth={2.5}
                fill="url(#fill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card elev-sm chart-card">
          <h3>Календарь выполнения</h3>
          <div className="calendar-grid">
            {stats.history.map((h) => (
              <span key={h.date} className={`calendar-cell ${h.completed ? "filled" : ""}`} title={h.date} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
