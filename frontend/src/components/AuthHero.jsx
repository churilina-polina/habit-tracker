import { Bell, Check, ChevronDown, Flame, LineChart, Sparkles, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const QUOTES = [
  "Маленькие шаги каждый день складываются в большие перемены.",
  "Дисциплина — это выбор между тем, что хочется сейчас, и тем, что важно всегда.",
  "Привычка не требует мотивации — только повторения.",
  "Не важно, насколько медленно. Важно не останавливаться.",
  "Сегодняшний выбор — это привычка завтрашнего дня.",
];

// Плавно проявляет элемент на отрезке [start, start+span] прокрутки, 0 → 1.
function reveal(scrollY, start, span = 260) {
  return Math.min(1, Math.max(0, (scrollY - start) / span));
}

export default function AuthHero({ mode, children }) {
  const [scrollY, setScrollY] = useState(0);
  const [sectionTop, setSectionTop] = useState(0);
  const cardSectionRef = useRef(null);
  const quote = QUOTES[new Date().getDate() % QUOTES.length];
  const todayLabel = new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" });

  useEffect(() => {
    // setTimeout-троттлинг вместо requestAnimationFrame: не зависит от того,
    // выполняет ли вкладка сейчас цикл отрисовки (rAF может не сработать,
    // если вкладка неактивна/свёрнута, и тогда скролл навсегда "залипнет").
    let pending = false;
    const update = () => {
      pending = false;
      setScrollY(window.scrollY);
      if (cardSectionRef.current) {
        const rect = cardSectionRef.current.getBoundingClientRect();
        setSectionTop(rect.top + window.scrollY);
      }
    };
    const onScroll = () => {
      if (!pending) {
        pending = true;
        setTimeout(update, 16);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const isRegister = mode === "register";
  const kicker = isRegister ? "Новый аккаунт" : "С возвращением";
  const headline = isRegister ? "Начни отслеживать привычки" : "Продолжи там, где остановился";

  const scrollToCard = () => {
    cardSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Каскад: каждый следующий элемент второй секции проявляется чуть позже предыдущего.
  const kickerP = reveal(scrollY, sectionTop - 640);
  const headlineP = reveal(scrollY, sectionTop - 560);
  const quoteP = reveal(scrollY, sectionTop - 480);
  const featuresP = reveal(scrollY, sectionTop - 400);
  const cardP = reveal(scrollY, sectionTop - 320, 320);

  const fadeUp = (p, distance = 20) => ({
    opacity: p,
    transform: `translateY(${(1 - p) * distance}px)`,
  });

  // Параллакс иллюстрации: плывёт медленнее контента, создавая ощущение глубины.
  const parallax = Math.min(scrollY * 0.12, 90);

  return (
    <div className="auth-page">
      <section className="auth-landing">
        <div className="auth-blob auth-blob-1" style={{ transform: `translateY(${parallax * 0.6}px)` }} />
        <div className="auth-blob auth-blob-2" style={{ transform: `translateY(${-parallax * 0.4}px)` }} />

        <div className="auth-landing-copy">
          <div className="auth-brand">
            <Flame size={24} color="var(--color-accent-700)" />
            <span>Habitly</span>
          </div>
          <span className="tag tag-outline">Трекер привычек</span>
          <h1 className="auth-landing-title">Маленькие шаги — большие перемены</h1>
          <p className="auth-landing-quote">«{quote}»</p>
          <div className="auth-landing-features">
            <span>
              <Flame size={16} color="var(--color-accent-700)" /> Стрики и прогресс
            </span>
            <span>
              <LineChart size={16} color="var(--color-accent-700)" /> Наглядная статистика
            </span>
            <span>
              <Bell size={16} color="var(--color-accent-700)" /> Напоминания вовремя
            </span>
          </div>
          <button className="auth-scroll-hint" onClick={scrollToCard}>
            Прокрути, чтобы войти
            <ChevronDown size={18} color="var(--color-accent-700)" />
          </button>
        </div>

        <div className="auth-landing-preview">
          <div className="auth-preview-halo" style={{ transform: `translateY(calc(-50% + ${-parallax}px))` }} />
          <div
            className="auth-preview-halo-outline"
            style={{ transform: `translateY(calc(-50% + ${-parallax}px))` }}
          />

          <div className="auth-preview-stack" style={{ transform: `translateY(${-parallax}px)` }}>
            <div className="card elev-lg auth-preview-card">
              <div className="auth-preview-head">
                <div>
                  <div className="auth-preview-head-title">Сегодня</div>
                  <div className="auth-preview-head-date">{todayLabel}</div>
                </div>
                <div className="auth-preview-ring">
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="25" fill="none" stroke="var(--color-accent-200)" strokeWidth="6" />
                    <circle
                      cx="30"
                      cy="30"
                      r="25"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="157"
                      strokeDashoffset="52"
                      transform="rotate(-90 30 30)"
                    />
                  </svg>
                  <div className="auth-preview-ring-value">67%</div>
                </div>
              </div>

              <div className="auth-preview-divider" />

              <div className="auth-preview-list">
                <div className="auth-preview-item">
                  <span className="auth-preview-check done">
                    <Check size={12} color="var(--color-surface)" />
                  </span>
                  <span className="auth-preview-item-label">Утренняя пробежка</span>
                  <span className="auth-preview-item-days">12 дн.</span>
                </div>
                <div className="auth-preview-item">
                  <span className="auth-preview-check done">
                    <Check size={12} color="var(--color-surface)" />
                  </span>
                  <span className="auth-preview-item-label">Пить 2 литра воды</span>
                  <span className="auth-preview-item-days">21 дн.</span>
                </div>
                <div className="auth-preview-item muted">
                  <span className="auth-preview-check" />
                  <span className="auth-preview-item-label">Читать 20 страниц</span>
                  <span className="auth-preview-item-days dim">—</span>
                </div>
              </div>

              <div className="auth-preview-bars">
                <span style={{ background: "var(--color-accent-300)" }} />
                <span style={{ background: "var(--color-accent-500)" }} />
                <span style={{ background: "var(--color-accent-200)" }} />
                <span style={{ background: "var(--color-accent-600)" }} />
                <span style={{ background: "var(--color-accent-400)" }} />
                <span style={{ background: "var(--color-accent-600)" }} />
                <span style={{ background: "var(--color-neutral-200)" }} />
              </div>
            </div>

            <div className="card elev-md auth-preview-streak">
              <span className="auth-preview-streak-icon">
                <Flame size={17} color="var(--color-accent-700)" />
              </span>
              <div>
                <div className="auth-preview-streak-value">21 день</div>
                <div className="auth-preview-streak-label">лучший стрик</div>
              </div>
            </div>

            <div className="card elev-md auth-preview-trend">
              <TrendingUp size={16} color="var(--color-accent-700)" />
              <span>+18% за месяц</span>
            </div>
          </div>
        </div>
      </section>

      <section ref={cardSectionRef} className="auth-form-section">
        <div className="auth-form-info">
          <div className="auth-blob auth-blob-3" />
          <div className="auth-brand" style={fadeUp(kickerP, 14)}>
            <Flame size={24} color="var(--color-accent-700)" />
            <span>Habitly</span>
          </div>
          <div className="auth-form-info-text">
            <span className="tag tag-outline" style={fadeUp(kickerP, 14)}>
              {kicker}
            </span>
            <h1 className="auth-form-headline" style={fadeUp(headlineP, 22)}>
              {headline}
            </h1>
            <p className="auth-landing-quote" style={fadeUp(quoteP, 18)}>
              «{quote}»
            </p>
          </div>
          <div className="auth-landing-features" style={fadeUp(featuresP, 18)}>
            <span>
              <Flame size={16} color="var(--color-accent-700)" /> Стрики, которые мотивируют не сдаваться
            </span>
            <span>
              <LineChart size={16} color="var(--color-accent-700)" /> Статистика по неделям и месяцам
            </span>
            <span>
              <Bell size={16} color="var(--color-accent-700)" /> Напоминания в нужный момент
            </span>
          </div>
        </div>

        <div className="auth-form-wrap">
          <div className="card elev-lg auth-card" style={fadeUp(cardP, 28)}>
            <div className="auth-card-icon">
              <Sparkles size={20} color="var(--color-accent-700)" />
            </div>
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}
