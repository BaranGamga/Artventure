/* Artventure uygulama mantığı. İçerik content.js'te, tema styles.css'te. */
"use strict";
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---------- Kayıt: veriler yalnızca bu cihazda ---------- */
const KEY="artventure-data", PREF="artventure-pref";
const read=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
let data=Object.assign({journal:[],session:[],bible:{},progress:{},usta:[]},read(KEY,{}));
let pref=Object.assign({theme:"auto",mode:"kesif",week:0,apiKey:"",world:""},read(PREF,{}));
const save=()=>write(KEY,data), savePref=()=>write(PREF,pref);

const idb=(()=>{let p;const open=()=>p||(p=new Promise((res,rej)=>{const r=indexedDB.open("artventure",1);r.onupgradeneeded=()=>r.result.createObjectStore("photos");r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}));
  const tx=(mode,fn)=>open().then(db=>new Promise((res,rej)=>{const t=db.transaction("photos",mode);const q=fn(t.objectStore("photos"));t.oncomplete=()=>res(q&&q.result);t.onerror=()=>rej(t.error)}));
  return{put:(k,v)=>tx("readwrite",s=>s.put(v,k)),get:k=>tx("readonly",s=>s.get(k))}})();
function shrink(file){return new Promise((res,rej)=>{const img=new Image();img.onload=()=>{const m=900,s=Math.min(1,m/Math.max(img.width,img.height));const c=document.createElement("canvas");c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext("2d").drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(img.src);res(c.toDataURL("image/jpeg",.82))};img.onerror=rej;img.src=URL.createObjectURL(file)})}

function applyTheme(){const r=document.documentElement;if(pref.theme==="auto")r.removeAttribute("data-theme");else r.setAttribute("data-theme",pref.theme==="gece"?"dark":"light")}
applyTheme();

/* ---------- Durum ---------- */
let pi=0,draft="",ctxLabel="Keşfet",timer={phase:null,left:0,int:null};
const sess=()=>read("artventure-sess",null);
const fmt=s=>String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
const spark=`<svg class="spark" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.2 7.1L21 12l-6.8 2.9L12 22l-2.2-7.1L3 12l6.8-2.9z"/></svg>`;
const ring=(done,total)=>{const r=22,c=2*Math.PI*r,f=total?done/total:0;return `<svg class="ring" viewBox="0 0 54 54" aria-label="${done}/${total} tamamlandı"><circle cx="27" cy="27" r="${r}" stroke="var(--cloud)"/><circle cx="27" cy="27" r="${r}" stroke="var(--purple)" stroke-linecap="round" stroke-dasharray="${c*f} ${c}" transform="rotate(-90 27 27)"/></svg>`};

