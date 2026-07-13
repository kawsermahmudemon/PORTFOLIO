document.addEventListener('DOMContentLoaded', () => {
  const widgetsHtml = `
    <div class="dashboard-widgets glass-card" style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center; padding: 15px 25px;">
      <div class="widget-time" style="display: flex; flex-direction: column;">
        <span id="live-time" class="time-display" style="font-size: 1.5rem; font-family: var(--font-mono); color: var(--color-accent); font-weight: bold;">00:00:00</span>
        <span class="time-label" style="font-size: 0.8rem; color: var(--text-light); opacity: 0.7;">Sirajganj, BD</span>
      </div>
      <div class="widget-weather" style="display: flex; align-items: center; gap: 15px;">
        <span id="weather-icon" class="weather-icon" style="font-size: 2rem;">☁️</span>
        <div class="weather-info" style="display: flex; flex-direction: column;">
          <span id="weather-temp" class="weather-temp" style="font-size: 1.2rem; font-weight: bold; color: var(--text-light);">--°C</span>
          <span id="weather-desc" class="weather-desc" style="font-size: 0.8rem; color: var(--text-light); opacity: 0.7;">Loading...</span>
        </div>
      </div>
    </div>
  `;

  // Insert widgets into the About section stats area
  const statsContainer = document.querySelector('.about-stats');
  if (statsContainer) {
    statsContainer.insertAdjacentHTML('afterend', widgetsHtml);
  }

  // Live Clock
  function updateTime() {
    const timeDisplay = document.getElementById('live-time');
    if (!timeDisplay) return;
    
    // Bangladesh is UTC+6
    const now = new Date();
    const bdTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Dhaka"}));
    let hours = bdTime.getHours().toString().padStart(2, '0');
    let minutes = bdTime.getMinutes().toString().padStart(2, '0');
    let seconds = bdTime.getSeconds().toString().padStart(2, '0');
    
    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
  }
  
  setInterval(updateTime, 1000);
  updateTime();

  // Weather Fetch (Open-Meteo - Free, No Key)
  async function fetchWeather() {
    try {
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=24.3167&longitude=89.7000&current_weather=true');
      const data = await res.json();
      
      const temp = data.current_weather.temperature;
      const code = data.current_weather.weathercode;
      
      let desc = "Clear";
      let icon = "☀️";
      
      if (code >= 1 && code <= 3) { desc = "Partly Cloudy"; icon = "⛅"; }
      else if (code >= 45 && code <= 48) { desc = "Foggy"; icon = "🌫️"; }
      else if (code >= 51 && code <= 67) { desc = "Rain"; icon = "🌧️"; }
      else if (code >= 71 && code <= 77) { desc = "Snow"; icon = "❄️"; }
      else if (code >= 95) { desc = "Thunderstorm"; icon = "⛈️"; }
      
      document.getElementById('weather-temp').textContent = `${Math.round(temp)}°C`;
      document.getElementById('weather-desc').textContent = desc;
      document.getElementById('weather-icon').textContent = icon;
      
    } catch (e) {
      console.log('Failed to fetch weather data.', e);
      document.getElementById('weather-desc').textContent = "Offline";
    }
  }
  
  fetchWeather();
});
