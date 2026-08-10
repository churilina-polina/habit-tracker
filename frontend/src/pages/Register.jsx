import { Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthHero from "../components/AuthHero";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, name, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Не получилось зарегистрироваться");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthHero mode="register">
      <h2>Создать аккаунт</h2>
      <p className="text-muted">Начни отслеживать привычки уже сегодня</p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Имя</label>
          <div className="input-icon-wrap">
            <User size={15} />
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Полина"
              required
            />
          </div>
        </div>
        <div className="field">
          <label>Email</label>
          <div className="input-icon-wrap">
            <Mail size={15} />
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
        </div>
        <div className="field">
          <label>Пароль</label>
          <div className="input-icon-wrap">
            <Lock size={15} />
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 8 символов"
              minLength={8}
              required
            />
          </div>
        </div>
        {error && <p className="form-error">{error}</p>}
        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Создаём..." : "Зарегистрироваться"}
        </button>
      </form>
      <p className="auth-switch">
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </AuthHero>
  );
}
