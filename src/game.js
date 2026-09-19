'use strict';
const {Majiang,RULE,CHARACTERS:DEFAULT_CHARACTERS,WINDS,handTiles,tileId,tileFile,meldKind,meldTiles,HumanPlayer,Match}=require('./engine');
const $=id=>document.getElementById(id);
const NAMES=['一萬','二萬','三萬','四萬','五萬','六萬','七萬','八萬','九萬','一筒','二筒','三筒','四筒','五筒','六筒','七筒','八筒','九筒','一索','二索','三索','四索','五索','六索','七索','八索','九索','東','南','西','北','白','發','中'];
const CHARACTERS=DEFAULT_CHARACTERS.slice();
const WIN_ART=['nicole','billy','miyabi','ellen'];
const WIN_COLORS=['#ff4d9b','#ff9a4d','#7fddff','#ff4664'];
const tileName=p=>{const id=typeof p==='number'?p:tileId(p);return id>=34?'赤 '+NAMES[[4,13,22][id-34]]:NAMES[id]};
let match,human,decision=null,reply=null,selected=-1,riichiPick=false,kanPick=false,callFilter=null,skippedActions=false,lastTileTap=0,lastText='正在发牌…',sound=false,ctx,actionEffects=[],effectsTimers=[],resultOpen=false;
const later=(fn,ms)=>{const id=setTimeout(fn,ms);effectsTimers.push(id);return id};
function tone(freq=450){if(!sound)return;try{ctx??=new(window.AudioContext||window.webkitAudioContext)();ctx.resume();const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.value=freq;o.connect(g);g.connect(ctx.destination);g.gain.setValueAtTime(.045,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.13);o.start();o.stop(ctx.currentTime+.14)}catch{}}
function tile(p,small=false){const id=typeof p==='number'?p:tileId(p),el=document.createElement('span');el.className='tile art-tile png-tile'+(small?' small':'')+(id>=34?' aka':'');el.title=tileName(p);el.setAttribute('aria-label',tileName(p));const img=document.createElement('img');img.src='tiles/'+tileFile(p)+'.png';img.alt='';img.draggable=false;el.appendChild(img);return el}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function clearEffects(){effectsTimers.forEach(clearTimeout);effectsTimers=[];for(const fx of actionEffects)fx.remove();actionEffects=[];document.querySelectorAll('.character-sprite').forEach(p=>p.classList.remove('discarding'));$('cutin').hidden=true;$('call-fx').hidden=true}
class BotWorker{
 constructor(){this.worker=new Worker('ai-worker.js?v='+__BUILD_VERSION__);this.pending=new Map();this.sequence=0;this.alive=true;this.worker.onmessage=({data})=>{if(!this.alive)return;if(data.error)return failMatch('电脑计算中断，请重新开始对局。');const cb=this.pending.get(data.id);this.pending.delete(data.id);cb?.(data.result)};this.worker.onerror=()=>{if(this.alive)failMatch('电脑载入失败，请刷新页面后重试。')}}
 action(message,callback){const id=++this.sequence;if(callback)this.pending.set(id,callback);this.worker.postMessage({id,message,reply:!!callback})}
 dispose(){this.alive=false;this.worker.terminate();this.pending.clear()}
}
function failMatch(text){match?.dispose();decision=null;reply=null;lastText=text;render();show('<h2>对局已暂停</h2><p>'+text+'</p><button id="restart-error">重新开始</button>');$('restart-error').onclick=newGame}
function submit(answer){if(!reply)return;const cb=reply;reply=null;decision=null;riichiPick=false;kanPick=false;callFilter=null;selected=-1;if(resultOpen){resultOpen=false;$('modal').close();$('victory').close();$('modal').classList.remove('winner-result')}render();cb(answer)}
function onDecision(options,callback){skippedActions=false;lastTileTap=0;decision=options;reply=callback;selected=-1;riichiPick=false;kanPick=false;callFilter=null;if(['result','draw','match'].includes(options.type)){if(options.type==='result')showVictory(options);else showResult(options);render();return}render()}
function newGame(dealer){skippedActions=false;lastTileTap=0;$('round-info').hidePopover();match?.dispose();clearEffects();if($('modal').open)$('modal').close();if($('victory').open)$('victory').close();$('modal').classList.remove('winner-result');resultOpen=false;decision=null;reply=null;selected=-1;riichiPick=false;kanPick=false;callFilter=null;lastText='正在发牌…';human=new HumanPlayer(onDecision);match=new Match([human,new BotWorker(),new BotWorker(),new BotWorker()],()=>{},RULE,'Nicole • Riichi Club · 东风战');match.model.player=CHARACTERS.slice();match.speed=4;match.wait=0;match.view={kaiju:render,redraw:()=>{clearEffects();lastText='新一局开始';render()},update:onEvent,say:()=>{},summary:render};match.kaiju(Number.isInteger(dealer)?dealer:undefined);}
function onEvent(event){render();if(!event)return;const [type,data]=Object.entries(event)[0],id=data.l==null?null:match.model.player_id[data.l];if(type==='dapai'){lastText=CHARACTERS[id]+' 切出 '+tileName(data.p);animateDiscard(id,data.p);if(data.p.includes('*')){lastText=CHARACTERS[id]+' 立直';playWords('立直','RIICHI',id)}}else if(type==='fulou'||type==='gang'){const kind=type==='gang'?'kan':meldKind(data.m);lastText=CHARACTERS[id]+' '+({chi:'吃',pon:'碰',kan:'杠'}[kind]);playCallEffect(kind,id)}else if(type==='zimo'||type==='gangzimo'){lastText=id===0?(type==='gangzimo'?'岭上摸牌 · 请选择出牌':'轮到你出牌'):CHARACTERS[id]+' 正在思考…'}else if(type==='hule'){lastText=CHARACTERS[id]+(data.baojia==null?' 自摸':' 荣和');$('cutin').hidden=true}else if(type==='pingju'){lastText='本局流局'}render()}
function ownSeat(){return match.model.player_id.indexOf(0)}
function discardCode(index){const hand=match.model.shoupai[ownSeat()],tiles=handTiles(hand);return tiles[index]+(hand._zimo?.length===2&&index===tiles.length-1?'_':'')}
function selectDiscard(index){if(decision?.type!=='turn')return;const p=discardCode(index),allowed=riichiPick?decision.riichi:decision.discards;if(!allowed.includes(p))return;const now=performance.now();if(selected===index&&now-lastTileTap<450){lastTileTap=0;discard()}else{selected=index;lastTileTap=now;tone(540);render()}}
function discard(){if(decision?.type!=='turn'||selected<0)return;const p=discardCode(selected),allowed=riichiPick?decision.riichi:decision.discards;if(allowed.includes(p))submit({dapai:p+(riichiPick?'*':'')})}
function renderMeld(m,small=true){const group=document.createElement('div');group.className='meld';group.title=meldKind(m)==='kan'?(/[+=-]/.test(m)?'明杠／加杠':'暗杠'):meldKind(m)==='pon'?'碰':'吃';const tiles=meldTiles(m),closed=meldKind(m)==='kan'&&!/[+=-]/.test(m);let calledSlot;tiles.forEach((t,i)=>{const v=tile(t.p,small);if(closed&&(i===0||i===3)){v.className='tile tile-back'+(small?' small':'');v.replaceChildren();v.setAttribute('aria-label','暗杠背面')}if(/[+=-]\d$/.test(m)&&i===tiles.length-1&&calledSlot){v.classList.add('added-kan');calledSlot.appendChild(v);return}if(t.called){v.classList.add('claimed');calledSlot=document.createElement('span');calledSlot.className='meld-called';calledSlot.appendChild(v);group.appendChild(calledSlot)}else group.appendChild(v)});return group}
function render(){if(!match?.model.shan)return;const model=match.model,seat=ownSeat(),hand=model.shoupai[seat];
 $('round-label').textContent=WINDS[model.zhuangfeng]+' '+(model.jushu+1)+' 局';$('my-points').textContent=model.defen[0].toLocaleString();$('round-info-title').textContent=$('round-label').textContent;$('wall').textContent=model.shan.paishu;$('sticks').textContent=model.changbang+' 本场 · '+model.lizhibang+' 供托';$('dora').replaceChildren(...model.shan.baopai.map(p=>tile(p,true)));
 for(let l=0;l<4;l++){const id=model.player_id[l],river=$('river'+id);river.replaceChildren(...model.he[l]._pai.map(p=>{const v=tile(p,true);if(/[+=-]$/.test(p))v.classList.add('called-away');if(p.includes('*'))v.classList.add('riichi-tile');return v}));const score=$('score'+id);score.querySelector('small').textContent=WINDS[l]+'家'+(l===0?' · 庄':'')+(model.shoupai[l].lizhi?' · 立直':'');score.querySelector('b').textContent=model.defen[id].toLocaleString();score.classList.toggle('active-seat',model.lunban===l);$('riichi-stick'+id).hidden=!model.shoupai[l].lizhi;$('seat-label'+id).textContent=CHARACTERS[id]+' · '+WINDS[l]+'家';$('board-melds'+id).replaceChildren(...model.shoupai[l]._fulou.map(m=>renderMeld(m)));if(id!==0){const backs=$('backs'+id);backs.replaceChildren();for(let i=0;i<handTiles(model.shoupai[l]).length;i++){const back=document.createElement('span');back.className='tile-back';back.setAttribute('aria-hidden','true');backs.appendChild(back)}backs.setAttribute('aria-label',CHARACTERS[id]+' · '+handTiles(model.shoupai[l]).length+' 张暗牌')}}
 $('melds').replaceChildren(...hand._fulou.map(m=>renderMeld(m)));$('melds').hidden=!hand._fulou.length;
 const handNode=$('hand');handNode.replaceChildren();handTiles(hand).forEach((p,i)=>{const v=tile(p),b=document.createElement('button');b.className=v.className+(selected===i?' selected':'')+(hand._zimo?.length===2&&i===handTiles(hand).length-1?' drawn':'');b.replaceChildren(...v.childNodes);b.title=tileName(p);b.setAttribute('aria-label',tileName(p)+(b.classList.contains('drawn')?' 摸入':''));b.setAttribute('aria-pressed',selected===i);const legal=decision?.type==='turn'?(riichiPick?decision.riichi:decision.discards):[];b.disabled=!legal.includes(discardCode(i));b.onclick=()=>selectDiscard(i);handNode.appendChild(b)});
 $('win').disabled=decision?.type!=='turn'||!decision.win;$('riichi').disabled=decision?.type!=='turn'||!decision.riichi.length;$('riichi').querySelector('.action-caption').textContent=hand.lizhi?'已立直':riichiPick?'取消立直':'立直';for(const kind of ['chi','pon','kan']){const available=decision?.type==='response'?decision.calls.some(m=>meldKind(m)===kind):kind==='kan'&&decision?.type==='turn'&&decision.kan.length>0;$(kind).disabled=!available||skippedActions;$(kind).hidden=$(kind).disabled;$(kind).setAttribute('aria-expanded',kind==='kan'&&decision?.type==='turn'?kanPick:callFilter===kind);$(kind).title=available?'选择'+({chi:'吃',pon:'碰',kan:'杠'}[kind])+'牌组合':({chi:'上家弃牌可组成顺子时可吃',pon:'对手弃牌与你的对子相同时可碰',kan:'持有四张同牌或可加杠时开放'}[kind])}$('abort').hidden=decision?.type!=='turn'||!decision.abort||skippedActions;
 $('win').hidden=$('win').disabled||skippedActions;$('riichi').hidden=$('riichi').disabled||skippedActions;
 $('ron').hidden=decision?.type!=='response'||!decision.win; $('ron').disabled=$('ron').hidden;
 $('call-pass').hidden=decision?.type==='response'?false:decision?.type!=='turn'||skippedActions||!([decision.win,decision.riichi.length,decision.kan.length,decision.abort].some(Boolean));
 $('status').textContent=decision?.type==='response'?(decision.rob?'抢杠机会':'可以鸣牌／荣和'):decision?.type==='turn'?(riichiPick?'立直 · 选择切牌':hand.lizhi?'已立直 · 摸切／自摸':'双击手牌打出'):lastText;
 const shanten=Majiang.Util.xiangting(hand);$('hint').textContent=decision?.type==='response'?'荣和优先；跳过荣和会进入振听':riichiPick?'切出高亮牌并支付 1,000 点':hand.lizhi?'立直后只可摸切、合法暗杠或和牌':shanten===0?(hand._zimo?'可保持听牌 · 请选择切牌':'听牌 · '+(Majiang.Util.tingpai(hand)||[]).map(tileName).join('、')):shanten<0?'牌形完成，须有役才能和牌':shanten+' 向听 · 吃碰后不可立直';$('tilelabel').textContent=selected>=0?tileName(handTiles(hand)[selected]):'选择一张牌';renderChoices();
}
function actionButton(label,action,meld,kind){const b=document.createElement('button');b.className='call-choice';b.setAttribute('aria-label',label+(meld?' '+meldTiles(meld).map(t=>tileName(t.p)).join('、'):''));if(kind){const img=document.createElement('img');img.src=kind==='ron'?'actions/ron.png':kind+'-fx.png';img.alt=label;b.appendChild(img)}else{const text=document.createElement('strong');text.textContent=label;b.appendChild(text)}if(meld)meldTiles(meld).forEach(t=>b.appendChild(tile(t.p,true)));b.onclick=action;return b}
function renderChoices(){const panel=$('call-panel'),choices=$('call-choices');choices.replaceChildren();const response=decision?.type==='response';panel.hidden=response?!callFilter:!(kanPick&&decision?.kan.length);if(panel.hidden)return;if(response){$('call-label').textContent=CHARACTERS[match.model.player_id[decision.from]]+' '+(decision.rob?'加杠':'切出')+' '+tileName(decision.tile);for(const m of decision.calls){const kind=meldKind(m);if(callFilter&&kind!==callFilter)continue;choices.appendChild(actionButton({chi:'吃',pon:'碰',kan:'杠'}[kind],()=>submit({fulou:m}),m,kind))}}else{$('call-label').textContent='选择暗杠／加杠';for(const m of decision.kan)choices.appendChild(actionButton(/[+=-]/.test(m)?'加杠':'暗杠',()=>submit({gang:m}),m,'kan'))}}
let callEffectTimer;
function playCallEffect(kind,id=0,preview=false){
 const layer=$('call-fx');clearTimeout(callEffectTimer);
 $('call-character').src='calls/'+WIN_ART[id]+'-'+kind+'.png';
 $('call-character').alt=CHARACTERS[id]+' · '+{chi:'吃',pon:'碰',kan:'杠'}[kind]+' 专属动作';
 $('call-badge').src=kind+'-fx.png';$('call-badge').alt={chi:'吃 Chi',pon:'碰 Pon',kan:'杠 Kan'}[kind];
 layer.style.setProperty('--action-color',WIN_COLORS[id]);
 layer.querySelector('small').textContent=(preview?'演出预览 · ':'')+CHARACTERS[id]+' · '+{chi:'吃',pon:'碰',kan:'杠'}[kind];
 layer.hidden=false;layer.classList.remove('playing');void layer.offsetWidth;layer.classList.add('playing');
 tone(kind==='kan'?220:660);callEffectTimer=later(()=>layer.hidden=true,2100);
}
function chooseCallKind(kind){
 if(decision?.type==='response'&&decision.calls.some(m=>meldKind(m)===kind)){callFilter=callFilter===kind?null:kind;render();return}
 if(kind==='kan'&&decision?.type==='turn'&&decision.kan.length){kanPick=!kanPick;riichiPick=false;selected=-1;render()}
}
function playWords(title,english,id){if(document.body.classList.contains('no-motion')||matchMedia('(prefers-reduced-motion: reduce)').matches)return;document.querySelector('.cut-art').style.backgroundImage='url(winners/'+WIN_ART[id]+'.png)';document.querySelector('.cut-words small').textContent=CHARACTERS[id];$('cut-title').textContent=title;$('cut-sub').textContent=CHARACTERS[id]+' · '+english;$('cutin').hidden=false;later(()=>$('cutin').hidden=true,1800)}
function show(html){$('modalbody').innerHTML=html;if(!$('modal').open)$('modal').showModal()}
const DRAW_NAMES={'荒牌平局':'荒牌流局','九種九牌':'九种九牌','四風連打':'四风连打','四家立直':'四家立直','四開槓':'四杠散了','三家和':'三家和流局','流し満貫':'流局满贯'};
function addWinAtmosphere(root){
 root.querySelector('.win-atmosphere')?.remove();
 const fx=document.createElement('div');fx.className='win-atmosphere';fx.setAttribute('aria-hidden','true');
 for(const name of ['win-halo','win-beam','win-streak','win-flare']){const el=document.createElement('i');el.className=name;fx.appendChild(el)}
 for(let i=0;i<18;i++){const el=document.createElement('i');el.className='win-spark';el.style.cssText=`--x:${(i*37+11)%100}%;--y:${(i*23+7)%100}%;--delay:${-(i%7)*.65}s;--duration:${3+i%4}s`;fx.appendChild(el)}
 root.prepend(fx);
}
function showVictory(options){
 resultOpen=true;const r=options.result,id=match.model.player_id[r.l],dialog=$('victory');
 clearEffects();if($('modal').open)$('modal').close();
 dialog.style.setProperty('--winner-color',WIN_COLORS[id]);addWinAtmosphere(dialog);
 $('victory-art').src='winners/'+WIN_ART[id]+'.png';$('victory-art').alt=CHARACTERS[id]+' 专属和牌立绘';
 $('victory-call-art').src='actions/'+(r.baojia==null?'tsumo':'ron')+'.png';$('victory-call-art').alt=r.baojia==null?'自摸':'荣和';
 $('victory-title').textContent=CHARACTERS[id]+' · '+(r.baojia==null?'自摸':'荣和');
 $('victory-sub').textContent=(r.damanguan?r.damanguan+' 倍役满':r.fanshu+' 番 '+r.fu+' 符')+' / '+r.defen.toLocaleString()+' 点';
 $('reveal-result').onclick=()=>{dialog.close();showResult(options)};
 if(!dialog.open)dialog.showModal();$('reveal-result').focus();
}
$('victory').addEventListener('cancel',e=>e.preventDefault());
function showResult(options){resultOpen=true;$('modal').classList.remove('winner-result');const result=options.result,model=match.model;
 if(options.type==='match'){show('<h2>东风战 · 终局</h2><div class="settlement">'+result.rank.map((rank,id)=>({rank,id})).sort((a,b)=>a.rank-b.rank).map(({rank,id})=>'<p><b>#'+rank+' '+CHARACTERS[id]+'</b><span>'+result.defen[id].toLocaleString()+' 点</span></p>').join('')+'</div><button id="next" class="primary">再开一场</button><button id="download-log">保存牌谱</button>');$('next').onclick=newGame;$('download-log').onclick=()=>downloadLog(result);return}
 const win=options.type==='result';const title=win?CHARACTERS[model.player_id[result.l]]+' '+(result.baojia==null?'自摸':'荣和 · '+CHARACTERS[model.player_id[result.baojia]]+' 放铳'):(DRAW_NAMES[result.name]||result.name);
 const detail=win?(result.damanguan?result.damanguan+' 倍役满':result.fanshu+' 番 '+result.fu+' 符')+' · '+result.defen.toLocaleString()+' 点':'';
 show('<h2>'+escapeHtml(title)+'</h2><strong class="result-points">'+detail+'</strong><div id="result-hand"></div><div class="yaku-list">'+(result.hupai||[]).map(h=>'<span>'+escapeHtml(h.name)+' <b>'+escapeHtml(h.fanshu)+' 番</b></span>').join('')+'</div>'+(result.fubaopai?.length?'<p>里宝牌指示</p><div id="ura"></div>':'')+'<div class="settlement">'+result.fenpei.map((delta,l)=>{const id=model.player_id[l];return '<p><b>'+CHARACTERS[id]+'</b><span>'+model.defen[id].toLocaleString()+' → '+(model.defen[id]+delta).toLocaleString()+'</span><em class="'+(delta>=0?'gain':'loss')+'">'+(delta>0?'+':'')+delta+'</em></p>'}).join('')+'</div><button id="next" class="primary">确认结算 · 继续</button>');
 if(win){const id=model.player_id[result.l];$('modal').classList.add('winner-result');$('modal').style.setProperty('--winner-color',WIN_COLORS[id]);addWinAtmosphere($('modal'));const art=document.createElement('img');art.src='winners/'+WIN_ART[id]+'.png';art.alt=CHARACTERS[id]+' 和牌立绘';art.className='settlement-art';const detail=document.createElement('div');detail.className='settlement-detail';detail.append(...$('modalbody').childNodes);$('modalbody').replaceChildren(art,detail);const h=Majiang.Shoupai.fromString(result.shoupai);$('result-hand').replaceChildren(...handTiles(h).map(p=>tile(p,true)),...h._fulou.map(m=>renderMeld(m)));if($('ura'))$('ura').replaceChildren(...result.fubaopai.map(p=>tile(p,true)))}else{result.shoupai.forEach((s,l)=>{if(!s)return;const label=document.createElement('p');label.textContent=CHARACTERS[model.player_id[l]]+' 听牌';$('result-hand').appendChild(label);const h=Majiang.Shoupai.fromString(s);handTiles(h).forEach(p=>$('result-hand').appendChild(tile(p,true)))})}$('next').onclick=()=>submit({});
}
function downloadLog(log){const blob=new Blob([JSON.stringify(log,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='nicole-riichi-'+Date.now()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function showGallery(){show('<h2>新艾利都 · 37 张特色牌</h2><p>本牌局直接使用这些 PNG；每门一张红五，计入赤宝牌。</p><div id="tile-catalog"></div>');const families=[['万子',0,9],['饼子',9,18],['索子',18,27],['字牌',27,34],['赤五',34,37]];for(const [label,start,end] of families){const h=document.createElement('h3');h.textContent=label;const row=document.createElement('div');row.className='catalog-row';for(let id=start;id<end;id++)row.appendChild(tile(id));$('tile-catalog').append(h,row)}}
$('round-info').addEventListener('toggle',e=>$('round-toggle').setAttribute('aria-expanded',String(e.newState==='open')));
$('ron').onclick=()=>{if(decision?.type==='response'&&decision.win)submit({hule:'-'})};$('win').onclick=()=>{if(decision?.type==='turn'&&decision.win)submit({hule:'-'})};$('riichi').onclick=()=>{if(decision?.type==='turn'&&decision.riichi.length){riichiPick=!riichiPick;selected=-1;kanPick=false;render()}};$('chi').onclick=()=>chooseCallKind('chi');$('pon').onclick=()=>chooseCallKind('pon');$('kan').onclick=()=>chooseCallKind('kan');$('abort').onclick=()=>{if(decision?.abort)submit({daopai:'-'})};$('call-pass').onclick=()=>{if(decision?.type==='response')submit({});else if(decision?.type==='turn'){skippedActions=true;riichiPick=false;kanPick=false;callFilter=null;selected=-1;lastTileTap=0;render()}};
$('new').onclick=()=>{if(resultOpen)return;show('<h2>重新开始东风战？</h2><p>当前点数和本场进度会重置，四人从 25,000 点开始。</p><button id="reset" class="primary">重新开始</button>');$('reset').onclick=()=>{match?.dispose();clearEffects();decision=null;reply=null;$('modal').close();openStart()}};$('close').onclick=()=>{if(!resultOpen)$('modal').close()};$('modal').addEventListener('cancel',e=>{if(resultOpen)e.preventDefault()});
$('sound').onclick=()=>{sound=!sound;$('sound').textContent='声音 '+(sound?'ON':'OFF');$('sound').setAttribute('aria-pressed',sound);tone()};$('motion').onclick=()=>{const off=document.body.classList.toggle('no-motion');$('motion').textContent='动作特效 '+(off?'OFF':'ON');$('motion').setAttribute('aria-pressed',!off);if(off)clearEffects()};$('scene').onclick=()=>{const roof=document.body.classList.toggle('rooftop');$('scene').textContent='光线：'+(roof?'日光':'夜场')+' ↻'};
$('preview-chi').onclick=()=>playCallEffect('chi',Number($('preview-character').value),true);$('preview-pon').onclick=()=>playCallEffect('pon',Number($('preview-character').value),true);$('preview-kan').onclick=()=>playCallEffect('kan',Number($('preview-character').value),true);$('tile-gallery').onclick=showGallery;
$('rules').onclick=()=>show('<h2>四人立直麻将 · 东风战</h2><p>四人各 25,000 点。庄家随机，按东一至东四推进；庄家和牌或听牌连庄。无人达到 30,000 点时进入南入延长；飞人结束。</p><ul><li>吃仅限上家；碰、明杠可接任意对手。荣和优先于碰杠，碰杠优先于吃。禁止食替。</li><li>暗杠、加杠、明杠后摸岭上牌并翻杠宝牌。加杠可被抢杠，四杠散了除单人四杠。</li><li>和牌必须有役。支持自摸、荣和、振听、同巡振听、立直振听，以及标准役种与符番计分。</li><li>门前听牌可付 1,000 点立直。支持一发、双立直、赤宝牌、里宝牌、杠宝牌；立直后仅允许不改变听牌的暗杠。</li><li>双响有效，三家和流局。流局听牌罚符 3,000 点，供托与本场按规则延续。</li><li>角色位置保持不变；东南西北身份随庄家轮换。结算需确认后进入下一局。</li></ul><p>使用 <a href="https://github.com/kobalab/majiang-core" target="_blank" rel="noopener">majiang-core</a> 规则引擎与 majiang-ai 电脑；MIT 授权。非官方同人作品。</p>');
document.addEventListener('keydown',e=>{if($('modal').open||$('victory').open||document.querySelector('[popover]:popover-open'))return;if(decision?.type==='response'){if(e.key==='Escape')submit({});return}if(decision?.type!=='turn')return;if(e.key==='Escape'&&!$('call-pass').hidden){$('call-pass').click();return}if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const n=handTiles(match.model.shoupai[ownSeat()]).length,step=e.key==='ArrowRight'?1:-1;for(let k=0;k<n;k++){selected=(selected+step+n)%n;if((riichiPick?decision.riichi:decision.discards).includes(discardCode(selected)))break}render()}if(e.key==='Enter'&&document.activeElement.tagName!=='BUTTON')discard()});
for(const [id,path] of [['chi','chi-fx.png'],['pon','pon-fx.png'],['kan','kan-fx.png'],['riichi','actions/riichi.png'],['win','actions/tsumo.png'],['call-pass','actions/pass.png'],['ron','actions/ron.png']]){
 const b=$(id),label=b.textContent;b.textContent='';b.classList.add('illustrated-action');const img=document.createElement('img');img.src=path;img.alt='';img.className='action-art';const caption=document.createElement('span');caption.className='action-caption';caption.textContent=label;b.append(img,caption);
}
const actionRow=document.querySelector('.actions');actionRow.append(...[...actionRow.children].reverse());actionRow.prepend($('call-pass'));
const viewport=document.querySelector('.board'),world=document.querySelector('.world');
const compactLayout=matchMedia('(max-aspect-ratio: 1/1), (max-width: 700px)');
const rack=document.querySelector('.player-rack'),nameplate=document.querySelector('.player-label');
function fitScene(){const scale=Math.min(viewport.clientWidth/1000,viewport.clientHeight/(2000/3));world.style.setProperty('--scene-scale',scale);world.style.setProperty('--touch-world',44/Math.max(scale,.01)+'px');document.querySelector('.game').style.setProperty('--controls-bottom',(document.querySelector('.game').clientHeight-(viewport.offsetTop+viewport.clientHeight/2+(524-1000/3)*scale)+12)+'px')}
function fitHand(){const target=compactLayout.matches?$('mobile-hand-dock'):world;target.append(rack);world.append(nameplate);fitScene()}
compactLayout.addEventListener('change',fitHand);new ResizeObserver(fitScene).observe(viewport);fitHand();
$('fullscreen').hidden=!document.fullscreenEnabled;
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();$('game-menu').hidePopover()}catch{$('fullscreen').textContent='当前浏览器不支持全屏'}};
document.addEventListener('fullscreenchange',()=>{$('fullscreen').textContent=document.fullscreenElement?'退出全屏 ↙':'进入全屏 ↗'});
for(const id of ['rules','new','tile-gallery'])$(id).addEventListener('click',()=>$('game-menu').hidePopover());
for(const id of ['preview-chi','preview-pon','preview-kan'])$(id).addEventListener('click',()=>$('game-menu').hidePopover());
function animateDiscard(player,called){
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
 const label=document.createElement('b');label.textContent=CHARACTERS[player]+' / 切';banner.appendChild(label);
 const name=document.createElement('span');name.textContent=tileName(called);banner.appendChild(name);board.appendChild(banner);actionEffects.push(banner);
 banner.animate([{opacity:0,transform:'translateX(-110%) skewX(-7deg)'},{opacity:1,transform:'translateX(0) skewX(-7deg)',offset:.2},{opacity:1,transform:'translateX(0) skewX(-7deg)',offset:.7},{opacity:0,transform:'translateX(30%) skewX(-7deg)'}],{duration:900,fill:'forwards'});
 const surface=board.querySelector?.('.table-layer')||board;surface.animate([{transform:'translate(0,0)'},{transform:'translate(2px,1px)'},{transform:'translate(-2px,0)'},{transform:'translate(0,0)'}],{duration:150,delay:650});
 later(()=>{fly.remove();tone(190)},650);
 later(()=>{for(const el of [fly,burst,banner])el.remove();actionEffects=actionEffects.filter(el=>![fly,burst,banner].includes(el))},1230);
}
// A read-only integration exposes only information visible at the table.
function publicTable(){const m=match?.model;if(!m?.shan)return {};return {round:WINDS[m.zhuangfeng]+(m.jushu+1),scores:m.defen.slice(),remaining:m.shan.paishu,hand:handTiles(m.shoupai[ownSeat()]).map(tileName),rivers:m.he.map(h=>h._pai.map(tileName)),melds:m.shoupai.map(h=>h._fulou.slice()),turn:m.player_id[m.lunban],available:decision?{type:decision.type,win:decision.win,kan:decision.kan,calls:decision.calls}:null}}
if(navigator.modelContext?.registerTool){try{navigator.modelContext.registerTool({name:'read_mahjong_table',description:'Read public mahjong table and your own hand; never opponent hands or hidden wall.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:async()=>({content:[{type:'text',text:JSON.stringify(publicTable())}]})})}catch{}}
// Test access is opt-in and never enabled by the normal playable URL.
if(new URLSearchParams(location.search).has('test'))window.mahjongTest={get match(){return match},get decision(){return decision},get human(){return human},newGame,submit,render,tile,publicTable,Majiang,RULE,showVictory,showResult,playCallEffect};
const openStart=require('./start-screen').initStartScreen(agents=>{
 agents.forEach(([name,art,color],id)=>{CHARACTERS[id]=name;WIN_ART[id]=art;WIN_COLORS[id]=color;const sprite=document.querySelector('.person-'+id+' .character-sprite');sprite.className='character-sprite '+art;sprite.style.backgroundImage='url('+art+'-action6.png)';$('score'+id).querySelector('span').textContent=name+(id===0?' / YOU':'');$('preview-character').options[id].textContent=name;$('seat-label'+id).parentElement.style.setProperty('--tag-accent',color);});
 newGame();
});
require('./scene-resources').initSceneResources();
require('./i18n').initLanguage();
if(new URLSearchParams(location.search).has('test'))newGame();else openStart();
