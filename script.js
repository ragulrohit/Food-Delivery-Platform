const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll(
  ".hero-visual, .category, .discover, .mood-grid span, .offer-card, .story-card, .delivery-card, .delivery-steps article, .dish-card, .promise-row article, .app-band, .phone-card, .page-hero, .restaurant-showcase, .restaurant-list article, .famous-food-grid article, .deal-board article, .offer-price-grid article, .popular-food-grid article, .platform-grid article, .place-grid article, .menu-gallery article, .app-features article, .app-screen-card, .app-flow article, .contact-layout, .contact-form, .contact-cards article, .location-section, .location-list article, .login-showcase, .login-panel, .social-login a, .footer-brand, .footer-column, .dashboard-sidebar, .dashboard-topbar, .dashboard-food-banner, .kitchen-pulse article, .metric-grid article, .dashboard-experience-row article, .dashboard-panel, .settings-list div, .ops-timeline div"
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
  window.clearTimeout(showLoginSuccess.timer);
  showLoginSuccess.timer = window.setTimeout(hideLoginSuccess, 2400);
}

function hideLoginSuccess() {
  const successMessage = document.querySelector(".login-success-message");
  if (!successMessage) return;

  window.clearTimeout(showLoginSuccess.timer);
  successMessage.classList.remove("show");
  successMessage.textContent = "";
}

function resetLoginSubmitButton() {
  const loginPage = document.querySelector(".login-page");
  const loginForm = document.querySelector(".login-form");
  const submitButton = loginForm?.querySelector("button[type='submit']");
  if (!loginPage || !loginForm || !submitButton) return;

  submitButton.disabled = false;
  submitButton.innerHTML = loginPage.classList.contains("is-signup")
    ? "Create Account"
    : "Sign In";
}

function resetLoginPageState() {
  hideLoginSuccess();
  resetLoginSubmitButton();
}

function getStoredDashboardUser() {
  try {
    return JSON.parse(localStorage.getItem("stacklyDashboardUser") || "null");
  } catch {
    return null;
  }
}

function saveDashboardUser(user) {
  try {
    localStorage.setItem("stacklyDashboardUser", JSON.stringify(user));
  } catch {
    // Local storage can be unavailable in private or restricted browser modes.
  }
}

function nameFromEmail(email) {
  const fallback = "Ragul";
  if (!email) return fallback;

  const localPart = email.split("@")[0]?.replace(/[._-]+/g, " ").replace(/\d+/g, "").trim();
  if (!localPart) return fallback;

  return localPart
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getInitials(name, email) {
  const source = name || nameFromEmail(email);
  const initials = source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "RA";
}

function setupDashboardUserProfile() {
  const profiles = document.querySelectorAll(".dashboard-profile");
  if (!profiles.length) return;

  const storedUser = getStoredDashboardUser();

  profiles.forEach((profile) => {
    const avatar = profile.querySelector(".profile-avatar");
    const name = profile.querySelector("strong");
    const email = profile.querySelector("p");
    const displayName = storedUser?.name || name?.textContent.trim() || "Ragul";
    const displayEmail = storedUser?.email || email?.textContent.trim() || "ragulrohit143@gmail.com";

    if (avatar) avatar.textContent = getInitials(displayName, displayEmail);
    if (name) name.textContent = displayName;
    if (email) email.textContent = displayEmail;
  });
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

  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 8, 7) * 70}ms`);
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
        const signupName = document.querySelector("#signup-name");
        const signupEmail = document.querySelector("#login-email");

        if (password && confirmPassword && password.value !== confirmPassword.value) {
          confirmPassword.setCustomValidity("Passwords do not match.");
          confirmPassword.reportValidity();
          confirmPassword.setCustomValidity("");
          return;
        }

        saveDashboardUser({
          name: signupName?.value.trim() || nameFromEmail(signupEmail?.value.trim()),
          email: signupEmail?.value.trim() || "ragulrohit143@gmail.com",
        });

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

      const emailValue = email?.value.trim() || "ragulrohit143@gmail.com";
      const storedUser = getStoredDashboardUser();

      saveDashboardUser({
        name: storedUser?.email === emailValue && storedUser?.name ? storedUser.name : nameFromEmail(emailValue),
        email: emailValue,
      });

      const submitButton = loginForm.querySelector("button[type='submit']");
      showToast("Sign in successful. Opening dashboard...");
      showLoginSuccess("Sign in successful. Opening dashboard...");

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Signing In...";
      }

      loginForm.reset();
      window.setTimeout(() => {
        hideLoginSuccess();
        resetLoginSubmitButton();
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
  const openButtons = document.querySelectorAll("[data-logout-open], .logout-action");
  let modal = document.querySelector("[data-logout-modal]");

  if (!openButtons.length) return;

  if (!modal) {
    modal = document.createElement("div");
    modal.className = "logout-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("data-logout-modal", "");
    modal.innerHTML = `
      <div class="logout-dialog" role="dialog" aria-modal="true" aria-labelledby="logout-title">
        <span class="logout-icon">L</span>
        <h2 id="logout-title">Logout?</h2>
        <p>Are you sure you want to leave your Foodly dashboard?</p>
        <div class="logout-actions">
          <button type="button" class="cancel-logout" data-logout-cancel>Cancel</button>
          <a class="confirm-logout" href="login.html">Confirm</a>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const cancelButton = modal.querySelector("[data-logout-cancel]");
  const confirmButton = modal.querySelector(".confirm-logout");
  const dialog = modal.querySelector(".logout-dialog");

  if (!cancelButton || !confirmButton || !dialog) return;

  function setLogoutModal(isOpen) {
    modal.classList.toggle("is-open", isOpen);
    modal.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("logout-modal-open", isOpen);

    if (isOpen) {
      cancelButton.focus();
    }
  }

  openButtons.forEach((openButton) => {
    openButton.setAttribute("data-logout-open", "");
    openButton.addEventListener("click", (event) => {
      event.preventDefault();
      confirmButton.setAttribute("href", openButton.getAttribute("href") || "login.html");
      setLogoutModal(true);
    });
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

function setupDashboardSidebar() {
  const sidebarLinks = document.querySelectorAll(".account-menu a[href^='#']");
  if (!sidebarLinks.length) return;

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      event.preventDefault();
      sidebarLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", link.getAttribute("href"));
    });
  });
}

