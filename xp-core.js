// ========== USER ID INIT ==========
const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
localStorage.setItem('userId', userId);

// ========== XP DISPLAY LOGIC ==========
async function fetchXP() {
  const xp = parseInt(localStorage.getItem('xp')) || 0;
  document.getElementById("xp-count").textContent = xp;
  document.getElementById("rupee-count").textContent = (xp / 100).toFixed(2);
}
window.addEventListener('DOMContentLoaded', fetchXP);

// ========== XP TASK COMPLETION ==========
async function completeTask(taskId, amount) {
  if (localStorage.getItem(`done_${taskId}`)) {
    alert("You've already completed this task.");
    return;
  }

  let xp = parseInt(localStorage.getItem('xp')) || 0;
  xp += amount;
  localStorage.setItem('xp', xp);
  localStorage.setItem(`done_${taskId}`, true);

  fetchXP();
  alert(`✅ You earned ${amount} XP!`);
}

// ========== ANUSHA REDIRECT VERIFICATION ==========
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const redirectedFrom = params.get("source");
  const xpCount = document.getElementById("xp-count");
  const rupeeCount = document.getElementById("rupee-count");
  let currentXP = parseInt(localStorage.getItem("xp")) || 0;

  if (redirectedFrom === "anusha" && !localStorage.getItem("task_verified_anusha")) {
    const earnedXP = 10;
    currentXP += earnedXP;
    localStorage.setItem("xp", currentXP);
    localStorage.setItem("task_verified_anusha", "true");

    if (xpCount) xpCount.textContent = currentXP;
    if (rupeeCount) rupeeCount.textContent = (currentXP / 100).toFixed(2);

    // Alert box
    const alertBox = document.createElement("div");
    alertBox.textContent = `✅ Task Verified! You earned ${earnedXP} XP`;
    Object.assign(alertBox.style, {
      position: "fixed",
      bottom: "30px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "#1abc9c",
      color: "#fff",
      padding: "14px 28px",
      fontSize: "1.1rem",
      borderRadius: "20px",
      boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
      zIndex: "9999",
      transition: "opacity 0.5s ease"
    });
    document.body.appendChild(alertBox);
    setTimeout(() => {
      alertBox.style.opacity = "0";
      setTimeout(() => alertBox.remove(), 500);
    }, 4000);

    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});

// ========== CAROUSEL LOGIC ==========
document.addEventListener('DOMContentLoaded', function () {
  const track = document.querySelector('.task-carousel-track');
  if (!track) return;

  const slides = Array.from(track.children);
  const nextButton = document.querySelector('.carousel-nav.next');
  const prevButton = document.querySelector('.carousel-nav.prev');
  const indicatorsContainer = document.querySelector('.carousel-indicators');
  let currentIndex = 0;

  slides.forEach((_, index) => {
    const indicator = document.createElement('div');
    indicator.classList.add('carousel-indicator');
    if (index === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => goToSlide(index));
    indicatorsContainer.appendChild(indicator);
  });

  const indicators = Array.from(indicatorsContainer.children);

  function updateSlidePosition() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    indicators.forEach((indicator, index) =>
      indicator.classList.toggle('active', index === currentIndex)
    );
  }

  function goToSlide(index) {
    currentIndex = index;
    updateSlidePosition();
  }

  nextButton?.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      updateSlidePosition();
    }
  });

  prevButton?.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlidePosition();
    }
  });

  // Swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
  track.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50 && currentIndex < slides.length - 1) currentIndex++;
    else if (touchEndX - touchStartX > 50 && currentIndex > 0) currentIndex--;
    updateSlidePosition();
  });

  // Auto rotate
  setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlidePosition();
  }, 5000);
});

// ========== PARTICLES.JS ==========
document.addEventListener('DOMContentLoaded', () => {
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#1abc9c" },
        shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
        opacity: { value: 0.3, random: true },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#1abc9c",
          opacity: 0.2,
          width: 1
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out"
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" }
        }
      },
      retina_detect: true
    });
  }
});

// ========== FAQ TOGGLE ==========
function toggleFAQ(element) {
  element.classList.toggle('active');
  const content = element.nextElementSibling;
  content.classList.toggle('show');
}
window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const redirectedFrom = params.get("source");
  let currentXP = parseInt(localStorage.getItem("xp")) || 0;

  if (redirectedFrom === "anusha" && !localStorage.getItem("task_verified_anusha")) {
    const earnedXP = 10;
    currentXP += earnedXP;

    localStorage.setItem("xp", currentXP);
    localStorage.setItem("task_verified_anusha", "true");

    // Update UI
    const xpSpan = document.getElementById("xp-count");
    const rupeeSpan = document.getElementById("rupee-count");
    if (xpSpan) xpSpan.textContent = currentXP;
    if (rupeeSpan) rupeeSpan.textContent = (currentXP / 100).toFixed(2);

    // Success popup
    const alertBox = document.createElement("div");
    alertBox.textContent = `✅ Task Verified! You earned ${earnedXP} XP`;
    Object.assign(alertBox.style, {
      position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)",
      background: "#1abc9c", color: "#fff", padding: "14px 28px",
      fontSize: "1.1rem", borderRadius: "20px", zIndex: "9999"
    });
    document.body.appendChild(alertBox);

    setTimeout(() => {
      alertBox.style.opacity = "0";
      setTimeout(() => alertBox.remove(), 500);
    }, 4000);

    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
  } else {
    // Always show stored XP on page load
    const xpSpan = document.getElementById("xp-count");
    const rupeeSpan = document.getElementById("rupee-count");
    if (xpSpan) xpSpan.textContent = currentXP;
    if (rupeeSpan) rupeeSpan.textContent = (currentXP / 100).toFixed(2);
  }
};
