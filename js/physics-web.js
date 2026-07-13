/*
 * Physics-Based Knowledge Web (Canvas) v2
 * Performance-optimized: cached styles, visibility observer
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('skills-canvas-container');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.width = container.offsetWidth;
  canvas.height = 400;
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '0';
  canvas.style.borderRadius = 'var(--radius)';
  
  container.style.position = 'relative';
  container.style.overflow = 'hidden';
  container.style.minHeight = '400px';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  
  const nodes = [];
  const numNodes = 25;
  const maxDistance = 150;
  const maxDistSq = maxDistance * maxDistance;
  
  let mouse = { x: -1000, y: -1000, radius: 100 };
  
  // RAF-throttled mouse tracking
  let mouseTicking = false;
  container.addEventListener('mousemove', (e) => {
    if (mouseTicking) return;
    mouseTicking = true;
    requestAnimationFrame(() => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouseTicking = false;
    });
  }, { passive: true });
  
  container.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Debounced resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      canvas.width = container.offsetWidth;
    }, 200);
  });

  const techLabels = ["React", "Node", "Python", "IoT", "C", "Figma", "UI/UX", "Firebase", "SQL", "Arduino", "AI"];

  // Cache computed styles (update on theme change)
  let primaryColor = '#6366f1';
  let secondaryR = 99, secondaryG = 102, secondaryB = 241;

  function cacheColors() {
    const rootStyle = getComputedStyle(document.documentElement);
    primaryColor = rootStyle.getPropertyValue('--primary').trim() || '#6366f1';
    const sc = rootStyle.getPropertyValue('--secondary').trim() || '#818cf8';
    if (sc.startsWith('#') && sc.length === 7) {
      secondaryR = parseInt(sc.substring(1, 3), 16);
      secondaryG = parseInt(sc.substring(3, 5), 16);
      secondaryB = parseInt(sc.substring(5, 7), 16);
    }
  }
  cacheColors();

  // Re-cache on theme change
  const themeObserver = new MutationObserver(cacheColors);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  class Node {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.radius = Math.random() * 3 + 2;
      this.label = techLabels[Math.floor(Math.random() * techLabels.length)];
      this.hasLabel = Math.random() > 0.7;
    }

    update() {
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      this.x += this.vx;
      this.y += this.vy;

      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distSq = dx * dx + dy * dy;
      const radiusSq = mouse.radius * mouse.radius;

      if (distSq < radiusSq) {
        const distance = Math.sqrt(distSq);
        const force = (mouse.radius - distance) / mouse.radius;
        this.x -= (dx / distance) * force * 5;
        this.y -= (dy / distance) * force * 5;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = primaryColor;
      ctx.fill();

      if (this.hasLabel) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '10px Space Grotesk';
        ctx.fillText(this.label, this.x + 8, this.y + 4);
      }
    }
  }

  for (let i = 0; i < numNodes; i++) {
    nodes.push(new Node());
  }

  let isVisible = true;
  let raf;

  function animate() {
    if (!isVisible) return;
    raf = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      nodes[i].draw();

      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dSq = dx * dx + dy * dy;

        if (dSq < maxDistSq) {
          const dist = Math.sqrt(dSq);
          const opacity = 1 - (dist / maxDistance);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${secondaryR}, ${secondaryG}, ${secondaryB}, ${opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Pause when not visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!isVisible) {
          isVisible = true;
          animate();
        }
      } else {
        isVisible = false;
        if (raf) cancelAnimationFrame(raf);
      }
    });
  }, { threshold: 0 });
  
  if (container) observer.observe(container);

  animate();
});