/* ---------- Görünümler ---------- */
const V={
kesfet(){ctxLabel="Keşfet";const g=c=>TOPICS.filter(t=>c.includes(t.cat));const card=t=>`<a class="card" href="#konu-${t.id}"><span class="tag" style="background:${t.c}">${t.cat}</span><h3>${t.title}</h3><div class="sub">${t.sum}</div></a>`;
 return{t:"Artventure",h:`<div class="hero">${spark}<div class="eyebrow">Kişisel atölye</div><div class="big">Karakterin merak etsin, dünya belirsin</div><p>Eski Pokémon ve Beyblade form dili, yumuşak organik stilizasyon ve senin meraklı uzaylın.</p></div>
<h2>Benim dünyam</h2><a class="card" href="#dunyam"><span class="tag" style="background:var(--coral)">Karakterim</span><h3>Benim dünyam</h3><div class="sub">${pref.world?"Karakterin, sahnelerin ve Usta'nın seni tanıdığı notlar":"Henüz boş. Karakterini ve sahnelerini buraya yaz."}</div></a>${g(["Yöntemim"]).map(card).join("")}<a class="card" href="#bible"><span class="tag" style="background:var(--yellow)">Manifesto</span><h3>Kişisel sanat dilim</h3><div class="sub">Beş ilke, paletin ve kendi "işte bu" notların</div></a>
<h2>Öğren</h2>${g(["Form sözlüğü","Teknik","Tasarım","Bakış"]).map(card).join("")}
<a class="card" href="#kaynaklar"><span class="tag" style="background:var(--blue)">Arşiv</span><h3>Kaynaklar</h3><div class="sub">Kitap, ansiklopedi, sakuga, cel ve settei</div></a>`}},
konu(id){const t=TOPICS.find(x=>x.id===id);if(!t)return V.kesfet();ctxLabel=t.title;return{t:t.title,back:"#kesfet",h:`<div class="card"><span class="tag" style="background:${t.c}">${t.cat}</span>${t.body}</div>`}},
bible(){ctxLabel="Kişisel sanat dilim";const b=data.bible;return{t:"Sanat dilim",back:"#kesfet",h:`<p class="sub">Bu sayfa okunmak için değil, yazılmak için. Her ilkenin altına kendi keşfettiğin "işte bu" anlarını ekle.</p>
<div class="card"><h3>Paletim</h3><div class="sw"><span><i style="background:#7B4A8E"></i>#7B4A8E</span><span><i style="background:#8CA5DD"></i>#8CA5DD</span><span><i style="background:#F0A0A8"></i>#F0A0A8</span><span><i style="background:#F3D08B"></i>#F3D08B</span><span><i style="background:#9CBAB3"></i>#9CBAB3</span></div></div>
${BIBLE_DEFAULT.map(p=>`<div class="card"><h3>${p.t}</h3><div class="sub">${p.d}</div>${(b[p.k]||[]).map(n=>`<p>• ${esc(n)}</p>`).join("")}<form class="row bibleF" data-k="${p.k}" style="margin-top:8px"><input type="text" id="bi-${p.k}" aria-label="${p.t} için not" placeholder="İşte bu: …"><button class="btn small" type="submit">Ekle</button></form></div>`).join("")}`}},
dunyam(){ctxLabel="Benim dünyam";return{t:"Benim dünyam",back:"#kesfet",h:`<p class="sub">Karakterin, hayal ettiğin sahneler ve Usta'nın seni tanıması için notlar. Yalnızca bu telefonda saklanır; Usta sohbetlerinde bunu bilir.</p>
<form class="card" id="worldF"><label for="world">Benim dünyam<textarea id="world" style="min-height:280px" placeholder="Örn. Karakterim meraklı, küçük bir uzaylı. Biri görünce saklanır…">${esc(pref.world)}</textarea></label><div class="row wrap"><button class="btn" type="submit">Kaydet</button><span class="status" id="wstat"></span></div></form>`}},
kaynaklar(){ctxLabel="Kaynaklar";return{t:"Kaynaklar",back:"#kesfet",h:SOURCES.map(s=>`<div class="card"><span class="tag" style="background:var(--blue)">${s.cat}</span><ul class="tight">${s.items.map(i=>`<li>${i}</li>`).join("")}</ul></div>`).join("")+`<p class="note">Görseller telif nedeniyle uygulamaya kopyalanmadı; bağlantılar orijinal malzemeye götürür. Metinler İngilizce ve Japonca kaynaklardan Türkçeye özetlendi.</p>`}},
sanatcilar(){ctxLabel="Sanatçılar";const grp=g=>ARTISTS.filter(a=>a.grp===g).map(a=>`<a class="card row" href="#sanatci-${a.id}"><span class="badge" style="background:${a.c}">${a.ini}</span><span style="min-width:0"><h3>${a.name}</h3><span class="sub">${a.role}</span></span></a>`).join("");
 const groups=[...new Set(ARTISTS.map(a=>a.grp))];return{t:"Sanatçılar",h:groups.map(g=>`<h2>${g}</h2>${grp(g)}`).join("")}},
sanatci(id){const a=ARTISTS.find(x=>x.id===id);if(!a)return V.sanatcilar();ctxLabel=a.name;return{t:a.name,back:"#sanatcilar",h:`<div class="card row"><span class="badge" style="background:${a.c}">${a.ini}</span><span><h3>${a.name}</h3><span class="sub">${a.role}</span></span></div>
<div class="card"><span class="tag" style="background:var(--blue)">Hayat hikâyesi</span>${a.life}</div><div class="card"><span class="tag" style="background:var(--teal)">Çalışma tarzı</span>${a.style}</div>
<div class="card" style="background:var(--cream)"><span class="tag" style="background:var(--coral)">Bu hafta ondan çalacağın tek şey</span><p><b>${a.steal}</b></p></div>
<div class="card"><span class="tag" style="background:var(--yellow)">Kaynaklar</span><ul class="tight">${a.src.map(s=>`<li>${s}</li>`).join("")}</ul></div>`}},
bakis(){const m=pref.mode;ctxLabel="Bakış ("+(m==="kesif"?"keşif":"analiz")+" modu)";
 return{t:"Bakış",h:`<div class="seg" role="group" aria-label="Mod"><button type="button" data-mode="kesif" aria-pressed="${m==="kesif"}">Keşif modu</button><button type="button" data-mode="analiz" aria-pressed="${m==="analiz"}">Analiz modu</button></div>
<p class="sub">${m==="kesif"?"Kural yok, eleştiri yok. Sadece merak.":"Referansa bak, sanatçının hangi kararı verdiğini sor."}</p>${PERSPECTIVES.filter(p=>p.mode===m).map(p=>`<div class="card"><h3>${p.title}</h3>${p.body}</div>`).join("")}`}},
pratik(){ctxLabel="Pratik";const wk=pref.week,w=WEEKS[wk],dn=data.progress,di=MERAK[data.session.filter(s=>s.type==="merak").length%MERAK.length];
 let today=w.days.findIndex((_,i)=>!dn[wk+"-"+i]);if(today<0)today=w.days.length-1;const doneN=w.days.filter((_,i)=>dn[wk+"-"+i]).length;
 return{t:"Pratik",h:`<div class="strip">${WEEKS.map((x,i)=>`<button class="st" type="button" data-week="${i}" aria-current="${i===wk}"><small>Hafta ${i+1}</small>${x.t}</button>`).join("")}</div>
<div class="card"><div class="row"><div style="flex:1"><div class="eyebrow">Hafta ${wk+1} · Gün ${today+1}</div></div>${ring(doneN,w.days.length)}</div><p class="prompt" id="dayTask">${w.days[today]}</p><div class="days">${w.days.map((_,i)=>`<button class="day ${dn[wk+"-"+i]?"done":""}" type="button" data-day="${i}" aria-current="${i===today}" aria-label="Gün ${i+1}">${i+1}</button>`).join("")}</div>
<div class="row wrap" style="margin-top:14px"><button class="btn" type="button" data-start="program" data-task="${esc(w.days[today])}" data-key="${wk}-${today}">Bu görevi başlat</button></div><p class="note" style="margin-top:12px">Kaçırılan gün yok, sadece kaldığın yer var.</p></div>
<div class="card"><span class="tag" style="background:var(--coral)">Merak Defteri</span><h3>${di[0]}</h3><p>${di[1]}</p><p class="sub">Niyet, engel, kulakların tepkisi, ortaya çıkan bir ayrıntı.</p><button class="btn ghost" type="button" data-start="merak" data-task="${esc(di[0]+": "+di[1])}">Uzaylını buraya götür</button></div>
<div class="card"><span class="tag" style="background:var(--teal)">Serbest</span><p class="prompt" id="prompt">${PROMPTS[pi]}</p><div class="row wrap"><button class="btn ghost" id="newP" type="button">Başka bir tane</button><button class="btn ghost" type="button" data-start="serbest">Bunu başlat</button></div></div>`}},
oturum(){ctxLabel="Yaşat → Güzelleştir oturumu";const s=sess();if(!s)return V.pratik();const g=timer.phase==="guzel";
 return{t:"Oturum",back:"#pratik",h:`<div class="card"><div class="eyebrow">${s.type==="merak"?"Merak Defteri":s.type==="program"?"Program":"Serbest"}</div><p class="prompt">${esc(s.task)}</p></div>
<div class="card"><div class="seg" role="group" aria-label="Aşama"><button type="button" data-phase="yasat" aria-pressed="${!g}">1 · Yaşat (10 dk)</button><button type="button" data-phase="guzel" aria-pressed="${g}">2 · Güzelleştir (15 dk)</button></div>
<div class="timer" id="clock">${fmt(timer.left||(g?900:600))}</div><p class="sub" id="phaseHint">${g?"En ilginç anı seç. Formun zarafeti, yanakların yumuşaklığı, renk ve gölge.":"Kaba, hızlı, silgisiz. Sadece sor: şimdi ne yapıyor?"}</p><div class="row wrap"><button class="btn" id="tgo" type="button">Başlat</button><button class="btn ghost" id="tstop" type="button">Durdur</button></div></div>
<form class="card" id="closeF"><h3>Oturumu kapat</h3><label for="q1">Ne oldu?<textarea id="q1"></textarea></label><label for="q2">Hangi tasarım problemi çıktı?<textarea id="q2"></textarea></label><label for="q3">Hangi görsel çözümü buldum?<textarea id="q3"></textarea></label>
<label for="photo">Çiziminin fotoğrafı (isteğe bağlı)<input id="photo" type="file" accept="image/*"></label><div class="row wrap"><button class="btn" type="submit">Kaydet</button><span class="status" id="sstat"></span></div></form>`}},
gunluk(){ctxLabel="Günlük";return{t:"Günlük",h:`<p class="sub">Kısa yaz; bir kelime bile yeter. Kayıtlar yalnızca bu telefonda saklanır.</p>
<form class="card" id="jform"><label for="seen">Bugün ne gördüm, ne beni durdurdu?<textarea id="seen"></textarea></label><label for="drew">Ne çizdim, ne denedim?<textarea id="drew">${esc(draft)}</textarea></label>
<div><b style="font-size:15px">Şu an hissettiğim</b><div class="chips" id="feel" style="margin-top:8px">${FEEL.map(w=>`<button type="button" class="chip" aria-pressed="false">${w}</button>`).join("")}</div></div>
<div><b style="font-size:15px">İhtiyacım olan</b><div class="chips" id="need" style="margin-top:8px">${NEED.map(w=>`<button type="button" class="chip" aria-pressed="false">${w}</button>`).join("")}</div></div>
<label for="note">Kendime not<input id="note" type="text"></label><div class="row wrap"><button class="btn" type="submit">Kaydet</button><span class="status" id="status"></span></div></form>
<h2>Geçmiş</h2><div id="entries" style="display:grid;gap:12px"></div>`}},
ayarlar(){ctxLabel="Ayarlar";const t=pref.theme;return{t:"Ayarlar",back:"#kesfet",h:`<div class="card"><h3>Tema</h3><p class="sub">Gece teması gece okurken gözü yormayan sıcak, koyu tonlardadır.</p><div class="seg" role="group" aria-label="Tema"><button type="button" data-theme-set="auto" aria-pressed="${t==="auto"}">Otomatik</button><button type="button" data-theme-set="gunduz" aria-pressed="${t==="gunduz"}">Gündüz</button><button type="button" data-theme-set="gece" aria-pressed="${t==="gece"}">Gece</button></div></div>
<form class="card" id="keyF"><h3>Usta için API anahtarı</h3><p class="sub">Usta, Anthropic API ile çalışır. Anahtarın yalnızca bu telefonda saklanır ve sadece api.anthropic.com'a gönderilir. Anahtarı console.anthropic.com adresinden alabilirsin; kullanım ücretlidir.</p><label for="apikey">Anahtar<input id="apikey" type="password" autocomplete="off" placeholder="${pref.apiKey?"Kayıtlı (değiştirmek için yeni anahtar gir)":"sk-ant-…"}"></label><div class="row wrap"><button class="btn small" type="submit">Kaydet</button><button class="btn ghost small" type="button" id="keyDel">Anahtarı sil</button><span class="status" id="kstat">${pref.apiKey?"Anahtar kayıtlı":"Anahtar yok"}</span></div></form>
<div class="card"><h3>Claude Code'daki Usta'ya gönder</h3><p class="sub">Günlüğünü, pratik notlarını ve sanat dilini metin olarak kopyalar. Bu metni Claude Code'a yapıştır; Usta okuyup uygulamayı ve programını ona göre günceller. Fotoğraflar metne girmez.</p><div class="row wrap"><button class="btn small" type="button" id="expMd">Metni hazırla ve kopyala</button></div><textarea id="expOut" hidden readonly style="margin-top:10px;min-height:160px" aria-label="Dışa aktarılan metin"></textarea><span class="status" id="estat"></span></div>
<div class="card"><h3>Yedek</h3><p class="sub">Tüm kayıtların (fotoğraflar hariç) yedeğini al ya da başka bir cihazdan geri yükle.</p><div class="row wrap"><button class="btn ghost small" type="button" id="bkOut">Yedeği kopyala</button><button class="btn ghost small" type="button" id="bkIn">Yedeği geri yükle</button></div><textarea id="bkTxt" hidden style="margin-top:10px;min-height:120px" aria-label="Yedek metni"></textarea><button class="btn small" type="button" id="bkApply" hidden style="margin-top:8px">Geri yüklemeyi onayla (mevcut kayıtların yerine geçer)</button><span class="status" id="bstat"></span></div>
<div class="card"><h3>Sürüm</h3><p class="sub" id="verTxt">Kontrol ediliyor…</p><button class="btn ghost small" type="button" id="chkUpd">Güncellemeleri denetle</button></div>`}}
};

