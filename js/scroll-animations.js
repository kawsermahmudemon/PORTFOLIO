/* ══════════════════════════════════════════
   SCROLL-TRIGGERED REVEAL SYSTEM v3
   Performance-optimized version
   ══════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  // ── Reveal data-animate elements ──
  const animElements = document.querySelectorAll("[data-animate]");
  const staggerContainers = document.querySelectorAll("[data-stagger]");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseFloat(el.getAttribute("data-delay")) || 0;
      const animType = el.getAttribute("data-animate");

      // Text split character animation
      if (animType === "split-chars" && !el.dataset.split) {
        el.dataset.split = "true";
        const text = el.innerHTML;
        // Preserve existing HTML tags (like span.gradient-text)
        const parts = text.split(/(<[^>]+>)/g);
        let charIndex = 0;
        el.innerHTML = parts.map(part => {
          if (part.startsWith("<")) return part; // HTML tag, keep as-is
          return part.split("").map(char => {
            if (char === " ") return " ";
            const span = `<span class="split-char" style="transition-delay:${charIndex * 0.03}s">${char}</span>`;
            charIndex++;
            return span;
          }).join("");
        }).join("");

        // Trigger reveal after a frame
        setTimeout(() => {
          el.querySelectorAll(".split-char").forEach(c => c.classList.add("revealed"));
          el.classList.add("revealed");
        }, delay * 1000 + 50);
      } else {
        setTimeout(() => {
          el.classList.add("revealed");
        }, delay * 1000);
      }

      obs.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

  animElements.forEach(el => observer.observe(el));

  // ── Stagger children ──
  const staggerObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const children = entry.target.children;
      Array.from(children).forEach((child, i) => {
        setTimeout(() => child.classList.add("active"), i * 80);
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  staggerContainers.forEach(el => staggerObserver.observe(el));

  // ── Scroll progress bar (RAF-batched) ──
  const progressBar = document.getElementById("scroll-progress");
  if (progressBar) {
    let scrollTicking = false;
    window.addEventListener("scroll", () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(() => {
          const h = document.documentElement.scrollHeight - window.innerHeight;
          const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
          progressBar.style.width = `${pct}%`;
          scrollTicking = false;
        });
      }
    }, { passive: true });
  }

  // ── Parallax elements (RAF-batched) ──
  const parallaxElements = document.querySelectorAll("[data-parallax]");
  if (parallaxElements.length && !window.matchMedia("(pointer: coarse)").matches) {
    let parallaxTicking = false;
    window.addEventListener("scroll", () => {
      if (!parallaxTicking) {
        parallaxTicking = true;
        requestAnimationFrame(() => {
          parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute("data-parallax")) || 0.1;
            const rect = el.getBoundingClientRect();
            const elCenter = rect.top + rect.height / 2;
            const viewCenter = window.innerHeight / 2;
            const offset = (elCenter - viewCenter) * speed;
            el.style.transform = `translateY(${offset}px)`;
          });
          parallaxTicking = false;
        });
      }
    }, { passive: true });
  }
});
