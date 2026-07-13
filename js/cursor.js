/* ══════════════════════════════════════════
   PREMIUM BLEND-MODE CURSOR WITH MORPHING
   ══════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(pointer: coarse)").matches || 'ontouchstart' in window) return;

  // Make sure we have the text element inside ring
  let ring = document.getElementById("cursor-ring");
  if (ring && !ring.querySelector('.cursor-text')) {
    const textEl = document.createElement('div');
    textEl.className = 'cursor-text';
    ring.appendChild(textEl);
  }

  const dot = document.getElementById("cursor-dot");
  ring = document.getElementById("cursor-ring");
  const textEl = ring ? ring.querySelector('.cursor-text') : null;

  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = `${mx}px`;
    dot.style.top = `${my}px`;
    dot.style.opacity = "1";
    ring.style.opacity = "1";
  });

  window.addEventListener("mouseleave", () => {
    dot.style.opacity = "0";
    ring.style.opacity = "0";
  });

  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = `${rx}px`;
    ring.style.top = `${ry}px`;
    requestAnimationFrame(animateRing);
  })();

  // Hover detection via delegation
  const hoverSelectors = 'a, button, .magnetic, .form-input, .tab-btn, [role="button"]';
  const morphSelectors = '[data-cursor-text]';

  document.body.addEventListener("mouseover", e => {
    const morphTarget = e.target.closest(morphSelectors);
    if (morphTarget) {
      const text = morphTarget.getAttribute('data-cursor-text');
      if (textEl) textEl.innerText = text;
      dot.classList.add("morphed");
      ring.classList.add("morphed");
    } else if (e.target.closest(hoverSelectors)) {
      dot.classList.add("hover");
      ring.classList.add("hover");
    }
  });

  document.body.addEventListener("mouseout", e => {
    const morphTarget = e.target.closest(morphSelectors);
    if (morphTarget) {
      dot.classList.remove("morphed");
      ring.classList.remove("morphed");
    } else if (e.target.closest(hoverSelectors)) {
      dot.classList.remove("hover");
      ring.classList.remove("hover");
    }
  });
});
