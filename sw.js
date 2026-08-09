const CACHE='karaman-gezi-v5';
const ASSETS=['./','./index.html','./manifest.json','./icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));

function enhance(text){
  text=text.replaceAll('İkinci İstasyon Caddesi No:241','İstasyon Caddesi 241 Sokak No:6');
  const old='<section class="card"><h3>🧭 Günlük kontrol listesi</h3><div class="tips"><div class="tip">☐ Su ve kişisel ihtiyaçlar kontrol edildi.</div><div class="tip">☐ Araç anahtarı / telefon / şarj kontrol edildi.</div><div class="tip">☐ Yaşlı misafirlerin yorgunluk durumu kontrol edildi.</div><div class="tip">☐ Bir sonraki durağın açılış ve yol durumu kontrol edildi.</div><div class="tip">☐ Gün sonunda ek durak eklenmedi; dönüş saati korunuyor.</div></div></section>';
  const replacement='<section class="card checklist-card"><h3>🧭 Günlük kontrol listesi</h3><div class="tips"><label class="tip checkrow"><input type="checkbox" data-check="water"><span>Su ve kişisel ihtiyaçlar kontrol edildi.</span></label><label class="tip checkrow"><input type="checkbox" data-check="car"><span>Araç anahtarı / telefon / şarj kontrol edildi.</span></label><label class="tip checkrow"><input type="checkbox" data-check="elder"><span>Yaşlı misafirlerin yorgunluk durumu kontrol edildi.</span></label><label class="tip checkrow"><input type="checkbox" data-check="next"><span>Bir sonraki durağın açılış ve yol durumu kontrol edildi.</span></label><label class="tip checkrow"><input type="checkbox" data-check="end"><span>Gün sonunda ek durak eklenmedi; dönüş saati korunuyor.</span></label></div></section>';
  text=text.replace(old,replacement);
  const extra='<style>.checkrow{display:flex;align-items:center;gap:10px;cursor:pointer;user-select:none}.checkrow input{width:24px;height:24px;min-width:24px;accent-color:#2f7d46}.checkrow:has(input:checked){background:#e4f2e6;text-decoration:line-through}.checkrow span{flex:1}</style><script>(function(){function initChecks(){document.querySelectorAll("input[data-check]").forEach(function(c){var k="karamanCheck_"+c.dataset.check;c.checked=localStorage.getItem(k)==="1";c.addEventListener("change",function(){localStorage.setItem(k,c.checked?"1":"0")})})}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initChecks);else initChecks()})();<\/script>';
  return text.replace('</head>',extra+'</head>');
}
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.pathname.endsWith('/index.html') || url.pathname.endsWith('/')){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(async r=>{
      if(!r.ok)throw new Error('network');
      const text=await r.text();
      const enhanced=enhance(text);
      const response=new Response(enhanced,{status:r.status,statusText:r.statusText,headers:r.headers});
      caches.open(CACHE).then(c=>c.put(event.request,response.clone()));
      return response;
    }).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(event.request).then(r=>r||fetch(event.request).then(x=>{const copy=x.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return x}).catch(()=>caches.match('./index.html'))));
});