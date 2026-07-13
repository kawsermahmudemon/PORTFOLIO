/* ══════════════════════════════════════════
   GITHUB STATS — Heatmap, Donut, Counters
   ══════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  // ── Contribution Heatmap ──
  const heatmapGrid = document.getElementById("github-heatmap");
  if (heatmapGrid) {
    const weeks = 52;
    const days = 7;
    const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

    // Label column
    const labelCol = document.createElement("div");
    labelCol.className = "heatmap-labels";
    dayLabels.forEach(label => {
      const span = document.createElement("span");
      span.textContent = label;
      labelCol.appendChild(span);
    });
    heatmapGrid.appendChild(labelCol);

    // Generate realistic contribution data
    for (let w = 0; w < weeks; w++) {
      const col = document.createElement("div");
      col.className = "heatmap-col";
      for (let d = 0; d < days; d++) {
        const cell = document.createElement("div");
        cell.className = "heatmap-cell";
        // Simulate realistic pattern: more active mid-week, less on weekends
        const weekendFactor = (d === 0 || d === 6) ? 0.3 : 1;
        const seasonFactor = Math.sin((w / weeks) * Math.PI * 2) * 0.3 + 0.7;
        const random = Math.random();
        let level = 0;
        const threshold = random * weekendFactor * seasonFactor;
        if (threshold > 0.7) level = 4;
        else if (threshold > 0.5) level = 3;
        else if (threshold > 0.35) level = 2;
        else if (threshold > 0.2) level = 1;
        cell.setAttribute("data-level", level);
        const contribs = level === 0 ? 0 : level * Math.floor(Math.random() * 3 + 1);
        cell.title = `${contribs} contributions`;
        col.appendChild(cell);
      }
      heatmapGrid.appendChild(col);
    }
  }

  // ── Language Donut Chart ──
  const donutCanvas = document.getElementById("lang-donut");
  if (donutCanvas) {
    const ctx = donutCanvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const size = 200;
    donutCanvas.width = size * dpr;
    donutCanvas.height = size * dpr;
    donutCanvas.style.width = size + "px";
    donutCanvas.style.height = size + "px";
    ctx.scale(dpr, dpr);

    const languages = [
      { name: "JavaScript", pct: 38, color: "#f7df1e" },
      { name: "Java", pct: 22, color: "#f89820" },
      { name: "Python", pct: 18, color: "#3776ab" },
      { name: "HTML/CSS", pct: 12, color: "#e34c26" },
      { name: "TypeScript", pct: 7, color: "#3178c6" },
      { name: "Other", pct: 3, color: "#555555" },
    ];

    const cx = size / 2, cy = size / 2;
    const outerR = 85, innerR = 55;
    let startAngle = -Math.PI / 2;

    // Animate drawing
    let animProgress = 0;
    function drawDonut() {
      ctx.clearRect(0, 0, size, size);
      let angle = -Math.PI / 2;
      const totalAngle = Math.PI * 2 * Math.min(animProgress, 1);

      languages.forEach(lang => {
        const slice = (lang.pct / 100) * totalAngle;
        ctx.beginPath();
        ctx.arc(cx, cy, outerR, angle, angle + slice);
        ctx.arc(cx, cy, innerR, angle + slice, angle, true);
        ctx.closePath();
        ctx.fillStyle = lang.color;
        ctx.fill();
        angle += slice;
      });

      // Center text
      const dark = document.documentElement.getAttribute("data-theme") === "dark";
      ctx.fillStyle = dark ? "#ededed" : "#111111";
      ctx.font = "bold 22px 'Space Grotesk', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("6+", cx, cy - 8);
      ctx.font = "12px 'Inter', sans-serif";
      ctx.fillStyle = dark ? "#888888" : "#666666";
      ctx.fillText("Languages", cx, cy + 12);

      if (animProgress < 1) {
        animProgress += 0.025;
        requestAnimationFrame(drawDonut);
      }
    }

    // Trigger on scroll
    const donutObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animProgress = 0;
        drawDonut();
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    donutObs.observe(donutCanvas);

    // Build legend
    const legend = document.getElementById("lang-legend");
    if (legend) {
      languages.forEach(lang => {
        const item = document.createElement("div");
        item.className = "legend-item";
        item.innerHTML = `<span class="legend-color" style="background:${lang.color}"></span><span class="legend-name">${lang.name}</span><span class="legend-pct">${lang.pct}%</span>`;
        legend.appendChild(item);
      });
    }
  }

  // ── GitHub Stats Counters ──
  const ghStats = document.querySelectorAll(".gh-stat-number");
  
  async function fetchGitHubData() {
    try {
      const res = await fetch('https://api.github.com/users/kawsermahmudemon');
      if (res.ok) {
        const data = await res.json();
        const repos = data.public_repos || 24;
        
        // Update HTML data attributes so the counter observer uses real numbers
        document.querySelector('[data-type="repos"]').setAttribute("data-count", repos);
        // Add more dynamic stats if they exist in the HTML...
      }
    } catch (e) {
      console.log('Using fallback GitHub stats');
    }
  }

  if (ghStats.length) {
    fetchGitHubData().then(() => {
      const ghObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-count"), 10) || 0;
          let val = 0;
          const dur = 2000, interval = 16;
          const step = Math.max(Math.ceil(target / (dur / interval)), 1);
          const timer = setInterval(() => {
            val += step;
            if (val >= target) { el.textContent = target + "+"; clearInterval(timer); }
            else el.textContent = val;
          }, interval);
          obs.unobserve(el);
        });
      }, { threshold: 0.3 });
      ghStats.forEach(s => ghObs.observe(s));
    });
  }
});
