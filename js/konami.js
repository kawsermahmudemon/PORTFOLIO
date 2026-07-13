/*
 * Konami Code Easter Egg (Snake Game)
 */

document.addEventListener('DOMContentLoaded', () => {
  // ArrowUp, ArrowUp, ArrowDown, ArrowDown, ArrowLeft, ArrowRight, ArrowLeft, ArrowRight, b, a
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
    'b', 'a'
  ];
  let konamiIndex = 0;
  
  // Game state
  let isGameActive = false;

  // Create game overlay
  const overlay = document.createElement('div');
  overlay.className = 'konami-overlay';
  overlay.innerHTML = `
    <div class="konami-game-container">
      <h2>SNAKE IN THE TERMINAL</h2>
      <p class="konami-score">Score: <span id="konami-score-val">0</span></p>
      <canvas id="konami-canvas" width="400" height="400"></canvas>
      <p style="margin-top: 10px; color: var(--text-secondary);">Use Arrow Keys. Press ESC to exit.</p>
    </div>
    <style>
      .konami-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.85);
        backdrop-filter: blur(10px);
        z-index: 100000;
        display: none;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        opacity: 0;
        transition: opacity 0.5s ease;
      }
      .konami-game-container {
        background: var(--surface);
        padding: 30px;
        border-radius: var(--radius);
        border: 2px solid var(--primary);
        box-shadow: 0 0 40px rgba(99, 102, 241, 0.4);
        text-align: center;
      }
      .konami-game-container h2 {
        color: var(--primary);
        font-family: var(--font-heading);
        margin-bottom: 10px;
      }
      #konami-canvas {
        background: #000;
        border: 1px solid var(--border);
        image-rendering: pixelated;
      }
    </style>
  `;
  document.body.appendChild(overlay);

  document.addEventListener('keydown', (e) => {
    if (isGameActive) {
      // Prevent default scrolling for arrow keys during game
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'Escape') {
        endGame();
      }
      return;
    }

    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        startGame();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0; // Reset
    }
  });

  // Simple Snake Game Logic
  let canvas, ctx;
  let grid = 20;
  let count = 0;
  let score = 0;
  let snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [], maxCells: 4 };
  let apple = { x: 320, y: 320 };
  let reqId;

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function loop() {
    reqId = requestAnimationFrame(loop);
    
    if (++count < 6) return; // control speed
    count = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    // wrap wrap
    if (snake.x < 0) snake.x = canvas.width - grid;
    else if (snake.x >= canvas.width) snake.x = 0;
    
    if (snake.y < 0) snake.y = canvas.height - grid;
    else if (snake.y >= canvas.height) snake.y = 0;

    snake.cells.unshift({ x: snake.x, y: snake.y });
    if (snake.cells.length > snake.maxCells) {
      snake.cells.pop();
    }

    // draw apple
    ctx.fillStyle = '#db2777';
    ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // draw snake
    ctx.fillStyle = '#0f0'; // classic green
    snake.cells.forEach((cell, index) => {
      ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);
      
      // eat apple
      if (cell.x === apple.x && cell.y === apple.y) {
        snake.maxCells++;
        score += 10;
        document.getElementById('konami-score-val').innerText = score;
        if(window.uiSounds) window.uiSounds.playTick(); // sound effect
        apple.x = getRandomInt(0, 20) * grid;
        apple.y = getRandomInt(0, 20) * grid;
      }

      // check collision
      for (let i = index + 1; i < snake.cells.length; i++) {
        if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
          // reset game
          snake.x = 160; snake.y = 160;
          snake.cells = [];
          snake.maxCells = 4;
          snake.dx = grid;
          snake.dy = 0;
          score = 0;
          document.getElementById('konami-score-val').innerText = score;
          apple.x = getRandomInt(0, 20) * grid;
          apple.y = getRandomInt(0, 20) * grid;
          if(window.uiSounds) window.uiSounds.playPop(); // failure sound
        }
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!isGameActive) return;
    
    if (e.key === 'ArrowLeft' && snake.dx === 0) {
      snake.dx = -grid; snake.dy = 0;
    } else if (e.key === 'ArrowUp' && snake.dy === 0) {
      snake.dy = -grid; snake.dx = 0;
    } else if (e.key === 'ArrowRight' && snake.dx === 0) {
      snake.dx = grid; snake.dy = 0;
    } else if (e.key === 'ArrowDown' && snake.dy === 0) {
      snake.dy = grid; snake.dx = 0;
    }
  });

  function startGame() {
    isGameActive = true;
    overlay.style.display = 'flex';
    // Trigger reflow
    void overlay.offsetWidth;
    overlay.style.opacity = '1';
    
    canvas = document.getElementById('konami-canvas');
    ctx = canvas.getContext('2d');
    
    // Play sound if available
    if(window.uiSounds) window.uiSounds.playPop();
    
    reqId = requestAnimationFrame(loop);
  }

  function endGame() {
    isGameActive = false;
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.display = 'none';
      cancelAnimationFrame(reqId);
    }, 500);
  }
});
