import { useState, useEffect } from "react";
import "./Header.css";

function Header() {
  const storedTheme = localStorage.getItem("theme") || "dark";
  const [theme, setTheme] = useState(storedTheme);

  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header className="header">
      <h1 className="title-header">Dashboard - Analyse et Prédictions</h1>
      {/* Switch mode dark/light */}
      <div className="theme-switch">
        <label htmlFor="themeToggle" className="switch">
          <span className="sr-only">
            Basculer entre le mode clair et sombre
          </span>
          <input
            id="themeToggle"
            type="checkbox"
            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            checked={theme === "light"}
          />
          <span className="slider"></span>
        </label>
        <span className="icon" aria-hidden="true">
          {theme === "dark" ? "🌙" : "☀️"}
        </span>
      </div>
    </header>
  );
}

export default Header;
