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
for(let n=0;n<5;n++){newGame();assert(state.wall.length===69,'initial wall');let steps=0;while(!state.over&&steps++<100){if(state.turn===0){selected=0;discard()}else bot();const all=[...state.wall,...state.dead,...state.hands.flat(),...state.rivers.flat()];assert(all.length===136,'tile conservation');assert(counts(all).every(n=>n===4),'four copies each')}assert(state.over,'round ends')}
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
