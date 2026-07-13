/*
 * Theme Switcher v2
 * Updated palettes for warm dark design system
 */

document.addEventListener('DOMContentLoaded', () => {
  const themeSwatches = document.querySelectorAll('.theme-swatch');
  const root = document.documentElement;

  // Color palettes matching the new design system
  const palettes = {
    default: {
      primary: '#f59e0b',
      secondary: '#f97316'
    },
    blue: {
      primary: '#3b82f6',
      secondary: '#06b6d4'
    },
    green: {
      primary: '#22c55e',
      secondary: '#84cc16'
    },
    orange: {
      primary: '#a855f7',
      secondary: '#ec4899'
    }
  };

  // Load saved palette
  const savedPalette = localStorage.getItem('portfolio-palette');
  if (savedPalette && palettes[savedPalette]) {
    applyPalette(savedPalette);
    themeSwatches.forEach(s => {
      s.classList.toggle('active', s.dataset.palette === savedPalette);
    });
  }

  themeSwatches.forEach(swatch => {
    swatch.addEventListener('click', (e) => {
      const theme = e.currentTarget.dataset.palette;
      applyPalette(theme);
      
      themeSwatches.forEach(s => s.classList.remove('active'));
      e.currentTarget.classList.add('active');
    });
  });

  function applyPalette(themeName) {
    const palette = palettes[themeName];
    if (!palette) return;

    root.style.setProperty('--accent-1', palette.primary);
    root.style.setProperty('--accent-2', palette.secondary);
    root.style.setProperty('--accent-soft', hexToRgba(palette.primary, 0.12));
    root.style.setProperty('--glow', hexToRgba(palette.primary, 0.12));
    root.style.setProperty('--glow-strong', hexToRgba(palette.primary, 0.25));

    const gradient = `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`;
    root.style.setProperty('--gradient', gradient);
    root.style.setProperty('--gradient-text', `linear-gradient(135deg, ${palette.secondary}, ${palette.primary}, ${palette.secondary})`);

    localStorage.setItem('portfolio-palette', themeName);
  }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
});
