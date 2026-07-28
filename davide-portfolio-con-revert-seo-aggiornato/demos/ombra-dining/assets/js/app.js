(() => {
  "use strict";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const loader = document.getElementById("loader");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  const hideLoader = () => {
    if (!loader) return;
    loader.style.opacity = "0";
    loader.style.visibility = "hidden";
    setTimeout(() => loader.remove(), 350);
  };

  const setMenu = open => {
    document.body.classList.toggle("menu-open", open);
    if (window.gsap && !reduced) {
      gsap.to(mobileMenu,{y:open?"0%":"-101%",autoAlpha:open?1:0,duration:.7,ease:"power4.inOut"});
    } else {
      mobileMenu.style.transform = open ? "translateY(0)" : "translateY(-101%)";
      mobileMenu.style.visibility = open ? "visible" : "hidden";
    }
  };

  let menuOpen = false;
  menuToggle.addEventListener("click", () => { menuOpen = !menuOpen; setMenu(menuOpen); });
  mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {menuOpen=false;setMenu(false)}));

  const dishes = [...document.querySelectorAll(".dish")];
  document.querySelectorAll(".dish-btn").forEach((btn, index) => {
    btn.addEventListener("click", () => {
      document.querySelector(".dish-btn.active")?.classList.remove("active");
      btn.classList.add("active");
      const current = document.querySelector(".dish.active");
      const next = dishes[index];
      if (current === next) return;
      if (window.gsap && !reduced) {
        gsap.to(current,{opacity:0,scale:1.03,duration:.35,onComplete:()=>current.classList.remove("active")});
        next.classList.add("active");
        gsap.fromTo(next,{opacity:0,scale:.98},{opacity:1,scale:1,duration:.6,delay:.15,ease:"power3.out"});
      } else {
        current.classList.remove("active");
        next.classList.add("active");
      }
    });
  });

  const quotes = [...document.querySelectorAll(".quote")];
  let qi = 0;
  const showQuote = n => {
    const old = quotes[qi];
    qi = (n + quotes.length) % quotes.length;
    const next = quotes[qi];
    if (window.gsap && !reduced) {
      gsap.to(old,{opacity:0,y:-20,duration:.35,onComplete:()=>old.classList.remove("active")});
      next.classList.add("active");
      gsap.fromTo(next,{opacity:0,y:25},{opacity:1,y:0,duration:.55,delay:.15});
    } else {
      old.classList.remove("active"); next.classList.add("active");
    }
  };
  document.getElementById("prevQuote").addEventListener("click",()=>showQuote(qi-1));
  document.getElementById("nextQuote").addEventListener("click",()=>showQuote(qi+1));

  document.getElementById("reserveForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const people = document.getElementById("people").value;
    const date = document.getElementById("date").value.trim() || "Da concordare";
    const time = document.getElementById("time").value;
    const notes = document.getElementById("notes").value.trim() || "Nessuna";
    if (!name) return;
    const msg = [`Buonasera, sono ${name}.`,"","Vorrei richiedere un tavolo da OMBRA.",`Persone: ${people}`,`Data: ${date}`,`Orario: ${time}`,`Note/allergie: ${notes}`].join("\n");
    window.open(`https://wa.me/393519927137?text=${encodeURIComponent(msg)}`,"_blank","noopener,noreferrer");
  });

  const start = () => {
    if (!window.gsap || !window.ScrollTrigger || reduced) { hideLoader(); return; }
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({onComplete:()=>{loader.remove();initScroll();}});
    tl.from(".loader-ring",{scale:.2,opacity:0,duration:.7,ease:"power3.out"})
      .from(".loader span",{y:40,opacity:0,duration:.6},.2)
      .to(".loader-ring",{scale:1.4,opacity:0,duration:.55},1)
      .to(".loader span,.loader p",{opacity:0,duration:.25},1.05)
      .to(loader,{yPercent:-100,duration:.85,ease:"power4.inOut"},1.25)
      .from(".hero h1 span,.hero h1 em",{yPercent:110,duration:1,stagger:.12,ease:"power4.out"},1.45)
      .from(".eyebrow,.hero-bottom",{y:25,opacity:0,duration:.7,stagger:.12},1.7);
  };

  const initScroll = () => {
    gsap.from(".concept-copy h2",{y:60,opacity:0,duration:1.1,ease:"power3.out",scrollTrigger:{trigger:".concept",start:"top 80%",once:true}});
    gsap.from(".menu-intro>*",{y:45,opacity:0,duration:.8,stagger:.12,scrollTrigger:{trigger:".menu-intro",start:"top 84%",once:true}});
    gsap.from(".dish-visuals",{clipPath:"inset(100% 0 0 0)",duration:1.1,ease:"power4.inOut",scrollTrigger:{trigger:".dish-visuals",start:"top 84%",once:true}});
    gsap.from(".chef-image",{clipPath:"inset(0 100% 0 0)",duration:1.15,ease:"power4.inOut",scrollTrigger:{trigger:".chef",start:"top 80%",once:true}});
    gsap.from(".space-gallery>*",{y:55,opacity:0,duration:.8,stagger:.12,scrollTrigger:{trigger:".space-gallery",start:"top 84%",once:true}});
    gsap.to(".hero-video",{scale:1.08,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}});
    gsap.to(".interlude video",{scale:1.12,ease:"none",scrollTrigger:{trigger:".interlude",start:"top bottom",end:"bottom top",scrub:true}});
    ScrollTrigger.refresh();
  };

  if (document.readyState === "complete") start();
  else window.addEventListener("load",start,{once:true});
  setTimeout(()=>{if(loader&&document.body.contains(loader)&&(!window.gsap||reduced))hideLoader()},3500);
})();