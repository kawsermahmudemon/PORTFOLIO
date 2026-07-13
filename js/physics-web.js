/*
 * Physics-Based Knowledge Web (Canvas)
 * Interactive node graph for the Skills section
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('skills-canvas-container');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.width = container.offsetWidth;
  canvas.height = 400; // Fixed height for this section
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '0';
  canvas.style.borderRadius = 'var(--radius)';
  
  // Make the parent container relative and overflow hidden
  container.style.position = 'relative';
  container.style.overflow = 'hidden';
  container.style.minHeight = '400px';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  
  // Physics config
  const nodes = [];
  const numNodes = 25;
  const maxDistance = 150;
  
  // Mouse interaction
  let mouse = { x: -1000, y: -1000, radius: 100 };
  
  container.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  
  container.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Handle resize
  window.addEventListener('resize', () => {
    canvas.width = container.offsetWidth;
  });

  const techLabels = ["React", "Node", "Python", "IoT", "C", "Figma", "UI/UX", "Firebase", "SQL", "Arduino", "AI"];

  class Node {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.radius = Math.random() * 3 + 2;
      this.label = techLabels[Math.floor(Math.random() * techLabels.length)];
      this.hasLabel = Math.random() > 0.7; // Only some nodes get labels
    }

    update() {
      // Bounce off walls
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      this.x += this.vx;
      this.y += this.vy;

      // Mouse interaction (repel)
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (mouse.radius - distance) / mouse.radius;
        
        this.x -= forceDirectionX * force * 5;
        this.y -= forceDirectionY * force * 5;
      }
    }

    draw() {
      // Get theme colors from CSS variables
      const rootStyle = getComputedStyle(document.documentElement);
      const primaryColor = rootStyle.getPropertyValue('--primary').trim() || '#6366f1';
      
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

  // Initialize nodes
  for (let i = 0; i < numNodes; i++) {
    nodes.push(new Node());
  }

  let isVisible = true;
  let raf;

  function animate() {
    if (!isVisible) return;
    raf = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const rootStyle = getComputedStyle(document.documentElement);
    const secondaryColor = rootStyle.getPropertyValue('--secondary').trim() || '#818cf8';

    // Update and draw connections
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      nodes[i].draw();

      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          ctx.beginPath();
          // opacity based on distance
          const opacity = 1 - (dist / maxDistance);
          
          // Helper to convert hex to rgba
          let r = 99, g = 102, b = 241; // Fallback
          if (secondaryColor.startsWith('#')) {
            const hex = secondaryColor.replace('#','');
            if(hex.length === 6) {
              r = parseInt(hex.substring(0,2), 16);
              g = parseInt(hex.substring(2,4), 16);
              b = parseInt(hex.substring(4,6), 16);
            }
          }
          
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Intersection Observer for performance
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
