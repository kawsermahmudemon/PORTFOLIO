/* 
 * Spotlight Effect for Glass Cards
 * Dynamically updates CSS variables with mouse coordinates for advanced hover masking
 */

document.addEventListener('DOMContentLoaded', () => {
  const initSpotlight = () => {
    const cards = document.querySelectorAll('.glass-card');
    
    // Add spotlight class to all glass cards
    cards.forEach(card => card.classList.add('spotlight-enabled'));

    document.addEventListener('mousemove', (e) => {
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        
        // Calculate mouse position relative to the card
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Set CSS variables on the card
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  };

  initSpotlight();
});
