/* 
 * Spotlight Effect for Glass Cards
 * RAF-throttled for performance — no longer fires on every mousemove pixel
 */

document.addEventListener('DOMContentLoaded', () => {
  // Skip on touch devices
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const cards = document.querySelectorAll('.glass-card');
  if (!cards.length) return;

  // Add spotlight class to all glass cards
  cards.forEach(card => card.classList.add('spotlight-enabled'));

  let spotlightTicking = false;
  let lastX = 0, lastY = 0;

  document.addEventListener('mousemove', (e) => {
    lastX = e.clientX;
    lastY = e.clientY;

    if (spotlightTicking) return;
    spotlightTicking = true;

    requestAnimationFrame(() => {
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        
        // Skip cards that are off-screen (huge perf win)
        if (rect.bottom < 0 || rect.top > window.innerHeight ||
            rect.right < 0 || rect.left > window.innerWidth) return;

        // Calculate mouse position relative to the card
        const x = lastX - rect.left;
        const y = lastY - rect.top;

        // Set CSS variables on the card
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
      spotlightTicking = false;
    });
  }, { passive: true });
});
