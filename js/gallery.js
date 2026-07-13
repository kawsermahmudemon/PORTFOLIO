/* 
 * Public Gallery / Moments Logic
 * Fetches uploaded media from Firebase Firestore and displays in a Masonry Grid
 */

document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.getElementById('public-gallery-grid');
  
  if (!galleryGrid) return; // Only run if gallery section exists

  async function fetchGallery() {
    if (typeof firebase === 'undefined') {
      galleryGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 40px; border: 1px dashed var(--border); border-radius: var(--radius);">
          <p style="color: var(--text-secondary);">Waiting for Firebase Configuration to load moments.</p>
        </div>
      `;
      return;
    }

    try {
      const db = firebase.firestore();
      const snapshot = await db.collection('moments').orderBy('createdAt', 'desc').get();
      
      galleryGrid.innerHTML = '';
      
      if (snapshot.empty) {
        galleryGrid.innerHTML = `
          <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 40px; border: 1px dashed var(--border); border-radius: var(--radius);">
            <p style="color: var(--text-secondary);">No moments uploaded yet. Admin must upload via /admin.html</p>
          </div>
        `;
        return;
      }

      snapshot.forEach(doc => {
        const data = doc.data();
        
        const item = document.createElement('div');
        item.className = 'moment-item glass-card tilt-effect'; // Add existing tilt effect
        
        let mediaHtml = '';
        if (data.type === 'image') {
          mediaHtml = `<img src="${data.url}" alt="${data.caption || 'Gallery moment'}" class="moment-media" loading="lazy">`;
        } else {
          mediaHtml = `<video src="${data.url}" class="moment-media" autoplay muted loop playsinline></video>`;
        }
        
        item.innerHTML = `
          <div class="moment-media-wrapper">
            ${mediaHtml}
          </div>
          ${data.caption ? `<div class="moment-caption">${data.caption}</div>` : ''}
        `;
        
        galleryGrid.appendChild(item);
      });
      
      // Re-initialize tilt effect for new elements
      if (window.VanillaTilt) {
        window.VanillaTilt.init(document.querySelectorAll(".moment-item.tilt-effect"), {
          max: 10,
          speed: 400,
          glare: true,
          "max-glare": 0.2
        });
      }

    } catch (error) {
      console.error("Error fetching gallery:", error);
      galleryGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 40px; border: 1px solid #ef4444; border-radius: var(--radius); background: rgba(239, 68, 68, 0.1);">
          <p style="color: #ef4444;">Could not load moments. Database rules might be restricting access or API keys are missing.</p>
        </div>
      `;
    }
  }

  // Load gallery on page load
  fetchGallery();
});
