/* ══════════════════════════════════════════
   THEME SWITCHER — Cinematic Transitions
   ══════════════════════════════════════════ */
(function () {
  const getTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    // Default to dark for cinematic experience
    return "dark";
  };

  const theme = getTheme();
  document.documentElement.setAttribute("data-theme", theme);

  const updateIcon = (t) => {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    const icon = btn.querySelector(".theme-icon");
    if (icon) icon.textContent = t === "dark" ? "🌙" : "☀️";
    btn.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
  };

  document.addEventListener("DOMContentLoaded", () => {
    updateIcon(document.documentElement.getAttribute("data-theme"));
    
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      updateIcon(next);
    });
  });
})();
