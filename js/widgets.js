document.addEventListener('DOMContentLoaded', () => {
  const widgetsHtml = `
    <div class="dashboard-widgets" style="margin-top: 30px; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
      <div class="widget-card glass-card" style="display: flex; align-items: center; justify-content: center; padding: 25px; border-radius: 20px; text-align: center; flex-direction: column; gap: 10px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);">
        <div style="position:absolute; top:0; left:0; width:100%; height:3px; background: linear-gradient(90deg, var(--accent-1), transparent);"></div>
        <span id="live-time" class="time-display" style="font-size: 2rem; font-family: var(--font-mono); color: var(--text-primary); font-weight: 700; letter-spacing: 2px; text-shadow: 0 0 20px rgba(255,87,34,0.3);">00:00:00</span>
        <span class="time-label" style="font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px;">📍 Sirajganj, Bangladesh</span>
      </div>
      <div class="widget-card glass-card" style="display: flex; align-items: center; justify-content: center; padding: 25px; border-radius: 20px; text-align: center; flex-direction: column; gap: 10px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);">
        <div style="position:absolute; top:0; left:0; width:100%; height:3px; background: linear-gradient(90deg, transparent, var(--accent-2));"></div>
        <div style="display: flex; align-items: center; gap: 15px;">
          <span id="weather-icon" class="weather-icon" style="font-size: 2.5rem; filter: drop-shadow(0 0 10px rgba(255,255,255,0.2));">☁️</span>
          <span id="weather-temp" class="weather-temp" style="font-size: 2rem; font-weight: bold; color: var(--text-primary); font-family: var(--font-mono);">--°C</span>
        </div>
        <span id="weather-desc" class="weather-desc" style="font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px;">Loading...</span>
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
