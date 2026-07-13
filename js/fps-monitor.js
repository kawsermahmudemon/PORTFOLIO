document.addEventListener('DOMContentLoaded', () => {
  const fpsHtml = `
    <div id="fps-monitor" style="position:fixed; bottom: 10px; right: 10px; z-index: 10000; background: rgba(0,0,0,0.8); color: #00ffcc; font-family: monospace; font-size: 10px; padding: 4px 8px; border-radius: 4px; pointer-events: none; border: 1px solid rgba(0, 255, 204, 0.3); backdrop-filter: blur(5px);">
      <span id="fps-val">60</span> FPS
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', fpsHtml);

  const fpsEl = document.getElementById('fps-val');
  let lastTime = performance.now();
  let frames = 0;

  function updateFPS() {
    const now = performance.now();
    frames++;
    if (now >= lastTime + 1000) {
      fpsEl.textContent = Math.round((frames * 1000) / (now - lastTime));
      frames = 0;
      lastTime = now;
    }
    requestAnimationFrame(updateFPS);
  }
  
  updateFPS();
});