function setupGoBackButtons() {
  const goBackButtons = document.querySelectorAll("[data-go-back]");
  if (!goBackButtons.length) return;

  goBackButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (window.history.length > 1) {
        window.history.back();
        return;
      }

      window.location.href = "index.html";
    });
  });
}

function setupAuthMode() {
  const loginPage = document.querySelector(".login-page");
  const authLinks = document.querySelectorAll("[data-auth-mode]");
  const heading = document.querySelector(".login-heading h2");
  const subheading = document.querySelector(".login-heading p");
  const submitButton = document.querySelector(".login-form button[type='submit']");

  if (!loginPage || !authLinks.length || !heading || !subheading || !submitButton) return;

  function setAuthMode(mode) {
    const isSignup = mode === "signup";
    loginPage.classList.toggle("is-signup", isSignup);
    heading.innerHTML = isSignup ? '<span>Create</span> Account' : '<span>Sign</span> In';
    subheading.textContent = isSignup ? "Start your Stackly dashboard." : "Enter your Stackly dashboard.";
    submitButton.textContent = isSignup ? "Create Account" : "Sign In";
  }

  window.setAuthMode = setAuthMode;

  authLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setAuthMode(link.dataset.authMode);
      if (link.dataset.authMode === "signup") {
        window.history.replaceState(null, "", "#create-account");
      } else {
        window.history.replaceState(null, "", window.location.pathname);
      }
    });
  });

  setAuthMode(window.location.hash === "#create-account" ? "signup" : "signin");
}

function setupPasswordToggles() {
  const toggles = document.querySelectorAll("[data-password-toggle]");
  if (!toggles.length) return;

  toggles.forEach((toggle) => {
    const field = toggle.closest(".password-field");
    const input = field?.querySelector("input");
    if (!input) return;

    const showLabel = toggle.getAttribute("aria-label") || "Show password";
    const hideLabel = showLabel.replace("Show", "Hide");

    toggle.addEventListener("click", () => {
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      toggle.textContent = isHidden ? "Hide" : "Show";
      toggle.setAttribute("aria-label", isHidden ? hideLabel : showLabel);
      toggle.setAttribute("aria-pressed", String(isHidden));
      input.focus();
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
window.addEventListener("pageshow", resetLoginPageState);
window.addEventListener("pagehide", resetLoginPageState);
window.addEventListener("beforeunload", resetLoginPageState);
window.addEventListener("load", () => {
  updateHeader();
  setupNavigation();
  setupReveal();
  setupForms();
  setupLogoutModal();
  setupDashboardSidebar();
  setupDashboardUserProfile();
  setupGoBackButtons();
  setupAuthMode();
  setupPasswordToggles();
  setupLoginRoleToggle();
  setupRestaurantSlider();
  setupCountdowns();
});
