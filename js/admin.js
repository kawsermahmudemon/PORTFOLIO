/* Admin Dashboard Logic (Firebase Storage & Firestore) */

document.addEventListener('DOMContentLoaded', () => {
  // Simple passcode auth for frontend only (Not highly secure, but works for static portfolio)
  const ADMIN_PASS = 'emon2026';
  
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const passInput = document.getElementById('admin-pass');
  const btnLogin = document.getElementById('btn-login');
  const loginError = document.getElementById('login-error');
  
  const checkAuth = () => {
    if (localStorage.getItem('emon_admin_auth') === 'true') {
      loginView.classList.remove('active');
      dashboardView.classList.add('active');
      loadGallery();
    }
  };
  
  btnLogin.addEventListener('click', () => {
    if (passInput.value === ADMIN_PASS) {
      localStorage.setItem('emon_admin_auth', 'true');
      loginError.style.display = 'none';
      checkAuth();
    } else {
      loginError.style.display = 'block';
    }
  });

  passInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btnLogin.click();
  });
  
  checkAuth();

  // ----------------------------------------------------
  // FIREBASE UPLOAD LOGIC
  // ----------------------------------------------------
  
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const uploadPreview = document.getElementById('upload-preview');
  const btnUpload = document.getElementById('btn-upload');
  const mediaCaption = document.getElementById('media-caption');
  
  const progressDiv = document.getElementById('upload-progress');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  
  let selectedFile = null;

  // Drag and drop events
  dropZone.addEventListener('click', () => fileInput.click());
  
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });
  
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  });
  
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
      handleFile(fileInput.files[0]);
    }
  });

  function handleFile(file) {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Only images and videos are supported.');
      return;
    }
    
    selectedFile = file;
    btnUpload.disabled = false;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadPreview.innerHTML = '';
      const div = document.createElement('div');
      div.className = 'preview-item';
      
      let media;
      if (file.type.startsWith('image/')) {
        media = document.createElement('img');
      } else {
        media = document.createElement('video');
        media.muted = true;
        media.play();
      }
      
      media.src = e.target.result;
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-preview';
      removeBtn.innerHTML = '✕';
      removeBtn.onclick = () => {
        selectedFile = null;
        uploadPreview.innerHTML = '';
        btnUpload.disabled = true;
      };
      
      div.appendChild(media);
      div.appendChild(removeBtn);
      uploadPreview.appendChild(div);
    };
    reader.readAsDataURL(file);
  }

  // Upload to Firebase
  btnUpload.addEventListener('click', async () => {
    if (!selectedFile) return;
    
    if (typeof firebase === 'undefined') {
      alert('Firebase is not initialized. Please configure js/firebase-config.js');
      return;
    }

    try {
      const storage = firebase.storage();
      const db = firebase.firestore();
      
      btnUpload.disabled = true;
      progressDiv.style.display = 'block';
      
      // Create unique filename
      const timestamp = new Date().getTime();
      const ext = selectedFile.name.split('.').pop();
      const fileName = `moments/${timestamp}_${Math.random().toString(36).substring(7)}.${ext}`;
      
      const storageRef = storage.ref(fileName);
      const uploadTask = storageRef.put(selectedFile);
      
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressFill.style.width = progress + '%';
          progressText.innerText = `Uploading: ${Math.round(progress)}%`;
        }, 
        (error) => {
          console.error('Upload failed:', error);
          alert('Upload failed. See console.');
          resetUpload();
        }, 
        async () => {
          // Success
          const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
          
          // Save metadata to Firestore
          await db.collection('moments').add({
            url: downloadURL,
            type: selectedFile.type.startsWith('image/') ? 'image' : 'video',
            caption: mediaCaption.value || '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
          
          progressText.innerText = 'Upload Complete! 🎉';
          setTimeout(() => {
            resetUpload();
            loadGallery();
          }, 1500);
        }
      );
    } catch (error) {
      console.error(error);
      alert('Error connecting to Firebase. Check config.');
      resetUpload();
    }
  });

  function resetUpload() {
    selectedFile = null;
    fileInput.value = '';
    uploadPreview.innerHTML = '';
    mediaCaption.value = '';
    btnUpload.disabled = true;
    progressDiv.style.display = 'none';
    progressFill.style.width = '0%';
  }

  // ----------------------------------------------------
  // GALLERY MANAGEMENT
  // ----------------------------------------------------
  
  const galleryGrid = document.getElementById('admin-gallery-grid');
  document.getElementById('btn-refresh').addEventListener('click', loadGallery);

  async function loadGallery() {
    if (typeof firebase === 'undefined') {
      galleryGrid.innerHTML = '<div class="loading-state">Firebase not configured.</div>';
      return;
    }

    const db = firebase.firestore();
    galleryGrid.innerHTML = '<div class="loading-state">Loading...</div>';

    try {
      const snapshot = await db.collection('moments').orderBy('createdAt', 'desc').get();
      galleryGrid.innerHTML = '';
      
      if (snapshot.empty) {
        galleryGrid.innerHTML = '<div class="loading-state" style="grid-column: 1/-1">No media uploaded yet.</div>';
        return;
      }

      snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement('div');
        div.className = 'gallery-item';
        
        let media;
        if (data.type === 'image') {
          media = `<img src="${data.url}" alt="${data.caption}">`;
        } else {
          media = `<video src="${data.url}" muted loop onmouseover="this.play()" onmouseout="this.pause()"></video>`;
        }
        
        div.innerHTML = `
          ${media}
          ${data.caption ? `<div class="gallery-caption">${data.caption}</div>` : ''}
          <button class="delete-btn" data-id="${doc.id}">Delete</button>
        `;
        
        galleryGrid.appendChild(div);
      });

      // Bind delete buttons
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          if(confirm('Are you sure you want to delete this?')) {
            const id = e.target.getAttribute('data-id');
            await db.collection('moments').doc(id).delete();
            // In a real app we should also delete from Storage, but keeping it simple for now
            loadGallery();
          }
        });
      });

    } catch (error) {
      console.error(error);
      galleryGrid.innerHTML = '<div class="loading-state" style="color:red">Error loading gallery. Check console.</div>';
    }
  }
});
