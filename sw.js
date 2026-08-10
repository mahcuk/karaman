const CACHE='karaman-gezi-v20';

// Emergency recovery Service Worker.
// The previous versions injected update.js into the application and caused
// an update/reload loop. This version deliberately does not inject scripts.
const ASSETS=['./','./index.html','./manifest.json','./icon.svg'];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(ASSETS))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
    // This recovery worker unregisters itself after cleaning the old worker.
    // The application then runs directly from the network without a PWA
    // update loop. LocalStorage is never touched here.
    await self.registration.unregister();
  })());
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);

  // Never rewrite/inject application HTML or JavaScript.
  if(url.origin===location.origin){
    event.respondWith(
      fetch(event.request,{cache:'no-store'})
        .catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html')))
    );
  }
});
