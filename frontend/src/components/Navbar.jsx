import { Flame, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <button className="navbar-logo" onClick={() => navigate("/")}>
          <Flame size={20} color="var(--color-accent-700)" />
          Habitly
        </button>
        <nav className="navbar-links">
          <button className="navbar-link" onClick={() => navigate("/")}>
            Дашборд
          </button>
          <button className="navbar-link" onClick={() => navigate("/profile")}>
            Профиль
          </button>
        </nav>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <LogOut size={15} />
          Выйти
        </button>
      </div>
    </header>
  );
}
