/*
 * Theme Switcher
 * Handles dynamically changing the primary and secondary accent colors
 */

document.addEventListener('DOMContentLoaded', () => {
  const themeSwatches = document.querySelectorAll('.theme-swatch');
  const root = document.documentElement;

  // Pre-defined color palettes
  const palettes = {
    default: {
      primary: '#6b21a8',
      secondary: '#db2777'
    },
    blue: {
      primary: '#1d4ed8',
      secondary: '#0ea5e9'
    },
    green: {
      primary: '#16a34a',
      secondary: '#84cc16'
    },
    orange: {
      primary: '#ea580c',
      secondary: '#eab308'
    }
  };

  // Load saved palette
  const savedPalette = localStorage.getItem('portfolio-palette');
  if (savedPalette && palettes[savedPalette]) {
    applyPalette(savedPalette);
  }

  themeSwatches.forEach(swatch => {
    swatch.addEventListener('click', (e) => {
      const theme = e.currentTarget.dataset.palette;
      applyPalette(theme);
      
      // Update UI
      themeSwatches.forEach(s => s.classList.remove('active'));
      e.currentTarget.classList.add('active');
    });
  });

  function applyPalette(themeName) {
    const palette = palettes[themeName];
    if (!palette) return;

    // Set CSS Variables
    root.style.setProperty('--primary', palette.primary);
    root.style.setProperty('--secondary', palette.secondary);
    
    // Create gradient
    const gradient = `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`;
    root.style.setProperty('--gradient', gradient);

    localStorage.setItem('portfolio-palette', themeName);

    // If particles are active, update them too
    if (window.particleSystem) {
      window.particleSystem.updateColors(palette.primary, palette.secondary);
    }
  }
});
