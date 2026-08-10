(()=>{
const DAY_KEY='karaman-current-day';
const VERSION='14';
function installDayPersistence(){
  const original=window.setDay;
  if(typeof original==='function'){
    window.setDay=function(d){localStorage.setItem(DAY_KEY,d);return original(d)};
  }
  const saved=localStorage.getItem(DAY_KEY);
  if(saved&&window.DAYS&&window.DAYS[saved]&&typeof window.setDay==='function'){
    window.setDay(saved);
  }
}
function addUpdateUI(reg){
  const box=document.createElement('div');
  box.id='appUpdateBox';
  box.style.cssText='position:fixed;left:10px;right:10px;bottom:70px;z-index:9999;background:#15191e;color:#fff;border-radius:14px;padding:12px;box-shadow:0 5px 25px #0005;font:600 13px system-ui;display:none';
  box.innerHTML='<div style="margin-bottom:8px">Yeni sürüm hazır. Gezi verileriniz korunacaktır.</div><button id="appUpdateBtn" style="width:100%;border:0;border-radius:10px;padding:11px;font-weight:800">Güncelle ve yeniden aç</button>';
  document.body.appendChild(box);
  const show=()=>{box.style.display='block'};
  if(reg.waiting)show();
  reg.addEventListener('updatefound',()=>{
    const worker=reg.installing;
    if(!worker)return;
    worker.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)show()});
  });
  document.getElementById('appUpdateBtn').onclick=()=>{
    if(reg.waiting){reg.waiting.postMessage({type:'SKIP_WAITING'});}
    else{reg.update().then(()=>setTimeout(()=>location.reload(),700)).catch(()=>location.reload())}
  };
}
function register(){
 if(!('serviceWorker'in navigator))return;
 navigator.serviceWorker.register('./sw.js?v='+VERSION).then(reg=>{
   reg.update().catch(()=>{});
   addUpdateUI(reg);
   navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload());
 }).catch(()=>{});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{installDayPersistence();register()});else{installDayPersistence();register()}
})();