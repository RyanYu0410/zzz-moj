const fs=require('fs'),vm=require('vm'),assert=require('assert');
const els={};function el(){return {classList:{add(){},contains(){return false},toggle(){return false}},setAttribute(){},replaceChildren(){},appendChild(){},addEventListener(){},style:{},open:false,showModal(){this.open=true},close(){this.open=false}}}
const context={console,Math,setTimeout:()=>0,clearTimeout(){},document:{getElementById:id=>els[id]??=(el()),createElement:el,addEventListener(){},body:el()},matchMedia:()=>({matches:false})};vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/dist/game.js','utf8'),context);
vm.runInContext(`
function assert(x,m){if(!x)throw Error(m)}
assert(winning([0,1,2,3,4,5,9,10,11,27,27,27,33,33]),'standard win');
assert(winning([0,0,2,2,9,9,11,11,18,18,27,27,33,33]),'seven pairs');
assert(winning([0,8,9,17,18,26,27,28,29,30,31,32,33,33]),'orphans');
assert(!winning([0,1,2,3,4,5,9,10,11,27,27,28,33,33]),'invalid rejected');
assert(waits([0,1,2,3,4,5,9,10,11,27,27,27,33]).includes(33),'wait found');
for(let n=0;n<5;n++){newGame();assert(state.wall.length===69,'initial wall');let steps=0;while(!state.over&&steps++<200){if(state.pending)passCall();else if(state.turn===0){selected=0;discard()}else bot();const all=[...state.wall,...state.dead,...state.hands.flat(),...state.rivers.flat()];assert(all.length===136,'tile conservation');assert(counts(all).every(n=>n===4),'four copies each')}assert(state.over,'round ends')}
newGame();state.hands[0]=[0,1,2,3,4,5,9,10,11,27,27,27,33,5];riichiPick=true;selected=13;discard();assert(state.riichi,'riichi declaration');assert(state.waiting.includes(33),'riichi wait saved');
console.log('PASS: hand recognition, waits, five simulated rounds, 136-tile conservation, riichi declaration');
`,context);
let animations=0,removed=0;const tracks=[];
function fxNode(){return {...el(),animate(frames,options){animations++;tracks.push({frames,options});},remove(){removed++;},cloneNode(){return fxNode()},getBoundingClientRect(){return {left:100,top:100,width:24,height:30}}}}
context.document.createElement=fxNode;
const board=fxNode();board.getBoundingClientRect=()=>({left:0,top:0,width:900,height:500});context.document.querySelector=()=>board;
for(let i=0;i<4;i++)els['river'+i].lastElementChild=fxNode();
vm.runInContext('for(let p=0;p<4;p++){state.rivers[p]=[1];animateDiscard(p)};clearEffects()',context);
assert.equal(animations,20,'Each of four discards schedules five animation tracks');assert.equal(removed,12,'Effects cleaned on reset');console.log('PASS: all four seats trigger flight, impact, cut-in and table response; cleanup verified');
const poses=Array.from({length:4},()=>({classList:{values:new Set(),add(v){this.values.add(v)},remove(v){this.values.delete(v)}}}));
board.querySelector=selector=>selector.includes('character-sprite')?poses[Number(selector.match(/person-(\d)/)[1])]:board;
context.document.querySelectorAll=()=>poses;
for(let p=0;p<4;p++){
 vm.runInContext('clearEffects()',context);vm.runInContext('animateDiscard('+p+')',context);
 assert.deepEqual(poses.map(n=>n.classList.values.has('discarding')),poses.map((_,i)=>i===p),'Only acting character changes pose');
}
vm.runInContext('clearEffects()',context);assert(poses.every(p=>p.classList.values.size===0));console.log('PASS: independent pose triggers and reset for all four characters');

