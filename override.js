(function(){
'use strict';
function getCustom(){try{return JSON.parse(localStorage.getItem('karamanCustomStopsV6')||'{}')}catch(e){return {}}}
function setCustom(x){localStorage.setItem('karamanCustomStopsV6',JSON.stringify(x))}
function apply(){
  const all=getCustom();
  Object.keys(all).forEach(function(d){
    if(!DATA[d]) return;
    const base=DATA[d].stops;
    const extras=(all[d]||[]).slice().sort((a,b)=>a.after-b.after||a.created-b.created);
    if(!extras.length) return;
    let shift=0,out=[];
    for(let i=0;i<base.length;i++){
      const orig=base[i].slice();
      const s=min(orig[1])+shift,e=min(orig[2])+shift;
      orig[1]=fmt(s);orig[2]=fmt(e);out.push(orig);
      extras.filter(x=>x.after===i).forEach(function(x){
        const st=e+x.travel,en=st+x.stay;
        x.start=fmt(st);x.end=fmt(en);
        out.push([x.name,x.start,x.end,'drive',x.place,x.desc,x.stay+' dk']);
        shift+=x.travel+x.stay;
      });
    }
    DATA[d].stops=out;
  });
}
window.addStop=function(){
  const name=document.getElementById('newName').value.trim();
  const place=document.getElementById('newPlace').value.trim()||name;
  const travel=Math.max(0,+document.getElementById('travel').value||20);
  const stay=Math.max(5,+document.getElementById('stay').value||30);
  const desc=document.getElementById('newDesc').value.trim()||'Kısa ziyaret, fotoğraf ve grubun ihtiyacına göre dinlenme.';
  if(!name){alert('Önce gitmek istediğiniz yeri yazın.');return}
  const all=getCustom();if(!all[day])all[day]=[];
  const base=DATA[day].stops;let after=base.length-1;
  for(let i=0;i<base.length;i++){const s=state[key(day,i)]||{};if(s.active)after=i}
  for(let i=0;i<base.length;i++){const s=state[key(day,i)]||{};if(s.done||s.skip)after=Math.max(after,i)}
  all[day].push({id:day+'_custom_'+Date.now(),name,place,travel,stay,desc,after,created:Date.now()});
  setCustom(all);
  alert(name+' mevcut programda '+(after+1)+'. durağın altına eklendi. Sonraki saatler buna göre kaydırıldı.');
  location.reload();
};
apply();
})();