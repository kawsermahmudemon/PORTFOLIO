/*
 * Live Presence Widget
 * Simulates a real-time presence (time in Bangladesh, online status, activity)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Create widget DOM
  const widget = document.createElement('div');
  widget.className = 'presence-widget glass-card';
  
  widget.innerHTML = `
    <div class="presence-inner">
      <div class="presence-avatar">
        <div class="presence-img">
          <!-- We'll use an emoji or initial if no image is available, but ideally it's Emon's face -->
          ⚡
        </div>
        <div class="presence-dot"></div>
      </div>
      <div class="presence-info">
        <div class="presence-status">Available for work</div>
        <div class="presence-activity" id="presence-activity">Currently: Innovating</div>
        <div class="presence-time" id="presence-time">Loading...</div>
      </div>
    </div>
    <style>
      .presence-widget {
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 12px 16px;
        z-index: 900;
        border-radius: var(--radius-full);
        transform: translateY(100px);
        opacity: 0;
        animation: slideUpPresence 1s cubic-bezier(0.16, 1, 0.3, 1) 2s forwards;
      }
      @keyframes slideUpPresence {
        to { transform: translateY(0); opacity: 1; }
      }
      .presence-inner {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .presence-avatar {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--surface);
        border: 1px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
      }
      .presence-dot {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 12px;
        height: 12px;
        background: #22c55e;
        border: 2px solid var(--glass);
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        animation: pulseGreen 2s infinite;
      }
      @keyframes pulseGreen {
        0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
        70% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
        100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
      }
      .presence-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .presence-status {
        font-family: var(--font-heading);
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-primary);
        line-height: 1;
      }
      .presence-activity {
        font-size: 0.7rem;
        color: var(--text-secondary);
        line-height: 1;
      }
      .presence-time {
        font-size: 0.65rem;
        color: var(--accent-1);
        font-weight: 600;
        line-height: 1;
        margin-top: 2px;
        font-family: monospace;
      }
      
      @media(max-width: 768px) {
        .presence-widget {
          bottom: 80px; /* Above terminal launcher if mobile */
          right: auto;
          left: 50%;
          transform: translateX(-50%) translateY(100px);
        }
        @keyframes slideUpPresence {
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      }
    </style>
  `;

  document.body.appendChild(widget);

  // Time updater (Bangladesh Time - UTC+6)
  const timeEl = document.getElementById('presence-time');
  
  function updateTime() {
    // Get current time in Bangladesh
    const options = { 
      timeZone: 'Asia/Dhaka', 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    };
    const bdTime = new Date().toLocaleTimeString('en-US', options);
    timeEl.innerText = `BD Local Time • ${bdTime}`;
  }
  
  setInterval(updateTime, 1000);
  updateTime();

  // Activity Cycler
  const activities = [
    "Currently: Building in React",
    "Currently: Designing in Figma",
    "Currently: IoT Prototyping",
    "Currently: Solving LeetCode",
    "Currently: Drinking Coffee ☕"
  ];
  
  const activityEl = document.getElementById('presence-activity');
  let actIndex = 0;
  
  setInterval(() => {
    actIndex = (actIndex + 1) % activities.length;
    activityEl.style.opacity = 0;
    setTimeout(() => {
      activityEl.innerText = activities[actIndex];
      activityEl.style.opacity = 1;
    }, 300);
  }, 10000); // Change every 10 seconds

});
