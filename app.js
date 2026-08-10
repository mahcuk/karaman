'use strict';
const BUILD='2026.08.10.01';
const START='İstasyon Caddesi 241 Sokak No:6, Karaman, Türkiye';
const COORD={
 [START]:'37.18195,33.22120','Karaman Kalesi, Karaman':'37.182098,33.205250','Aktekke Camii, Karaman':'37.18145,33.21785','Yunus Emre Camii ve Türbesi, Karaman':'37.18240,33.22040','Tartan Konağı, Karaman':'37.18120,33.21830','Mevlana Müzesi, Konya':'37.87135,32.49316','Şems-i Tebrizi Türbesi, Konya':'37.87440,32.49470','Aziziye Camii, Konya':'37.86980,32.49370','Karatay Medresesi, Konya':'37.87040,32.49570','Alaaddin Tepesi, Konya':'37.87290,32.49220','Yerköprü Şelalesi, Hadim, Konya':'37.02867,32.70108','Binbir Kilise, Madenşehri, Karaman':'37.43154,33.11749','Manazan Mağaraları, Karaman':'37.3380,33.1920','Taşkale Tahıl Ambarları, Karaman':'37.0050,33.4280','Ermenek Barajı, Karaman':'36.56806,32.96778'
};
const DAYS={
Pazartesi:{theme:'Karaman tarihi • türbeler • Taşkale • Manazan',tempo:'Orta / kontrollü',stops:[
['Karaman Kalesi','09:15','09:50','Karaman Kalesi, Karaman','Şehre ve kaleye giriş. Kısa seyir ve tarih anlatımı. Yokuşlarda yaşlı misafirleri zorlamayın.'],
['Aktekke Camii / Mümine Hatun Türbesi','10:05','10:35','Aktekke Camii, Karaman','Sakin ziyaret. Cami adabına dikkat; giriş ve çıkışta grup yeniden toplansın.'],
['Yunus Emre Camii ve Türbesi','10:40','11:10','Yunus Emre Camii ve Türbesi, Karaman','Kısa ziyaret, tarih anlatımı ve oturma molası.'],
['Tartan Konağı','11:15','12:00','Tartan Konağı, Karaman','Geleneksel konak mimarisi ve süslemeleri. Ziyaret durumu sahada kontrol edilir.'],
['Öğle yemeği • yöresel tatlar','12:05','13:20','Karaman merkez','Rahat oturma, temiz tuvalet ve servis hızı öncelikli. Calla veya etli ekmek tercih edilebilir.'],
['Binbir Kilise (Madenşehri)','13:55','14:45','Binbir Kilise, Madenşehri, Karaman','Açık hava tarihî alanı. Su, şapka ve uygun ayakkabı. Yıkıntılara tırmanmayın.'],
['Taşkale Tahıl Ambarları','15:15','16:00','Taşkale Tahıl Ambarları, Karaman','Kaya içine oyulmuş ambarları güvenli seyir noktalarından görün.'],
['Manazan Mağaraları','16:15','17:00','Manazan Mağaraları, Karaman','Kaya yerleşimini güvenli erişim noktalarından görün; dar ve riskli yerlere girmeyin.'],
['Karaman’a dönüş • dinlenme','17:00','18:00',START,'Günün son ayağı. Akşamı boş bırakın.']]},
Salı:{theme:'Konya • Mevlâna • Şems • Selçuklu merkezi',tempo:'Orta / şehir içi',stops:[
['Karaman → Konya','08:00','09:30','Mevlana Müzesi, Konya','Tek parça sürüş. İhtiyaç halinde kısa mola.'],
['Mevlâna Müzesi / Dergâh','09:30','11:00','Mevlana Müzesi, Konya','Ana ziyaret. Türbe, dergâh ve avluyu sakin tempoda gezin.'],
['Dinlenme • su • tuvalet','11:00','11:20','Mevlana Müzesi, Konya','Herkesin toplandığını kontrol edin.'],
['Şems-i Tebrizi Türbesi','11:20','12:00','Şems-i Tebrizi Türbesi, Konya','Kısa ziyaret. Yürüyüş zor gelirse araç yaklaşımı tercih edilir.'],
['Aziziye Camii','12:00','12:25','Aziziye Camii, Konya','Kısa mimari durak.'],
['Öğle yemeği • Konya mutfağı','12:30','13:40','Konya merkez','Etli ekmek veya fırın kebabı. Servis hızına göre alternatif seçin.'],
['Karatay Medresesi','13:50','14:35','Karatay Medresesi, Konya','Selçuklu mimarisi ve çini işçiliği.'],
['Alaaddin Tepesi','14:45','15:20','Alaaddin Tepesi, Konya','Kısa seyir ve oturma molası.'],
['Konya → Karaman • dönüş','15:20','17:00',START,'Dönüşten sonra yeni program eklemeyin.']]},
Çarşamba:{theme:'Yerköprü Şelalesi • piknik • serbest doğa',tempo:'Rahat / doğa günü',stops:[
['Karaman → Yerköprü (Hadim/Konya)','09:00','10:30','Yerköprü Şelalesi, Hadim, Konya','Hedef kesin olarak Hadim/Konya Yerköprü Şelalesidir. Mut’taki Yerköprü değildir.'],
['Yerköprü Şelalesi • ziyaret','10:30','11:30','Yerköprü Şelalesi, Hadim, Konya','Seyir alanına kontrollü yürüyüş. Kaygan zemine ve dik kenarlara yaklaşmayın.'],
['Piknik + serbest gezi + dinlenme','11:30','14:30','Yerköprü Şelalesi, Hadim, Konya','Aynı sahada uzun mola: piknik, çay, sohbet, fotoğraf ve kısa serbest dolaşım. Ayrı piknik noktası aramıyoruz.'],
['Yerköprü → Karaman • dönüş','14:30','16:30',START,'İhtiyaç halinde dönüşte kısa mola. Akşamı boş bırakın.']]},
Perşembe:{theme:'Ermenek • Zeyve Pazarı • baraj',tempo:'Uzun yol / rahat',stops:[
['Karaman → Ermenek','08:00','10:15','Ermenek, Karaman','Uzun sürüş. Su ve ihtiyaç kontrolü; gerekirse kısa mola.'],
['Ermenek merkez • mola','10:15','10:50','Ermenek merkez, Karaman','Çay/kahve ve tuvalet molası.'],
['Ermenek → Zeyve Pazarı','10:50','11:35','Zeyve Pazarı, Ermenek, Karaman','Pazar alanına geçiş; grup araçtan indikten sonra toplansın.'],
['Zeyve Pazarı • tanıma','11:35','12:15','Zeyve Pazarı, Ermenek, Karaman','Çınarlar, su kaynakları, değirmenler ve pazar dokusu.'],
['Dere • değirmenler • dinlenme','12:15','12:50','Zeyve Pazarı, Ermenek, Karaman','Su kenarında oturun; kaygan taşlara ve dere yatağına yaklaşmayın.'],
['Öğle yemeği • Zeyve','12:50','14:10','Zeyve Pazarı, Ermenek, Karaman','Uzun oturma molası. Zeyve kebabı bulunuyorsa denenebilir.'],
['Çay • serbest zaman','14:10','14:45','Zeyve Pazarı, Ermenek, Karaman','Yöresel ürün alışverişi ve dinlenme.'],
['Zeyve → Ermenek Barajı','14:45','15:30','Ermenek Barajı, Karaman','Güvenli seyir noktasında manzara.'],
['Baraj manzarası • fotoğraf','15:30','16:15','Ermenek Barajı, Karaman','Kısa seyir ve fotoğraf. Kenarlarda güvenli sınır dışına çıkmayın.'],
['Ermenek → Karaman • dönüş','16:15','18:30',START,'Uzun dönüş. Akşam başka program planlamayın.']]}
};
const STORAGE='karaman-gezi-v13';
let S=JSON.parse(localStorage.getItem(STORAGE)||'{}');
let day=S.selectedDay&&DAYS[S.selectedDay]?S.selectedDay:'Pazartesi';
function save(){localStorage.setItem(STORAGE,JSON.stringify(S))}
function mins(t){let[a,b]=t.split(':').map(Number);return a*60+b}
function fmt(n){n=(n+1440)%1440;return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')}
function shiftForDay(d){return Number(S.offsets?.[d]||0)}
function actualTime(d,t){return fmt(mins(t)+shiftForDay(d))}
function key(i){return day+'-'+i}
function baseStops(d){return DAYS[d].stops.map((x,i)=>({name:x[0],start:x[1],end:x[2],place:x[3],info:x[4],base:true,id:'b'+i}))}
function customStops(d){return (S.customStops?.[d]||[]).map(x=>({...x,base:false}))}
function stops(d=day){let arr=baseStops(d);for(const c of customStops(d)){let at=Math.max(0,Math.min(arr.length,c.after+1));arr.splice(at,0,c)}return arr}
function routeUrl(o,d){let a=COORD[o]||o,b=COORD[d]||d;return 'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(a)+'&destination='+encodeURIComponent(b)+'&travelmode=driving'}
function fullUrl(){let p=[START,...stops(day).map(x=>x.place)],u=[];p.forEach(x=>{if(!u.includes(x))u.push(x)});let o=COORD[u[0]]||u[0],d=COORD[u.at(-1)]||u.at(-1),w=u.slice(1,-1).map(x=>COORD[x]||x);return 'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(o)+'&destination='+encodeURIComponent(d)+(w.length?'&waypoints='+encodeURIComponent(w.join('|')):'')+'&travelmode=driving'}
function stateFor(i){return S.states?.[key(i)]||{}}
function anchorIndex(){let arr=stops(day),best=-1;for(let i=0;i<arr.length;i++){let s=stateFor(i);if(s.done||s.active)best=i}return best<0?0:best}
function render(){
 document.getElementById('days').innerHTML=Object.keys(DAYS).map(d=>`<button class="${d===day?'active':''}" onclick="setDay('${d}')">${d}</button>`).join('');
 const D=DAYS[day],A=stops(day);let done=A.filter((_,i)=>stateFor(i).done).length,skip=A.filter((_,i)=>stateFor(i).skip).length;
 let start=actualTime(day,D.stops[0][1]);
 let html=`<section class="card hero"><h2>${day}</h2><div class="lead"><b>${D.theme}</b><br>Tempo: ${D.tempo}<br>İlk rota: <b>${START}</b> → ilk durak. Sonraki her rota <b>bir önceki durak → mevcut durak</b>.</div><div class="stats"><div class="stat"><b>${A.length}</b><span>durak</span></div><div class="stat"><b>${done}</b><span>yapıldı</span></div><div class="stat"><b>${skip}</b><span>atlandı</span></div></div><a class="route" href="${fullUrl()}" target="_blank">🗺️ Günün bütün duraklarını tek rotada aç</a></section>`;
 html+=`<section class="card starttime"><h3>🕐 Bugün kaçta çıktık?</h3><div class="lead">Program 09:15 gibi sabit bir saate bağlı değil. Fiilen çıktığınız saati girin; günün kalan saatleri aynı fark kadar ileri/geri kaydırılır.</div><div class="row"><input id="startTime" type="time" value="${start}"><button onclick="setStartTime()">Saati uygula</button></div><div class="status">Bu günün planlanan başlangıcı: <b>${start}</b></div></section>`;
 A.forEach((x,i)=>{let st=stateFor(i),origin=i?A[i-1].place:START,cls=st.done?'done':st.skip?'skip':st.active?'active':'';html+=`<article class="card stop ${cls}"><div class="meta">${i+1}. DURAK${st.active?' • AKTİF':''}</div><h3>${x.name}</h3><div class="time">${actualTime(day,x.start)} – ${actualTime(day,x.end)}</div><div class="meta"><b>Rota:</b> ${origin} → ${x.place}</div><div class="details"><strong>Burada ne yapacağız?</strong><p>${x.info}</p><strong>Tempo / grup notu</strong><p>${D.tempo}. Yaşlı misafirleri zorlamayın; ihtiyaç molasında saati kaydırın.</p></div><a class="route" href="${routeUrl(origin,x.place)}" target="_blank">🧭 Bu durağa rotayı aç</a><div class="actions"><button class="doneBtn" onclick="mark(${i},'done')">${st.done?'✓ Yapıldı':'Yapıldı'}</button><button class="skipBtn" onclick="mark(${i},'skip')">${st.skip?'✓ Atlandı':'Atla'}</button><button class="delayBtn" onclick="delayFrom(${i},15)">+15 dk</button><button class="activeBtn" onclick="mark(${i},'active')">${st.active?'● Aktif':'Aktif yap'}</button></div><textarea class="note" placeholder="Bu durakla ilgili saha notu..." oninput="note(${i},this.value)">${st.note||''}</textarea></article>`});
 html+=`<section class="card add"><h3>➕ Sonradan durak ekle</h3><div class="lead">Sadece gitmek istediğiniz yerin adını yazın. Adres, koordinat, mesafe veya ziyaret süresi bilmenize gerek yok. Sistem yeri bulur, kaldığınız durağın altına ekler ve rota ile makul ziyaret süresini hesaplar.</div><input id="newPlace" placeholder="Örn. Hatuniye Medresesi"><button onclick="addStop()">🧭 Yeri bul ve programa ekle</button><div class="warning">Yer adı belirsizse il/ilçe otomatik eklenir. Rota servisi çalışmazsa durak eklenmez; mevcut program bozulmaz.</div></section>`;
 html+=`<section class="card"><h3>☑ Günlük kontrol listesi</h3><div class="checklist">${['Su ve kişisel ihtiyaçlar kontrol edildi','Araç / anahtar / telefon kontrol edildi','Yaşlı misafirlerin oturma ve dinlenme ihtiyacı kontrol edildi','Bir sonraki durağın yol durumu kontrol edildi','Gün sonunda eksik kalanlar not edildi'].map((t,i)=>{let k=day+'-check-'+i,v=!!S.checks?.[k];return `<label class="check ${v?'done':''}"><input type="checkbox" ${v?'checked':''} onchange="check('${k}',this.checked)"><span>${t}</span></label>`}).join('')}</div></section>`;
 html+=`<section class="card update"><h3>🔄 Güncelleme</h3><div class="lead">Sürüm: <b>${BUILD}</b>. Eski Service Worker / önbellek güncellemeyi engellemesin diye temizleme işlemi yapılabilir.</div><button onclick="hardRefresh()">Güncel sürümü temizle ve aç</button></section>`;
 document.getElementById('app').innerHTML=html;
}
function setDay(d){day=d;S.selectedDay=d;save();render()}
function ensureStates(){if(!S.states)S.states={}}
function mark(i,t){ensureStates();let k=key(i);S.states[k]=S.states[k]||{};if(t==='active'){Object.keys(S.states).filter(k=>k.startsWith(day+'-')).forEach(k=>{if(S.states[k])S.states[k].active=false});S.states[k].active=true}else{S.states[k][t]=!S.states[k][t];if(t==='done'&&S.states[k].done)S.states[k].skip=false;if(t==='skip'&&S.states[k].skip)S.states[k].done=false}save();render()}
function note(i,v){ensureStates();let k=key(i);S.states[k]=S.states[k]||{};S.states[k].note=v;save()}
function check(k,v){S.checks=S.checks||{};S.checks[k]=v;save();render()}
function setStartTime(){let v=document.getElementById('startTime').value;if(!v)return;let base=mins(DAYS[day].stops[0][1]);let next=mins(v);S.offsets=S.offsets||{};let delta=next-base;if(delta>720)delta-=1440;if(delta<-720)delta+=1440;S.offsets[day]=delta;save();render()}
function delayFrom(i,n){S.offsets=S.offsets||{};S.offsets[day]=shiftForDay(day)+n;save();render()}
function resetDay(){if(!confirm(day+' gününün saha durumunu sıfırlayalım mı?'))return;Object.keys(S.states||{}).filter(k=>k.startsWith(day+'-')).forEach(k=>delete S.states[k]);Object.keys(S.checks||{}).filter(k=>k.startsWith(day+'-')).forEach(k=>delete S.checks[k]);S.offsets=S.offsets||{};S.offsets[day]=0;save();render()}
async function geo(q){let query=q+', Türkiye';let r=await fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=tr&accept-language=tr&q='+encodeURIComponent(query),{headers:{Accept:'application/json'}});if(!r.ok)throw Error('geo');let a=await r.json();if(!a.length)throw Error('notfound');return a[0]}
async function osrm(a,b){let r=await fetch('https://router.project-osrm.org/route/v1/driving/'+a.lon+','+a.lat+';'+b.lon+','+b.lat+'?overview=false');if(!r.ok)throw Error('route');let j=await r.json();if(j.code!=='Ok'||!j.routes?.length)throw Error('route');return Math.max(5,Math.ceil(j.routes[0].duration/60)+5)}
function stay(n){n=n.toLocaleLowerCase('tr-TR');if(/cami|türbe|mescit/.test(n))return 25;if(/müze/.test(n))return 45;if(/kale/.test(n))return 45;if(/şelale|park|mesire|göl|baraj|doğa/.test(n))return 60;if(/pazar|çarşı/.test(n))return 60;if(/yemek|restoran|lokanta/.test(n))return 75;if(/kilise|ören|antik|manastır|höyük/.test(n))return 50;return 40}
async function addStop(){let inp=document.getElementById('newPlace'),name=inp.value.trim();if(!name)return alert('Sadece yer adını yazın.');let btn=inp.nextElementSibling;btn.disabled=true;btn.textContent='⏳ Yer aranıyor...';try{let A=stops(day),idx=anchorIndex(),origin=A[idx]?.place||START,g=await geo(name);let from=COORD[origin]?(()=>{let[a,b]=COORD[origin].split(',');return{lat:a,lon:b}})():await geo(origin);let travel=await osrm(from,{lat:g.lat,lon:g.lon}),st=stay(name),end=mins(A[idx]?.end||DAYS[day].stops[0][2]);let custom={id:'c'+Date.now(),name:name,start:fmt(end+travel-shiftForDay(day)),end:fmt(end+travel+st-shiftForDay(day)),place:g.display_name||name,info:'Eklenen durak. Yol süresi harita servisinden, ziyaret süresi yerin türüne göre otomatik tahmin edilmiştir.',after:idx};S.customStops=S.customStops||{};S.customStops[day]=S.customStops[day]||[];S.customStops[day].push(custom);save();render();alert(name+' programa eklendi. '+travel+' dk yol + '+st+' dk ziyaret süresi ayrıldı.');}catch(e){alert('Yer bulunamadı veya rota hesaplanamadı. Örneğin "Hatuniye Medresesi, Karaman" gibi daha açık yazın.')}finally{let b=document.querySelector('.add button');if(b){b.disabled=false;b.textContent='🧭 Yeri bul ve programa ekle'}}}
async function hardRefresh(){try{let regs=await navigator.serviceWorker?.getRegistrations?.()||[];await Promise.all(regs.map(r=>r.unregister()));if(window.caches){let ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}}catch(e){}let u=new URL(location.href);u.searchParams.set('v',BUILD);u.searchParams.set('t',Date.now());location.replace(u.toString())}
render();
if('serviceWorker'in navigator){navigator.serviceWorker.getRegistrations().then(rs=>Promise.all(rs.map(r=>r.unregister()))).catch(()=>{})}
