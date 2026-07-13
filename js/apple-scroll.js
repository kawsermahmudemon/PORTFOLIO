/* ══════════════════════════════════════════
   APPLE-STYLE SCROLL (GSAP + ScrollTrigger)
   ══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Only apply on desktop
  if (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // --- 1. HERO CINEMATIC ZOOM ---
  // When scrolling down, the hero title scales up massively and fades out.
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    gsap.to(heroContent, {
      scale: 4,
      opacity: 0,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1, // Smooth scrubbing
        pin: true,
        pinSpacing: false // Allows the next section to scroll up *under/over* the hero
      }
    });
  }

  // --- 2. PROJECTS HORIZONTAL SCROLL ---
  const projectsGrid = document.querySelector('.projects-grid');
  const projectsWrapper = document.querySelector('.projects-wrapper');
  
  if (projectsGrid && projectsWrapper) {
    // Add class to change CSS to flex horizontal layout
    projectsGrid.classList.add('gsap-horizontal');

    // Remove old fade-up animations from cards to prevent conflict
    const cards = projectsGrid.querySelectorAll('.project-card');
    cards.forEach(card => card.removeAttribute('data-animate'));

    let getScrollAmount = () => {
      let gridWidth = projectsGrid.scrollWidth;
      return -(gridWidth - window.innerWidth + 100); // 100px padding margin
    };

    const tween = gsap.to(projectsGrid, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: projectsWrapper,
        start: "top 20%",
        end: () => `+=${getScrollAmount() * -1}`,
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    // Refresh ScrollTrigger when filter buttons are clicked
    const filterBtns = document.querySelectorAll('.projects-filter .tab-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 500); // Wait for CSS transition to finish hiding/showing cards
      });
    });
  }

  // --- 3. ABOUT IMAGE PARALLAX ---
  const aboutImage = document.querySelector('.about-image img');
  if (aboutImage) {
    // Make the image taller in CSS temporarily using GSAP for parallax
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

// Re-calculate on load just to be safe
window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
});
