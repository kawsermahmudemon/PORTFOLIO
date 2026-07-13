/* ══════════════════════════════════════════
   BLOG DATA & MODAL LOGIC
   ══════════════════════════════════════════ */
const blogs = {
  1: {
    category: "Resilience & Engineering",
    time: "7 min read",
    date: "July 2026",
    title: "From Floodwaters to Future: Engineering Resilience in Rural Bangladesh",
    author: "Emon Sarker",
    content: `
      <p>My earliest memory is not of a toy or a game, but of a river. The catastrophic flood of 2014 was a pivotal moment in my life. As the murky water devoured our home, I lost a fundamental belief in a secure world. However, out of that destruction grew a relentless drive to build.</p>
      
      <h3>The Turning Point</h3>
      <p>In the wake of the disaster, the insecurities born from my rural background surfaced through cruel remarks. The pain was real, but my mother pushed me forward: <em>"You will not wait for a chance,"</em> she told me with an unyielding gaze. <em>"You will create it."</em></p>
      
      <p>That command became my new purpose. I took on a challenge that seemed impossible: solving the lack of electricity and internet that disconnected us from the world. I proposed installing solar panels and worked with an ISP to extend their network, bringing modern education to thousands in my village.</p>
      
      <blockquote>
        "An admissions officer might see my GPA or awards, but this is my true identity: a boy who used his passion for technology to uplift his entire community."
      </blockquote>
      
      <h3>Engineering for the People</h3>
      <p>This led me to my philosophy: technology is most powerful when it acts as a bridge for social equity and resilience. Whether I am building a maternal health tech prototype for rural women or an autonomous food-serving robot, engineering must serve humanity. Every line of code, every circuit, and every community initiative is an opportunity to empower those who need it most.</p>
    `
  },
  2: {
    category: "Leadership & Impact",
    time: "5 min read",
    date: "June 2026",
    title: "The 150K Impact: Scaling the National Coding & Robotics League",
    author: "Emon Sarker",
    content: `
      <p>When I founded the Bangladesh National Coding & Robotics League (NCRL), I had one goal: democratize technology education for students who, like me, grew up outside the tech hubs.</p>
      
      <h3>The Growth</h3>
      <p>What started as a small initiative quickly ballooned. We organized 6 regional hackathons and directly impacted over 600 students. But the ripple effect was much larger. Through our digital campaigns, school outreach, and the "Girls in Code" initiative, our network reach exceeded 150,000 individuals across the country.</p>
      
      <p>Building this wasn't just about teaching Python or C++. It was about breaking the mental barrier that rural students face when looking at modern technology. Today, seeing those students build their own apps and robotics projects is the greatest reward I could ask for.</p>
    `
  },
  3: {
    category: "Journey & Reflection",
    time: "4 min read",
    date: "May 2026",
    title: "Overcoming the Visa Barrier: The Road to Kent State",
    author: "Emon Sarker",
    content: `
      <p>Getting admitted to a US university as an international student is tough. But getting the visa can sometimes be an insurmountable wall. I faced multiple rejections under section 214(b) in early 2026. For a moment, it felt like the floodwaters of 2014 all over again—a force outside my control threatening to wash away my dreams.</p>
      
      <h3>Perseverance</h3>
      <p>But resilience is built into my code. I didn't give up. With the unwavering support of Kent State University and an emergency expedite request, I finally secured my F-1 Visa approval. This fall, I'll be joining Kent State as a Computer Science Freshman.</p>
      
      <p>This journey taught me that "No" is rarely the final answer. It's just a variable waiting to be reassigned. I look forward to taking this resilience to Ohio, and eventually, the global tech industry.</p>
    `
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const modalHtml = `
    <div id="blog-modal">
      <div class="blog-modal-container">
        <button class="blog-modal-close" id="blog-modal-close">&times;</button>
        <div class="blog-modal-header">
          <div class="blog-modal-meta" id="blog-modal-meta"></div>
          <h2 class="blog-modal-title" id="blog-modal-title"></h2>
          <div class="blog-modal-author">
            <span id="blog-modal-author-name"></span>
          </div>
        </div>
        <div class="blog-modal-content" id="blog-modal-content"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const modal = document.getElementById('blog-modal');
  const closeBtn = document.getElementById('blog-modal-close');

  document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-blog-id');
      const data = blogs[id];
      if (data) {
        document.getElementById('blog-modal-meta').textContent = `${data.category} • ${data.time} • ${data.date}`;
        document.getElementById('blog-modal-title').textContent = data.title;
        document.getElementById('blog-modal-author-name').textContent = `By ${data.author}`;
        document.getElementById('blog-modal-content').innerHTML = data.content;
        modal.classList.add('active');
      }
    });
  });

  function closeModal() {
    modal.classList.remove('active');
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
});
