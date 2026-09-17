'use strict';
const Majiang=require('@kobalab/majiang-core');
const RULE=Majiang.rule({'場数':1,'赤牌':{m:1,p:1,s:1},'カンドラ後乗せ':false});
const CHARACTERS=['妮可','比利','雅','艾莲'];
const WINDS=['东','南','西','北'];
function handTiles(hand){const result=[];for(const match of hand.toString().split(',')[0].matchAll(/([mpsz])(\d+)/g))for(const n of match[2])result.push(match[1]+n);return result}
function tileId(p){if(p[1]==='0')return 34+'mps'.indexOf(p[0]);return p[0]==='z'?26+Number(p[1]):'mps'.indexOf(p[0])*9+Number(p[1])-1}
function tileFile(p){const id=typeof p==='number'?p:tileId(p);return id<27?['man','pin','sou'][Math.floor(id/9)]+'-'+(id%9+1):id<34?['east','south','west','north','white','green','red'][id-27]:['man','pin','sou'][id-34]+'-red-5'}
function meldKind(m){return (m.match(/\d/g)||[]).length===4?'kan':new Set(m.match(/\d/g).map(n=>n==='0'?'5':n)).size===1?'pon':'chi'}
function meldTiles(m){return [...m.matchAll(/(\d)([+=-]?)/g)].map(x=>({p:m[0]+x[1],called:!!x[2]}))}
function turnChoices(player,gangzimo=false){return {type:'turn',discards:player.get_dapai(player.shoupai)||[],riichi:player.allow_lizhi(player.shoupai)||[],kan:player.get_gang_mianzi(player.shoupai)||[],win:!!player.allow_hule(player.shoupai,null,gangzimo),abort:player.allow_pingju(player.shoupai)}}
function responseChoices(player,event,rob=false){
 const d=['','+','=','-'][(4+event.l-player._menfeng)%4];
 const p=(rob?event.m[0]+event.m.slice(-1):event.p.slice(0,2))+d;
 if(rob&&/^[mpsz]\d{4}$/.test(event.m))return {type:'response',calls:[],win:false};
 return {type:'response',from:event.l,tile:p,rob,win:!!player.allow_hule(player.shoupai,p,rob),calls:rob?[]:[...(player.get_gang_mianzi(player.shoupai,p)||[]),...(player.get_peng_mianzi(player.shoupai,p)||[]),...(player.get_chi_mianzi(player.shoupai,p)||[])]};
}
class HumanPlayer extends Majiang.Player{
 constructor(onDecision){super();this.onDecision=onDecision}
 decide(options){const cb=this._callback;this.onDecision(options,reply=>cb(reply))}
 action_kaiju(){this._callback()}
 action_qipai(){this._callback()}
 action_zimo(event,gangzimo){if(event.l!==this._menfeng)return this._callback();this.decide(turnChoices(this,gangzimo))}
 action_dapai(event){if(event.l===this._menfeng)return this._callback();const options=responseChoices(this,event);if(options.win||options.calls.length)this.decide(options);else this._callback()}
 action_fulou(event){if(event.l!==this._menfeng||meldKind(event.m)==='kan')return this._callback();this.decide({type:'turn',discards:this.get_dapai(this.shoupai)||[],riichi:[],kan:[],win:false,abort:false})}
 action_gang(event){if(event.l===this._menfeng)return this._callback();const options=responseChoices(this,event,true);if(options.win)this.decide(options);else this._callback()}
 action_hule(result){this.decide({type:'result',result})}
 action_pingju(result){this.decide({type:'draw',result})}
 action_jieju(result){this.decide({type:'match',result})}
}
// All scheduled dispatches belong to one match and can be disposed on restart.
class Match extends Majiang.Game{
 constructor(...args){super(...args);this.active=true;this.scheduled=new Set()}
 reply(id,reply){if(!this.active)return;this._reply[id]=reply||{};if(this._reply.filter(Boolean).length===4&&!this._timeout_id)this._timeout_id=this.schedule(()=>this.next())}
 next(){if(!this.active)return;return super.next()}
 schedule(fn,ms=0){const id=setTimeout(()=>{this.scheduled.delete(id);if(this.active)fn()},ms);this.scheduled.add(id);return id}
 delay(fn,timeout){if(this._sync)return fn();this.schedule(fn,this._dwell===0?0:timeout==null?Math.max(500,this._dwell):timeout)}
 call_players(type,msg,timeout){this._status=type;this._reply=[];for(let l=0;l<4;l++){const id=this.model.player_id[l];this.schedule(()=>this._players[id].action(msg[l],reply=>{if(this.active)this.reply(id,reply)}))}this._timeout_id=this.schedule(()=>this.next(),this._dwell===0?0:timeout??this._dwell)}
 notify_players(type,msg){for(let l=0;l<4;l++){const id=this.model.player_id[l];this.schedule(()=>this._players[id].action(msg[l]))}}
 dispose(){this.active=false;clearTimeout(this._timeout_id);for(const id of this.scheduled)clearTimeout(id);this.scheduled.clear();this._players.forEach(p=>p.dispose?.())}
}
module.exports={Majiang,RULE,CHARACTERS,WINDS,handTiles,tileId,tileFile,meldKind,meldTiles,turnChoices,responseChoices,HumanPlayer,Match};
