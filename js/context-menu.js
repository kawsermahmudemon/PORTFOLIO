document.addEventListener('DOMContentLoaded', () => {
  // Create Context Menu HTML
  const menuHtml = `
    <div id="custom-context-menu">
      <div class="context-menu-item" id="cm-resume">
        <i>📄</i> Download CV
      </div>
      <div class="context-menu-item" id="cm-contact">
        <i>✉️</i> Contact Me
      </div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item" id="cm-godmode">
        <i>🧊</i> Toggle God Mode
      </div>
      <div class="context-menu-item" id="cm-music">
        <i>🎧</i> Play/Pause Lofi
      </div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item" id="cm-terminal">
        <i>>_</i> Open Terminal
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', menuHtml);

  const menu = document.getElementById('custom-context-menu');

  // Prevent default right-click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const { clientX: mouseX, clientY: mouseY } = e;
    
    // Boundary checks
    const menuWidth = menu.offsetWidth || 250;
    const menuHeight = menu.offsetHeight || 250;
    
    let x = mouseX;
    let y = mouseY;
    
    if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth;
    if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight;
    
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
    alert('Resume download triggered!'); // Replace with actual link
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
    const terminal = document.getElementById('developer-terminal');
    if (terminal) terminal.classList.add('open');
  });
});
