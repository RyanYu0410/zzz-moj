'use strict';
const $=id=>document.getElementById(id);
const names=['一萬','二萬','三萬','四萬','五萬','六萬','七萬','八萬','九萬','一筒','二筒','三筒','四筒','五筒','六筒','七筒','八筒','九筒','一索','二索','三索','四索','五索','六索','七索','八索','九索','東','南','西','北','白','發','中'];
const baseTile=t=>t>=34?[4,13,22][t-34]:t;
const tileName=t=>(t>=34?'赤 ':'')+names[baseTile(t)];
const tileSort=(a,b)=>baseTile(a)-baseTile(b)||a-b;
let state,selected=-1,riichiPick=false,timers=[],sound=false,ctx,round=0;
function later(fn,ms){timers.push(setTimeout(fn,ms))}
function tone(freq=450){if(!sound)return;try{ctx??=new (window.AudioContext||window.webkitAudioContext)();const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.value=freq;o.connect(g);g.connect(ctx.destination);g.gain.setValueAtTime(.045,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.13);o.start();o.stop(ctx.currentTime+.14)}catch{}}
function counts(hand){const c=Array(34).fill(0);for(const t of hand)c[baseTile(t)]++;return c}
function groups(c){const i=c.findIndex(x=>x>0);if(i<0)return true;if(c[i]>=3){c[i]-=3;const ok=groups(c);c[i]+=3;if(ok)return true}if(i<27&&i%9<7&&c[i+1]&&c[i+2]){c[i]--;c[i+1]--;c[i+2]--;const ok=groups(c);c[i]++;c[i+1]++;c[i+2]++;if(ok)return true}return false}
function winning(hand,open=0){if(hand.length!==14-open*3)return false;let c=counts(hand);if(!open&&c.filter(n=>n===2).length===7)return true;const ends=[0,8,9,17,18,26,27,28,29,30,31,32,33];if(!open&&ends.every(i=>c[i]>0)&&ends.some(i=>c[i]>1))return true;for(let i=0;i<34;i++)if(c[i]>=2){c[i]-=2;const ok=groups(c);c[i]+=2;if(ok)return true}return false}
function waits(hand,open=0,exposed=[]){if(hand.length!==13-open*3)return [];const c=counts([...hand,...exposed]),out=[];for(let i=0;i<34;i++)if(c[i]<4&&winning([...hand,i],open))out.push(i);return out}
function riichiOptions(){if(state.melds.length||state.pending)return [];return state.hands[0].map((t,i)=>waits(state.hands[0].filter((_,j)=>i!==j)).length?i:-1).filter(i=>i>=0)}
function tile(t,small=false){
 const el=document.createElement('span'),base=baseTile(t),suit=Math.floor(base/9),rank=base%9+1,red=t>=34;
 el.className='tile art-tile'+(small?' small':'')+(red?' aka':'')+' '+(base<27?['man','pin','sou'][suit]:'honor');
 el.title=tileName(t);el.setAttribute('aria-label',tileName(t));
 let face='';
 if(base<9)face='<span class="man-number">'+['一','二','三','四','五','六','七','八','九'][rank-1]+'</span><span class="man-mark">萬</span>';
 else if(base<27){
  const layouts={1:[[50,50]],2:[[50,26],[50,74]],3:[[28,24],[50,50],[72,76]],4:[[28,25],[72,25],[28,75],[72,75]],5:[[27,24],[73,24],[50,50],[27,76],[73,76]],6:[[28,22],[72,22],[28,50],[72,50],[28,78],[72,78]],7:[[50,14],[28,38],[72,38],[28,60],[72,60],[28,82],[72,82]],8:[[28,17],[72,17],[28,39],[72,39],[28,61],[72,61],[28,83],[72,83]],9:[[24,20],[50,20],[76,20],[24,50],[50,50],[76,50],[24,80],[50,80],[76,80]]};
  face='<svg class="suit-art" viewBox="0 0 100 100" aria-hidden="true">'+layouts[rank].map(([x,y])=>suit===1?'<g transform="translate('+x+' '+y+')"><circle r="10" fill="currentColor"/><circle r="5.5" fill="#fff7e4"/><circle r="2.5" fill="currentColor"/></g>':'<g transform="translate('+x+' '+y+')"><rect x="-5" y="-11" width="10" height="22" rx="3" fill="currentColor"/><path d="M-7,-5H7M-7,5H7" stroke="#fff7e4" stroke-width="2.5"/></g>').join('')+'</svg>';
 }else face='<span class="honor-mark '+(base===31?'white-dragon':base===32?'green-dragon':base===33?'red-dragon':'')+'">'+(base===31?'':names[base])+'</span>';
 el.innerHTML='<span class="tile-face" aria-hidden="true"><span class="tile-corner">'+(red?'赤':base<27?rank:['E','S','W','N','□','F','C'][base-27])+'</span><span class="tile-symbol">'+face+'</span><span class="tile-tech">'+(red?'RED • 05':'NEW ERIDU')+'</span></span>';
 return el;
}
function render(){for(let p=0;p<4;p++){$('river'+p).replaceChildren(...state.rivers[p].map(t=>tile(t,true)))}$('wall').textContent=state.wall.length;$('round').textContent=round;$('dora').replaceChildren(tile(state.indicator,true));const h=$('hand');h.replaceChildren();state.hands[0].forEach((t,i)=>{const b=document.createElement('button'),v=tile(t);b.className=v.className+(i===selected?' selected':'');b.innerHTML=v.innerHTML;b.setAttribute('aria-label',tileName(t)+(state.drawn&&i===state.hands[0].length-1?' 摸入':''));b.setAttribute('aria-pressed',i===selected);b.disabled=state.turn!==0||state.over||!!state.pending||state.forbidden.includes(baseTile(t))||(state.riichi&&i!==state.hands[0].length-1);b.onclick=()=>{tone(540);if(selected===i)discard();else{selected=i;render()}};h.appendChild(b)});const active=state.turn===0&&!state.over&&!state.pending;$('discard').disabled=!active||selected<0;$('win').disabled=!active||!canSelfDraw();$('riichi').disabled=!active||state.riichi||state.wall.length<4||!riichiOptions().length;$('riichi').textContent=state.riichi?'已立直':riichiPick?'取消立直':'立直';$('tilelabel').textContent=selected>=0?tileName(state.hands[0][selected]):'选择一张牌';$('status').textContent=state.over?'本局结束':state.turn===0?(state.riichi?'已立直 · 摸切或自摸':riichiPick?'选择听牌切牌':'轮到你出牌'):['','比利正在思考…','雅正在思考…','艾莲正在思考…'][state.turn];if(riichiPick){$('hint').textContent='可切：'+riichiOptions().map(i=>tileName(state.hands[0][i])).filter((v,i,a)=>a.indexOf(v)===i).join('、')}else if(state.riichi){$('hint').textContent='等待：'+state.waiting.map(i=>names[i]).join('、')}else{$('hint').textContent=state.forbidden.length?'副露后请切牌 · 禁止食替':state.melds.length?'开门：支持断幺九／役牌自摸；不可立直':'点击选择，再次点击或按“切牌”确认'}renderCalls()}
function newGame(){timers.forEach(clearTimeout);timers=[];clearEffects();$('cutin').hidden=true;if(typeof hideCallEffect==='function')hideCallEffect();if($('modal').open)$('modal').close();const wall=Array.from({length:136},(_,i)=>Math.floor(i/4));for(let suit=0;suit<3;suit++)wall[(suit*9+4)*4]=34+suit;for(let i=wall.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[wall[i],wall[j]]=[wall[j],wall[i]]}const dead=wall.splice(-14);state={wall,hands:[[],[],[],[]],rivers:[[],[],[],[]],indicator:dead[4],dead,turn:0,over:false,riichi:false,waiting:[],melds:[],pending:null,forbidden:[],drawn:true};for(let p=0;p<4;p++){state.hands[p]=wall.splice(-13).sort(tileSort)}state.hands[0].push(wall.pop());round++;selected=-1;riichiPick=false;$('quote').textContent='好啦，这一局就交给你了。';render()}
let actionEffects=[];
function clearEffects(){for(const fx of actionEffects)fx.remove();actionEffects=[];document.querySelectorAll?.(".character-sprite").forEach(p=>p.classList.remove("discarding"));}
function animateDiscard(player){
 if(document.body.classList.contains('no-motion')||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const target=$('river'+player).lastElementChild;
 if(!target?.animate)return;
 const board=document.querySelector('.world'),rect=board.getBoundingClientRect(),tr=target.getBoundingClientRect(),scale=rect.width/1000,br={width:1000,height:2000/3};
 const x=(tr.left+tr.width/2-rect.left)/scale,y=(tr.top+tr.height/2-rect.top)/scale;
 const origins=[[550,470],[800,280],[450,197],[200,385]];
 const [sx,sy]=origins[player];
 const person=board.querySelector?.('.person-'+player+' .character-sprite');
 if(person){person.classList.remove('discarding');void person.offsetWidth;person.classList.add('discarding');later(()=>person.classList.remove('discarding'),1200)}
 target.animate([{opacity:0},{opacity:0,offset:.99},{opacity:1}],{duration:650});
 const fly=target.cloneNode(true);fly.className+=' flying-tile';fly.style.opacity='0';board.appendChild(fly);actionEffects.push(fly);
 fly.animate([{transform:`translate(${sx}px,${sy}px) translate(-50%,-50%) rotate(-22deg) scale(2.2)`,opacity:1},{transform:`translate(${x}px,${y}px) translate(-50%,-50%) rotate(0deg) scale(1)`,opacity:1}],{duration:250,delay:400,easing:'cubic-bezier(.16,.8,.28,1)',fill:'forwards'});
 const burst=document.createElement('img');burst.src='impact.png';burst.className='impact-art';burst.alt='';burst.style.left=x+'px';burst.style.top=y+'px';board.appendChild(burst);actionEffects.push(burst);
 burst.animate([{opacity:0,transform:'translate(-50%,-50%) scale(.15)'},{opacity:0,transform:'translate(-50%,-50%) scale(.15)',offset:.54},{opacity:.95,transform:'translate(-50%,-50%) scale(.65)',offset:.56},{opacity:0,transform:'translate(-50%,-50%) scale(1.25)'}],{duration:1200,fill:'forwards'});
 const banner=document.createElement('div');banner.className='discard-banner '+(player===0?'nicole-banner':'opponent-banner');
 const label=document.createElement('b');label.textContent=['妮可','比利','雅','艾莲'][player]+' / 切';banner.appendChild(label);
 const name=document.createElement('span');name.textContent=tileName(state.rivers[player].at(-1));banner.appendChild(name);board.appendChild(banner);actionEffects.push(banner);
 banner.animate([{opacity:0,transform:'translateX(-110%) skewX(-7deg)'},{opacity:1,transform:'translateX(0) skewX(-7deg)',offset:.2},{opacity:1,transform:'translateX(0) skewX(-7deg)',offset:.7},{opacity:0,transform:'translateX(30%) skewX(-7deg)'}],{duration:900,fill:'forwards'});
 const surface=board.querySelector?.('.table-layer')||board;surface.animate([{transform:'translate(0,0)'},{transform:'translate(2px,1px)'},{transform:'translate(-2px,0)'},{transform:'translate(0,0)'}],{duration:150,delay:650});
 later(()=>{fly.remove();tone(190)},650);
 later(()=>{for(const el of [fly,burst,banner])el.remove();actionEffects=actionEffects.filter(el=>![fly,burst,banner].includes(el))},1230);
}
function cutin(title='RIICHI!',sub='立 直'){if(document.body.classList.contains('no-motion')||matchMedia('(prefers-reduced-motion: reduce)').matches)return;$('cut-title').textContent=title;$('cut-sub').textContent=sub;$('cutin').hidden=false;tone(700);later(()=>$('cutin').hidden=true,1800)}
function show(html){$('modalbody').innerHTML=html;$('modal').showModal()}
function finish(winner){state.over=true;render();if(winner>=0){if(winner===0)cutin('TSUMO!','自 摸');const who=['妮可 · 你','比利','雅','艾莲'][winner];$('quote').textContent=winner===0?'这笔收入，我就收下啦。':'别急，下一局赢回来。';later(()=>{show('<h2>'+who+' 自摸</h2><div id="result-hand" style="display:flex;gap:3px;flex-wrap:wrap"></div><p>'+(winner===0&&state.melds.length?openYaku().join(' · '):'门前清自摸和')+(winner===0&&state.riichi?' · 立直':'')+'</p><p>练习局只验证和牌牌形，不结算符数、番数或点数。</p><button id="next" class="primary">再来一局 ↗</button>');$('result-hand').replaceChildren(...[...state.hands[winner],...(winner===0?state.melds.flatMap(m=>m.tiles):[])].map(t=>tile(t,true)));$('next').onclick=newGame},winner===0?1800:200)}else{show('<h2>荒牌流局</h2><p>牌山已摸完。'+(waits(state.hands[0],state.melds.length,state.melds.flatMap(m=>m.tiles)).length?'你已听牌。':'这一局尚未听牌。')+'</p><button id="next" class="primary">再来一局 ↗</button>');$('next').onclick=newGame}}
function discard(){if(state.over||state.pending||state.turn!==0||selected<0||selected>=state.hands[0].length||state.forbidden.includes(baseTile(state.hands[0][selected])))return;if(state.riichi&&selected!==state.hands[0].length-1)return;if(riichiPick&&!riichiOptions().includes(selected)){ $('hint').textContent='这张牌切出后无法听牌，请选择提示中的牌。';return}state.rivers[0].push(state.hands[0].splice(selected,1)[0]);state.hands[0].sort(tileSort);if(riichiPick){state.riichi=true;state.waiting=waits(state.hands[0]);riichiPick=false;cutin();$('quote').textContent='筹码押上了，可别让我失望。'}selected=-1;state.forbidden=[];state.drawn=false;tone(280);state.turn=1;render();animateDiscard(0);later(bot,1300)}
function botChoice(hand){let best=-Infinity,choice=0;for(let i=0;i<hand.length;i++){const kept=hand.filter((_,j)=>j!==i),c=counts(kept);let score=waits(kept).length*50;for(let t=0;t<34;t++){score+=c[t]>=3?10:c[t]===2?5:0;if(t<27){if(t%9<8)score+=Math.min(c[t],c[t+1])*2;if(t%9<7)score+=Math.min(c[t],c[t+2])}}if(score>best){best=score;choice=i}}return choice}
function openYaku(){
 const all=[...state.hands[0],...state.melds.flatMap(m=>m.tiles)].map(baseTile),c=counts(all),yaku=[];
 if(all.every(t=>t<27&&t%9!==0&&t%9!==8))yaku.push('断幺九');
 for(const t of [27,31,32,33])if(c[t]>=3)yaku.push(t===27?'役牌 · 东（场风／自风）':'役牌 · '+names[t]);
 return yaku;
}
function canSelfDraw(){return state.drawn&&winning(state.hands[0],state.melds.length)&&(!state.melds.length||openYaku().length>0)}
function callOptions(from,called){
 if(state.riichi||state.over||state.melds.length>=4||!state.wall.length)return [];
 const hand=state.hands[0],t=baseTile(called),result=[],seen=new Set();
 for(let i=0;i<hand.length;i++)for(let j=i+1;j<hand.length;j++){
  const vals=[baseTile(hand[i]),baseTile(hand[j]),t].sort((a,b)=>a-b);
  const kind=vals.every(v=>v===t)?'pon':from===3&&t<27&&Math.floor(vals[0]/9)===Math.floor(vals[2]/9)&&vals[1]===vals[0]+1&&vals[2]===vals[0]+2?'chi':null;
  if(!kind)continue;
  const forbidden=[t];
  if(kind==='chi'){if(t===vals[0]&&t%9<6)forbidden.push(t+3);if(t===vals[2]&&t%9>=3)forbidden.push(t-3)}
  if(!hand.some((v,k)=>k!==i&&k!==j&&!forbidden.includes(baseTile(v))))continue;
  const key=kind+':'+[hand[i],hand[j]].sort((a,b)=>a-b).join(',');if(seen.has(key))continue;seen.add(key);
  result.push({kind,indices:[i,j],forbidden});
 }
 return result;
}
function renderCalls(){
 const panel=$('call-panel'),choices=$('call-choices');choices.replaceChildren();panel.hidden=!state.pending;
 const melds=$('melds');melds.replaceChildren();melds.hidden=!state.melds.length;
 state.melds.forEach(m=>{const group=document.createElement('div');group.className='meld';const label=document.createElement('small');label.textContent=(m.kind==='chi'?'吃':'碰')+' · '+['','下家','对家','上家'][m.from];group.appendChild(label);m.tiles.forEach((t,i)=>{const v=tile(t,true);if(i===m.claimedIndex)v.classList.add('claimed');group.appendChild(v)});melds.appendChild(group)});
 if(!state.pending)return;
 $('status').textContent='可以鸣牌 · 等待你的选择';$('hint').textContent='吃仅限上家，碰可来自任意一家；也可跳过';
 $('call-label').textContent=['','比利','雅','艾莲'][state.pending.from]+' 切出 '+tileName(state.pending.tile);
 state.pending.options.forEach((option,index)=>{const button=document.createElement('button');button.className='call-choice';button.setAttribute('aria-label',(option.kind==='chi'?'吃':'碰')+' '+option.indices.map(i=>tileName(state.hands[0][i])).join('、'));const art=document.createElement('img');art.src=option.kind+'-fx.png';art.alt=option.kind==='chi'?'吃':'碰';button.appendChild(art);option.indices.forEach(i=>button.appendChild(tile(state.hands[0][i],true)));button.onclick=()=>claimCall(index);choices.appendChild(button)});
}
function advanceAfterDiscard(from){
 if(state.over)return;state.pending=null;state.turn=(from+1)%4;
 if(state.turn===0){if(!state.wall.length){finish(-1);return}state.hands[0].push(state.wall.pop());state.drawn=true;selected=state.riichi?state.hands[0].length-1:-1;render();tone(500)}else{render();later(bot,1300)}
}
function passCall(){if(!state.pending)return;const from=state.pending.from;advanceAfterDiscard(from)}
function claimCall(index){
 if(!state.pending||state.over)return;
 const pending=state.pending,option=callOptions(pending.from,pending.tile)[index];
 if(!option||state.rivers[pending.from].at(-1)!==pending.tile)return;
 const own=option.indices.map(i=>state.hands[0][i]);
 option.indices.slice().sort((a,b)=>b-a).forEach(i=>state.hands[0].splice(i,1));
 const called=state.rivers[pending.from].pop(),tiles=own.sort(tileSort),claimedIndex=pending.from===3?0:pending.from===2?1:2;tiles.splice(claimedIndex,0,called);
 state.melds.push({kind:option.kind,tiles,from:pending.from,claimedIndex});state.pending=null;state.forbidden=option.forbidden;state.drawn=false;state.turn=0;selected=-1;riichiPick=false;clearEffects();render();
 if(typeof playCallEffect==='function')playCallEffect(option.kind,false);
}
function bot(){
 if(state.over||state.pending||state.turn===0)return;
 if(!state.wall.length){finish(-1);return}
 const p=state.turn;state.hands[p].push(state.wall.pop());if(winning(state.hands[p])){finish(p);return}
 const i=botChoice(state.hands[p]),called=state.hands[p].splice(i,1)[0];state.rivers[p].push(called);
 const options=callOptions(p,called);
 if(options.length){state.pending={from:p,tile:called,options};render();animateDiscard(p)}else{advanceAfterDiscard(p);animateDiscard(p)}
}
$('call-pass').onclick=passCall;
$('scene').onclick=()=>{const roof=document.body.classList.toggle('rooftop');$('scene').textContent='光线：'+(roof?'日光':'夜场')+' ↻'};
$('discard').onclick=discard;$('new').onclick=()=>show('<h2>重新发牌？</h2><p>当前练习局将结束。</p><button class="primary" id="reset">重新开始</button>');document.addEventListener('click',e=>{if(e.target.id==='reset')newGame()});$('win').onclick=()=>{if(state.turn===0&&!state.over&&!state.pending&&canSelfDraw())finish(0)};$('riichi').onclick=()=>{if(state.turn!==0||state.over||state.pending||state.melds.length||state.riichi||state.wall.length<4||!riichiOptions().length)return;riichiPick=!riichiPick;render()};$('close').onclick=()=>$('modal').close();$('sound').onclick=()=>{sound=!sound;$('sound').textContent='声音 '+(sound?'ON':'OFF');$('sound').setAttribute('aria-pressed',sound);tone()};$('motion').onclick=()=>{const off=document.body.classList.toggle('no-motion');$('motion').textContent='动作特效 '+(off?'OFF':'ON');$('motion').setAttribute('aria-pressed',!off);if(off){$('cutin').hidden=true;clearEffects()}};$('rules').onclick=()=>show('<h2>妮可的吃碰练习桌</h2><p>与三个电脑轮流摸牌、切牌。凑齐四组面子与一对雀头，也支持七对子、国士无双。</p><ul><li>点击手牌选中，再点一次或按“切牌”。</li><li>切牌后能听牌时，可选择“立直”。立直后只能摸切或自摸。</li><li>满足和牌牌形时，“自摸”按钮会亮起。</li></ul><p>此版为动态美术与吃碰练习原型：已支持玩家吃碰；暂不支持杠、荣和、完整役种、符番计分与东风战进程。宝牌指示仅作展示；每门一张红五，暂不计番。上家出牌可吃，任意对手出牌可碰；鸣牌后不可立直，禁止食替。开门后目前仅支持断幺九、役牌自摸。电脑仅使用自身手牌决策。</p><p>每次切牌都有飞牌、落桌冲击与短分镜；立直、自摸播放更大的角色演出。四名角色各用独立的六帧出牌序列：准备、伸手、放牌、跟随、收手、归位。飞牌与落桌特效由独立图层同步播放。非官方同人作品。</p>');document.addEventListener('keydown',e=>{if($('modal').open||state.over)return;if(state.pending){if(e.key==='Escape')passCall();return}if(state.turn!==0)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();selected=state.riichi?state.hands[0].length-1:(selected+(e.key==='ArrowRight'?1:-1)+state.hands[0].length)%state.hands[0].length;render()}if(e.key==='Enter'&&document.activeElement.tagName!=='BUTTON')discard()});
newGame();
if(typeof ResizeObserver!=='undefined'){
 const viewport=document.querySelector('.board'),world=document.querySelector('.world');
 const resize=()=>world.style.setProperty('--scene-scale',viewport.clientWidth/1000);
 new ResizeObserver(resize).observe(viewport);resize();
}
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'read_mahjong_table',description:'Read the visible player hand, rivers and turn, without revealing opponents hands or the hidden wall.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({hand:state.hands[0].map(tileName),rivers:state.rivers.map(r=>r.map(tileName)),melds:state.melds.map(m=>({kind:m.kind,from:m.from,tiles:m.tiles.map(tileName)})),callAvailable:!!state.pending,remaining:state.wall.length,turn:state.turn,over:state.over})})).catch(()=>{})}catch{}}
