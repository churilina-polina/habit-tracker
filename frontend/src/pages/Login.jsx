import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthHero from "../components/AuthHero";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Неверный email или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthHero mode="login">
      <h2>С возвращением</h2>
      <p className="text-muted">Войди, чтобы продолжить свои привычки</p>
      <form onSubmit={handleSubmit}>
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
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        {error && <p className="form-error">{error}</p>}
        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Входим..." : "Войти"}
        </button>
      </form>
      <p className="auth-switch">
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </AuthHero>
  );
}
