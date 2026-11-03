(() => {
  "use strict";

  const root = document.documentElement;

  /* ---------------------------------------------------------------- theme */
  const themeToggle = document.getElementById("theme-toggle");
  const themeMeta = document.getElementById("theme-color");
  const themeColors = { light: "#f7f4ee", dark: "#12151a" };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    if (themeMeta) themeMeta.setAttribute("content", themeColors[theme]);
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
      themeToggle.setAttribute("title", theme === "dark" ? "Light theme" : "Dark theme");
    }
  };

  applyTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light");

  themeToggle?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("cs-theme", next);
    } catch (error) {
      /* storage unavailable — theme still applies for this visit */
    }
  });

  /* ----------------------------------------------------------- mobile menu */
  const menuToggle = document.getElementById("menu-toggle");
  const navPanel = document.getElementById("nav-panel");

  const setMenu = (open) => {
    if (!menuToggle || !navPanel) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navPanel.hidden = !open;
  };

  menuToggle?.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  navPanel?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (menuToggle?.getAttribute("aria-expanded") !== "true") return;
    if (event.target instanceof Element && event.target.closest("#site-header")) return;
    setMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) setMenu(false);
  });

  /* ------------------------------------------------------- sticky header */
  const header = document.getElementById("site-header");
  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* -------------------------------------------------------- active nav link */
  const navLinks = Array.from(document.querySelectorAll('.primary-nav a[href^="#"]'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => link.removeAttribute("aria-current"));
          const active = navLinks.find(
            (link) => link.getAttribute("href") === `#${entry.target.id}`
          );
          active?.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  /* --------------------------------------------------- video playback speed */
  const demonstration = document.getElementById("smart-city-video");

  if (demonstration) {
    const speedButtons = Array.from(
      document.querySelectorAll(".segmented [data-rate]")
    );

    speedButtons.forEach((button) => {
      button.addEventListener("click", () => {
        demonstration.playbackRate = Number(button.dataset.rate);
        speedButtons.forEach((option) => {
          option.setAttribute("aria-pressed", String(option === button));
        });
      });
    });
  }

  /* ------------------------------------------------------------ copy email */
  const copyButton = document.getElementById("copy-email");

  if (copyButton) {
    const status = document.createElement("span");
    status.className = "visually-hidden";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    document.body.append(status);

    let timer = 0;

    copyButton.addEventListener("click", async () => {
      const email = copyButton.dataset.email || "";

      try {
        await navigator.clipboard.writeText(email);
      } catch (error) {
        const helper = document.createElement("textarea");
        helper.value = email;
        helper.setAttribute("readonly", "");
        helper.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
        document.body.append(helper);
        helper.select();
        try {
          document.execCommand("copy");
        } catch (fallbackError) {
          /* nothing else to try */
        }
        helper.remove();
      }

      copyButton.classList.add("is-copied");
      copyButton.setAttribute("aria-label", "Email address copied");
      status.textContent = "Email address copied to clipboard";

      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        copyButton.classList.remove("is-copied");
        copyButton.setAttribute("aria-label", "Copy email address");
      }, 2200);
    });
  }

  /* -------------------------------------------------------- certificate viewer */
  const dialog = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const certificates = Array.from(document.querySelectorAll(".cert"));

  if (dialog && lightboxImage && lightboxCaption && certificates.length) {
    let current = 0;

    const showCertificate = (index) => {
      current = (index + certificates.length) % certificates.length;
      const certificate = certificates[current];
      const label =
        certificate.dataset.caption ||
        certificate.querySelector("figcaption")?.textContent?.trim() ||
        "Certificate";

      lightboxImage.src = certificate.getAttribute("href");
      lightboxImage.alt =
        certificate.querySelector("img")?.getAttribute("alt") || label;
      lightboxCaption.textContent = `${label} · ${current + 1} of ${certificates.length}`;
    };

    const openViewer = (index) => {
      showCertificate(index);
      if (typeof dialog.showModal === "function" && !dialog.open) {
        dialog.showModal();
      }
    };

    certificates.forEach((certificate, index) => {
      certificate.addEventListener("click", (event) => {
        if (typeof dialog.showModal !== "function") return;
        event.preventDefault();
        openViewer(index);
      });
    });

    dialog.querySelector(".lightbox-prev")?.addEventListener("click", () => {
      showCertificate(current - 1);
    });
    dialog.querySelector(".lightbox-next")?.addEventListener("click", () => {
      showCertificate(current + 1);
    });
    dialog.querySelector(".lightbox-close")?.addEventListener("click", () => {
      dialog.close();
    });

    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showCertificate(current + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        showCertificate(current - 1);
      }
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  }
})();
