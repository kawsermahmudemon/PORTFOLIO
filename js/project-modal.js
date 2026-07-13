/* ══════════════════════════════════════════
   PROJECT DETAIL MODAL — Full-screen overlay
   ══════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("project-modal");
  if (!modal) return;

  const closeBtn = modal.querySelector(".project-modal-close");
  const modalTitle = modal.querySelector(".project-modal-title");
  const modalDesc = modal.querySelector(".project-modal-desc");
  const modalTags = modal.querySelector(".project-modal-tags");
  const modalImage = modal.querySelector(".project-modal-image");
  const modalLinks = modal.querySelector(".project-modal-links");

  function openModal(card) {
    const info = card.querySelector(".project-info");
    const imageDiv = card.querySelector(".project-image");
    if (!info) return;

    const title = info.querySelector("h3")?.textContent || "";
    const desc = info.querySelector("p")?.textContent || "";
    const tags = info.querySelectorAll(".tag");
    const links = card.querySelectorAll(".project-link");
    const bgStyle = imageDiv?.style.background || "";
    const emoji = card.querySelector(".project-image-content")?.textContent || "✨";

    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;

    // Tags
    if (modalTags) {
      modalTags.innerHTML = "";
      tags.forEach(tag => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = tag.textContent;
        modalTags.appendChild(span);
      });
    }

    // Image area
    if (modalImage) {
      const img = imageDiv?.querySelector("img");
      if (img) {
        modalImage.innerHTML = `<img src="${img.src}" alt="${title}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius);">`;
      } else {
        modalImage.innerHTML = `<div style="background:${bgStyle};width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:6rem;border-radius:var(--radius);">${emoji}</div>`;
      }
    }

    // Links
    if (modalLinks) {
      modalLinks.innerHTML = "";
      links.forEach(link => {
        const a = document.createElement("a");
        a.href = link.href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = "btn-primary";
        const label = link.getAttribute("aria-label") || "View";
        a.innerHTML = `<span>${label}</span>`;
        modalLinks.appendChild(a);
      });
    }

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Close button
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  // Backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
  });

  // Delegate click on project cards
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".project-card");
    const link = e.target.closest(".project-link");

    // Don't open modal if clicking a direct link (GitHub/Live)
    if (link) return;

    if (card) {
      e.preventDefault();
      openModal(card);
    }
  });
});
