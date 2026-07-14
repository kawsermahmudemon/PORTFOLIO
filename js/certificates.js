document.addEventListener('DOMContentLoaded', () => {
  const certCards = document.querySelectorAll('.cert-card');
  
  if (certCards.length === 0) return;

  // Create Modal HTML
  const modalHTML = `
    <div class="cert-modal-overlay" id="cert-modal">
      <div class="cert-modal-container">
        <!-- Left: Preview -->
        <div class="cert-modal-preview">
          <div class="cert-modal-header-bar">
            <div class="cert-viewer-status">REC</div>
            <div class="cert-viewer-timecode" id="cert-timecode">00:00:00:00</div>
          </div>
          <div class="cert-preview-content" id="cert-preview-content">
            <!-- Image or PDF placeholder will be injected here -->
          </div>
        </div>
        
        <!-- Right: Inspector Details -->
        <div class="cert-modal-details">
          <button class="cert-modal-close" id="cert-modal-close" aria-label="Close Modal">&times;</button>
          
          <div class="cert-details-inner">
            <h3 class="cert-detail-title" id="cert-modal-title">Title</h3>
            
            <div class="cert-meta-section">
              <span class="cert-meta-label">CONTEXT / OBTAINED</span>
              <div class="cert-meta-value" id="cert-modal-context">Context goes here</div>
            </div>
            
            <div class="cert-meta-section">
              <span class="cert-meta-label">PURPOSE / LEARNINGS</span>
              <div class="cert-meta-value" id="cert-modal-purpose">Purpose goes here</div>
            </div>
            
            <div class="cert-meta-section" style="border-bottom: none; padding-bottom: 0;">
              <span class="cert-meta-label">VALUE & IMPACT</span>
              <div class="cert-meta-value" id="cert-modal-impact">Impact goes here</div>
            </div>
          </div>
          
          <div class="cert-actions">
            <a href="#" id="cert-modal-link" target="_blank" rel="noopener noreferrer">
              VIEW FULL FILE
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Inject modal into body
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById('cert-modal');
  const closeBtn = document.getElementById('cert-modal-close');
  const previewContent = document.getElementById('cert-preview-content');
  const mTitle = document.getElementById('cert-modal-title');
  const mContext = document.getElementById('cert-modal-context');
  const mPurpose = document.getElementById('cert-modal-purpose');
  const mImpact = document.getElementById('cert-modal-impact');
  const mLink = document.getElementById('cert-modal-link');
  const mTimecode = document.getElementById('cert-timecode');

  // Timecode generator
  let timecodeInterval;
  const startTimecode = () => {
    let f = 0, s = 0, m = 0, h = 0;
    clearInterval(timecodeInterval);
    timecodeInterval = setInterval(() => {
      f++;
      if(f >= 24) { f = 0; s++; }
      if(s >= 60) { s = 0; m++; }
      if(m >= 60) { m = 0; h++; }
      mTimecode.innerText = 
        String(h).padStart(2, '0') + ':' + 
        String(m).padStart(2, '0') + ':' + 
        String(s).padStart(2, '0') + ':' + 
        String(f).padStart(2, '0');
    }, 41); // ~24fps
  };

  const openModal = (card) => {
    const title = card.getAttribute('data-title') || 'Certificate';
    const context = card.getAttribute('data-context') || 'Information not available.';
    const purpose = card.getAttribute('data-purpose') || 'Information not available.';
    const impact = card.getAttribute('data-impact') || 'Information not available.';
    const link = card.getAttribute('href');
    const isImage = link.match(/\.(jpeg|jpg|gif|png)$/i) != null;

    // Populate data
    mTitle.innerText = title;
    mContext.innerText = context;
    mPurpose.innerText = purpose;
    mImpact.innerText = impact;
    mLink.href = link;

    // Build Preview
    if (isImage) {
      previewContent.innerHTML = `<img src="${link}" alt="${title}">`;
    } else {
      previewContent.innerHTML = `
        <div class="pdf-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>PDF Document</span>
        </div>
      `;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    startTimecode();
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    clearInterval(timecodeInterval);
    setTimeout(() => {
      previewContent.innerHTML = '';
    }, 400); // wait for transition
  };

  certCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(card);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
});
