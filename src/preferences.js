'use strict';
const {icon}=require('./ui-icons');
const SETTINGS='riichi-settings-v1',HISTORY='riichi-history-v1';
const defaults={rounds:1,extension:true,bankruptcy:true,lastDealer:true,sound:false,motion:true};
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
function normalize(value){const v=value&&typeof value==='object'?value:{};return Object.fromEntries(Object.entries(defaults).map(([k,d])=>[k,k==='rounds'?([0,1,2].includes(v[k])?v[k]:d):typeof v[k]==='boolean'?v[k]:d]))}
let settings=normalize(read(SETTINGS,defaults));
const mode=s=>['一局战','东风战','半庄战'][s.rounds];
function getRules(base){return {...base,'場数':settings.rounds,'延長戦方式':settings.extension?1:0,'トビ終了あり':settings.bankruptcy,'オーラス止めあり':settings.lastDealer}}
function getSettings(){return {...settings}}
function history(){const rows=read(HISTORY,[]);return Array.isArray(rows)?rows.filter(r=>r&&Array.isArray(r.log?.rank)&&Array.isArray(r.log?.defen)&&Array.isArray(r.log?.player)).slice(0,20):[]}
function saveMatch(id,log,rules){const rows=history();if(rows.some(r=>r.id===id))return true;rows.unshift({id,date:new Date().toISOString(),rules,log:JSON.parse(JSON.stringify(log))});try{localStorage.setItem(HISTORY,JSON.stringify(rows.slice(0,20)));return true}catch{return false}}
function initPreferences(download){
 const panel=document.createElement('dialog');panel.id='preferences-panel';panel.setAttribute('aria-labelledby','preferences-title');document.body.append(panel);
 const node=(tag,text)=>{const n=document.createElement(tag);n.textContent=text;return n};
 function shell(title){panel.replaceChildren();const close=node('button','关闭');close.prepend(icon('close'));close.className='preferences-close';close.onclick=()=>panel.close();const h=node('h2',title);h.id='preferences-title';panel.append(close,h);if(!panel.open)panel.showModal()}
 function updateSummary(){const el=document.querySelector('.start-rules');if(el)el.textContent=mode(settings)+' · 四人麻将 · 25,000 点'}
 function persist(){try{localStorage.setItem(SETTINGS,JSON.stringify(settings));return true}catch{return false}}
 function openSettings(confirm){const setup=typeof confirm==='function';shell(setup?'结束条件':'设置');const form=node('div','');form.className='preferences-form';panel.append(form);
 if(!setup){const label=node('label','Language / 语言');const select=node('select','');select.id='settings-language';select.setAttribute('aria-label','Language');const original=document.getElementById('language-select');select.append(...[...original.options].map(o=>o.cloneNode(true)));select.value=original.value;select.onchange=()=>{original.value=select.value;original.dispatchEvent(new Event('change',{bubbles:true}))};label.append(select);form.append(label)}
 if(setup){const label=node('label','对局长度');const select=node('select','');select.id='setting-rounds';[[0,'一局战'],[1,'东风战'],[2,'半庄战']].forEach(([v,t])=>{const o=node('option',t);o.value=v;select.append(o)});select.value=settings.rounds;label.append(select);form.append(label);
select.onchange=()=>{settings.rounds=Number(select.value);persist();updateSummary()};}
 const status=node('p','');status.setAttribute('role','status');
 const save=()=>{status.textContent=persist()?'已保存':'无法保存到本机，本次设置仍然有效。';updateSummary()};
 for(const [key,title] of (setup?[['extension','未满 30,000 点时延长'],['bankruptcy','负分时结束'],['lastDealer','末局庄家第一名可结束']]:[['sound','声音'],['motion','动作特效']])){const l=node('label',title),input=document.createElement('input');input.type='checkbox';input.id='setting-'+key;input.checked=settings[key];l.append(input);form.append(l);input.onchange=()=>{settings[key]=input.checked;if(key==='sound'||key==='motion'){const b=document.getElementById(key);if(b.getAttribute('aria-pressed')!==String(input.checked))b.click()}save()}}
 if(setup){panel.append(node('p','东风战到东四，半庄战到南四；庄家连庄可能增加局数。一局战无延长。'));const play=node('button','确认并发牌');play.id='confirm-start';play.prepend(icon('play'));play.onclick=()=>{panel.close();confirm()};panel.append(play)}panel.append(status);
 }
 function openHistory(){shell('对局历史');panel.append(node('p','仅保存在当前浏览器，保留最近 20 场已完成对局。'));const rows=history();if(!rows.length){panel.append(node('p','还没有已完成的对局。'));return}
 for(const row of rows){const card=node('article','');card.className='history-card';card.append(node('h3',new Date(row.date).toLocaleString()),node('p',mode(row.rules||defaults)+' · '+row.log.player[0]+' · #'+row.log.rank[0]+' · '+row.log.defen[0].toLocaleString()+' 点'));const details=node('details','');details.append(node('summary','查看排名与牌谱'));row.log.rank.map((rank,id)=>({rank,id})).sort((a,b)=>a.rank-b.rank).forEach(({rank,id})=>details.append(node('p','#'+rank+' '+row.log.player[id]+' · '+row.log.defen[id].toLocaleString()+' 点')));details.append(node('p',(row.log.log?.length||0)+' 局'));const btn=node('button','保存牌谱');btn.onclick=()=>download(row.log);details.append(btn);card.append(details);panel.append(card)}
 }
 function button(parent,id,title,handler){const b=node('button',title);b.id=id;b.prepend(icon(id.includes('history')?'history':'settings'));b.onclick=()=>{document.getElementById('game-menu').hidePopover();handler()};parent.append(b)}
 const lobby=document.createElement('div');lobby.className='start-tools';document.querySelector('.start-content').append(lobby);button(lobby,'start-settings','设置',openSettings);button(lobby,'start-history','对局历史',openHistory);
 const menu=document.querySelector('.menu-buttons');button(menu,'menu-settings','设置',openSettings);button(menu,'menu-history','对局历史',openHistory);
 for(const key of ['sound','motion']){const b=document.getElementById(key);if(b.getAttribute('aria-pressed')!==String(settings[key]))b.click();b.addEventListener('click',()=>{settings[key]=b.getAttribute('aria-pressed')==='true';persist()})}
 updateSummary();return {openSettings,openHistory,confirmStart:openSettings};
}
module.exports={getRules,getSettings,saveMatch,initPreferences};
