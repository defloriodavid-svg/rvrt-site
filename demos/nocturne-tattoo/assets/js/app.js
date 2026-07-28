(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.getElementById("siteHeader");
  const loader = document.getElementById("siteLoader");
  const loaderCount = document.getElementById("loaderCount");
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");
  const bookingForm = document.getElementById("bookingForm");
  const artistFloat = document.getElementById("artistFloat");

  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  // Header
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const setMenu = (open) => {
    menuButton.classList.toggle("active", open);
    menuButton.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("menu-open", open);

    if (window.gsap && !prefersReduced) {
      gsap.to(mobileMenu, {
        y: open ? "0%" : "-101%",
        autoAlpha: open ? 1 : 0,
        duration: .65,
        ease: "power4.inOut"
      });
    } else {
      mobileMenu.style.transform = open ? "translateY(0)" : "translateY(-101%)";
      mobileMenu.style.visibility = open ? "visible" : "hidden";
    }
  };

  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    setMenu(open);
  });

  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => setMenu(false));
  });

  // FAQ
  document.querySelectorAll(".faq-item").forEach(item => {
    const button = item.querySelector(".faq-button");
    const answer = item.querySelector(".faq-answer");

    button.addEventListener("click", () => {
      const isOpen = item.classList.toggle("open");
      answer.style.height = isOpen ? `${answer.scrollHeight}px` : "0px";
    });
  });

  // WhatsApp form
  if (bookingForm) {
    bookingForm.addEventListener("submit", event => {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const style = document.getElementById("style").value;
      const placement = document.getElementById("placement").value.trim() || "Da definire";
      const size = document.getElementById("size").value.trim() || "Da definire";
      const idea = document.getElementById("idea").value.trim();

      if (!name || !idea) return;

      const message = [
        `Ciao, sono ${name}.`,
        "",
        "Vorrei richiedere una consulenza per un tatuaggio.",
        `Stile: ${style}`,
        `Zona del corpo: ${placement}`,
        `Dimensione indicativa: ${size}`,
        `Idea: ${idea}`
      ].join("\n");

      const url = `https://wa.me/393519927137?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  // Cursor
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");

  if (dot && ring && window.matchMedia("(pointer:fine)").matches && !prefersReduced) {
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener("mousemove", e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
    }, { passive: true });

    let ringScale = 1;
    document.querySelectorAll("a, button, input, textarea, select").forEach(el => {
      el.addEventListener("mouseenter", () => { ringScale = 1.55; });
      el.addEventListener("mouseleave", () => { ringScale = 1; });
    });

    const animateCursorScaled = () => {
      ringX += (mouseX - ringX) * .14;
      ringY += (mouseY - ringY) * .14;
      ring.style.transform = `translate(${ringX - 17}px, ${ringY - 17}px) scale(${ringScale})`;
      requestAnimationFrame(animateCursorScaled);
    };
    // Replace the first animation loop with the scale-aware loop.
    ring.style.willChange = "transform";
    animateCursorScaled();
  }

  // Artist floating preview
  document.querySelectorAll(".artist-row").forEach(row => {
    const image = row.dataset.image;
    row.addEventListener("mouseenter", () => {
      if (!artistFloat || window.innerWidth < 1100) return;
      artistFloat.querySelector("img").src = image;
      artistFloat.style.opacity = "1";
    });
    row.addEventListener("mousemove", e => {
      if (!artistFloat || window.innerWidth < 1100) return;
      artistFloat.style.left = `${e.clientX}px`;
      artistFloat.style.top = `${e.clientY}px`;
    });
    row.addEventListener("mouseleave", () => {
      if (artistFloat) artistFloat.style.opacity = "0";
    });
  });

  // Loader and GSAP
  const runSite = () => {
    if (!window.gsap || !window.ScrollTrigger || prefersReduced) {
      if (loader) loader.style.display = "none";
      document.querySelectorAll(".reveal-up,.reveal-project").forEach(el => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const loaderTimeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        loader.style.display = "none";
        initScrollAnimations();
      }
    });

    const counter = { value: 0 };
    loaderTimeline
      .to(counter, {
        value: 100,
        duration: 1.1,
        onUpdate: () => loaderCount.textContent = String(Math.round(counter.value)).padStart(2, "0")
      }, 0)
      .to(".loader-line span", { scaleX: 1, duration: 1.1 }, 0)
      .to(".loader-logo", { y: -18, opacity: 0, duration: .45 }, 1.1)
      .to(".loader-line,.loader-count", { opacity: 0, duration: .3 }, 1.08)
      .to(loader, { yPercent: -100, duration: .85, ease: "power4.inOut" }, 1.35)
      .from(".title-line", { yPercent: 115, duration: 1.1, stagger: .12, ease: "power4.out" }, 1.55)
      .from(".hero .eyebrow,.hero-intro,.hero-actions", { y: 24, opacity: 0, duration: .7, stagger: .1 }, 1.75)
      .from(".hero-media", { clipPath: "inset(0 0 100% 0)", duration: 1.25, ease: "power4.inOut" }, 1.55);
  };

  function initScrollAnimations() {
    gsap.utils.toArray(".reveal-up").forEach(el => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: .85,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 86%", once: true }
      });
    });

    gsap.utils.toArray(".reveal-project").forEach(el => {
      gsap.from(el, {
        y: 70,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });

    gsap.from(".manifesto-lead", {
      y: 50,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".manifesto-lead", start: "top 82%", once: true }
    });

    gsap.utils.toArray(".section-heading").forEach(el => {
      gsap.from(el.children, {
        y: 40,
        opacity: 0,
        duration: .9,
        stagger: .12,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 84%", once: true }
      });
    });

    gsap.utils.toArray(".artist-row").forEach((row, index) => {
      gsap.from(row, {
        x: index % 2 ? 40 : -40,
        opacity: 0,
        duration: .8,
        ease: "power3.out",
        scrollTrigger: { trigger: row, start: "top 90%", once: true }
      });
    });

    gsap.utils.toArray(".process-card").forEach((card, index) => {
      gsap.from(card, {
        y: 55,
        opacity: 0,
        duration: .75,
        delay: index * .06,
        ease: "power3.out",
        scrollTrigger: { trigger: ".process-grid", start: "top 82%", once: true }
      });
    });

    gsap.utils.toArray(".care-row").forEach(row => {
      gsap.from(row, {
        x: 55,
        opacity: 0,
        duration: .75,
        ease: "power3.out",
        scrollTrigger: { trigger: row, start: "top 90%", once: true }
      });
    });

    gsap.to(".hero-media img", {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.to(".rotating-badge", {
      y: -80,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    ScrollTrigger.refresh();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runSite, { once: true });
  } else {
    runSite();
  }

  // Hard fallback: the page must never remain covered by the loader.
  setTimeout(() => {
    if (loader && getComputedStyle(loader).display !== "none") {
      loader.style.display = "none";
      document.documentElement.classList.add("site-ready");
    }
  }, 3200);
})();
