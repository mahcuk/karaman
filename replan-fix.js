'use strict';
async function fixPointFor(x){
  if(x&&x.lat&&x.lon)return{lat:x.lat,lon:x.lon};
  if(x&&x.place&&typeof COORD!=='undefined'&&COORD[x.place]){let[a,b]=COORD[x.place].split(',');return{lat:a,lon:b};}
  let g=await geo(x.place||x.name);return{lat:g.lat,lon:g.lon};
}
window.replanFromNow=async function(){
 const arr=stops(day);if(!arr.length)return;
 let anchor=anchorIndex(),a=arr[anchor],now=new Date(),cursor=now.getHours()*60+now.getMinutes();
 if(a){let s=stateFor(anchor);if(!s.done&&!s.active)return alert('Önce bulunduğunuz durağı “Aktif” yapın veya son tamamlanan durağı “Yapıldı” olarak işaretleyin.');}
 let origin=a||{place:START};
 try{for(let i=anchor+1;i<arr.length;i++){let st=stateFor(i);if(st.done||st.skip)continue;let target=arr[i],from=await fixPointFor(origin),to=await fixPointFor(target),travel=await osrm(from,to),start=cursor+travel,dur=Math.max(5,mins(target.end)-mins(target.start)),end=start+dur;S.replanStops=S.replanStops||{};S.replanStops[day]=S.replanStops[day]||{};S.replanStops[day][target.id]={start:fmt(start-shiftForDay(day)),end:fmt(end-shiftForDay(day)),travel};cursor=end;origin=target}S.offsets=S.offsets||{};S.offsets[day]=0;S.lastReplan={day,at:now.toISOString(),anchor:a?.id||'START'};save();render();alert('Kalan program şu andan itibaren yeniden planlandı.');}catch(e){console.error(e);alert('Rota hesaplanamadı. Program değiştirilmedi.');}
};
