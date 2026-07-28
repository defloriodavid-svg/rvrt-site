(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const loader = document.getElementById("loader");
  const loaderCount = document.getElementById("loaderCount");
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const servicePreview = document.getElementById("servicePreview");

  const hideLoader = () => {
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
        duration: .68,
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

  document.querySelectorAll(".service-item").forEach(item => {
    item.addEventListener("mouseenter", () => {
      if (!servicePreview || window.innerWidth < 1100) return;
      servicePreview.querySelector("img").src = item.dataset.image;
      servicePreview.style.opacity = "1";
    });
    item.addEventListener("mousemove", event => {
      if (!servicePreview || window.innerWidth < 1100) return;
      servicePreview.style.left = `${event.clientX}px`;
      servicePreview.style.top = `${event.clientY}px`;
    });
    item.addEventListener("mouseleave", () => {
      if (servicePreview) servicePreview.style.opacity = "0";
    });
  });

  document.querySelectorAll(".faq-item").forEach(item => {
    const button = item.querySelector("button");
    const answer = item.querySelector(".faq-answer");

    button.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      answer.style.height = open ? `${answer.scrollHeight}px` : "0px";
    });
  });

  const reviews = [...document.querySelectorAll(".review")];
  let reviewIndex = 0;

  const showReview = nextIndex => {
    const old = reviews[reviewIndex];
    reviewIndex = (nextIndex + reviews.length) % reviews.length;
    const current = reviews[reviewIndex];

    if (window.gsap && !reduced) {
      gsap.to(old, {
        opacity:0,
        y:-18,
        duration:.35,
        onComplete:() => old.classList.remove("active")
      });
      current.classList.add("active");
      gsap.fromTo(current,{opacity:0,y:24},{opacity:1,y:0,duration:.55,delay:.15});
    } else {
      old.classList.remove("active");
      current.classList.add("active");
    }
  };

  document.getElementById("prevReview").addEventListener("click", () => showReview(reviewIndex - 1));
  document.getElementById("nextReview").addEventListener("click", () => showReview(reviewIndex + 1));

  document.getElementById("contactForm").addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const reason = document.getElementById("reason").value;
    const when = document.getElementById("when").value.trim() || "Da concordare";
    const message = document.getElementById("message").value.trim() || "Nessun dettaglio aggiuntivo";

    if (!name) return;

    const text = [
      `Buongiorno, sono ${name}.`,
      "",
      "Vorrei richiedere informazioni o una prima visita.",
      `Motivo: ${reason}`,
      `Preferenza di contatto: ${when}`,
      `Messaggio: ${message}`
    ].join("\n");

    window.open(`https://wa.me/393519927137?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });

  const startAnimations = () => {
    if (!window.gsap || !window.ScrollTrigger || reduced) {
      hideLoader();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const count = {value:0};
    const tl = gsap.timeline({
      onComplete:() => {
        loader.remove();
        initScrollAnimations();
      }
    });

    tl.to(count,{
      value:100,
      duration:1,
      onUpdate:() => loaderCount.textContent = String(Math.round(count.value)).padStart(2,"0")
    },0)
    .to(".loader-line span",{scaleX:1,duration:1,ease:"power2.inOut"},0)
    .to(".loader-symbol",{scale:.7,rotate:20,opacity:0,duration:.5,ease:"power3.in"},1)
    .to(".loader-bottom,.loader-line",{opacity:0,duration:.3},1.02)
    .to(loader,{yPercent:-100,duration:.85,ease:"power4.inOut"},1.25)
    .from(".hero-line",{yPercent:115,duration:1.08,stagger:.12,ease:"power4.out"},1.5)
    .from(".hero-top,.hero-intro,.hero-actions",{y:24,opacity:0,duration:.7,stagger:.1},1.68)
    .from(".hero-media",{clipPath:"inset(0 0 100% 0)",duration:1.15,ease:"power4.inOut"},1.45);
  };

  const initScrollAnimations = () => {
    gsap.from(".statement-main",{y:55,opacity:0,duration:1.05,ease:"power3.out",scrollTrigger:{trigger:".statement-main",start:"top 84%",once:true}});

    gsap.utils.toArray(".section-head").forEach(head => {
      gsap.from(head.children,{y:44,opacity:0,duration:.9,stagger:.12,ease:"power3.out",scrollTrigger:{trigger:head,start:"top 85%",once:true}});
    });

    gsap.utils.toArray(".service-item").forEach(item => {
      gsap.from(item,{x:-40,opacity:0,duration:.75,ease:"power3.out",scrollTrigger:{trigger:item,start:"top 90%",once:true}});
    });

    gsap.utils.toArray(".method-steps article").forEach((step,index) => {
      gsap.from(step,{x:40,opacity:0,duration:.7,delay:index*.05,ease:"power3.out",scrollTrigger:{trigger:step,start:"top 91%",once:true}});
    });

    gsap.utils.toArray(".doctor-card").forEach((card,index) => {
      gsap.from(card,{y:60,opacity:0,duration:.9,delay:index*.08,ease:"power3.out",scrollTrigger:{trigger:card,start:"top 88%",once:true}});
    });

    gsap.from(".studio-gallery",{y:55,opacity:0,duration:1,ease:"power3.out",scrollTrigger:{trigger:".studio-gallery",start:"top 84%",once:true}});

    gsap.to(".hero-media img",{yPercent:10,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}});
    gsap.to(".method-image img",{yPercent:8,ease:"none",scrollTrigger:{trigger:".method",start:"top bottom",end:"bottom top",scrub:true}});

    ScrollTrigger.refresh();
  };

  if (document.readyState === "complete") startAnimations();
  else window.addEventListener("load", startAnimations, {once:true});

  setTimeout(() => {
    if (loader && document.body.contains(loader) && (!window.gsap || reduced)) hideLoader();
  },3500);
})();