import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import Navbar from "../components/Navbar";
import client from "../api/client";

export default function HabitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    client.get(`/habits/${id}/stats`).then(({ data }) => setStats(data));
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

  const chartData = stats.history.map((h) => ({
    date: h.date.slice(5),
    value: h.completed ? 1 : 0,
  }));

  return (
    <>
      <Navbar />
      <main className="container detail-page">
        <Link to="/" className="back-link">
          ← Назад
        </Link>

        <div className="stat-grid">
          <div className="stat-card card">
            <span className="stat-value">🔥 {stats.current_streak}</span>
            <span className="stat-label">Текущий стрик</span>
          </div>
          <div className="stat-card card">
            <span className="stat-value">🏆 {stats.longest_streak}</span>
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

        <div className="card chart-card">
          <h2>Динамика за 28 дней</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4fa3e3" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#4fa3e3" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#7688a0" }}
                axisLine={false}
                tickLine={false}
                interval={3}
              />
              <Tooltip
                formatter={(v) => (v ? "Выполнено" : "Пропущено")}
                contentStyle={{ borderRadius: 10, border: "1px solid #e2ecf5" }}
              />
              <Area
                type="stepAfter"
                dataKey="value"
                stroke="#4fa3e3"
                strokeWidth={2}
                fill="url(#fill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </main>
    </>
  );
}
