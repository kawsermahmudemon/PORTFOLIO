/* ══════════════════════════════════════════
   CONSTELLATION PARTICLE SYSTEM v2
   Performance-optimized: cached theme, fewer DOM reads
   ══════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let raf;
  const mouse = { x: null, y: null, radius: 140 };

  // Performance detection
  const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;

  // Cache theme colors (update on theme change via MutationObserver)
  let isDark = document.documentElement.getAttribute("data-theme") === "dark";
  let fillColor = isDark ? "rgba(245,158,11,0.2)" : "rgba(217,119,6,0.12)";
  let strokeColor = isDark ? "rgba(245,158,11," : "rgba(217,119,6,";

  const themeObserver = new MutationObserver(() => {
    isDark = document.documentElement.getAttribute("data-theme") === "dark";
    fillColor = isDark ? "rgba(245,158,11,0.2)" : "rgba(217,119,6,0.12)";
    strokeColor = isDark ? "rgba(245,158,11," : "rgba(217,119,6,";
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r = Math.random() * 1.5 + 0.5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      if (mouse.x !== null) {
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        const radiusSq = mouse.radius * mouse.radius;
        if (distSq < radiusSq) {
          const dist = Math.sqrt(distSq);
          const f = (mouse.radius - dist) / mouse.radius;
          this.x += (dx / dist) * f * 0.8;
          this.y += (dy / dist) * f * 0.8;
        }
      }
    }
    draw() {
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    particles = [];
    let count;
    if (isLowEnd) count = window.innerWidth < 768 ? 12 : 25;
    else count = window.innerWidth < 768 ? 25 : 50;
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function connect() {
    const max = 120;
    const maxSq = max * max;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dSq = dx * dx + dy * dy;
        if (dSq < maxSq) {
          const d = Math.sqrt(dSq);
          const a = (1 - d / max) * 0.08;
          ctx.strokeStyle = `${strokeColor}${a})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  let isVisible = true;
  function loop() {
    if (!isVisible) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    raf = requestAnimationFrame(loop);
  }

  let resizeTimer;
  window.addEventListener("resize", () => { 
    clearTimeout(resizeTimer); 
    resizeTimer = setTimeout(() => { 
      cancelAnimationFrame(raf); 
      resize(); 
      if(isVisible) loop(); 
    }, 200); 
  });

  // RAF-throttled mouse tracking
  let mouseTicking = false;
  window.addEventListener("mousemove", e => {
    if (mouseTicking) return;
    mouseTicking = true;
    requestAnimationFrame(() => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouseTicking = false;
    });
  }, { passive: true });
  window.addEventListener("mouseleave", () => { mouse.x = null; mouse.y = null; });

  // Intersection Observer for performance — pause when hero not visible
  const heroEl = document.getElementById('hero');
  if (heroEl) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            loop();
          }
        } else {
          isVisible = false;
          cancelAnimationFrame(raf);
        }
      });
    }, { threshold: 0 });
    observer.observe(heroEl);
  }

  resize();
});
