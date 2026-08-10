/* Karaman Gezi Kontrol — saha zaman yönetimi */
(function(){
  const STATE_KEY='karaman-v12-state';
  const START_KEY='karaman-gezi-start-v1';
  const originalSetDay=window.setDay;
  const originalRender=window.render;
  const originalResetDay=window.resetDay;

  function state(){ try{return JSON.parse(localStorage.getItem(STATE_KEY)||'{}')}catch(e){return {}} }
  function saveState(s){localStorage.setItem(STATE_KEY,JSON.stringify(s))}
  function dayStart(d){ const s=state(); return s[d+'-real-start']||null }
  function selectedDay(){ try{return localStorage.getItem('karaman-selected-day')||'Pazartesi'}catch(e){return 'Pazartesi'} }

  function shiftMinutes(d){
    const s=state();
    return Number(s[d+'-start-shift']||0);
  }
  function applyStartShift(d, shift){
    const D=DAYS[d]; if(!D) return;
    const s=state();
    const applied=Number(s[d+'-applied-shift']||0);
    const delta=shift-applied;
    if(!delta) return;
    D.stops.forEach(x=>{ x[1]=fmt(mins(x[1])+delta); x[2]=fmt(mins(x[2])+delta); });
    s[d+'-applied-shift']=shift;
    saveState(s);
  }

  function wrapSetDay(d){
    localStorage.setItem('karaman-selected-day',d);
    originalSetDay(d);
    injectControls();
  }
  window.setDay=wrapSetDay;

  function injectControls(){
    const hero=document.querySelector('.hero'); if(!hero || document.getElementById('timeControl')) return;
    const d=day;
    const D=DAYS[d];
    const planned=D && D.stops.length ? D.stops[0][1] : '08:00';
    const real=dayStart(d)||'';
    const box=document.createElement('div');
    box.id='timeControl';
    box.style.cssText='margin-top:12px;padding:12px;border:1px solid #d6c79d;border-radius:12px;background:#fffdf5';
    box.innerHTML='<strong>🕐 Bugünkü gezi başlangıcı</strong><div style="font-size:12px;color:#66717c;margin:5px 0 9px">Planlanan başlangıç: <b>'+planned+'</b>. Gerçek çıkış saatinizi girerseniz kalan program aynı farkla yeniden hesaplanır.</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:7px"><input id="realStartTime" type="time" value="'+real+'" style="border:1px solid #cbd1d6;border-radius:9px;padding:10px;font:inherit"><button id="setRealStart" style="border:0;border-radius:9px;padding:10px;font-weight:900;background:#15191e;color:#fff">Programı bu saate göre başlat</button></div><div id="timeStatus" style="font-size:12px;margin-top:7px"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:7px"><button id="nowStart" style="border:1px solid #ccd2d7;border-radius:9px;padding:9px;background:#fff;font-weight:800">⏱ Şimdi çıkıyoruz</button><button id="recalcNow" style="border:1px solid #ccd2d7;border-radius:9px;padding:9px;background:#fff;font-weight:800">🔄 Kalan programı yeniden hesapla</button></div>';
    hero.appendChild(box);
    document.getElementById('setRealStart').onclick=()=>setStart(document.getElementById('realStartTime').value);
    document.getElementById('nowStart').onclick=()=>{ const n=new Date(); setStart(String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0')); };
    document.getElementById('recalcNow').onclick=()=>recalculateFromNow();
    showStatus();
  }

  function setStart(value){
    if(!value) return;
    const D=DAYS[day]; if(!D||!D.stops.length) return;
    const planned=mins(D.stops[0][1]);
    const actual=mins(value);
    let shift=actual-planned;
    if(shift<0) shift+=1440;
    const s=state();
    s[day+'-real-start']=value;
    s[day+'-start-shift']=shift;
    saveState(s);
    applyStartShift(day,shift);
    originalRender();
    injectControls();
  }

  function recalculateFromNow(){
    const n=new Date();
    const value=String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0');
    const D=DAYS[day]; if(!D) return;
    const s=state();
    let idx=-1;
    D.stops.forEach((_,i)=>{const z=s[day+'-'+i]||{};if(z.done||z.active)idx=i});
    if(idx<0) return alert('Önce bulunduğunuz/bitirdiğiniz son durağı “Aktif yap” veya “Yapıldı” ile işaretleyin.');
    const from=mins(value), currentEnd=mins(D.stops[idx][2]);
    const delta=from-currentEnd;
    for(let j=idx+1;j<D.stops.length;j++){D.stops[j][1]=fmt(mins(D.stops[j][1])+delta);D.stops[j][2]=fmt(mins(D.stops[j][2])+delta)}
    s[day+'-recalc-at']=value;
    saveState(s);
    originalRender(); injectControls();
  }

  function showStatus(){
    const el=document.getElementById('timeStatus'); if(!el)return;
    const s=state(); const v=s[day+'-real-start']; const sh=Number(s[day+'-start-shift']||0);
    el.textContent=v ? ('Gerçek başlangıç: '+v+' • Program kayması: '+(sh>=0?'+':'')+sh+' dk') : 'Henüz gerçek başlangıç saati belirlenmedi.';
  }

  // İlk açılışta kaydedilmiş günü ve başlangıç kaymasını uygula.
  try{
    const saved=selectedDay();
    if(DAYS[saved]) day=saved;
    const sh=shiftMinutes(day);
    if(sh) applyStartShift(day,sh);
    originalRender();
    injectControls();
  }catch(e){ console.error('time-control',e); }
})();