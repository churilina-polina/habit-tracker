import { useEffect, useRef, useState } from "react";
import client from "../api/client";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const load = () => {
    client.get("/notifications").then(({ data }) => setNotifications(data));
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const unread = notifications.filter((n) => !n.is_read).length;

  const markRead = async (id) => {
    await client.post(`/notifications/${id}/read`);
    load();
  };

  return (
    <div className="bell-wrapper" ref={ref}>
      <button className="bell-button" onClick={() => setOpen((v) => !v)}>
        🔔
        {unread > 0 && <span className="bell-badge">{unread}</span>}
      </button>
      {open && (
        <div className="bell-dropdown card">
          <p className="bell-title">Уведомления</p>
          {notifications.length === 0 && <p className="bell-empty">Пока пусто</p>}
          {notifications.map((n) => (
            <button
              key={n.id}
              className={`bell-item ${n.is_read ? "read" : ""}`}
              onClick={() => markRead(n.id)}
            >
              {n.message}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
