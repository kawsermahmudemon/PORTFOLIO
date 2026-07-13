/*
 * Emon-AI Simulated Chatbot v2
 * Updated to match the new cinematic design system
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inject HTML for the chatbot using new CSS classes from animations.css
  const chatHTML = `
    <button class="emon-ai-fab" id="emon-ai-fab" aria-label="Chat with Emon-AI">
      ⚡
    </button>
    
    <div class="emon-ai-panel glass-card" id="emon-ai-panel">
      <div class="emon-ai-header">
        <h3>⚡ Emon-AI <span style="font-size:0.7rem; color:var(--success); font-weight:400; margin-left:6px;">Online</span></h3>
        <button class="emon-ai-close" id="emon-ai-close">✕</button>
      </div>
      
      <div class="emon-ai-messages" id="emon-ai-messages">
        <div class="ai-msg bot">
          Hi! I'm Emon's AI assistant. How can I help you explore his portfolio?
        </div>
      </div>
      
      <div class="emon-ai-input-area">
        <input type="text" class="emon-ai-input" id="emon-ai-input" placeholder="Ask about Emon..." autocomplete="off">
        <button class="emon-ai-send" id="emon-ai-send">Send</button>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', chatHTML);
  
  const fab = document.getElementById('emon-ai-fab');
  const panel = document.getElementById('emon-ai-panel');
  const closeBtn = document.getElementById('emon-ai-close');
  const messagesArea = document.getElementById('emon-ai-messages');
  const input = document.getElementById('emon-ai-input');
  const sendBtn = document.getElementById('emon-ai-send');
  
  // Toggle
  const toggleChat = () => {
    panel.classList.toggle('active');
    if (panel.classList.contains('active')) {
      input.focus();
    }
  };
  
  fab.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);
  
  // Simple NLP responses
  const responses = [
    { keywords: ['stack', 'tech', 'skills', 'language'], text: 'Emon is a Full Stack Developer. His core stack includes React, Next.js, Node.js, Python, and C. He also works extensively with IoT hardware like Arduino and Raspberry Pi!' },
    { keywords: ['achieve', 'award', 'prize', 'won'], text: 'He was ranked 1st in his class out of 450 students, and was recognized globally as a Finalist at the Japan 3ZERO Leadership Challenge for his social entrepreneurship.' },
    { keywords: ['hire', 'work', 'job', 'available', 'freelance'], text: 'Yes! Emon is currently open to new opportunities. You can use the Contact form or email him directly at mdemonsarker.personal@gmail.com.' },
    { keywords: ['project', 'portfolio', 'built'], text: 'Check out the Projects section! He built the Shohagpur Blood Donation Club app, an Autonomous Service Robot, and an IoT Smart Agriculture system.' },
    { keywords: ['hello', 'hi', 'hey'], text: 'Hello! I am ready to answer any questions you have about Emon.' },
    { keywords: ['default'], text: "That's an interesting question! While I'm just a simple AI, I recommend sending Emon a message through the contact form for a detailed answer." }
  ];
  
  const processMessage = (msg) => {
    if (!msg.trim()) return;
    
    // User message
    appendMessage(msg, 'user');
    input.value = '';
    
    // Bot typing
    const typingId = appendTyping();
    
    // Process intent
    const lowerMsg = msg.toLowerCase();
    let reply = responses.find(r => r.keywords.some(k => lowerMsg.includes(k)))?.text;
    if (!reply) reply = responses.find(r => r.keywords.includes('default')).text;
    
    // Bot response
    setTimeout(() => {
      removeTyping(typingId);
      appendMessage(reply, 'bot');
    }, 1000 + Math.random() * 1000); 
  };
  
  sendBtn.addEventListener('click', () => processMessage(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') processMessage(input.value);
  });
  
  function appendMessage(text, type) {
    const div = document.createElement('div');
    div.className = `ai-msg ${type}`;
    div.innerText = text;
    messagesArea.appendChild(div);
    scrollToBottom();
  }
  
  function appendTyping() {
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = 'ai-msg bot ai-typing';
    div.innerHTML = '...';
    messagesArea.appendChild(div);
    scrollToBottom();
    return id;
  }
  
  function removeTyping(id) {
    const el = document.getElementById(id);
    if(el) el.remove();
  }
  
  function scrollToBottom() {
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }
});
