(function(){
  const DAY_KEY='karaman-v12-day';
  const savedDay=localStorage.getItem(DAY_KEY);

  function patchSameLocationRoutes(){
    document.querySelectorAll('.stop').forEach(card=>{
      const metas=card.querySelectorAll('.meta');
      const route=card.querySelector('a.route');
      if(!route||metas.length<2)return;
      const text=(metas[1].textContent||'').trim();
      const parts=text.split(' → ');
      if(parts.length===2 && parts[0].trim()===parts[1].trim()){
        route.removeAttribute('href');
        route.removeAttribute('target');
        route.textContent='📍 Aynı konum — rota gerekmiyor';
        route.style.background='#66717c';
        route.style.cursor='default';
        route.onclick=e=>e.preventDefault();
      }
    });
  }

  function install(){
    if(typeof window.setDay==='function' && !window.__dayPersistenceInstalled){
      const originalSetDay=window.setDay;
      window.setDay=function(d){
        localStorage.setItem(DAY_KEY,d);
        return originalSetDay(d);
      };
      window.__dayPersistenceInstalled=true;
      if(savedDay && savedDay!==document.querySelector('.days button.active')?.textContent?.trim()){
        window.setDay(savedDay);
      }
    }
    patchSameLocationRoutes();
  }

  const observer=new MutationObserver(()=>patchSameLocationRoutes());
  observer.observe(document.body,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
