/* ══════════════════════════════════════════
   APPLE-STYLE SCROLL (GSAP + ScrollTrigger)
   Optimized for Lenis integration
   ══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Only apply on desktop
  if (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // --- 1. HERO CINEMATIC ZOOM ---
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    gsap.to(heroContent, {
      scale: 3,
      opacity: 0,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
        pin: true,
        pinSpacing: false,
        anticipatePin: 1 // Prevents jank when pin starts
      }
    });
  }

  // --- 2. PROJECTS HORIZONTAL SCROLL ---
  const projectsGrid = document.querySelector('.projects-grid');
  const projectsWrapper = document.querySelector('.projects-wrapper');
  
  if (projectsGrid && projectsWrapper) {
    projectsGrid.classList.add('gsap-horizontal');

    const cards = projectsGrid.querySelectorAll('.project-card');
    cards.forEach(card => card.removeAttribute('data-animate'));

    let getScrollAmount = () => {
      let gridWidth = projectsGrid.scrollWidth;
      return -(gridWidth - window.innerWidth + 100);
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
        scrub: 1.5,
        invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });

    // Refresh ScrollTrigger when filter buttons are clicked
    const filterBtns = document.querySelectorAll('.projects-filter .tab-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 500);
      });
    });
  }

  // --- 3. ABOUT IMAGE PARALLAX ---
  const aboutImage = document.querySelector('.about-image img');
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
