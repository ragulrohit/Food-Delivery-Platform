const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll(
  ".category, .discover, .offer-card, .story-card, .delivery-card, .delivery-steps article, .dish-card, .promise-row article, .app-band, .page-hero, .restaurant-showcase, .restaurant-list article, .famous-food-grid article, .deal-board article, .offer-price-grid article, .popular-food-grid article, .platform-grid article, .place-grid article, .menu-gallery article, .app-features article, .app-screen-card, .app-flow article, .contact-layout, .location-section"
);

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
}

function showToast(message) {
  let toast = document.querySelector(".toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

function setupReveal() {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => {
    item.classList.add("reveal");
    observer.observe(item);
  });
}

function setupForms() {
  const searchForm = document.querySelector(".search-panel");
  const locationInput = document.querySelector("#location");

  if (searchForm && locationInput) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const location = locationInput.value.trim();
      const message = location
        ? `Showing fresh food near ${location}.`
        : "Please enter your delivery location.";

      showToast(message);

      if (location) {
        window.setTimeout(() => {
          window.location.href = "popular.html";
        }, 700);
      }
    });
  }

  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      showToast("Thanks! Foodly support will contact you soon.");
      contactForm.reset();
    });
  }

  const loginForm = document.querySelector(".login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      showToast("Login ready! Welcome back to Foodly.");
      loginForm.reset();
    });
  }
}

function setupRestaurantSlider() {
  const slider = document.querySelector("[data-restaurant-slider]");
  if (!slider) return;

  const slides = slider.querySelectorAll(".restaurant-slide");
  const dots = slider.querySelectorAll("[data-slide-to]");
  const previousButton = slider.querySelector("[data-slider-prev]");
  const nextButton = slider.querySelector("[data-slider-next]");
  let activeIndex = 0;
  let timer;

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", isActive ? "false" : "true");
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
  }

  function startSlider() {
    window.clearInterval(timer);
    timer = window.setInterval(() => {
      showSlide(activeIndex + 1);
    }, 4200);
  }

  previousButton?.addEventListener("click", () => {
    showSlide(activeIndex - 1);
    startSlider();
  });

  nextButton?.addEventListener("click", () => {
    showSlide(activeIndex + 1);
    startSlider();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.slideTo));
      startSlider();
    });
  });

  slider.addEventListener("mouseenter", () => window.clearInterval(timer));
  slider.addEventListener("mouseleave", startSlider);

  showSlide(0);
  startSlider();
}

function setupCountdowns() {
  const countdowns = document.querySelectorAll("[data-countdown-hours]");
  if (!countdowns.length) return;

  const timers = Array.from(countdowns).map((countdown) => {
    const hours = Number(countdown.dataset.countdownHours) || 1;
    const output = countdown.querySelector("[data-countdown-time]");
    return {
      endTime: Date.now() + hours * 60 * 60 * 1000,
      output,
    };
  });

  function updateCountdowns() {
    timers.forEach((timer) => {
      const remaining = Math.max(0, timer.endTime - Date.now());
      const totalSeconds = Math.floor(remaining / 1000);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
      const seconds = String(totalSeconds % 60).padStart(2, "0");

      if (timer.output) {
        timer.output.textContent = remaining > 0 ? `${hours}:${minutes}:${seconds}` : "Expired";
      }
    });
  }

  updateCountdowns();
  window.setInterval(updateCountdowns, 1000);
}

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("load", () => {
  updateHeader();
  setupReveal();
  setupForms();
  setupRestaurantSlider();
  setupCountdowns();
});
