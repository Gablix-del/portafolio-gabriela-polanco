
document.addEventListener("DOMContentLoaded", () => {

  const body = document.body;
  const navbar = document.querySelector(".navbar");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  const STORAGE_KEY = "gp-theme";

  /* =====================================
     1. LIGHT AND DARK MODE
  ===================================== */

  const getStoredTheme = () => {
    try {
      const theme = localStorage.getItem(STORAGE_KEY);
      return theme === "light" || theme === "dark" ? theme : null;
    } catch {
      return null;
    }
  };

  const storeTheme = (theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // The page still works without local storage.
    }
  };

  const applyTheme = (theme) => {
    const isDark = theme === "dark";

    body.classList.toggle("dark", isDark);

    if (themeIcon) {
      themeIcon.classList.toggle("fa-moon", !isDark);
      themeIcon.classList.toggle("fa-sun", isDark);
    }

    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isDark));

      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Activar modo claro" : "Activar modo oscuro"
      );

      themeToggle.setAttribute(
        "title",
        isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
      );
    }

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        "content",
        isDark ? "#29201F" : "#F3EBDD"
      );
  };

  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  );

  const savedTheme = getStoredTheme();

  applyTheme(
    savedTheme || (prefersDark.matches ? "dark" : "light")
  );

  if (prefersDark.addEventListener) {
    prefersDark.addEventListener("change", (event) => {
      if (!getStoredTheme()) {
        applyTheme(event.matches ? "dark" : "light");
      }
    });
  }

  themeToggle?.addEventListener("click", () => {
    const nextTheme = body.classList.contains("dark")
      ? "light"
      : "dark";

    applyTheme(nextTheme);
    storeTheme(nextTheme);
  });


  /* =====================================
     2. SMOOTH SCROLLING
  ===================================== */

  const navCollapse = document.getElementById("mainNav");

  document.querySelectorAll('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {

      const id = link.getAttribute("href");

      if (!id || id.length < 2) return;

      const target = document.querySelector(id);

      if (!target) return;

      event.preventDefault();

      const offset = navbar?.offsetHeight || 0;

      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        offset + 1;

      window.scrollTo({
        top,
        behavior: "smooth"
      });

      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });

      if (
        navCollapse?.classList.contains("show") &&
        window.bootstrap
      ) {
        window.bootstrap.Collapse
          .getOrCreateInstance(navCollapse)
          .hide();
      }

    });

  });


  /* =====================================
     3. ACTIVE NAVIGATION AND SHADOW
  ===================================== */

  const sections = document.querySelectorAll(
    "main section[id]"
  );

  const navLinks = document.querySelectorAll(
    ".navbar .nav-link"
  );

  const onScroll = () => {

    navbar?.classList.toggle(
      "scrolled",
      window.scrollY > 40
    );

    let current = "";

    sections.forEach((section) => {

      if (
        window.scrollY +
        (navbar?.offsetHeight || 0) +
        80 >= section.offsetTop
      ) {
        current = section.id;
      }

    });

    navLinks.forEach((link) => {

      const active =
        link.getAttribute("href") === `#${current}`;

      link.classList.toggle("active", active);

      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }

    });

  };

  window.addEventListener("scroll", onScroll, {
    passive: true
  });

  onScroll();


  /* =====================================
     4. SCROLL REVEAL ANIMATIONS
  ===================================== */

  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }

        });

      },
      { threshold: 0.15 }
    );

    revealEls.forEach((element) => {
      observer.observe(element);
    });

  } else {

    revealEls.forEach((element) => {
      element.classList.add("visible");
    });

  }


  /* =====================================
     5. HERO IMAGE FALLBACK
  ===================================== */

  const heroImg = document.querySelector(".hero-img");

  heroImg?.addEventListener("error", () => {

    const fallback = document.createElement("div");

    fallback.className = "hero-img-fallback";
    fallback.setAttribute("role", "img");
    fallback.setAttribute("aria-label", heroImg.alt);
    fallback.textContent = "GP";

    heroImg.replaceWith(fallback);

  });


  /* =====================================
     6. PROJECT IMAGES
  ===================================== */

  document.querySelectorAll(".card-img-top").forEach((img) => {

    img.addEventListener("error", () => {
      img.removeAttribute("src");
    });

  });


  /* =====================================
     7. CONTACT FORM
  ===================================== */

  const form = document.getElementById("contactForm");

  form?.addEventListener("submit", (event) => {

    event.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      form.querySelector(":invalid")?.focus();
      return;
    }

    alert("¡Mensaje enviado! 📧");

    form.reset();
    form.classList.remove("was-validated");

  });


  /* =====================================
     8. AUTOMATIC FOOTER YEAR
  ===================================== */

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

});