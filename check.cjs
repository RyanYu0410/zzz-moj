'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {Majiang,RULE,HumanPlayer,Match,handTiles,tileFile,meldKind,meldTiles,turnChoices,responseChoices}=require('./src/engine');
const S=s=>Majiang.Shoupai.fromString(s);
function human(hand){let options,respond;const p=new HumanPlayer((o,cb)=>{options=o;respond=cb});p.action({kaiju:{id:0,rule:RULE,title:'test',player:['A','B','C','D'],qijia:0}},()=>{});p.action({qipai:{zhuangfeng:0,jushu:0,changbang:0,lizhibang:0,defen:[25000,25000,25000,25000],baopai:'z4',shoupai:[hand,'','','']}},()=>{});return {p,get options(){return options},respond:r=>respond(r)}}
assert.equal(RULE['場数'],1);assert.equal(RULE['喰い替え許可レベル'],0);
for(let id=0;id<37;id++)assert(fs.existsSync('dist/tiles/'+tileFile(id)+'.png'));
assert.deepEqual(handTiles(S('m123p456s789z1122')),['m1','m2','m3','p4','p5','p6','s7','s8','s9','z1','z1','z2','z2']);
assert.equal(tileFile('p0'),'pin-red-5');assert.equal(meldKind('m055+'),'pon');assert.equal(meldKind('s555+0'),'kan');assert(meldTiles('m123-').some(t=>t.called));
const wall=new Majiang.Shan(RULE);assert.equal(wall._pai.length,136);for(const s of ['m','p','s'])assert.equal(wall._pai.filter(p=>p===s+'0').length,1);
for(let i=0;i<52;i++)wall.zimo();const n=wall.paishu;wall.gangzimo();wall.kaigang();assert.equal(wall.paishu,n-1);assert.equal(wall.baopai.length,2);
let h=human('m23056p123s123z11');let o=responseChoices(h.p,{l:3,p:'m4'});assert(o.calls.some(m=>meldKind(m)==='chi'));assert(!responseChoices(h.p,{l:1,p:'m4'}).calls.some(m=>meldKind(m)==='chi'));
h=human('m055p123s123z1122');o=responseChoices(h.p,{l:1,p:'m5'});assert(o.calls.some(m=>meldKind(m)==='pon'));assert(o.calls.some(m=>meldKind(m)==='kan'));const redPon=o.calls.find(m=>meldKind(m)==='pon'&&m.includes('0'));const called=h.p.shoupai.clone().fulou(redPon);assert(called._fulou[0].includes('0'));assert(!Majiang.Game.get_dapai(RULE,called).some(p=>/^m[05]/.test(p)));assert.equal(Majiang.Game.allow_lizhi(RULE,called,null,40,25000),false);
h=human('m111p123s456z1122');h.p.action({zimo:{l:0,p:'m1'}},()=>{});assert(h.options.kan.includes('m1111'));assert.equal(h.options.type,'turn');
const add=S('p123s456z1122,m555+');add.zimo('m0');assert(Majiang.Game.get_gang_mianzi(RULE,add,null,30,1).some(m=>m==='m555+0'));
h=human('m123p123s123z5551');h.p.action({dapai:{l:1,p:'z1'}},()=>{});assert(h.options.win,'legal ron offered');h.respond({});assert.equal(h.p._neng_rong,false,'passing ron produces furiten');assert.equal(responseChoices(h.p,{l:2,p:'z1'}).win,false);
h=human('m123p123s123z1112');h.p._diyizimo=false;h.p.action({zimo:{l:0,p:'z2'}},()=>{});assert(h.options.win,'self draw offered');
h=human('m123p123s123z1112');h.p._neng_rong=false;assert.equal(responseChoices(h.p,{l:2,p:'z2'}).win,false,'discard furiten blocks ron');
h=human('m123p123s123z1112');assert(responseChoices(h.p,{l:2,m:'z222+2'},true).win,'robbing added kan');assert.equal(responseChoices(h.p,{l:2,m:'z2222'},true).win,false);
const noYaku=S('m123p456s789z22,m456-');assert.equal(Majiang.Game.allow_hule(RULE,noYaku,null,0,1,false,true),false,'open no-yaku hand rejected');
const scored=Majiang.Util.hule(S('m123p456s789z11555'),null,{rule:RULE,zhuangfeng:0,menfeng:1,hupai:{},baopai:[],jicun:{changbang:0,lizhibang:0}});assert(scored.hupai.length&&scored.defen>0);assert.equal(scored.fenpei.reduce((a,b)=>a+b,0),0,'payments conserve points');
const akas=Majiang.Util.hule(S('m234p406s678z22555'),null,{rule:RULE,zhuangfeng:0,menfeng:1,hupai:{},baopai:[],jicun:{changbang:0,lizhibang:0}});assert(akas.hupai.some(h=>h.name==='赤ドラ'),'red dora scores');
// Play a full match through the actual engine. The deterministic policy accepts legal
// wins/calls and minimizes shanten; full production AI runs separately in Web Workers.
let calls=0,kans=0;
class Auto extends HumanPlayer{constructor(){super((o,cb)=>{
 if(o.type==='turn'){if(o.win)return cb({hule:'-'});if(o.kan.length){kans++;return cb({gang:o.kan[0]})}if(o.abort)return cb({daopai:'-'});const ranked=o.discards.map(p=>({p,n:Majiang.Util.xiangting(this.shoupai.clone().dapai(p))})).sort((a,b)=>a.n-b.n);const p=ranked[0].p;return cb({dapai:p+(o.riichi.includes(p)?'*':'')})}
 if(o.type==='response'){if(o.win)return cb({hule:'-'});if(o.calls.length){calls++;return cb({fulou:o.calls[0]})}}cb({});
 })}}
const g=new Majiang.Game([new Auto(),new Auto(),new Auto(),new Auto()],()=>{},RULE);g.do_sync();assert.equal(g._paipu.rank.length,4);assert.equal(g._paipu.defen.reduce((a,b)=>a+b,0),100000);assert(g._paipu.log.length>=1);assert(calls>0);assert(g._paipu.log.flat().some(e=>e.hule||e.pingju));console.log('PASS: full East match completed ('+g._paipu.log.length+' hands, '+calls+' calls, '+kans+' self kans), scoring and 100,000-point conservation');
// Disposal must prevent any delayed transition from an abandoned match.
const m=new Match([],()=>{},RULE);let fired=false;m.schedule(()=>fired=true,1);m.dispose();setTimeout(()=>{assert.equal(fired,false);console.log('PASS: 37 PNG faces, red fives, chi/pon/three kan forms, rinshan/dora, furiten, ron/tsumo, no-yaku rejection, restart disposal')},15);
