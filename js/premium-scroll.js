// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential easing
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Integrate GSAP with Lenis (if GSAP ScrollTrigger is available)
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0, 0);
}

// Add Magnetic Hover Effect
document.querySelectorAll('a, button, .btn-primary, .btn-ghost, .project-card, .eca-card, .cert-card, .social-link').forEach((el) => {
  el.classList.add('hover-magnetic');
});

// Awwwards-style reveal animations using GSAP
document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === 'undefined') return;
  
  // Fade up headers
  gsap.utils.toArray('.section-title').forEach((title) => {
    gsap.from(title, {
      scrollTrigger: {
        trigger: title,
        start: "top 85%",
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
  });

  // Scale up background images/shapes
  gsap.utils.toArray('.hero-portrait-container, .project-image').forEach((img) => {
    gsap.fromTo(img, 
      { scale: 0.95, opacity: 0.8 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 1.5, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: img,
          start: "top 90%",
        }
      }
    );
  });
});
