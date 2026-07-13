/* ══════════════════════════════════════════
   PERFORMANCE UTILITIES
   Shared helpers for throttling & batching
   ══════════════════════════════════════════ */

/**
 * RAF-based throttle: ensures callback runs at most once per animation frame.
 * Perfect for mousemove / scroll handlers that update visuals.
 */
function rafThrottle(fn) {
  let ticking = false;
  return function (...args) {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      fn.apply(this, args);
      ticking = false;
    });
  };
}

/**
 * Classic throttle: limits function to once every `ms` milliseconds.
 * Good for scroll handlers that don't need pixel-perfect timing.
 */
function throttle(fn, ms) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/* Expose globally */
window.rafThrottle = rafThrottle;
window.throttle = throttle;
