/* ══════════════════════════════════════════
   DYNAMIC DATA — Greeting, Typing, Counters
   ══════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Year
  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Greeting
  const greetEl = document.getElementById("greeting");
  if (greetEl) {
    const h = new Date().getHours();
    greetEl.textContent = h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening";
  }

  // 3. Typewriter
  const typedEl = document.getElementById("typed-text");
  if (typedEl) {
    const roles = ["Full Stack Developer", "Creative Technologist", "UI/UX Designer", "Problem Solver"];
    let ri = 0, ci = 0, del = false;

    function type() {
      const word = roles[ri];
      if (del) {
        typedEl.textContent = word.substring(0, --ci);
        if (ci === 0) { del = false; ri = (ri + 1) % roles.length; setTimeout(type, 350); return; }
        setTimeout(type, 35);
      } else {
        typedEl.textContent = word.substring(0, ++ci);
        if (ci === word.length) { del = true; setTimeout(type, 2000); return; }
        setTimeout(type, 70);
      }
    }
    setTimeout(type, 1500);
  }

  // 4. Stat counters
  const stats = document.querySelectorAll(".stat-number");
  if (stats.length) {
    const countObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-count"), 10) || 0;
        let val = 0;
        const dur = 1600, interval = 16;
        const step = Math.max(Math.ceil(target / (dur / interval)), 1);
        const timer = setInterval(() => {
          val += step;
          if (val >= target) { el.textContent = target + "+"; clearInterval(timer); }
          else el.textContent = val;
        }, interval);
        obs.unobserve(el);
      });
    }, { threshold: 0.3 });
    stats.forEach(s => countObs.observe(s));
  }

  // 5. About tabs
  const aboutTabs = document.querySelectorAll(".about-tab-btn");
  const aboutPanels = document.querySelectorAll(".about-tab-panel");
  if (aboutTabs.length && aboutPanels.length) {
    aboutTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        aboutTabs.forEach(t => t.classList.remove("active"));
        aboutPanels.forEach(p => p.classList.remove("active"));
        tab.classList.add("active");
        const panel = document.getElementById(tab.getAttribute("data-panel"));
        if (panel) panel.classList.add("active");
      });
    });
  }
});

// ── Firebase Data Loading ──
document.addEventListener("DOMContentLoaded", async () => {
  if (typeof db !== 'undefined') {
    // 1. Fetch Projects
    const projectsGrid = document.getElementById("dynamic-projects-grid");
    if (projectsGrid) {
      try {
        const snapshot = await db.collection("projects").get();
        if (!snapshot.empty) {
          projectsGrid.innerHTML = '';
          
          let delay = 0;
          snapshot.forEach(doc => {
            const data = doc.data();
            const article = document.createElement('article');
            article.className = 'project-card';
            article.setAttribute('data-category', data.category || 'web');
            article.setAttribute('data-animate', 'fade-up');
            article.setAttribute('data-delay', delay.toString());
            article.setAttribute('data-tilt', '');
            delay += 0.1;

            const tagsHtml = data.tags ? data.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('') : '';
            
            let imageContent = '';
            if (data.imageUrl) {
              imageContent = `<img src="${data.imageUrl}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">`;
            } else {
              imageContent = `<div class="project-image-content">✨</div>`;
            }

            article.innerHTML = `
              <div class="project-image" style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);">
                ${imageContent}
                <div class="project-overlay">
                  ${data.liveUrl ? `<a href="${data.liveUrl}" target="_blank" class="project-link magnetic" data-magnetic aria-label="View live demo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                  </a>` : ''}
                  ${data.githubUrl ? `<a href="${data.githubUrl}" target="_blank" class="project-link magnetic" data-magnetic aria-label="View source code">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
                  </a>` : ''}
                </div>
              </div>
              <div class="project-info">
                <h3>${data.title}</h3>
                <p>${data.description}</p>
                <div class="project-tags">
                  ${tagsHtml}
                </div>
              </div>
            `;
            projectsGrid.appendChild(article);
          });

          // Re-initialize hover effects since DOM changed
          if (typeof window.setupMagnetic === 'function') window.setupMagnetic();
          if (typeof window.setupTilt === 'function') window.setupTilt();
        }
      } catch (err) {
        console.error("Firebase data load error (using fallback static data):", err);
      }
    }
  }
});