function route(){
  const h=(location.hash||"#kesfet").slice(1);const m=h.match(/^(sanatci|konu)-(.+)$/);
  const v=m?V[m[1]](m[2]):(V[h]||V.kesfet)();
  $("title").textContent=v.t;$("view").innerHTML=v.h;$("back").hidden=!v.back;$("back").onclick=()=>{location.hash=v.back};
  const tab=m?{sanatci:"sanatcilar",konu:"kesfet"}[m[1]]:({dunyam:"kesfet",bible:"kesfet",kaynaklar:"kesfet",oturum:"pratik",ayarlar:""}[h]??(V[h]?h:"kesfet"));
  document.querySelectorAll("nav.tabbar a").forEach(a=>a.dataset.tab===tab?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current"));
  bind(h);
}
window.addEventListener("hashchange",()=>{route();window.scrollTo(0,0)});

function copy(text,ta,stat,msg){const done=()=>{stat.textContent=msg};if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(done,()=>{ta.hidden=false;ta.value=text;ta.select();stat.textContent="Metni seçtim; uzun basıp Kopyala'ya dokun."})}else{ta.hidden=false;ta.value=text;ta.select();stat.textContent="Metni seçtim; uzun basıp Kopyala'ya dokun."}}

function bind(h){
  const v=$("view");
  v.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{pref.mode=b.dataset.mode;savePref();route()});
  v.querySelectorAll("[data-week]").forEach(b=>b.onclick=()=>{pref.week=+b.dataset.week;savePref();route()});
  v.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{const w=WEEKS[pref.week],i=+b.dataset.day;$("dayTask").textContent=w.days[i];const s=v.querySelector('[data-start="program"]');s.dataset.task=w.days[i];s.dataset.key=pref.week+"-"+i;v.querySelectorAll("[data-day]").forEach(x=>x.setAttribute("aria-current",x===b))});
  v.querySelectorAll("[data-start]").forEach(b=>b.onclick=()=>{write("artventure-sess",{type:b.dataset.start,task:b.dataset.start==="serbest"?PROMPTS[pi]:b.dataset.task,key:b.dataset.key||null});clearInterval(timer.int);timer={phase:"yasat",left:600,int:null};location.hash="oturum"});
  if($("newP"))$("newP").onclick=()=>{let n;do{n=Math.floor(Math.random()*PROMPTS.length)}while(n===pi&&PROMPTS.length>1);pi=n;$("prompt").textContent=PROMPTS[n]};
  v.querySelectorAll(".bibleF").forEach(f=>f.onsubmit=e=>{e.preventDefault();const k=f.dataset.k,inp=$("bi-"+k),t=inp.value.trim();if(!t)return;data.bible[k]=[...(data.bible[k]||[]),t];save();route()});
  v.querySelectorAll("[data-theme-set]").forEach(b=>b.onclick=()=>{pref.theme=b.dataset.themeSet;savePref();applyTheme();route()});
  if(h==="oturum")bindSession();
  if(h==="gunluk")bindJournal();
  if(h==="ayarlar")bindSettings();
  if(h==="dunyam")$("worldF").onsubmit=e=>{e.preventDefault();pref.world=$("world").value.trim();$("wstat").textContent=savePref()?"Kaydedildi":"Kaydedilemedi"};
}
function bindSession(){
  const tick=()=>{timer.left--;if($("clock"))$("clock").textContent=fmt(Math.max(0,timer.left));if(timer.left<=0){clearInterval(timer.int);timer.int=null;if($("phaseHint"))$("phaseHint").textContent=timer.phase==="yasat"?"Süre doldu. Hazır olduğunda Güzelleştir aşamasına geç; istersen başka bir gün.":"Süre doldu. Aşağıdaki üç soruyla oturumu kapat."}};
  document.querySelectorAll("[data-phase]").forEach(b=>b.onclick=()=>{clearInterval(timer.int);timer={phase:b.dataset.phase,left:b.dataset.phase==="guzel"?900:600,int:null};route()});
  $("tgo").onclick=()=>{if(timer.int)return;if(timer.left<=0)timer.left=timer.phase==="guzel"?900:600;timer.int=setInterval(tick,1000)};
  $("tstop").onclick=()=>{clearInterval(timer.int);timer.int=null};
  $("closeF").onsubmit=async e=>{e.preventDefault();const s=sess()||{},st=$("sstat"),f=$("photo").files[0];
    const d={id:"s"+Date.now(),type:s.type,task:s.task,at:Date.now(),q1:$("q1").value.trim(),q2:$("q2").value.trim(),q3:$("q3").value.trim()};
    if(!d.q1&&!d.q2&&!d.q3&&!f){st.textContent="En az bir soruyu yanıtla.";return}
    st.textContent="Kaydediliyor…";
    try{if(f){await idb.put(d.id,await shrink(f));d.photo=true}
      data.session.unshift(d);if(s.key)data.progress[s.key]=true;
      if(!save()){st.textContent="Telefonda yer kalmamış olabilir; kayıt yapılamadı.";return}
      clearInterval(timer.int);timer.int=null;write("artventure-sess",null);location.hash="gunluk"}
    catch(err){st.textContent="Fotoğraf kaydedilemedi. Fotoğrafsız tekrar dene."}};
}
function bindJournal(){
  document.querySelectorAll(".chip").forEach(b=>b.onclick=()=>b.setAttribute("aria-pressed",b.getAttribute("aria-pressed")==="true"?"false":"true"));
  renderEntries();
  $("jform").onsubmit=ev=>{ev.preventDefault();const pick=id=>[...$(id).querySelectorAll('[aria-pressed="true"]')].map(b=>b.textContent);
    const d={id:"j"+Date.now(),at:Date.now(),seen:$("seen").value.trim(),drew:$("drew").value.trim(),feel:pick("feel"),need:pick("need"),note:$("note").value.trim()};
    if(!d.seen&&!d.drew&&!d.note&&!d.feel.length){$("status").textContent="Önce bir şey yaz ya da bir his seç.";return}
    data.journal.unshift(d);if(!save()){$("status").textContent="Kayıt yapılamadı.";return}draft="";route()};
}
function renderEntries(){const box=$("entries");if(!box)return;box.textContent="";
  const list=[...data.journal.map(d=>({...d,k:"j"})),...data.session.map(d=>({...d,k:"s"}))].sort((a,b)=>b.at-a.at);
  if(!list.length){box.innerHTML=`<div class="card empty"><svg viewBox="0 0 24 24" width="56" height="56" aria-hidden="true"><path d="M12 2.5l2.6 6.6 7 .5-5.4 4.5 1.7 6.9L12 17.2 6.1 21l1.7-6.9L2.4 9.6l7-.5z" fill="var(--yellow)" stroke="var(--line)" stroke-width="1.5" stroke-linejoin="round"/></svg><p class="sub">Henüz kayıt yok. İlk satırını yazdığında ya da bir pratik oturumunu kapattığında burada görünecek.</p></div>`;return}
  list.forEach(d=>{const e=document.createElement("div");e.className="entry";const t=document.createElement("time");t.textContent=new Date(d.at).toLocaleString("tr-TR",{dateStyle:"medium",timeStyle:"short"})+(d.k==="s"?" · Pratik":"");e.appendChild(t);
    const add=(k,v)=>{if(!v)return;const p=document.createElement("p");const b=document.createElement("b");b.textContent=k+": ";p.append(b,v);e.appendChild(p)};
    if(d.k==="s"){add("Görev",d.task);add("Ne oldu",d.q1);add("Tasarım problemi",d.q2);add("Görsel çözüm",d.q3);if(d.photo){const i=document.createElement("img");i.alt="Oturum çizimi";idb.get(d.id).then(u=>{if(u)i.src=u}).catch(()=>{});e.appendChild(i)}}
    else{add("Gördüm",d.seen);add("Çizdim",d.drew);add("Hissettim",(d.feel||[]).join(", "));add("İhtiyacım",(d.need||[]).join(", "));add("Not",d.note)}
    box.appendChild(e)})}

