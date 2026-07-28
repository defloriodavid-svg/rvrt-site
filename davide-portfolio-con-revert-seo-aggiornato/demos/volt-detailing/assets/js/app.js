(() => {
  "use strict";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const loader = document.getElementById("loader");
  const count = document.getElementById("loaderCount");
  const menu = document.getElementById("mobileMenu");
  const toggle = document.getElementById("menuToggle");

  const hideLoader = () => {
    if (!loader) return;
    loader.style.opacity = "0";
    loader.style.visibility = "hidden";
    setTimeout(() => loader.remove(), 350);
  };

  let menuOpen = false;
  const setMenu = open => {
    document.body.classList.toggle("menu-open", open);
    if (window.gsap && !reduced) {
      gsap.to(menu,{y:open?"0%":"-101%",autoAlpha:open?1:0,duration:.7,ease:"power4.inOut"});
    } else {
      menu.style.transform = open ? "translateY(0)" : "translateY(-101%)";
      menu.style.visibility = open ? "visible" : "hidden";
    }
  };
  toggle.addEventListener("click",()=>{menuOpen=!menuOpen;setMenu(menuOpen)});
  menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{menuOpen=false;setMenu(false)}));

  // Before/after slider
  const box = document.getElementById("compareBox");
  const before = document.getElementById("compareBefore");
  const line = document.getElementById("compareLine");
  let dragging = false;

  const updateCompare = clientX => {
    const rect = box.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const pct = x / rect.width * 100;
    before.style.width = `${pct}%`;
    line.style.left = `${pct}%`;
  };

  box.addEventListener("pointerdown",e=>{dragging=true;box.setPointerCapture(e.pointerId);updateCompare(e.clientX)});
  box.addEventListener("pointermove",e=>{if(dragging)updateCompare(e.clientX)});
  box.addEventListener("pointerup",()=>dragging=false);
  box.addEventListener("pointercancel",()=>dragging=false);

  // Work filtering
  document.querySelectorAll(".work-filter button").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelector(".work-filter button.active")?.classList.remove("active");
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      document.querySelectorAll(".work-grid figure").forEach(fig=>{
        const visible = filter === "all" || fig.dataset.category === filter;
        if (window.gsap && !reduced) {
          gsap.to(fig,{opacity:visible?1:0,scale:visible?1:.96,duration:.35,display:visible?"block":"none"});
        } else {
          fig.style.display = visible ? "block" : "none";
        }
      });
    });
  });

  // WhatsApp quote
  document.getElementById("quoteForm").addEventListener("submit",e=>{
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const car = document.getElementById("car").value.trim();
    const service = document.getElementById("service").value;
    const notes = document.getElementById("notes").value.trim() || "Nessuna nota";
    if (!name || !car) return;
    const msg = [`Ciao, sono ${name}.`,"","Vorrei richiedere una valutazione per la mia auto.",`Auto: ${car}`,`Servizio: ${service}`,`Condizioni/obiettivo: ${notes}`].join("\n");
    window.open(`https://wa.me/393519927137?text=${encodeURIComponent(msg)}`,"_blank","noopener,noreferrer");
  });

  const start = () => {
    if (!window.gsap || !window.ScrollTrigger || reduced) { hideLoader(); return; }
    gsap.registerPlugin(ScrollTrigger);

    const obj = {v:0};
    const tl = gsap.timeline({onComplete:()=>{loader.remove();initScroll()}});
    tl.to(obj,{v:100,duration:1,onUpdate:()=>count.textContent=String(Math.round(obj.v)).padStart(2,"0")},0)
      .from(".loader-logo",{scale:.65,opacity:0,duration:.65,ease:"power3.out"},0)
      .to(".loader-logo,.loader-meta",{opacity:0,duration:.3},1)
      .to(loader,{yPercent:-100,duration:.8,ease:"power4.inOut"},1.2)
      .from(".hero h1 span,.hero h1 em",{yPercent:120,duration:1,stagger:.12,ease:"power4.out"},1.4)
      .from(".hero-kicker,.hero-bottom",{y:24,opacity:0,duration:.7,stagger:.12},1.65);
  };

  const initScroll = () => {
    gsap.from(".services-head>*",{y:45,opacity:0,duration:.8,stagger:.12,scrollTrigger:{trigger:".services-head",start:"top 84%",once:true}});
    gsap.utils.toArray(".service-panel").forEach((el,i)=>gsap.from(el,{y:55,opacity:0,duration:.8,delay:i*.06,scrollTrigger:{trigger:el,start:"top 88%",once:true}}));
    gsap.from(".compare-box",{clipPath:"inset(0 100% 0 0)",duration:1.15,ease:"power4.inOut",scrollTrigger:{trigger:".compare-box",start:"top 84%",once:true}});
    gsap.utils.toArray(".process-list article").forEach((el,i)=>gsap.from(el,{x:40,opacity:0,duration:.65,delay:i*.04,scrollTrigger:{trigger:el,start:"top 91%",once:true}}));
    gsap.utils.toArray(".package-grid article").forEach((el,i)=>gsap.from(el,{y:55,opacity:0,duration:.8,delay:i*.08,scrollTrigger:{trigger:el,start:"top 88%",once:true}}));
    gsap.to(".hero-video",{scale:1.1,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}});
    ScrollTrigger.refresh();
  };

  if (document.readyState === "complete") start();
  else window.addEventListener("load",start,{once:true});
  setTimeout(()=>{if(loader&&document.body.contains(loader)&&(!window.gsap||reduced))hideLoader()},3500);
})();