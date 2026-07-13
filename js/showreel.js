document.addEventListener('DOMContentLoaded', () => {
  const modalHtml = `
    <div id="showreel-modal">
      <div class="showreel-container">
        <button class="showreel-close" id="showreel-close">&times;</button>
        <video id="showreel-video" class="showreel-video" controls>
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
          Your browser does not support HTML video.
        </video>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const modal = document.getElementById('showreel-modal');
  const closeBtn = document.getElementById('showreel-close');
  const video = document.getElementById('showreel-video');

  // We will attach the event listener directly to document and use event delegation 
  // since the button might be added dynamically or we just want to ensure it works.
  document.addEventListener('click', (e) => {
    const watchBtn = e.target.closest('#btn-showreel');
    if (watchBtn) {
      e.preventDefault();
      modal.classList.add('active');
      video.play();
    }
  });

  function closeModal() {
    modal.classList.remove('active');
    video.pause();
    video.currentTime = 0;
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
});
