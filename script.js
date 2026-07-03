const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll(
  ".category, .discover, .offer-card, .story-card, .delivery-card, .delivery-steps article, .dish-card, .promise-row article, .app-band, .page-hero, .restaurant-showcase, .restaurant-list article, .famous-food-grid article, .deal-board article, .offer-price-grid article, .popular-food-grid article, .platform-grid article, .place-grid article, .menu-gallery article, .app-features article, .app-screen-card, .app-flow article, .contact-layout, .location-section"
);

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
}

function setupNavigation() {
  if (!header) return;

  const toggle = header.querySelector(".nav-toggle");
  const navLinks = header.querySelectorAll(".main-nav a, .nav-button");

  if (!toggle) return;

  function setMenuState(isOpen) {
    header.classList.toggle("is-menu-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", () => {
    setMenuState(!header.classList.contains("is-menu-open"));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 880) {
      setMenuState(false);
    }
  });
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

function showLoginSuccess(message) {
  const loginForm = document.querySelector(".login-form");
  if (!loginForm) return;

  let successMessage = loginForm.querySelector(".login-success-message");

  if (!successMessage) {
    successMessage = document.createElement("p");
    successMessage.className = "login-success-message";
    successMessage.setAttribute("role", "status");
    loginForm.prepend(successMessage);
  }

  successMessage.textContent = message;
  successMessage.classList.add("show");
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

      if (document.body.classList.contains("is-signup")) {
        if (!loginForm.checkValidity()) {
          loginForm.reportValidity();
          return;
        }

        const password = document.querySelector("#login-password");
        const confirmPassword = document.querySelector("#confirm-password");

        if (password && confirmPassword && password.value !== confirmPassword.value) {
          confirmPassword.setCustomValidity("Passwords do not match.");
          confirmPassword.reportValidity();
          confirmPassword.setCustomValidity("");
          return;
        }

        showToast("Account created. Please sign in.");
        loginForm.reset();
        window.setTimeout(() => {
          window.setAuthMode?.("signin");
        }, 900);
        return;
      }

      const email = document.querySelector("#login-email");
      const password = document.querySelector("#login-password");

      if (email && !email.reportValidity()) {
        return;
      }

      if (password && !password.reportValidity()) {
        return;
      }

      const submitButton = loginForm.querySelector("button[type='submit']");
      showToast("Sign in successful. Opening dashboard...");
      showLoginSuccess("Sign in successful. Opening dashboard...");

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Signing In...";
      }

      loginForm.reset();
      window.setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1200);
    });
  }

  const dashboardSearch = document.querySelector(".dashboard-search");
  const dashboardQuery = document.querySelector("#dashboard-query");

  if (dashboardSearch && dashboardQuery) {
    dashboardSearch.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = dashboardQuery.value.trim();
      showToast(query ? `Searching dashboard for ${query}.` : "Type an order, rider, or restaurant name.");
    });
  }
}

function setupLogoutModal() {
  const openButton = document.querySelector("[data-logout-open]");
  const modal = document.querySelector("[data-logout-modal]");
  const cancelButton = document.querySelector("[data-logout-cancel]");

  if (!openButton || !modal || !cancelButton) return;

  function setLogoutModal(isOpen) {
    modal.classList.toggle("is-open", isOpen);
    modal.setAttribute("aria-hidden", String(!isOpen));
  }

  openButton.addEventListener("click", (event) => {
    event.preventDefault();
    setLogoutModal(true);
  });

  cancelButton.addEventListener("click", () => setLogoutModal(false));

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      setLogoutModal(false);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      setLogoutModal(false);
    }
  });
}

function setupAuthMode() {
  const loginPage = document.querySelector(".login-page");
  const authLinks = document.querySelectorAll("[data-auth-mode]");
  const heading = document.querySelector(".login-heading h2");
  const subheading = document.querySelector(".login-heading p");
  const submitButton = document.querySelector(".login-form button");

  if (!loginPage || !authLinks.length || !heading || !subheading || !submitButton) return;

  function setAuthMode(mode) {
    const isSignup = mode === "signup";
    loginPage.classList.toggle("is-signup", isSignup);
    heading.textContent = isSignup ? "Create Account" : "Sign In";
    subheading.textContent = isSignup ? "Start your Foodly dashboard." : "Enter your Foodly dashboard.";
    submitButton.innerHTML = isSignup ? 'Create Account <span aria-hidden="true">-></span>' : 'Sign In <span aria-hidden="true">-></span>';
  }

  window.setAuthMode = setAuthMode;

  authLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setAuthMode(link.dataset.authMode);
    });
  });
}

function setupLoginRoleToggle() {
  const roleButtons = document.querySelectorAll("[data-login-role]");
  if (!roleButtons.length) return;

  roleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      roleButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    });
  });
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
  setupNavigation();
  setupReveal();
  setupForms();
  setupLogoutModal();
  setupAuthMode();
  setupLoginRoleToggle();
  setupRestaurantSlider();
  setupCountdowns();
});
