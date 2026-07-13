/* ══════════════════════════════════════════
   3D TILT EFFECT — Premium card interactions
   ══════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const TILT_MAX = 8; // degrees
  const SCALE = 1.02;
  const GLARE_OPACITY = 0.12;

  function initTilt(card) {
    const glare = document.createElement("div");
    glare.className = "tilt-glare";
    card.style.transformStyle = "preserve-3d";
    card.appendChild(glare);

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const rotateX = ((y - cy) / cy) * -TILT_MAX;
      const rotateY = ((x - cx) / cx) * TILT_MAX;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${SCALE},${SCALE},${SCALE})`;

      // Glare follows cursor
      const gx = (x / rect.width) * 100;
      const gy = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,${GLARE_OPACITY}), transparent 60%)`;
      glare.style.opacity = "1";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
      glare.style.opacity = "0";
      setTimeout(() => { card.style.transition = ""; }, 500);
    });

    card.addEventListener("mouseenter", () => {
      card.style.transition = "none";
    });
  }

  // Initialize on all tiltable elements
  function setupAllTilt() {
    document.querySelectorAll("[data-tilt]").forEach(initTilt);
  }

  setupAllTilt();
  // Expose for dynamic content
  window.setupTilt = setupAllTilt;
});
