/*
 * 3D Rotating ASCII Globe
 * Renders a spinning mathematical globe using text characters on a Canvas
 */

document.addEventListener('DOMContentLoaded', () => {
  // We'll inject a canvas into the footer
  const footerInner = document.querySelector('.footer-inner');
  if (!footerInner) return;

  const container = document.createElement('div');
  container.className = 'ascii-globe-container';
  container.style.position = 'absolute';
  container.style.right = '10%';
  container.style.bottom = '10px';
  container.style.width = '200px';
  container.style.height = '200px';
  container.style.opacity = '0.4';
  container.style.pointerEvents = 'none';
  
  // Make footer position relative to hold the absolute globe
  const footer = document.querySelector('.footer');
  footer.style.position = 'relative';
  footer.style.overflow = 'hidden';
  
  footer.appendChild(container);

  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  
  // Mathematical rendering of a 3D sphere mapped to ASCII
  let A = 0; // Rotation X
  let B = 0; // Rotation Y
  
  const chars = ".,-~:;=!*#$@";
  
  let isVisible = true;
  let raf;
  
  function renderGlobe() {
    if (!isVisible) return;
    raf = requestAnimationFrame(renderGlobe);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Get theme color
    const rootStyle = getComputedStyle(document.documentElement);
    const primaryColor = rootStyle.getPropertyValue('--primary').trim() || '#6b21a8';
    
    ctx.fillStyle = primaryColor;
    ctx.font = '10px monospace';
    
    const b = [];
    const z = [];
    
    // Grid size for the ASCII sphere
    const width = 40;
    const height = 40;
    const R1 = 1; // Radius
    const K2 = 5; // Distance from viewer
    const K1 = width * K2 * 3 / (8 * (R1 + 2)); 
    
    for (let k = 0; k < width * height; k++) {
      b[k] = ' ';
      z[k] = 0;
    }
    
    for (let j = 0; j < 6.28; j += 0.07) {
      for (let i = 0; i < 6.28; i += 0.02) {
        const c = Math.sin(i);
        const d = Math.cos(j);
        const e = Math.sin(A);
        const f = Math.sin(j);
        const g = Math.cos(A);
        const h = d + 2;
        const D = 1 / (c * h * e + f * g + 5);
        const l = Math.cos(i);
        const m = Math.cos(B);
        const n = Math.sin(B);
        const t = c * h * g - f * e;
        
        // 2D projection
        const x = 0 | (width / 2 + 15 * D * (l * h * m - t * n));
        const y = 0 | (height / 2 + 10 * D * (l * h * n + t * m));
        
        const o = x + width * y;
        
        // Luminance calculation for ASCII shading
        const N = 0 | (8 * ((f * e - c * d * g) * m - c * d * e - f * g - l * d * n));
        
        if (y < height && y >= 0 && x >= 0 && x < width && D > z[o]) {
          z[o] = D;
          b[o] = chars[N > 0 ? N : 0];
        }
      }
    }
    
    // Draw the array to canvas
    for (let k = 0; k < width * height; k++) {
      if (b[k] !== ' ') {
        const x = (k % width) * 5;
        const y = Math.floor(k / width) * 10;
        ctx.fillText(b[k], x, y);
      }
    }
    
    A += 0.04;
    B += 0.02;
  }
  
  // Hide on mobile as it might crowd the footer
  if (window.innerWidth > 768) {
    // Intersection Observer for performance
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            renderGlobe();
          }
        } else {
          isVisible = false;
          if (raf) cancelAnimationFrame(raf);
        }
      });
    }, { threshold: 0 });
    
    observer.observe(footer);
    renderGlobe();
  }
});
