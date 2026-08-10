const CACHE='karaman-gezi-v14';
const ASSETS=['./','./index.html','./manifest.json','./icon.svg','./update.js','./override.js','./route-fix.js','./route-final.js','./final-fix.js','./time-control.js'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('message',event=>{if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.pathname.endsWith('/index.html')||url.pathname.endsWith('/')){
  event.respondWith(fetch(event.request,{cache:'no-store'}).then(async r=>{
   if(!r.ok)throw new Error('network');
   let html=await r.text();
   if(!html.includes('./update.js'))html=html.replace('</body>','<script src="./update.js?v=14"></script></body>');
   const response=new Response(html,{status:r.status,statusText:r.statusText,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
   caches.open(CACHE).then(c=>c.put(event.request,response.clone()));
   return response;
  }).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html'))));
  return;
 }
 event.respondWith(caches.match(event.request).then(r=>r||fetch(event.request).then(x=>{const copy=x.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return x}).catch(()=>caches.match('./index.html'))));
});