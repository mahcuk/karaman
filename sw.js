const CACHE='karaman-gezi-v17';
const ASSETS=['./','./index.html','./manifest.json','./icon.svg','./update.js','./override.js','./route-fix.js','./route-final.js','./final-fix.js','./time-control.js'];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(ASSETS))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;

  const url=new URL(event.request.url);
  const isAppShell=url.pathname.endsWith('/sw.js') ||
                    url.pathname.endsWith('/update.js') ||
                    url.pathname.endsWith('/index.html') ||
                    url.pathname.endsWith('/');

  if(isAppShell){
    event.respondWith(
      fetch(event.request,{cache:'no-store'})
        .then(async response=>{
          if(!response.ok) throw new Error('network');

          if(url.pathname.endsWith('/sw.js') || url.pathname.endsWith('/update.js')){
            return response;
          }

          const html=await response.text();
          const finalHtml=html.includes('./update.js')
            ? html
            : html.replace('</body>','<script src="./update.js?v=17"></script></body>');

          const result=new Response(finalHtml,{
            status:response.status,
            statusText:response.statusText,
            headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}
          });

          caches.open(CACHE).then(c=>c.put(event.request,result.clone()));
          return result;
        })
        .catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cached=>cached || fetch(event.request).then(response=>{
        if(response.ok){
          const copy=response.clone();
          caches.open(CACHE).then(c=>c.put(event.request,copy));
        }
        return response;
      }).catch(()=>caches.match('./index.html')))
  );
});
