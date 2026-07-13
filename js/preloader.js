/* ══════════════════════════════════════════
   CINEMATIC PRELOADER — Counter 0→100%
   ══════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const numberEl = document.getElementById("preloader-number");
  const barEl = document.getElementById("preloader-bar");
  if (!preloader) return;

  let current = 0;
  const target = 100;
  const duration = 1800; // ms total
  const startTime = performance.now();

  function updateCounter(timestamp) {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-out cubic for natural deceleration
    const eased = 1 - Math.pow(1 - progress, 3);
    current = Math.floor(eased * target);

    if (numberEl) numberEl.textContent = current;
    if (barEl) barEl.style.width = `${current}%`;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      // Ensure final values
      if (numberEl) numberEl.textContent = "100";
      if (barEl) barEl.style.width = "100%";
      
      // Dramatic pause at 100%, then reveal
      setTimeout(() => {
        preloader.classList.add("done");
        // Clean up after transition
        setTimeout(() => {
          preloader.remove();
          document.body.style.overflow = "";
        }, 600);
      }, 300);
    }
  }

  // Lock scroll during preload
  document.body.style.overflow = "hidden";
  requestAnimationFrame(updateCounter);
});
