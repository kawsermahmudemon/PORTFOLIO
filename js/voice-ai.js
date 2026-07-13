/* ══════════════════════════════════════════
   VOICE COMMAND AI (Web Speech API)
   ══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('voice-ai-toggle');
  if (!toggleBtn) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    toggleBtn.style.display = 'none'; // Hide if not supported
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let isListening = false;

  toggleBtn.addEventListener('click', () => {
    if (isListening) {
      recognition.stop();
      isListening = false;
      toggleBtn.classList.remove('listening');
      playTone('off');
    } else {
      try {
        recognition.start();
        isListening = true;
        toggleBtn.classList.add('listening');
        playTone('on');
      } catch (e) {
        console.error("Speech recognition error", e);
      }
    }
  });

  recognition.onresult = (event) => {
    const lastResultIndex = event.results.length - 1;
    const command = event.results[lastResultIndex][0].transcript.toLowerCase().trim();
    console.log("Voice Command Recognized:", command);
    executeCommand(command);
  };

  recognition.onend = () => {
    // If it stops automatically but we want it continuous, we could restart it here.
    // For now, let the user toggle it.
    isListening = false;
    toggleBtn.classList.remove('listening');
  };

  recognition.onerror = (event) => {
    console.error("Voice AI Error:", event.error);
    isListening = false;
    toggleBtn.classList.remove('listening');
  };

  function executeCommand(cmd) {
    if (cmd.includes('home') || cmd.includes('top')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    else if (cmd.includes('about')) {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    }
    else if (cmd.includes('project') || cmd.includes('work')) {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    }
    else if (cmd.includes('contact')) {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
    else if (cmd.includes('terminal')) {
      const termBtn = document.querySelector('.terminal-toggle');
      if (termBtn) termBtn.click();
    }
    else if (cmd.includes('play music') || cmd.includes('lofi') || cmd.includes('play audio')) {
      const lofiBtn = document.getElementById('lofi-toggle-btn');
      if (lofiBtn && document.getElementById('lofi-audio').paused) {
        lofiBtn.click();
      }
    }
    else if (cmd.includes('stop music') || cmd.includes('pause music')) {
      const lofiBtn = document.getElementById('lofi-toggle-btn');
      if (lofiBtn && !document.getElementById('lofi-audio').paused) {
        lofiBtn.click();
      }
    }
    else if (cmd.includes('god mode') || cmd.includes('3d mode')) {
      document.body.classList.toggle('god-mode');
    }
    else if (cmd.includes('dark mode')) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    else if (cmd.includes('light mode')) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    // Give auditory feedback
    playTone('success');
  }

  function playTone(type) {
    // Only play if sound is enabled globally (assumes window.soundEnabled exists from app.js)
    if (window.soundEnabled === false) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'on') {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'off') {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'success') {
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.setValueAtTime(800, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(); osc.stop(ctx.currentTime + 0.2);
    }
  }
});
