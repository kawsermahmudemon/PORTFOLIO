/* ══════════════════════════════════════════
   FAQ ACCORDION — Smooth expand/collapse
   ══════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item");
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!trigger || !answer) return;

    // Set initial max-height to 0
    answer.style.maxHeight = "0px";

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all others
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains("open")) {
          other.classList.remove("open");
          const otherAnswer = other.querySelector(".faq-answer");
          if (otherAnswer) otherAnswer.style.maxHeight = "0px";
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove("open");
        answer.style.maxHeight = "0px";
      } else {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });

    // Keyboard support
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        trigger.click();
      }
    });
  });
});
