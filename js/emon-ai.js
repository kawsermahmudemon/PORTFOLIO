/*
 * Emon-AI Simulated Chatbot
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inject HTML for the chatbot
  const chatHTML = `
    <div class="ai-chat-bubble" id="ai-chat-bubble" title="Chat with Emon-AI">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
    </div>
    <div class="ai-chat-window glass-card" id="ai-chat-window">
      <div class="ai-chat-header">
        <div class="ai-avatar">⚡</div>
        <div class="ai-title">Emon-AI <span class="ai-status">Online</span></div>
        <button class="ai-close" id="ai-close">✕</button>
      </div>
      <div class="ai-chat-body" id="ai-chat-body">
        <div class="ai-msg ai-msg-bot">
          Hi! I'm Emon's AI assistant. What would you like to know about him?
        </div>
      </div>
      <div class="ai-chat-options" id="ai-chat-options">
        <button class="ai-opt-btn" data-q="stack">What's your tech stack?</button>
        <button class="ai-opt-btn" data-q="achieve">Greatest achievement?</button>
        <button class="ai-opt-btn" data-q="hire">Are you available for work?</button>
      </div>
    </div>
    <style>
      .ai-chat-bubble {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--gradient);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 25px var(--glow-strong);
        cursor: pointer;
        z-index: 990; /* Above terminal launcher if overlapping */
        transition: transform 0.3s ease;
      }
      .ai-chat-bubble:hover { transform: scale(1.1); }
      
      .ai-chat-window {
        position: fixed;
        bottom: 100px;
        right: 24px;
        width: 350px;
        max-width: calc(100vw - 48px);
        height: 450px;
        display: flex;
        flex-direction: column;
        padding: 0;
        z-index: 990;
        opacity: 0;
        pointer-events: none;
        transform: translateY(20px) scale(0.95);
        transition: opacity 0.3s ease, transform 0.3s ease;
        overflow: hidden;
      }
      .ai-chat-window.active {
        opacity: 1;
        pointer-events: all;
        transform: translateY(0) scale(1);
      }
      
      .ai-chat-header {
        display: flex;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid var(--border);
        background: rgba(0,0,0,0.2);
      }
      .ai-avatar {
        width: 32px; height: 32px;
        border-radius: 50%;
        background: var(--surface);
        display: flex; align-items: center; justify-content: center;
        margin-right: 12px;
      }
      .ai-title { font-weight: 600; flex: 1; }
      .ai-status { font-size: 0.7rem; color: #22c55e; font-weight: 400; margin-left: 8px; }
      .ai-close { background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 1.2rem; }
      
      .ai-chat-body {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .ai-msg {
        max-width: 85%;
        padding: 10px 14px;
        border-radius: 12px;
        font-size: 0.9rem;
        line-height: 1.4;
      }
      .ai-msg-bot {
        background: var(--surface);
        align-self: flex-start;
        border-bottom-left-radius: 2px;
      }
      .ai-msg-user {
        background: var(--primary);
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 2px;
      }
      .ai-typing {
        display: flex; gap: 4px; padding: 12px 14px;
      }
      .ai-typing-dot {
        width: 6px; height: 6px; background: var(--text-secondary); border-radius: 50%;
        animation: typing 1.4s infinite ease-in-out both;
      }
      .ai-typing-dot:nth-child(1) { animation-delay: -0.32s; }
      .ai-typing-dot:nth-child(2) { animation-delay: -0.16s; }
      @keyframes typing { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
      
      .ai-chat-options {
        padding: 16px;
        border-top: 1px solid var(--border);
        display: flex;
        flex-direction: column;
        gap: 8px;
        background: rgba(0,0,0,0.1);
      }
      .ai-opt-btn {
        background: var(--surface);
        border: 1px solid var(--border);
        color: var(--text-primary);
        padding: 8px 12px;
        border-radius: var(--radius-full);
        font-size: 0.8rem;
        text-align: left;
        transition: var(--transition-fast);
      }
      .ai-opt-btn:hover { background: var(--border); border-color: var(--accent-1); }
      
      @media(max-width: 768px) {
        .ai-chat-bubble {
          bottom: 24px;
          right: 24px;
        }
        /* Hide Presence widget if AI chat is open, they might overlap on mobile */
        .ai-chat-window.active ~ .presence-widget {
          display: none !important;
        }
      }
    </style>
  `;
  
  document.body.insertAdjacentHTML('beforeend', chatHTML);
  
  const bubble = document.getElementById('ai-chat-bubble');
  const windowEl = document.getElementById('ai-chat-window');
  const closeBtn = document.getElementById('ai-close');
  const bodyEl = document.getElementById('ai-chat-body');
  const optionsEl = document.getElementById('ai-chat-options');
  const optionBtns = document.querySelectorAll('.ai-opt-btn');
  
  // Adjust Presence widget position if it exists, to not overlap with chat bubble
  const presence = document.querySelector('.presence-widget');
  if (presence && window.innerWidth > 768) {
    presence.style.right = '100px';
  }

  // Toggle
  const toggleChat = () => {
    windowEl.classList.toggle('active');
    if(window.uiSounds) window.uiSounds.playPop();
  };
  
  bubble.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);
  
  const responses = {
    'stack': 'Emon is a Full Stack Developer. His core stack includes React, Next.js, Node.js, Python, and C. He also works extensively with IoT hardware like Arduino and Raspberry Pi!',
    'achieve': 'He was ranked 1st in his class out of 450 students, and was recognized globally as a Finalist at the Japan 3ZERO Leadership Challenge for his social entrepreneurship.',
    'hire': 'Yes! Emon is currently open to new opportunities. You can use the Contact form or email him directly at mdemonsarker.personal@gmail.com.',
  };
  
  optionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const qType = e.target.getAttribute('data-q');
      const qText = e.target.innerText;
      
      if(window.uiSounds) window.uiSounds.playTick();
      
      // User message
      appendMessage(qText, 'user');
      optionsEl.style.display = 'none';
      
      // Bot typing
      const typingId = appendTyping();
      
      // Bot response
      setTimeout(() => {
        removeTyping(typingId);
        appendMessage(responses[qType], 'bot');
        optionsEl.style.display = 'flex';
      }, 1500 + Math.random() * 1000); // Simulate thinking 1.5s - 2.5s
    });
  });
  
  function appendMessage(text, sender) {
    const div = document.createElement('div');
    div.className = \`ai-msg ai-msg-\${sender}\`;
    div.innerText = text;
    bodyEl.appendChild(div);
    scrollToBottom();
  }
  
  function appendTyping() {
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = 'ai-msg ai-msg-bot ai-typing';
    div.innerHTML = '<div class="ai-typing-dot"></div><div class="ai-typing-dot"></div><div class="ai-typing-dot"></div>';
    bodyEl.appendChild(div);
    scrollToBottom();
    return id;
  }
  
  function removeTyping(id) {
    const el = document.getElementById(id);
    if(el) el.remove();
  }
  
  function scrollToBottom() {
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }
});
