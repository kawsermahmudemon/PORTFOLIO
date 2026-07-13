/* ══════════════════════════════════════════
   SMOOTH SCROLL ENGINE (Lenis + GSAP)
   Buttery-smooth Apple-style scrolling
   ══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Only apply on desktop — mobile native scroll feels better
  if (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768) return;

  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 0.8,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // If GSAP ScrollTrigger is available, let GSAP drive Lenis (single RAF loop)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);

      // Let GSAP's ticker be the single animation driver
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      // Fallback: Lenis drives its own RAF loop
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') {
          lenis.scrollTo(0);
        } else {
          lenis.scrollTo(targetId, { offset: -80 });
        }
      });
    });

    // Expose lenis instance globally for other scripts
    window.lenis = lenis;
  }
});
