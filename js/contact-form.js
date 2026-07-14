document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  
  if (form) {
    // Standard HTML form submission is used now via Web3Forms POST action
  }

  // Copy Email Logic
  const copyBtns = document.querySelectorAll('.copy-email');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'mdemonsarker.personal@gmail.com';
      
      navigator.clipboard.writeText(email).then(() => {
        // Find text spans if it's the hero button
        const copyText = btn.querySelector('.copy-text');
        const copySuccess = btn.querySelector('.copy-success');
        
        if (copyText && copySuccess) {
          copyText.style.display = 'none';
          copySuccess.style.display = 'inline-block';
          setTimeout(() => {
            copyText.style.display = 'inline-block';
            copySuccess.style.display = 'none';
          }, 2000);
        } else {
          // If it's the icon button, change icon temporarily
          const originalHTML = btn.innerHTML;
          btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
          setTimeout(() => {
            btn.innerHTML = originalHTML;
          }, 2000);
        }
        
        // Play sound if available
        if (window.uiSounds && window.uiSounds.playTick) {
          window.uiSounds.playTick();
        }
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    });
  });
});