assert(tracks.some(t=>t.options.delay===400&&t.options.duration===250),"Flight starts at release and lands at 650ms");
assert(tracks.some(t=>t.options.delay===650&&t.options.duration===150),"Table impact starts on landing");
console.log("PASS: release, flight and landing timing aligned");
vm.runInContext(`
assert(baseTile(34)===4&&baseTile(35)===13&&baseTile(36)===22,'red five mapping');
assert(winning([2,3,34,11,12,35,20,21,36,27,27,27,33,33]),'red fives in winning sequences');
assert(waits([2,3,34,11,12,35,20,21,36,27,27,27,33]).includes(33),'red fives retain waits');
assert(counts([4,4,4,34])[4]===4,'red and normal five share copy limit');
newGame();
const full=[...state.wall,...state.dead,...state.hands.flat()];
assert([34,35,36].every(t=>full.filter(x=>x===t).length===1),'one red five per suit');
assert([4,13,22].every(t=>full.filter(x=>x===t).length===3),'three ordinary fives per suit');
for(let t=0;t<37;t++){const v=tile(t);assert(v.innerHTML.includes('tile-face'),'every tile has artwork');assert(v.title===tileName(t),'accessible tile name')}
console.log('PASS: 37 tile faces, red-five distribution, normalized winning shapes and waits');
`,context);
vm.runInContext(`
newGame();state.hands[0]=[2,3,34,5,6,7,9,10,11,18,19,20,27];
assert(callOptions(1,4).every(o=>o.kind!=='chi'),'cannot chi lower seat');
assert(callOptions(2,4).every(o=>o.kind!=='chi'),'cannot chi across');
assert(callOptions(3,4).filter(o=>o.kind==='chi').length===3,'three chi sequences');
state.riichi=true;assert(callOptions(3,4).length===0,'no calls after riichi');state.riichi=false;
assert(callOptions(3,27).every(o=>o.kind!=='chi'),'no honor sequence');
state.hands[0]=[7,9,10,12,13,14,18,19,20,27,28,29,30];assert(callOptions(3,8).length===0,'no cross-suit chi');
function setupCall(hand,from,called){
 newGame();timers.forEach(clearTimeout);timers=[];
 const pool=[...state.wall,...state.dead,...state.hands.flat()];
 for(const t of [...hand,called]){const i=pool.indexOf(t);assert(i>=0,'fixture has physical tile');pool.splice(i,1)}
 state.hands=[hand.slice(),pool.splice(0,13),pool.splice(0,13),pool.splice(0,13)];state.dead=pool.splice(0,14);state.wall=pool;state.rivers=[[],[],[],[]];state.rivers[from]=[called];state.turn=from;state.drawn=false;state.pending={from,tile:called,options:callOptions(from,called)};
}
function physicalTiles(){return [...state.wall,...state.dead,...state.hands.flat(),...state.rivers.flat(),...state.melds.flatMap(m=>m.tiles)]}
setupCall([4,34,0,1,2,9,10,11,18,19,20,27,27],1,4);
const beforeWall=state.wall.length;claimCall(0);
assert(state.melds.length===1&&state.melds[0].tiles.includes(34),'red five retained in pon');
assert(state.hands[0].length===11&&state.wall.length===beforeWall,'call consumes two without drawing');
assert(state.rivers[1].length===0&&state.turn===0&&!state.pending,'claimed discard removed and turn transferred');
assert(physicalTiles().length===136&&counts(physicalTiles()).every(n=>n===4),'all 136 tiles preserved by call');
assert(!riichiOptions().length&&!canSelfDraw(),'no riichi or self draw immediately after call');
selected=0;discard();assert(state.turn===1&&state.hands[0].length===10,'after pon next turn is lower seat');
setupCall([2,3,5,6,9,10,11,18,19,20,27,27,33],3,4);
claimCall(0);assert(state.melds[0].kind==='chi','chi recorded');
assert(state.forbidden.includes(4),'same-tile kuikae prohibited');
setupCall([3,4,5,6,9,10,11,18,19,20,27,27,33],3,2);
claimCall(0);assert(state.forbidden.includes(5),'sequence-end kuikae prohibited');
selected=state.hands[0].indexOf(5);discard();assert(state.turn===0&&state.hands[0].length===11,'forbidden discard does not advance');
setupCall([4,34,0,1,2,9,10,11,18,19,20,27,27],1,4);const wallBeforePass=state.wall.length;passCall();assert(state.turn===2&&state.wall.length===wallBeforePass,'pass resumes next opponent without drawing for player');
setupCall([4,34,0,1,2,9,10,11,18,19,20,27,27],3,4);const wallBeforeDraw=state.wall.length;passCall();assert(state.turn===0&&state.hands[0].length===14&&state.wall.length===wallBeforeDraw-1,'pass upper seat draws once');
assert(winning([9,10,11,18,19,20,27,27,27,33,33],1),'open winning shape');
assert(!winning([9,10,11,18,19,20,27,27,28,33,33],1),'invalid open shape rejected');
newGame();state.melds=[{tiles:[0,1,2]}];state.hands[0]=[9,10,11,18,19,20,24,25,26,28,28];state.drawn=true;assert(!canSelfDraw(),'open no-yaku win blocked');
state.hands[0]=[9,10,11,18,19,20,31,31,31,28,28];assert(canSelfDraw(),'open dragon yaku self draw allowed');
for(let n=0;n<25;n++){newGame();let steps=0;while(!state.over&&steps++<250){if(state.pending){if(n%2)claimCall(0);else passCall()}else if(state.turn===0){selected=state.hands[0].findIndex(t=>!state.forbidden.includes(baseTile(t)));discard()}else bot();const all=physicalTiles();assert(all.length===136&&counts(all).every(v=>v===4),'mixed calls tile conservation');assert([34,35,36].every(t=>all.filter(x=>x===t).length===1),'red copy conservation')}assert(state.over,'round with calls ends')}
console.log('PASS: chi seat/sequence restrictions, pon, red retention, kuikae, open yaku, pass/turn order, 25 full rounds with calls');
`,context);
