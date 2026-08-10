(()=>{
const DAY_KEY='karaman-current-day';
const VERSION='17';
let reloading=false;

function installDayPersistence(){
  const original=window.setDay;
  if(typeof original==='function'&&!original.__persisted){
    const wrapped=function(d){
      localStorage.setItem(DAY_KEY,d);
      return original(d);
    };
    wrapped.__persisted=true;
    window.setDay=wrapped;
  }

  const saved=localStorage.getItem(DAY_KEY);
  if(saved&&window.DAYS&&window.DAYS[saved]&&typeof window.setDay==='function'&&window.day!==saved){
    window.setDay(saved);
  }
}

function addUpdateUI(reg){
  let box=document.getElementById('appUpdateBox');
  if(!box){
    box=document.createElement('div');
    box.id='appUpdateBox';
    box.style.cssText='position:fixed;left:10px;right:10px;bottom:70px;z-index:99999;background:#15191e;color:#fff;border-radius:14px;padding:13px;box-shadow:0 5px 25px #0005;font:600 13px system-ui;display:none;pointer-events:auto';
    box.innerHTML='<div id="appUpdateText" style="margin-bottom:8px">Yeni sürüm hazır. Gezi verileriniz korunacaktır.</div><button id="appUpdateBtn" type="button" style="width:100%;border:0;border-radius:10px;padding:12px;font-weight:800;cursor:pointer">GÜNCELLE VE YENİDEN AÇ</button>';
    document.body.appendChild(box);
  }

  const show=()=>{
    box.style.display='block';
    box.style.visibility='visible';
  };

  if(reg.waiting) show();

  reg.addEventListener('updatefound',()=>{
    const worker=reg.installing;
    if(!worker)return;
    worker.addEventListener('statechange',()=>{
      if(worker.state==='installed'&&navigator.serviceWorker.controller) show();
    });
  });

  const btn=box.querySelector('#appUpdateBtn');
  if(btn&&!btn.dataset.bound){
    btn.dataset.bound='1';
    btn.addEventListener('click',async()=>{
      btn.disabled=true;
      btn.textContent='GÜNCELLENİYOR…';
      const text=box.querySelector('#appUpdateText');
      if(text)text.textContent='Yeni sürüm etkinleştiriliyor…';

      try{
        await reg.update();
        const waiting=reg.waiting;
        if(waiting){
          waiting.postMessage({type:'SKIP_WAITING'});
          return;
        }

        const installing=reg.installing;
        if(installing){
          installing.addEventListener('statechange',()=>{
            if(installing.state==='installed'&&navigator.serviceWorker.controller){
              installing.postMessage({type:'SKIP_WAITING'});
            }
          });
          return;
        }

        if(text)text.textContent='Güncelleme bulunamadı. Tekrar deneyin.';
        btn.disabled=false;
        btn.textContent='TEKRAR DENE';
      }catch(e){
        if(text)text.textContent='Güncelleme başarısız. İnternet bağlantısını kontrol edip tekrar deneyin.';
        btn.disabled=false;
        btn.textContent='TEKRAR DENE';
      }
    });
  }
}

function register(){
  if(!('serviceWorker'in navigator))return;

  navigator.serviceWorker.register('./sw.js?v='+VERSION,{updateViaCache:'none'}).then(reg=>{
    addUpdateUI(reg);
    reg.update().catch(()=>{});

    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      if(reloading)return;
      reloading=true;
      setTimeout(()=>location.reload(),150);
    });
  }).catch(()=>{});
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>{
    installDayPersistence();
    register();
  });
}else{
  installDayPersistence();
  register();
}
})();
