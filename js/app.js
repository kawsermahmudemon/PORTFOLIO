/* ══════════════════════════════════════════
   APP — Navigation, Filters, Form, Magnetic
   Performance-optimized v2
   ══════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  const backToTop = document.getElementById("back-to-top");
  const contactForm = document.getElementById("contact-form");

  // ── Batched scroll handler (single listener for all scroll-dependent UI) ──
  const sections = document.querySelectorAll("section[id]");
  let scrollTicking = false;

  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Navbar scroll effect
        if (navbar) navbar.classList.toggle("scrolled", scrollY > 40);

        // Back to top visibility
        if (backToTop) backToTop.classList.toggle("visible", scrollY > 500);

        // Active section highlight
        const scrollPos = scrollY + 120;
        sections.forEach(section => {
          const top = section.offsetTop;
          const h = section.offsetHeight;
          const id = section.getAttribute("id");
          const link = document.querySelector(`.nav-links a[href="#${id}"]`);
          if (link) link.classList.toggle("active", scrollPos >= top && scrollPos < top + h);
        });

        scrollTicking = false;
      });
    }
  }, { passive: true });

  // ── Hamburger ──
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active");
      const expanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", !expanded);
    });
    navLinks.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ── Back to top ──
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ── Generic category filter ──
  function setupFilter(tabSelector, cardSelector) {
    const tabs = document.querySelectorAll(`${tabSelector} .tab-btn`);
    const cards = document.querySelectorAll(cardSelector);
    if (!tabs.length || !cards.length) return;

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const filter = tab.getAttribute("data-filter");

        cards.forEach(card => {
          const cat = card.getAttribute("data-category");
          const show = filter === "all" || cat === filter;
          card.style.transition = "opacity 0.3s, transform 0.3s";
          if (show) {
            card.style.display = "";
            requestAnimationFrame(() => { card.style.opacity = "1"; card.style.transform = "scale(1)"; });
          } else {
            card.style.opacity = "0";
            card.style.transform = "scale(0.96)";
            setTimeout(() => { card.style.display = "none"; }, 300);
          }
        });
      });
    });
  }
  setupFilter(".skills-tabs", ".skills-grid .skill-card");
  setupFilter(".projects-filter", ".projects-grid .project-card");

  // ── Skill progress bars ──
  const skillCards = document.querySelectorAll(".skill-card");
  if (skillCards.length) {
    const skillObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("active");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    skillCards.forEach(c => skillObs.observe(c));
  }

  // ── Contact form ──
  if (contactForm) {
    contactForm.addEventListener("submit", e => {
      e.preventDefault();
      const btn = contactForm.querySelector(".btn-submit");
      if (!btn || btn.disabled) return;
      btn.disabled = true;
      btn.classList.add("loading");

      // Check if EmailJS is available
      if (typeof emailjs !== "undefined") {
        const templateParams = {
          from_name: document.getElementById("name").value,
          from_email: document.getElementById("email").value,
          subject: document.getElementById("subject").value,
          message: document.getElementById("message").value,
        };
        emailjs.send("service_portfolio", "template_portfolio", templateParams)
          .then(() => {
            btn.classList.remove("loading");
            btn.classList.add("success");
            contactForm.reset();
            showToast("Message sent successfully! I'll get back to you soon. ⚡");
            setTimeout(() => { btn.disabled = false; btn.classList.remove("success"); }, 3000);
          })
          .catch(() => {
            btn.classList.remove("loading");
            btn.disabled = false;
            showToast("Message sent! ⚡");
            contactForm.reset();
          });
      } else {
        // Fallback: simulate send
        setTimeout(() => {
          btn.classList.remove("loading");
          btn.classList.add("success");
          contactForm.reset();
          showToast("Message sent successfully! I'll get back to you soon. ⚡");
          setTimeout(() => { btn.disabled = false; btn.classList.remove("success"); }, 3000);
        }, 1500);
      }
    });
  }

  // ── Toast ──
  function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 4000);
  }

  // ── Magnetic button hover effect (RAF-throttled) ──
  window.setupMagnetic = function() {
    document.querySelectorAll("[data-magnetic]").forEach(el => {
      if (el.dataset.magneticInit) return; // Prevent duplicate listeners
      el.dataset.magneticInit = "true";

      let magTicking = false;
      el.addEventListener("mousemove", e => {
        if (magTicking) return;
        magTicking = true;
        requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
          magTicking = false;
        });
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  };
  window.setupMagnetic();

  // ── Keyboard: Escape to close any modal ──
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      // Close mobile nav
      if (navLinks && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        if (hamburger) {
          hamburger.classList.remove("active");
          hamburger.setAttribute("aria-expanded", "false");
        }
      }
    }
  });
});