function exportText(){const dt=d=>new Date(d).toLocaleString("tr-TR",{dateStyle:"medium",timeStyle:"short"});
  const lines=[`# Artventure verisi`,`Tarih: ${dt(Date.now())} · Sürüm: ${appVersion||"?"}`,``,`## Sanat dilim notları`];
  BIBLE_DEFAULT.forEach(p=>{lines.push(`- ${p.t}: ${(data.bible[p.k]||[]).join(" | ")||"(not yok)"}`)});
  lines.push(``,`## Program ilerlemesi`);WEEKS.forEach((w,i)=>{const n=w.days.filter((_,j)=>data.progress[i+"-"+j]).length;lines.push(`- Hafta ${i+1} (${w.t}): ${n}/${w.days.length}`)});
  lines.push(``,`## Pratik oturumları`);data.session.forEach(s=>lines.push(`- [${dt(s.at)}] ${s.type}: ${s.task}`,`  - Ne oldu: ${s.q1||"-"}`,`  - Tasarım problemi: ${s.q2||"-"}`,`  - Görsel çözüm: ${s.q3||"-"}${s.photo?" (fotoğraf var)":""}`));
  lines.push(``,`## Günlük`);data.journal.forEach(j=>lines.push(`- [${dt(j.at)}] Gördüm: ${j.seen||"-"} · Çizdim: ${j.drew||"-"} · Hissettim: ${(j.feel||[]).join(", ")||"-"} · İhtiyacım: ${(j.need||[]).join(", ")||"-"} · Not: ${j.note||"-"}`));
  lines.push(``,`## Usta ile son sohbet`);data.usta.slice(-10).forEach(m=>lines.push(`- ${m.role==="user"?"Ben":"Usta"}: ${m.content.replace(/\n+/g," ")}`));
  return lines.join("\n")}
