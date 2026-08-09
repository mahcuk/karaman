(function(){'use strict';
/* v10: Wednesday simplified + deterministic A-B-C route links */
const W=[
 ['Karaman → Yerköprü (Hadim)','09:00','10:30','drive','Yerköprü Şelalesi, Hadim, Konya','Karaman’dan Hadim’deki Yerköprü Şelalesi’ne gidiş. Araçta su, piknik malzemeleri ve uygun ayakkabı kontrolü yapılır.'],
 ['Yerköprü Şelalesi • ziyaret','10:30','11:30','walk','Yerköprü Şelalesi, Hadim, Konya','Şelaleyi ve seyir noktalarını kontrollü tempoda görün. Kısa yürüyüş; kaygan zemine ve dik kenarlara yaklaşmayın. Yaşlı misafirleri zorlamayın.'],
 ['Piknik • serbest doğa • dinlenme','11:30','14:30','walk','Yerköprü Şelalesi, Hadim, Konya','Aynı alanda uzun ve sakin mola. Piknik, çay, sohbet, fotoğraf ve kısa serbest dolaşım aynı blokta. Grup için buluşma noktası belirleyin; suya girmeyin ve kaygan zeminden uzak durun.'],
 ['Yerköprü → Karaman • dönüş','14:30','16:30','drive','İstasyon Caddesi 241 Sokak No:6, Karaman, Türkiye','Dönüş sürüşü. İhtiyaç halinde yol üzerinde kısa mola verilebilir. Akşam programını boş bırakın.']
];
if(window.DATA&&window.DATA.Çarşamba){window.DATA.Çarşamba.stops=W;window.DATA.Çarşamba.theme='Yerköprü Şelalesi (Hadim/Konya) • piknik • serbest doğa';window.DATA.Çarşamba.tempo='Rahat / doğa günü';}
if(typeof window.apply==='function')window.apply();
if(typeof window.render==='function')window.render();
/* Force exact previous-stop -> current-stop routing. */
window.mapUrl=function(place){const d=window.day;const items=(window.__KARAMAN_ITEMS&&window.__KARAMAN_ITEMS[d])||[];let i=items.findIndex(x=>x.x&&x.x[4]===place);if(i<0)i=items.findIndex(x=>(x.x&&x.x[4]||'').toLocaleLowerCase('tr-TR')===(place||'').toLocaleLowerCase('tr-TR'));const origin=i>0?(items[i-1].x[4]||'İstasyon Caddesi 241 Sokak No:6, Karaman, Türkiye'):'İstasyon Caddesi 241 Sokak No:6, Karaman, Türkiye';const C={'İstasyon Caddesi 241 Sokak No:6, Karaman, Türkiye':'37.18195,33.22120','Yerköprü Şelalesi, Hadim, Konya':'37.02867,32.70108'};const o=C[origin]||origin,dest=C[place]||place;return 'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(o)+'&destination='+encodeURIComponent(dest)+'&travelmode=driving';};
window.fullDayUrl=function(){const items=(window.__KARAMAN_ITEMS&&window.__KARAMAN_ITEMS[window.day])||[];const C={'İstasyon Caddesi 241 Sokak No:6, Karaman, Türkiye':'37.18195,33.22120','Yerköprü Şelalesi, Hadim, Konya':'37.02867,32.70108'};const pts=['İstasyon Caddesi 241 Sokak No:6, Karaman, Türkiye'];items.forEach(x=>{const p=x.x&&x.x[4];if(p)pts.push(p)});const origin=C[pts[0]]||pts[0],destination=C[pts[pts.length-1]]||pts[pts.length-1],wps=pts.slice(1,-1).map(p=>C[p]||p);return 'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(origin)+'&destination='+encodeURIComponent(destination)+(wps.length?'&waypoints='+encodeURIComponent(wps.join('|')):'')+'&travelmode=driving';};
})();
