(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const loader = document.getElementById("loader");
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const loaderCount = document.getElementById("loaderCount");

  const hideLoaderFallback = () => {
    if (!loader) return;
    loader.style.opacity = "0";
    loader.style.visibility = "hidden";
    setTimeout(() => loader.remove(), 400);
  };

  const setMenu = open => {
    menuToggle.classList.toggle("active", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("menu-open", open);

    if (window.gsap && !reduced) {
      gsap.to(mobileMenu, {
        y: open ? "0%" : "-101%",
        autoAlpha: open ? 1 : 0,
        duration: .7,
        ease: "power4.inOut"
      });
    } else {
      mobileMenu.style.transform = open ? "translateY(0)" : "translateY(-101%)";
      mobileMenu.style.visibility = open ? "visible" : "hidden";
    }
  };

  menuToggle.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));

  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 22);
  window.addEventListener("scroll", updateHeader, { passive:true });
  updateHeader();

  const reviews = [...document.querySelectorAll(".review")];
  let reviewIndex = 0;

  const showReview = next => {
    if (!reviews.length) return;
    const old = reviews[reviewIndex];
    reviewIndex = (next + reviews.length) % reviews.length;
    const current = reviews[reviewIndex];

    if (window.gsap && !reduced) {
      gsap.to(old, { opacity:0, y:-18, duration:.35, onComplete:() => old.classList.remove("active") });
      current.classList.add("active");
      gsap.fromTo(current, { opacity:0, y:24 }, { opacity:1, y:0, duration:.55, delay:.16 });
    } else {
      old.classList.remove("active");
      current.classList.add("active");
    }
  };

  document.getElementById("reviewPrev").addEventListener("click", () => showReview(reviewIndex - 1));
  document.getElementById("reviewNext").addEventListener("click", () => showReview(reviewIndex + 1));

  const form = document.getElementById("bookingForm");
  form.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const treatment = document.getElementById("treatment").value;
    const when = document.getElementById("when").value.trim() || "Da concordare";
    const notes = document.getElementById("notes").value.trim() || "Nessuna nota";

    if (!name) return;

    const message = [
      `Ciao, sono ${name}.`,
      "",
      "Vorrei richiedere un appuntamento presso Aurea Beauty Atelier.",
      `Trattamento: ${treatment}`,
      `Preferenza: ${when}`,
      `Note: ${notes}`
    ].join("\n");

    window.open(`https://wa.me/393519927137?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  });

  const initAnimations = () => {
    if (!window.gsap || !window.ScrollTrigger || reduced) {
      hideLoaderFallback();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const count = { value:0 };
    const tl = gsap.timeline({
      onComplete:() => {
        loader.remove();
        startScrollAnimations();
      }
    });

    tl.to(count, {
      value:100,
      duration:1,
      onUpdate:() => loaderCount.textContent = String(Math.round(count.value)).padStart(2,"0")
    },0)
    .to(".loader-progress span",{scaleX:1,duration:1,ease:"power2.inOut"},0)
    .to(".loader-mark",{scale:.78,opacity:0,duration:.5,ease:"power3.in"},1)
    .to(".loader-copy,.loader-progress",{opacity:0,duration:.3},1.02)
    .to(loader,{yPercent:-100,duration:.85,ease:"power4.inOut"},1.25)
    .from(".hero-line",{yPercent:115,duration:1.1,stagger:.12,ease:"power4.out"},1.5)
    .from(".hero .kicker,.hero-text,.hero-actions",{y:24,opacity:0,duration:.7,stagger:.1},1.7)
    .from(".hero-media",{clipPath:"inset(0 0 100% 0)",duration:1.15,ease:"power4.inOut"},1.45);
  };

  const startScrollAnimations = () => {
    gsap.utils.toArray(".section-head,.atelier-head").forEach(el => {
      gsap.from(el.children,{y:45,opacity:0,duration:.9,stagger:.12,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 84%",once:true}});
    });

    gsap.from(".intro-lead",{y:55,opacity:0,duration:1.1,ease:"power3.out",scrollTrigger:{trigger:".intro-lead",start:"top 84%",once:true}});

    gsap.utils.toArray(".ritual-card").forEach(card => {
      gsap.from(card,{y:70,opacity:0,duration:1,ease:"power3.out",scrollTrigger:{trigger:card,start:"top 86%",once:true}});
    });

    gsap.utils.toArray(".method-steps article").forEach((step,index) => {
      gsap.from(step,{x:45,opacity:0,duration:.7,delay:index*.05,ease:"power3.out",scrollTrigger:{trigger:step,start:"top 90%",once:true}});
    });

    gsap.from(".atelier-gallery",{y:55,opacity:0,duration:1,ease:"power3.out",scrollTrigger:{trigger:".atelier-gallery",start:"top 85%",once:true}});

    gsap.to(".hero-media img",{
      yPercent:10,
      ease:"none",
      scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}
    });

    gsap.to(".method-media img",{
      yPercent:8,
      ease:"none",
      scrollTrigger:{trigger:".method",start:"top bottom",end:"bottom top",scrub:true}
    });

    ScrollTrigger.refresh();
  };

  if (document.readyState === "complete") {
    initAnimations();
  } else {
    window.addEventListener("load", initAnimations, { once:true });
  }

  setTimeout(() => {
    if (loader && document.body.contains(loader) && (!window.gsap || reduced)) hideLoaderFallback();
  }, 3500);
})();