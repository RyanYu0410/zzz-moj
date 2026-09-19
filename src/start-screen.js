'use strict';
const {icon}=require('./ui-icons');
const AGENTS=[['妮可','nicole','#ff4d9b'],['比利','billy','#ff9a4d'],['雅','miyabi','#7fddff'],['艾莲','ellen','#ff4664']];
function initStartScreen(start,confirmStart){
 const screen=document.createElement('dialog');screen.id='start-screen';screen.setAttribute('aria-labelledby','start-title');
 screen.innerHTML='<div class="start-glow"></div><img id="start-portrait" alt=""><div class="start-content"><p class="start-eyebrow">NEW ERIDU · RIICHI CLUB</p><h1 id="start-title">新艾利都牌局</h1><p class="start-subtitle">选择角色，入座开局</p><h2 id="start-name"></h2><div class="agent-picker" role="group" aria-label="选择角色"></div><p class="start-rules">东风战 · 四人麻将 · 25,000 点</p><button id="start-play"><span>开始对局</span></button></div>';
 document.body.append(screen);screen.querySelector('#start-play').prepend(icon('play'));let selected=0;
 try{const saved=Number(localStorage.getItem('riichi-character'));if(Number.isInteger(saved)&&saved>=0&&saved<4)selected=saved}catch{}
 function select(id){selected=id;const [name,art,color]=AGENTS[id];screen.style.setProperty('--agent-color',color);screen.querySelector('#start-portrait').src='winners/'+art+'.png';screen.querySelector('#start-portrait').alt=name;screen.querySelector('#start-name').textContent=name;screen.querySelectorAll('.agent-option').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===id)))}
 AGENTS.forEach(([name,art],id)=>{const b=document.createElement('button');b.className='agent-option';b.innerHTML='<img src="winners/'+art+'.png" alt=""><span>'+name+'</span>';const badge=icon('check');badge.classList.add('agent-check');b.append(badge);b.onclick=()=>select(id);screen.querySelector('.agent-picker').append(b)});
 screen.addEventListener('cancel',e=>e.preventDefault());screen.querySelector('#start-play').onclick=()=>{try{localStorage.setItem('riichi-character',selected)}catch{}confirmStart(()=>{screen.close();start([selected,...AGENTS.map((_,i)=>i).filter(i=>i!==selected)].map(i=>AGENTS[i]));});};
 select(selected);return ()=>{select(selected);screen.showModal();screen.querySelectorAll('.agent-option')[selected].focus()};
}
module.exports={initStartScreen};
