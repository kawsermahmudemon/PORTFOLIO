document.addEventListener('DOMContentLoaded', () => {
  // Create Context Menu HTML matching new design system
  const menuHtml = `
    <div id="custom-context-menu" class="custom-context-menu">
      <button class="context-item" id="cm-resume">
        <span>📄</span> Download CV
      </button>
      <button class="context-item" id="cm-contact">
        <span>✉️</span> Contact Me
      </button>
      <div class="context-divider"></div>
      <button class="context-item" id="cm-godmode">
        <span>🧊</span> Toggle God Mode
      </button>
      <button class="context-item" id="cm-music">
        <span>🎧</span> Play/Pause Lofi
      </button>
      <div class="context-divider"></div>
      <button class="context-item" id="cm-terminal">
        <span>>_</span> Open Terminal
      </button>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', menuHtml);

  const menu = document.getElementById('custom-context-menu');

  // Prevent default right-click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const { clientX: mouseX, clientY: mouseY } = e;
    
    // Boundary checks
    const menuWidth = 180; // approximate width
    const menuHeight = 220; // approximate height
    
    let x = mouseX;
    let y = mouseY;
    
    if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 10;
    if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 10;
    
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.classList.add('active');
  });

  // Hide on click anywhere else
  document.addEventListener('click', (e) => {
    if (e.button !== 2) {
      menu.classList.remove('active');
    }
  });
  
  // Hide on scroll
  window.addEventListener('scroll', () => {
    menu.classList.remove('active');
  });

  // Add click actions
  document.getElementById('cm-resume').addEventListener('click', () => {
    alert('Resume download triggered!'); 
  });
  
  document.getElementById('cm-contact').addEventListener('click', () => {
    window.location.hash = '#contact';
  });
  
  document.getElementById('cm-godmode').addEventListener('click', () => {
    document.body.classList.toggle('god-mode-active');
  });
  
  document.getElementById('cm-music').addEventListener('click', () => {
    const audio = document.getElementById('lofi-audio');
    if (audio) {
      if (audio.paused) audio.play();
      else audio.pause();
    }
  });

  document.getElementById('cm-terminal').addEventListener('click', () => {
    const terminal = document.getElementById('terminal-overlay');
    if (terminal) terminal.classList.add('active');
  });
});
