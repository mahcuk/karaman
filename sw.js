const CACHE='karaman-gezi-v2';
const ASSETS=['./','./index.html','./manifest.json','./icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(caches.match(event.request).then(r=>r||fetch(event.request).then(x=>{const copy=x.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return x}).catch(()=>caches.match('./index.html'))))});