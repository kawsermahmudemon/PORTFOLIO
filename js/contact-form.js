document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  
  if (form) {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      const btnText = btn.querySelector('.btn-text');
      const btnLoading = btn.querySelector('.btn-loading');
      const btnSuccess = btn.querySelector('.btn-success');
      
      form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload
        
        // Show loading state
        btn.style.pointerEvents = 'none';
        if (btnText) btnText.style.display = 'none';
        if (btnSuccess) btnSuccess.style.display = 'none';
        
        if (btnLoading) {
          btnLoading.style.display = 'inline-block';
        } else {
          btn.innerHTML = `<span style="display:inline-block; animation: spin 1s linear infinite;">⏳</span> Sending...`;
        }
        
        // Simulate network request
        setTimeout(() => {
          // Success State
          if (btnLoading) btnLoading.style.display = 'none';
          
          if (btnSuccess) {
            btnSuccess.style.display = 'inline-block';
          } else {
            btn.innerHTML = `✅ Message Sent!`;
          }
          
          btn.style.background = '#00ffcc';
          btn.style.color = '#000';
          form.reset();
          
          // Revert after 3 seconds
          setTimeout(() => {
            btn.style.pointerEvents = 'auto';
            btn.style.background = ''; // Revert to CSS default
            btn.style.color = '';
            
            if (btnSuccess) btnSuccess.style.display = 'none';
            if (btnText) btnText.style.display = 'inline-block';
            
          }, 3000);
        }, 1500);
      });
    }
  }
});
