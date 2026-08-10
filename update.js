(()=>{
  // v19 — Güncelleme döngüsünü tamamen kaldır.
  // Uygulama artık Service Worker tarafından otomatik güncellenmeye çalışılmaz.
  // Mevcut eski Service Worker bir kez temizlenir; gezi verileri/localStorage korunur.
  const CLEAN_KEY='karaman-sw-cleaned-v19';

  async function cleanupOldServiceWorker(){
    if(!('serviceWorker' in navigator)) return;
    if(sessionStorage.getItem(CLEAN_KEY)==='1') return;

    try{
      const regs=await navigator.serviceWorker.getRegistrations();
      if(!regs.length) return;

      sessionStorage.setItem(CLEAN_KEY,'1');

      await Promise.all(regs.map(r=>r.unregister().catch(()=>false)));

      if('caches' in window){
        const names=await caches.keys();
        await Promise.all(names.map(n=>caches.delete(n).catch(()=>false)));
      }

      // Unregister tamamlandıktan sonra yalnızca bir kez yeniden aç.
      // Uygulama verilerine dokunulmaz.
      setTimeout(()=>location.reload(),200);
    }catch(e){
      // Temizlik başarısızsa otomatik yenileme yapma; sonsuz döngü oluşmasın.
      console.warn('Service Worker temizliği başarısız:',e);
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',cleanupOldServiceWorker,{once:true});
  }else{
    cleanupOldServiceWorker();
  }
})();
