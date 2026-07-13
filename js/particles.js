/* ══════════════════════════════════════════
   CONSTELLATION PARTICLE SYSTEM + GRADIENT ORBS
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
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const f = (mouse.radius - dist) / mouse.radius;
          this.x += (dx / dist) * f * 0.8;
          this.y += (dy / dist) * f * 0.8;
        }
      }
    }
    draw() {
      const dark = document.documentElement.getAttribute("data-theme") === "dark";
      ctx.fillStyle = dark ? "rgba(99,102,241,0.25)" : "rgba(79,70,229,0.15)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    particles = [];
    let count;
    if (isLowEnd) count = window.innerWidth < 768 ? 15 : 30;
    else count = window.innerWidth < 768 ? 30 : 60;
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function connect() {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    const max = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < max) {
          const a = (1 - d / max) * 0.08;
          ctx.strokeStyle = dark ? `rgba(99,102,241,${a})` : `rgba(79,70,229,${a})`;
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
  window.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener("mouseleave", () => { mouse.x = null; mouse.y = null; });

  // Intersection Observer for performance
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
  observer.observe(document.getElementById('hero'));

  resize();
});
