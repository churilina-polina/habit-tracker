import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [habits, setHabits] = useState([]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    client.get("/habits").then(({ data }) => setHabits(data));
  }, []);

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  const bestStreak = habits.reduce((max, h) => Math.max(max, h.current_streak), 0);

  const memberSince = user
    ? new Date(user.created_at).toLocaleDateString("ru-RU", { month: "long", year: "numeric" })
    : "";

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(name);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container profile-page">
        <h1>Профиль</h1>

        <div className="card elev-sm profile-card">
          <div className="profile-avatar">{user?.name?.[0]?.toUpperCase() || "?"}</div>
          <div className="profile-identity">
            {editing ? (
              <form className="profile-edit-form" onSubmit={handleSave}>
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
                <button className="btn btn-primary btn-sm" type="submit" disabled={saving}>
                  {saving ? "..." : "Сохранить"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setEditing(false);
                    setName(user.name);
                  }}
                >
                  Отмена
                </button>
              </form>
            ) : (
              <>
                <div className="profile-name">{user?.name}</div>
                <div className="text-muted">{user?.email}</div>
              </>
            )}
          </div>
          {!editing && (
            <button className="btn btn-secondary" onClick={() => setEditing(true)}>
              <Pencil size={14} />
              Изменить
            </button>
          )}
        </div>

        <div className="profile-stats">
          <div className="card profile-stat">
            <span className="profile-stat-value">{habits.length}</span>
            <span className="text-muted">активных привычек</span>
          </div>
          <div className="card profile-stat">
            <span className="profile-stat-value">{bestStreak}</span>
            <span className="text-muted">лучший стрик</span>
          </div>
          <div className="card profile-stat">
            <span className="profile-stat-value profile-stat-date">{memberSince}</span>
            <span className="text-muted">в приложении с</span>
          </div>
        </div>
      </main>
    </>
  );
}
