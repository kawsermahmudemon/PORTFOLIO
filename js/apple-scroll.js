/* ══════════════════════════════════════════
   APPLE-STYLE SCROLL (GSAP + ScrollTrigger)
   Optimized for Lenis integration (Removed pinning for smooth scrolling)
   ══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Only apply on desktop
  if (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // --- 1. HERO CINEMATIC ZOOM ---
  // (Removed pin: true to prevent scroll from getting stuck)
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    gsap.to(heroContent, {
      scale: 1.5, // Reduced scale so it doesn't pixelate too much without pinning
      opacity: 0,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.5
      }
    });
  }

  // --- 2. ABOUT IMAGE PARALLAX ---
  const aboutImage = document.querySelector('.about-image-frame img');
  if (aboutImage) {
    gsap.set(aboutImage, { height: '130%', objectPosition: '50% 0%' });
    
    gsap.to(aboutImage, {
      objectPosition: '50% 100%',
      ease: "none",
      scrollTrigger: {
        trigger: ".about-visual",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }
});

// Re-calculate on load
window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
});