function bindSettings(){
  $("keyF").onsubmit=e=>{e.preventDefault();const k=$("apikey").value.trim();if(!k){$("kstat").textContent="Önce anahtarı yapıştır.";return}pref.apiKey=k;savePref();$("apikey").value="";$("kstat").textContent="Anahtar kaydedildi"};
  $("keyDel").onclick=()=>{pref.apiKey="";savePref();$("kstat").textContent="Anahtar silindi"};
  $("expMd").onclick=()=>copy(exportText(),$("expOut"),$("estat"),"Kopyalandı. Claude Code'a yapıştırabilirsin.");
  $("bkOut").onclick=()=>copy(JSON.stringify({artventure:1,data,mode:pref.mode,week:pref.week,world:pref.world}),$("bkTxt"),$("bstat"),"Yedek kopyalandı.");
  $("bkIn").onclick=()=>{$("bkTxt").hidden=false;$("bkTxt").value="";$("bkApply").hidden=false;$("bstat").textContent="Yedek metnini kutuya yapıştır.";$("bkTxt").focus()};
  $("bkApply").onclick=()=>{try{const o=JSON.parse($("bkTxt").value);if(!o.artventure||!o.data)throw 0;data=Object.assign({journal:[],session:[],bible:{},progress:{},usta:[]},o.data);save();if(typeof o.world==="string"){pref.world=o.world;savePref()}$("bstat").textContent="Yedek geri yüklendi.";$("bkApply").hidden=true}catch(e){$("bstat").textContent="Bu metin bir Artventure yedeği değil."}};
  $("verTxt").textContent=appVersion?`Artventure ${appVersion}${verNotes?" · "+verNotes:""}`:"Sürüm bilgisi alınamadı (çevrimdışı olabilirsin).";
  $("chkUpd").onclick=async()=>{$("verTxt").textContent="Denetleniyor…";const r=await swReg;if(r){try{await r.update()}catch(e){}}setTimeout(()=>{if($("verTxt")&&$("update").hidden)$("verTxt").textContent=`Artventure ${appVersion||""} · En güncel sürümdesin.`},2500)};
}

