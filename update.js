(()=>{
  // v20 — Service Worker güncelleme/yenileme döngüsünü kes.
  // Bu dosya uygulamayı ASLA otomatik yenilemez.
  // Gezi verileri ve localStorage korunur.
  const KEY='karaman-sw-cleaned-v20';

  async function disableOldServiceWorkers(){
    if(!('serviceWorker' in navigator)) return;
    if(localStorage.getItem(KEY)==='1') return;

    try{
      const regs=await navigator.serviceWorker.getRegistrations();
      for(const reg of regs){
        try{ await reg.unregister(); }catch(e){}
      }

      if('caches' in window){
        const names=await caches.keys();
        for(const name of names){
          try{ await caches.delete(name); }catch(e){}
        }
      }

      localStorage.setItem(KEY,'1');
      console.info('Eski Service Worker devre dışı bırakıldı. Otomatik yenileme yapılmayacak.');
    }catch(e){
      console.warn('Service Worker temizlenemedi:',e);
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',disableOldServiceWorkers,{once:true});
  }else{
    disableOldServiceWorkers();
  }
})();
