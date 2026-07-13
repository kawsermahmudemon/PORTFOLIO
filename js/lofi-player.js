/* ══════════════════════════════════════════
   LOFI PLAYER (Focus Mode)
   ══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('lofi-audio');
  const btn = document.getElementById('lofi-toggle-btn');
  const player = document.getElementById('lofi-player');
  const statusTxt = document.querySelector('.lofi-status');

  if (!audio || !btn || !player) return;

  // Set stream source (Lofi Girl / Chillhop stream or generic non-copyright beat URL)
  // We'll use a royalty free lofi beat URL as a placeholder
  const LOFI_STREAM_URL = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3';
  
  let isLoaded = false;

  btn.addEventListener('click', () => {
    if (audio.paused) {
      if (!isLoaded) {
        audio.src = LOFI_STREAM_URL;
        audio.volume = 0.4; // Soft background volume
        isLoaded = true;
      }
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          player.classList.add('playing');
          btn.innerHTML = '⏸';
          statusTxt.innerText = 'Playing';
        }).catch(error => {
          console.error("Audio playback failed", error);
        });
      }
    } else {
      audio.pause();
      player.classList.remove('playing');
      btn.innerHTML = '▶';
      statusTxt.innerText = 'Paused';
    }
  });
});
