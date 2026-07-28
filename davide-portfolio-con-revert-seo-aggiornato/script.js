window.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('year').textContent=new Date().getFullYear();
  const loader=document.querySelector('.page-loader');
  const toggle=document.querySelector('.menu-toggle');
  const menu=document.querySelector('.mobile-menu');
  let open=false;
  const setMenu=(state)=>{open=state;toggle.setAttribute('aria-expanded',String(state));menu.setAttribute('aria-hidden',String(!state));document.body.style.overflow=state?'hidden':'';if(window.gsap){gsap.to(menu,{y:state?'0%':'-100%',autoAlpha:state?1:0,duration:.65,ease:'power4.inOut'});}else{menu.style.transform=state?'translateY(0)':'translateY(-100%)';menu.style.visibility=state?'visible':'hidden';}};
  toggle.addEventListener('click',()=>setMenu(!open));
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));

  const onScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress').style.width=(max>0?(scrollY/max)*100:0)+'%';};
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  if(!window.gsap||matchMedia('(prefers-reduced-motion: reduce)').matches){loader.style.display='none';document.querySelectorAll('.reveal').forEach(el=>{el.style.opacity=1;el.style.transform='none'});return;}
  gsap.registerPlugin(ScrollTrigger);
  const intro=gsap.timeline({defaults:{ease:'power3.out'}});
  intro.to('.loader-track span',{width:'100%',duration:.8}).to('.loader-mark',{y:-15,opacity:0,duration:.35},'-=.1').to(loader,{yPercent:-100,duration:.8,ease:'power4.inOut'}).set(loader,{display:'none'}).from('.hero-title .line>span',{yPercent:115,duration:1.05,stagger:.11},'-=.25').to('.hero .reveal',{opacity:1,y:0,duration:.7,stagger:.12},'-=.55');
  gsap.utils.toArray('.reveal:not(.hero .reveal)').forEach(el=>gsap.to(el,{opacity:1,y:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
  gsap.utils.toArray('.split-text').forEach(el=>gsap.from(el,{y:55,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 82%',once:true}}));
  gsap.utils.toArray('.project-visual').forEach(el=>gsap.from(el,{clipPath:'inset(14% 0 0 0 round 28px)',scale:.96,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 83%',once:true}}));
  gsap.to('.hero-title',{yPercent:13,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  let last=0;const header=document.querySelector('.site-header');ScrollTrigger.create({start:0,end:'max',onUpdate:self=>{const y=self.scroll();if(y>last&&y>130)header.style.transform='translateY(-110%)';else header.style.transform='translateY(0)';last=y;}});
});

// Keep every embedded demo at the same desktop viewport and scale it to the card.
(() => {
  const VIEWPORT_WIDTH = 1440;
  const sizePreview = (shell) => {
    const iframe = shell.querySelector('iframe');
    if (!iframe) return;
    const scale = shell.clientWidth / VIEWPORT_WIDTH;
    iframe.style.transform = `scale(${scale})`;
  };
  const shells = [...document.querySelectorAll('.live-preview-shell')];
  const observer = new ResizeObserver(entries => entries.forEach(entry => sizePreview(entry.target)));
  shells.forEach(shell => { sizePreview(shell); observer.observe(shell); });
})();
