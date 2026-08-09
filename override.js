(function(){
'use strict';

const CUSTOM_KEY='karamanCustomStopsV7';

function loadCustom(){
  try{
    const now=JSON.parse(localStorage.getItem(CUSTOM_KEY)||'null');
    if(now&&typeof now==='object') return now;
    const old=JSON.parse(localStorage.getItem('karamanCustomStopsV6')||'{}');
    const migrated={};
    Object.keys(old||{}).forEach(function(d){
      migrated[d]=(old[d]||[]).filter(function(x){return !/binbir/i.test(x.name||'')}).map(function(x){
        return {
          id:x.id||d+'_custom_'+Date.now()+Math.random(),
          name:x.name||'Ek durak',
          place:x.place||x.name,
          desc:x.desc||'Kısa ziyaret ve fotoğraf molası.',
          stay:Math.max(5,+x.stay||30),
          travelBefore:Math.max(0,+x.travel||20),
          travelAfter:0,
          afterId:'b'+Math.max(0,+x.after||0),
          created:x.created||Date.now()
        };
      });
    });
    localStorage.setItem(CUSTOM_KEY,JSON.stringify(migrated));
    return migrated;
  }catch(e){return {}}
}
function saveCustom(x){localStorage.setItem(CUSTOM_KEY,JSON.stringify(x));}

function injectBinbir(){
  if(!DATA.Pazartesi||!DATA.Pazartesi.stops) return;
  if(DATA.Pazartesi.stops.some(function(s){return /binbir kilise/i.test(s[0]);})) return;
  const s=DATA.Pazartesi.stops;
  const idx=s.findIndex(function(x){return /Öğle yemeği/.test(x[0]);});
  const binbir=['Binbir Kilise (Madenşehri)','12:55','13:45','drive','Binbir Kilise, Madenşehri, Karaman','Karadağ eteklerindeki Binbir Kilise kalıntılarını sakin tempoda görün. Bölge açık alandadır; su, şapka ve uygun ayakkabı bulundurun. Yıkıntılara tırmanmayın.'];
  if(idx>=0){
    s.splice(idx,0,binbir);
    const shift=50;
    for(let i=idx+1;i<s.length;i++){
      const a=s[i];
      if(/Öğle yemeği/.test(a[0])){a[1]=fmt(min(a[1])+shift);a[2]=fmt(min(a[2])+shift);}
      else if(/Taşkale/.test(a[0])){a[1]=fmt(min(a[1])+shift);a[2]=fmt(min(a[2])+shift);}
      else if(/Manazan/.test(a[0])){a[1]=fmt(min(a[1])+shift);a[2]=fmt(min(a[2])+shift);}
      else if(/Karaman’a dönüş/.test(a[0])){a[1]=fmt(min(a[1])+shift);a[2]=fmt(min(a[2])+shift);}
    }
  }
}

function baseId(i){return 'b'+i;}
function minute(t){return min(t);}
function stayFor(name,type){
  const n=(name+' '+(type||'')).toLowerCase();
  if(/cami|mescit|türbe|türbesi/.test(n)) return 25;
  if(/müze|museum/.test(n)) return 45;
  if(/kale|hisar/.test(n)) return 45;
  if(/şelale|şelalesi|mesire|park|göl|baraj|dere|doğa/.test(n)) return 60;
  if(/pazar|çarşı|çarşi|alışveriş/.test(n)) return 60;
  if(/lokanta|restoran|yemek|kebap|kahvaltı/.test(n)) return 75;
  if(/kilise|ören|manastır|antik|arkeoloji|höyük/.test(n)) return 50;
  return 40;
}

async function geocode(place){
  const qs=[place+', Karaman, Türkiye',place+', Türkiye'];
  for(const q of qs){
    try{
      const u='https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=tr&q='+encodeURIComponent(q);
      const r=await fetch(u,{headers:{'Accept-Language':'tr'}});
      if(!r.ok) continue;
      const a=await r.json();
      if(a&&a.length) return {lat:+a[0].lat,lon:+a[0].lon,label:a[0].display_name||place,type:a[0].type||''};
    }catch(e){}
  }
  throw new Error('Yer bulunamadı: '+place);
}

async function route(a,b){
  try{
    const u='https://router.project-osrm.org/route/v1/driving/'+a.lon+','+a.lat+';'+b.lon+','+b.lat+'?overview=false';
    const r=await fetch(u);
    if(!r.ok) throw new Error('route');
    const j=await r.json();
    if(j.code!=='Ok'||!j.routes||!j.routes[0]) throw new Error('route');
    return {minutes:Math.max(1,Math.ceil(j.routes[0].duration/60)+5),km:Math.round(j.routes[0].distance/100)/10};
  }catch(e){return {minutes:20,km:null};}
}

function buildDay(d){
  const custom=loadCustom()[d]||[];
  const children={};
  custom.forEach(function(c){
    if(!children[c.afterId]) children[c.afterId]=[];
    children[c.afterId].push(c);
  });
  Object.keys(children).forEach(function(k){children[k].sort(function(a,b){return (a.created||0)-(b.created||0);});});
  const items=[];
  function addChildren(id){
    (children[id]||[]).forEach(function(c){
      items.push({id:c.id,custom:true,c:c,x:[c.name,'','', 'drive',c.place,c.desc,'']});
      addChildren(c.id);
    });
  }
  const base=DATA[d].stops;
  for(let i=0;i<base.length;i++){
    const x=base[i].slice();
    x._id=baseId(i);
    items.push({id:x._id,custom:false,x:x,baseIndex:i});
    addChildren(x._id);
  }

  let currentEnd=null;
  let prev=null;
  const origins={};
  items.forEach(function(it,index){
    if(it.custom){
      const travel=Math.max(0,+it.c.travelBefore||20);
      const st=(currentEnd==null?9*60:currentEnd)+travel;
      const en=st+Math.max(5,+it.c.stay||30);
      it.x[1]=fmt(st);it.x[2]=fmt(en);it.x[6]=(it.c.stay||30)+' dk ziyaret • '+travel+' dk yol'+(it.c.travelKm!=null?' • '+it.c.travelKm+' km':'');
    }else{
      const plannedS=minute(it.x[1]);
      const plannedE=minute(it.x[2]);
      const dur=(plannedE-plannedS+1440)%1440;
      let st=plannedS;
      if(prev&&prev.custom){st=Math.max(plannedS,currentEnd+(+prev.c.travelAfter||20));}
      else if(currentEnd!=null){st=Math.max(plannedS,currentEnd);}
      it.x[1]=fmt(st);it.x[2]=fmt(st+dur);
    }
    origins[it.x[4]]=prev?prev.x[4]:START;
    currentEnd=minute(it.x[2]);
    prev=it;
  });
  return {items:items,origins:origins};
}

function apply(){
  injectBinbir();
  window.__KARAMAN_ORDER={};
  window.__KARAMAN_ITEMS={};
  window.__KARAMAN_ORIGINS={};
  Object.keys(DATA).forEach(function(d){
    const built=buildDay(d);
    DATA[d].stops=built.items.map(function(it){return it.x;});
    window.__KARAMAN_ORDER[d]=built.items.map(function(it){return it.id;});
    window.__KARAMAN_ITEMS[d]=built.items;
    window.__KARAMAN_ORIGINS[d]=built.origins;
  });
}

function styleAdd(){
  const sec=document.querySelector('.add');
  if(!sec) return;
  const lead=sec.querySelector('.lead');
  if(lead) lead.innerHTML='Sadece <b>gitmek istediğiniz yerin adını</b> yazın. Adresi, yol süresini, kalış süresini veya açıklamayı bilmenize gerek yok. Sistem yeri haritada bulur, bulunduğunuz son noktadan rotayı hesaplar, uygun ziyaret süresini belirler ve durağı oraya yerleştirir.';
  const place=document.getElementById('newPlace');
  const travel=document.getElementById('travel');
  const stay=document.getElementById('stay');
  const desc=document.getElementById('newDesc');
  [place,travel,stay,desc].forEach(function(el){if(el)el.style.display='none';});
  const name=document.getElementById('newName');
  if(name) name.placeholder='Örn. Binbir Kilise, Çeşmeli Kilise, Hatuniye Medresesi...';
  const btn=sec.querySelector('button');
  if(btn) btn.textContent='🧭 Yeri bul, rotaya ekle ve saatleri hesapla';
  const warn=sec.querySelector('.warning');
  if(warn) warn.textContent='Sistem yol süresini harita verisine göre hesaplar; ziyaret süresini yerin türüne göre makul bir süre olarak belirler. Sahadaki gerçek durum her zaman önceliklidir.';
}

function currentAnchor(){
  const order=window.__KARAMAN_ORDER[day]||[];
  const items=window.__KARAMAN_ITEMS[day]||[];
  let active=-1,last=-1;
  for(let i=0;i<items.length;i++){
    const st=state[key(day,i)]||{};
    if(st.active) active=i;
    if(st.done||st.skip) last=i;
  }
  const idx=active>=0?active:(last>=0?last:0);
  return {idx:idx,id:order[idx]||'b0',item:items[idx]||items[0]};
}

window.addStop=async function(){
  const name=(document.getElementById('newName')?.value||'').trim();
  if(!name){alert('Sadece gitmek istediğiniz yerin adını yazın.');return;}
  const btn=document.querySelector('.add button');
  if(btn){btn.disabled=true;btn.textContent='⏳ Yer aranıyor ve rota hesaplanıyor...';}
  try{
    const anchor=currentAnchor();
    const target=await geocode(name);
    const from=await geocode(anchor.item.x[4]);
    const before=await route(from,target);
    const order=window.__KARAMAN_ORDER[day]||[];
    const items=window.__KARAMAN_ITEMS[day]||[];
    const pos=order.indexOf(anchor.id);
    const next=pos>=0?items[pos+1]:null;
    let afterRoute={minutes:0,km:null};
    if(next) afterRoute=await route(target,await geocode(next.x[4]));
    const stay=stayFor(name,target.type);
    const desc=(function(){
      const n=(name+' '+target.type).toLowerCase();
      if(/cami|türbe|mescit/.test(n)) return 'Kısa ziyaret, mimari inceleme ve sakin bir oturma molası. Grup giriş ve çıkışta yeniden toplansın.';
      if(/müze/.test(n)) return 'Müze ziyareti. Yaşlı misafirler için oturma noktalarını kullanın; ziyaret sonunda grup yeniden toplansın.';
      if(/kilise|ören|manastır|antik|höyük/.test(n)) return 'Tarihî alan ziyareti. Açık alanda kontrollü yürüyüş, fotoğraf ve kısa tarih anlatımı. Yıkıntılara tırmanmayın.';
      if(/şelale|park|mesire|göl|baraj|doğa/.test(n)) return 'Manzara, fotoğraf ve dinlenme. Kaygan veya yüksek riskli bölgelere yaklaşmadan kontrollü tempo.';
      if(/pazar|çarşı|alışveriş/.test(n)) return 'Serbest dolaşım ve alışveriş. Grup dağılmasın; buluşma noktası belirleyin.';
      return 'Ziyaret, fotoğraf ve grubun ihtiyacına göre kısa dinlenme. Yaşlı misafirlerin temposunu koruyun.';
    })();

    const all=loadCustom();
    if(!all[day])all[day]=[];
    const c={
      id:day+'_custom_'+Date.now(),
      name:name,
      place:target.label||name,
      desc:desc,
      stay:stay,
      travelBefore:before.minutes,
      travelKm:before.km,
      travelAfter:afterRoute.minutes,
      afterId:anchor.id,
      created:Date.now()
    };

    // If the new stop is inserted before an existing custom stop, reroute that existing stop from the new place.
    if(next&&next.custom){
      next.c.travelBefore=afterRoute.minutes;
      next.c.travelKm=null;
    }
    // If the anchor itself is a custom stop, its outgoing route now ends at the new stop.
    if(anchor.item&&anchor.item.custom){
      const anchorCustom=all[day].find(function(x){return x.id===anchor.id;});
      if(anchorCustom) anchorCustom.travelAfter=before.minutes;
    }
    all[day].push(c);
    // Persist any updated existing custom route before rebuilding.
    saveCustom(all);
    apply();
    if(typeof render==='function') render();
    styleAdd();
    const built=window.__KARAMAN_ITEMS[day]||[];
    const added=built.find(function(x){return x.id===c.id;});
    alert(name+' eklendi. '+(added?'Yeni plan saati: '+added.x[1]+' – '+added.x[2]+'. ':'')+'Önceki duraktan yaklaşık '+before.minutes+' dk / '+(before.km!=null?before.km+' km':'mesafe')+' yol. Ziyaret için '+stay+' dk ayrıldı.');
  }catch(e){
    alert('Bu yeri haritada bulamadım. Yer adını biraz daha açık yazın. Örneğin "Binbir Kilise, Madenşehri" gibi.');
  }finally{
    styleAdd();
    if(btn){btn.disabled=false;btn.textContent='🧭 Yeri bul, rotaya ekle ve saatleri hesapla';}
  }
};

const originalRender=window.render;
window.render=function(){
  originalRender();
  setTimeout(styleAdd,0);
};

window.mapUrl=function(place){
  const origin=(window.__KARAMAN_ORIGINS[day]||{})[place]||START;
  return 'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(origin)+'&destination='+encodeURIComponent(place)+'&travelmode=driving';
};

apply();
if(typeof window.render==='function') window.render();
styleAdd();
})();
