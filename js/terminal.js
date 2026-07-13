/*
 * Interactive Terminal Easter Egg
 */

document.addEventListener('DOMContentLoaded', () => {
  const terminalOverlay = document.getElementById('terminal-overlay');
  const terminalLauncher = document.getElementById('terminal-launcher');
  const terminalClose = document.getElementById('terminal-close');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');

  if (!terminalOverlay || !terminalLauncher || !terminalInput) return;

  // File system mock
  const fileSystem = {
    'resume.pdf': 'File size: 142KB',
    'secrets.txt': 'ACCESS DENIED.',
    'projects': 'Directory. Type "cd projects" to explore.',
  };

  // Commands
  const commands = {
    'help': `Available commands:
  <span class="term-color-accent">whoami</span>    - Display user info
  <span class="term-color-accent">skills</span>    - List core technologies
  <span class="term-color-accent">contact</span>   - Show contact information
  <span class="term-color-accent">projects</span>  - List major projects
  <span class="term-color-accent">ls</span>        - List directory contents
  <span class="term-color-accent">clear</span>     - Clear terminal output
  <span class="term-color-accent">date</span>      - Show current date/time
  <span class="term-color-accent">theme</span>     - Try 'theme matrix' or 'theme default'
  <span class="term-color-accent">godmode</span>   - Toggles isometric 3D DOM view
  <span class="term-color-accent">exit</span>      - Close terminal`,
    
    'whoami': `Md Emon Sarker
Role: Full Stack Developer & Creative Technologist
Location: Belkuchi, Sirajganj, Bangladesh
Status: Engineering low-cost solutions for climate resilience & rural health.`,
    
    'skills': `Core Stack:
- Frontend: HTML/CSS, React, Next.js, Tailwind
- Backend: Python, Java, Node.js, C
- Hardware: Arduino, Raspberry Pi, IoT Circuit Design
- Databases: PostgreSQL, MongoDB, Firebase`,

    'contact': `Email: mdemonsarker.personal@gmail.com
Phone: +880 1575730125
LinkedIn: linkedin.com/in/kawsermahmudemon`,

    'projects': `1. Shohagpur Blood Donation Club (App & Web)
2. Smart Agriculture IoT Project
3. Autonomous Service Robot
4. Belkuchi Digital Market Project`,

    'ls': `resume.pdf    secrets.txt    projects/`,
    
    'date': new Date().toString(),
    
    'sudo': `<span class="term-color-error">Nice try. This incident will be reported.</span>`,
  };

  // Toggle terminal
  const toggleTerminal = () => {
    const isActive = terminalOverlay.classList.contains('active');
    if (isActive) {
      terminalOverlay.classList.remove('active');
      terminalInput.blur();
    } else {
      terminalOverlay.classList.add('active');
      setTimeout(() => terminalInput.focus(), 100);
      
      // Play pop sound if available
      if (window.uiSounds && window.uiSounds.playPop) window.uiSounds.playPop();
    }
  };

  terminalLauncher.addEventListener('click', toggleTerminal);
  terminalClose.addEventListener('click', toggleTerminal);
  
  // Close on outside click
  terminalOverlay.addEventListener('click', (e) => {
    if (e.target === terminalOverlay) toggleTerminal();
  });

  // Keyboard shortcut (Ctrl + ~)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === '`') {
      e.preventDefault();
      toggleTerminal();
    }
  });

  // Keep focus on input when clicking inside terminal
  document.querySelector('.terminal-body').addEventListener('click', () => {
    terminalInput.focus();
  });

  // Process commands
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const input = terminalInput.value.trim();
      const lowerInput = input.toLowerCase();
      terminalInput.value = '';

      if (!input) return;

      // Play tick sound
      if (window.uiSounds && window.uiSounds.playTick) window.uiSounds.playTick();

      // Echo input
      printOutput(`visitor@emon.dev:~$ ${input}`, 'term-color-system');

      // Handle specific complex commands
      if (lowerInput === 'clear') {
        terminalOutput.innerHTML = '';
        return;
      }
      
      if (lowerInput === 'exit') {
        toggleTerminal();
        return;
      }
      
      if (lowerInput.startsWith('echo ')) {
        printOutput(input.substring(5));
        return;
      }

      if (lowerInput.startsWith('theme ')) {
        const theme = lowerInput.split(' ')[1];
        if (theme === 'matrix') {
          document.documentElement.setAttribute('data-theme', 'matrix');
          document.documentElement.style.setProperty('--primary', '#0f0');
          document.documentElement.style.setProperty('--secondary', '#003300');
          printOutput('Wake up, Neo...', 'term-color-success');
        } else if (theme === '1998') {
          document.documentElement.setAttribute('data-theme', '1998');
          printOutput('INITIALIZING WINDOWS 95 SUBSYSTEM...', 'term-color-success');
          setTimeout(() => printOutput('WELCOME TO THE 90s.', 'term-color-success'), 1000);
        } else if (theme === 'default') {
          document.documentElement.setAttribute('data-theme', 'dark');
          document.documentElement.style.setProperty('--primary', '#6b21a8');
          document.documentElement.style.setProperty('--secondary', '#db2777');
          printOutput('Restored default theme.');
        } else {
          printOutput(`Unknown theme: ${theme}. Try 'matrix', '1998', or 'default'.`, 'term-color-error');
        }
        return;
      }
      
      if (lowerInput === 'godmode') {
        const isGodMode = document.body.classList.toggle('god-mode');
        if (isGodMode) {
          printOutput('GOD MODE ACTIVATED. DOM ISOMETRIC VIEW ENABLED.', 'term-color-success');
        } else {
          printOutput('God mode deactivated. Restoring flat DOM.');
        }
        return;
      }

      // Handle basic commands
      if (commands[lowerInput]) {
        printOutput(commands[lowerInput]);
      } else {
        printOutput(`Command not found: ${input}. Type 'help' for available commands.`, 'term-color-error');
      }
    }
  });

  function printOutput(text, className = '') {
    const div = document.createElement('div');
    div.className = `term-line ${className}`;
    div.innerHTML = text; // Using innerHTML to allow basic formatting
    terminalOutput.appendChild(div);
    
    // Auto scroll to bottom
    const body = document.querySelector('.terminal-body');
    body.scrollTop = body.scrollHeight;
  }

  // Initial boot sequence
  setTimeout(() => {
    printOutput('Emon.OS v1.0.0 loaded.', 'term-color-system');
    printOutput('Type "help" to see available commands.', 'term-color-system');
  }, 500);
});