/* ---------- Usta ---------- */
let busy=false;
function openUsta(){$("sheet").hidden=false;$("ustaCtx").textContent="Bağlam: "+ctxLabel+" · "+(pref.mode==="kesif"?"keşif":"analiz")+" modu";renderChat();$("ask").focus()}
function bubble(role,text,id){const d=document.createElement("div");d.className="msg "+(role==="user"?"u":"a");d.textContent=text;if(id)d.id=id;$("msgs").appendChild(d);return d}
function renderChat(){$("msgs").textContent="";if(!data.usta.length)bubble("assistant",pref.apiKey?"Merhaba, ben Usta. Bugün uzaylın nerede? Ya da kâğıdın başında seni ne durduruyor? Kısa yaz, birlikte en küçük adımı bulalım.":"Merhaba, ben Usta. Seninle konuşabilmem için Ayarlar'dan bir Anthropic API anahtarı eklemen gerekiyor. O zamana kadar Ayarlar'daki \"Claude Code'daki Usta'ya gönder\" ile notlarını bana Claude Code üzerinden getirebilirsin.");
  data.usta.forEach(m=>bubble(m.role,m.content));$("msgs").scrollTop=$("msgs").scrollHeight}
function systemPrompt(){const b=data.bible;const bt=BIBLE_DEFAULT.map(p=>p.t+": "+((b[p.k]||[]).join("; ")||"henüz not yok")).join("\n");
  const rec=data.session.slice(0,3).map(s=>`- ${s.task} | ne oldu: ${s.q1||"-"} | problem: ${s.q2||"-"} | çözüm: ${s.q3||"-"}`).join("\n")||"henüz yok";
  return `${USTA_RULES}\n\n${PROFILE}\n\nÖĞRENCİNİN KENDİ YAZDIĞI DÜNYASI VE PROFİLİ:\n${pref.world||"henüz yazmadı"}\n\nÖĞRENCİNİN SANAT DİLİ NOTLARI:\n${bt}\n\nSON PRATİK OTURUMLARI:\n${rec}\n\nŞU AN: Artventure uygulamasında "${ctxLabel}" sayfasında, ${pref.mode==="kesif"?"keşif":"analiz"} modunda.`}
