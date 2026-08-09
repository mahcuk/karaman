const CACHE='karaman-gezi-v14';
const ASSETS=['./','./index.html','./manifest.json','./icon.svg','./override.js','./route-fix.js','./route-final.js','./final-fix.js'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.pathname.endsWith('/index.html')||url.pathname.endsWith('/')){
  event.respondWith(fetch(event.request,{cache:'no-store'}).then(async r=>{
   if(!r.ok)throw new Error('network');
   const text=await r.text();
   const patch=`<script src="./override.js?v=14"></script><script src="./route-fix.js?v=14"></script><script src="./route-final.js?v=14"></script><script src="./final-fix.js?v=14"></script><script>(function(){const K='karaman-current-day';function restore(){try{const d=localStorage.getItem(K);if(d&&typeof window.setDay==='function')window.setDay(d)}catch(e){}}document.addEventListener('click',function(e){const b=e.target.closest&&e.target.closest('.days button');if(b){try{localStorage.setItem(K,b.textContent.trim())}catch(e){}}},true);if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',restore,{once:true})}else{restore()}})();</script></body>`;
   const enhanced=text.replace('</body>',patch);
   const response=new Response(enhanced,{status:r.status,statusText:r.statusText,headers:r.headers});
   caches.open(CACHE).then(c=>c.put(event.request,response.clone()));
   return response;
  }).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html'))));
  return;
 }
 event.respondWith(caches.match(event.request).then(r=>r||fetch(event.request).then(x=>{const copy=x.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return x}).catch(()=>caches.match('./index.html'))));
});