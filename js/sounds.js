/*
 * UI Micro-Sounds (Web Audio API)
 * Synthesizes subtle clicks and pops for interactive elements
 */

document.addEventListener('DOMContentLoaded', () => {
  // Audio Context
  let audioCtx = null;
  let isMuted = true; // Default to muted per browser policies
  
  const soundToggleBtn = document.getElementById('sound-toggle');
  
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      isMuted = !isMuted;
      
      // Update UI
      if (isMuted) {
        soundToggleBtn.innerHTML = '🔇';
        soundToggleBtn.setAttribute('aria-label', 'Enable Sounds');
      } else {
        soundToggleBtn.innerHTML = '🔊';
        soundToggleBtn.setAttribute('aria-label', 'Disable Sounds');
        playTick(); // Give immediate feedback
      }
    });
  }

  // Synthesize a very short, subtle "tick" sound (e.g. for hover)
  function playTick() {
    if (isMuted || !audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // Very quiet
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  }

  // Synthesize a "pop" sound (e.g. for clicks)
  function playPop() {
    if (isMuted || !audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  }

  // Bind to interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .glass-card, .tab-btn');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      // Don't play tick on body/container hovers, only specific elements
      if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.classList.contains('tab-btn') || el.classList.contains('glass-card')) {
        playTick();
      }
    });
    
    el.addEventListener('click', () => {
      playPop();
    });
  });
  
  // Expose for external calls (like terminal typing)
  window.uiSounds = {
    playTick,
    playPop
  };
});
