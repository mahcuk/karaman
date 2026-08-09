(function(){'use strict';
const C={
'İstasyon Caddesi 241 Sokak No:6, Karaman, Türkiye':'37.18195,33.22120',
'Karaman Kalesi, Karaman':'37.182098,33.205250',
'Aktekke Camii, Karaman':'37.18145,33.21785',
'Yunus Emre Camii ve Türbesi, Karaman':'37.18240,33.22040',
'Tartan Konağı, Karaman':'37.18120,33.21830',
'Yerköprü Şelalesi, Hadim, Konya':'37.02867,32.70108',
'Yerköprü Şelalesi, Hadim, Konya, Türkiye':'37.02867,32.70108',
'Ermenek Barajı, Karaman':'36.56806,32.96778',
'Binbir Kilise, Madenşehri, Karaman':'37.43154,33.11749',
'Binbir Kilise, Madenşehri, Karaman, Türkiye':'37.43154,33.11749',
'Manazan Mağaraları, Karaman':'37.3380,33.1920',
'Taşkale Tahıl Ambarları, Karaman':'37.0050,33.4280'
};
function norm(s){return (s||'').toLocaleLowerCase('tr-TR').replace(/[’']/g,"'").replace(/\s+/g,' ').trim()}
const aliases={
'yerköprü şelalesi, hadim, konya':'37.02867,32.70108',
'yerköprü şelalesi, hadim, konya, türkiye':'37.02867,32.70108',
'karaman kalesi, karaman':'37.182098,33.205250',
'binbir kilise, madenşehri, karaman':'37.43154,33.11749',
'ermenek barajı, karaman':'36.56806,32.96778'
};
function coord(s){const n=norm(s);if(aliases[n])return aliases[n];for(const k in C)if(norm(k)===n)return C[k];for(const k in C)if(n.includes(norm(k))||norm(k).includes(n))return C[k];if(n.includes('yerköprü')&&n.includes('şelale'))return aliases['yerköprü şelalesi, hadim, konya'];if(n.includes('binbir kilise'))return aliases['binbir kilise, madenşehri, karaman'];if(n.includes('ermenek baraj'))return aliases['ermenek barajı, karaman'];return null;}
window.mapUrl=function(place){
 const origins=(window.__KARAMAN_ORIGINS&&window.__KARAMAN_ORIGINS[window.day])||{};
 const origin=origins[place]||'İstasyon Caddesi 241 Sokak No:6, Karaman, Türkiye';
 const o=coord(origin)||origin;
 const d=coord(place)||place;
 return 'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(o)+'&destination='+encodeURIComponent(d)+'&travelmode=driving';
};
window.fullDayUrl=function(){
 const items=(window.__KARAMAN_ITEMS&&window.__KARAMAN_ITEMS[window.day])||[];const pts=[];
 const seen=new Set();
 function add(v){const c=coord(v)||v;if(!seen.has(c)){seen.add(c);pts.push(c)}}
 add('İstasyon Caddesi 241 Sokak No:6, Karaman, Türkiye');
 items.forEach(x=>add(x.x&&x.x[4]));
 if(pts.length<2)return '#';
 const origin=pts.shift(), destination=pts.pop();
 return 'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(origin)+'&destination='+encodeURIComponent(destination)+'&waypoints='+encodeURIComponent(pts.join('|'))+'&travelmode=driving';
};
})();