(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const loader = document.getElementById("loader");
  const loaderCount = document.getElementById("loaderCount");
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

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

  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 24);
  window.addEventListener("scroll", updateHeader, {passive:true});
  updateHeader();

  document.querySelectorAll(".faq-item").forEach(item => {
    const button = item.querySelector("button");
    const answer = item.querySelector(".faq-answer");

    button.addEventListener("click", () => {
      const isOpen = item.classList.toggle("open");
      answer.style.height = isOpen ? `${answer.scrollHeight}px` : "0px";
    });
  });

  const testimonials = [...document.querySelectorAll(".testimonial")];
  let testimonialIndex = 0;

  const showTestimonial = next => {
    const old = testimonials[testimonialIndex];
    testimonialIndex = (next + testimonials.length) % testimonials.length;
    const current = testimonials[testimonialIndex];

    if (window.gsap && !reduced) {
      gsap.to(old, {
        opacity:0,
        y:-20,
        duration:.35,
        onComplete:() => old.classList.remove("active")
      });
      current.classList.add("active");
      gsap.fromTo(current,{opacity:0,y:26},{opacity:1,y:0,duration:.55,delay:.15});
    } else {
      old.classList.remove("active");
      current.classList.add("active");
    }
  };

  document.getElementById("prevTestimonial").addEventListener("click", () => showTestimonial(testimonialIndex - 1));
  document.getElementById("nextTestimonial").addEventListener("click", () => showTestimonial(testimonialIndex + 1));

  document.getElementById("contactForm").addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const goal = document.getElementById("goal").value;
    const experience = document.getElementById("experience").value;
    const availability = document.getElementById("availability").value.trim() || "Da definire";
    const message = document.getElementById("message").value.trim() || "Nessuna nota aggiuntiva";

    if (!name) return;

    const text = [
      `Ciao, sono ${name}.`,
      "",
      "Vorrei candidarmi per un percorso AXIS Performance.",
      `Obiettivo: ${goal}`,
      `Esperienza: ${experience}`,
      `Disponibilità: ${availability}`,
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
    .to(".loader-bar span",{scaleX:1,duration:1,ease:"power2.inOut"},0)
    .to(".loader-word",{scale:.8,letterSpacing:"-.13em",opacity:0,duration:.5,ease:"power3.in"},1)
    .to(".loader-meta,.loader-bar",{opacity:0,duration:.3},1.02)
    .to(loader,{yPercent:-100,duration:.85,ease:"power4.inOut"},1.25)
    .from(".hero-line",{yPercent:115,duration:1.05,stagger:.11,ease:"power4.out"},1.5)
    .from(".hero-top,.hero-copy,.hero-actions",{y:24,opacity:0,duration:.7,stagger:.1},1.66)
    .from(".hero-bg",{scale:1.08,opacity:.4,duration:1.2,ease:"power3.out"},1.4);
  };

  const initScrollAnimations = () => {
    gsap.from(".manifesto-main",{y:55,opacity:0,duration:1.05,ease:"power3.out",scrollTrigger:{trigger:".manifesto-main",start:"top 84%",once:true}});

    gsap.utils.toArray(".section-head").forEach(head => {
      gsap.from(head.children,{y:45,opacity:0,duration:.9,stagger:.12,ease:"power3.out",scrollTrigger:{trigger:head,start:"top 85%",once:true}});
    });

    gsap.utils.toArray(".program-card").forEach((card,index) => {
      gsap.from(card,{y:65,opacity:0,duration:.9,delay:index*.08,ease:"power3.out",scrollTrigger:{trigger:card,start:"top 88%",once:true}});
    });

    gsap.utils.toArray(".method-steps article").forEach((step,index) => {
      gsap.from(step,{x:42,opacity:0,duration:.7,delay:index*.05,ease:"power3.out",scrollTrigger:{trigger:step,start:"top 91%",once:true}});
    });

    gsap.from(".coach-image",{clipPath:"inset(100% 0 0 0)",duration:1.1,ease:"power4.inOut",scrollTrigger:{trigger:".coach-image",start:"top 83%",once:true}});

    gsap.utils.toArray(".result-card").forEach((card,index) => {
      gsap.from(card,{y:50,opacity:0,duration:.85,delay:index*.1,ease:"power3.out",scrollTrigger:{trigger:card,start:"top 87%",once:true}});
    });

    gsap.to(".hero-bg img",{yPercent:12,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}});
    gsap.to(".method-image img",{yPercent:8,ease:"none",scrollTrigger:{trigger:".method",start:"top bottom",end:"bottom top",scrub:true}});

    ScrollTrigger.refresh();
  };

  if (document.readyState === "complete") startAnimations();
  else window.addEventListener("load", startAnimations, {once:true});

  setTimeout(() => {
    if (loader && document.body.contains(loader) && (!window.gsap || reduced)) hideLoader();
  },3500);
})();