async function send(){const q=$("ask").value.trim();if(!q||busy)return;
  if(!pref.apiKey){renderChat();return}
  busy=true;$("send").disabled=true;$("ask").value="";
  data.usta.push({role:"user",content:q});save();renderChat();const live=bubble("assistant","Düşünüyor…","live");$("msgs").scrollTop=$("msgs").scrollHeight;
  const msgs=data.usta.slice(-20);while(msgs.length&&msgs[0].role!=="user")msgs.shift();
  try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"content-type":"application/json","x-api-key":pref.apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-5-5",max_tokens:1024,system:systemPrompt(),messages:msgs})});
    const j=await r.json().catch(()=>({}));
    if(!r.ok){const m=r.status===401?"API anahtarı geçersiz görünüyor. Ayarlar'dan kontrol et.":r.status===429?"Biraz yoğunum, birkaç dakika sonra tekrar dene.":r.status===400&&/credit/i.test(j?.error?.message||"")?"API hesabında kredi kalmamış görünüyor.":"Yanıt alınamadı ("+r.status+"). Tekrar dene.";live.textContent=m;data.usta.pop();save();return}
    const text=(j.content||[]).filter(c=>c.type==="text").map(c=>c.text).join("\n").trim()||"…";
    data.usta.push({role:"assistant",content:text});data.usta=data.usta.slice(-40);save();renderChat()}
  catch(e){live.textContent="İnternete bağlanılamadı. Bağlantını kontrol edip tekrar dene.";data.usta.pop();save()}
  finally{busy=false;$("send").disabled=false}}
