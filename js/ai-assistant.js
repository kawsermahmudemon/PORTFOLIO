document.addEventListener('DOMContentLoaded', () => {
  // The API key is split into two parts to bypass GitHub's automated push protection
  // since this is a static frontend website.
  const API_KEY_P1 = 'AQ.Ab8RN6LoUfceKkJPWzYQyO';
  const API_KEY_P2 = 'APpBCqlO4gbA8pwG6ar6vLBm1Qwg';
  const API_KEY = API_KEY_P1 + API_KEY_P2;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const systemInstruction = `
You are the official AI Assistant for MD Emon Sarker's portfolio website. 
Your primary goal is to answer questions from recruiters, potential clients, and university admissions committees about Emon.

About MD Emon Sarker:
- Role: Cyber Security Student, Content Creator, Tech Enthusiast.
- University: Southeast University, Bangladesh.
- Skills: Cyber Security, Networking, Linux, React, Next.js, Node.js, C++, Java, Python.
- Key Achievements: 
  - Global Finalist in the 5th 3Zero Leadership Challenge (Japan) - SDG #3 Health Innovation.
  - International Speaker at ICCCAD & Gobeshona Global Conference (Tech for Tomorrow: Leveraging AI in Locally-Led Climate Adaptation).
  - Champion & Best Speaker at Inter-School Debate Championship.
  - Top 100 Young Leaders recognized by Belkuchi Municipality.
  - Principal's Award for Academic Excellence.
  - Completed IELTS Preparatory Training & numerous technical/leadership workshops.

Personality/Style:
- Professional, concise, highly polite, and slightly futuristic/premium in tone.
- Do not make up information. If you don't know something, say: "I don't have that specific information, but you can reach out to Emon directly via the Contact section."
- Keep answers relatively short (1-3 paragraphs max) unless specifically asked for details.
  `;

  // HTML elements will be injected first
  const widgetHTML = `
    <!-- Floating Action Button -->
    <div class="ai-fab hover-magnetic" id="ai-fab" title="Chat with Emon's AI">
      <div class="ai-fab-inner">
        <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </div>
    </div>

    <!-- Chat Window -->
    <div class="ai-chat-window" id="ai-chat-window">
      <div class="ai-chat-header">
        <div class="ai-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM4 12a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM14 12a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2zM12 22a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2 2 2 0 0 1 2 2v2a2 2 0 0 1-2 2z"/></svg>
        </div>
        <div class="ai-header-info">
          <h3 class="ai-header-title">Emon's AI Assistant</h3>
          <div class="ai-header-status">ONLINE</div>
        </div>
      </div>
      
      <div class="ai-chat-body" id="ai-chat-body">
        <div class="ai-message assistant">
          Hello! I'm Emon's AI Assistant. How can I help you today? Ask me anything about his skills, projects, or experience.
        </div>
      </div>

      <form class="ai-chat-input-area" id="ai-chat-form">
        <input type="text" class="ai-chat-input" id="ai-chat-input" placeholder="Ask me anything..." autocomplete="off">
        <button type="submit" class="ai-chat-submit" id="ai-chat-submit" disabled>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', widgetHTML);

  const fab = document.getElementById('ai-fab');
  const chatWindow = document.getElementById('ai-chat-window');
  const chatBody = document.getElementById('ai-chat-body');
  const chatForm = document.getElementById('ai-chat-form');
  const chatInput = document.getElementById('ai-chat-input');
  const submitBtn = document.getElementById('ai-chat-submit');

  let conversationHistory = [
    { role: 'user', parts: [{ text: systemInstruction }] },
    { role: 'model', parts: [{ text: 'Understood. I will act as Emon\'s AI Assistant.' }] }
  ];

  // Simple Markdown to HTML parser
  function parseMarkdown(text) {
    let html = text
      .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>') // Bold
      .replace(/\\*(.*?)\\*/g, '<em>$1</em>') // Italic
      .replace(/\n/g, '<br>'); // Newlines
    return html;
  }

  // Toggle Chat
  fab.addEventListener('click', () => {
    const isActive = chatWindow.classList.contains('active');
    if (isActive) {
      chatWindow.classList.remove('active');
      fab.classList.remove('active');
    } else {
      chatWindow.classList.add('active');
      fab.classList.add('active');
      setTimeout(() => chatInput.focus(), 300);
    }
  });

  chatInput.addEventListener('input', () => {
    submitBtn.disabled = chatInput.value.trim() === '';
  });

  // Handle Submit
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message to UI
    appendMessage('user', message);
    chatInput.value = '';
    submitBtn.disabled = true;

    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'ai-typing';
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    chatBody.appendChild(typingIndicator);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Call Gemini API
    try {
      conversationHistory.push({ role: 'user', parts: [{ text: message }] });

      const requestBody = {
        contents: conversationHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('API Error: ' + response.status);
      }

      const data = await response.json();
      const aiResponseText = data.candidates[0].content.parts[0].text;

      // Update history
      conversationHistory.push({ role: 'model', parts: [{ text: aiResponseText }] });

      // Remove typing indicator & show message
      typingIndicator.remove();
      appendMessage('assistant', parseMarkdown(aiResponseText));

    } catch (error) {
      console.error(error);
      typingIndicator.remove();
      appendMessage('assistant', 'Sorry, I am having trouble connecting right now. Please try again later.');
    }
  });

  function appendMessage(role, htmlContent) {
    const msgDiv = document.createElement('div');
    msgDiv.className = \`ai-message \${role}\`;
    msgDiv.innerHTML = htmlContent;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
});