$("fab").onclick=openUsta;$("closeSheet").onclick=()=>{$("sheet").hidden=true;$("fab").focus()};
$("sheet").addEventListener("click",e=>{if(e.target===$("sheet"))$("closeSheet").click()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("sheet").hidden)$("closeSheet").click()});
$("send").onclick=send;$("ask").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}});
$("clearChat").onclick=()=>{if(busy)return;data.usta=[];save();renderChat()};

/* ---------- Güncelleme: yeni sürüm sorulur, onayla yüklenir ---------- */
let appVersion="",verNotes="";
fetch("version.json",{cache:"no-store"}).then(r=>r.json()).then(v=>{appVersion=v.version;verNotes=v.notes||""}).catch(()=>{});
const swReg=("serviceWorker" in navigator)?navigator.serviceWorker.register("sw.js").catch(()=>null):Promise.resolve(null);
let waitingSW=null;
function offerUpdate(w){waitingSW=w;fetch("version.json?t="+Date.now(),{cache:"no-store"}).then(r=>r.json()).then(v=>{$("updNotes").textContent=(v.version?"Sürüm "+v.version+". ":"")+(v.notes||"")}).catch(()=>{});$("update").hidden=false}
swReg.then(reg=>{if(!reg)return;if(reg.waiting&&navigator.serviceWorker.controller)offerUpdate(reg.waiting);
  reg.addEventListener("updatefound",()=>{const w=reg.installing;if(!w)return;w.addEventListener("statechange",()=>{if(w.state==="installed"&&navigator.serviceWorker.controller)offerUpdate(w)})});
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")reg.update().catch(()=>{})});
  setInterval(()=>reg.update().catch(()=>{}),30*60*1000)});
let reloading=false;
if("serviceWorker" in navigator)navigator.serviceWorker.addEventListener("controllerchange",()=>{if(reloading)return;reloading=true;location.reload()});
$("updYes").onclick=()=>{if(waitingSW){$("updYes").disabled=true;$("updYes").textContent="Yükleniyor…";waitingSW.postMessage("skipWaiting")}};
$("updNo").onclick=()=>{$("update").hidden=true};

route();
