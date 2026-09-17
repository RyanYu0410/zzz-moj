'use strict';
let callTimer;
const callLayer=document.getElementById('call-fx');
function hideCallEffect(){clearTimeout(callTimer);callLayer.hidden=true;callLayer.classList.remove('playing')}
function previewCall(kind){playCallEffect(kind,true)}
function playCallEffect(kind,preview=false){
 clearTimeout(callTimer);
 const img=callLayer.querySelector('img');
 img.src=kind==='chi'?'chi-fx.png':'pon-fx.png';
 img.alt=(kind==='chi'?'吃 CHI':'碰 PON')+(preview?' 演出预览':'');
 callLayer.querySelector('small').textContent=preview?'演出预览':kind==='chi'?'吃 · 请切出一张牌':'碰 · 请切出一张牌';
 callLayer.hidden=false;
 callLayer.classList.remove('playing');void callLayer.offsetWidth;callLayer.classList.add('playing');
 tone(kind==='chi'?660:440);
 callTimer=setTimeout(()=>{callLayer.hidden=true;callLayer.classList.remove('playing')},1600);
}
document.getElementById('preview-chi').onclick=()=>previewCall('chi');
document.getElementById('preview-pon').onclick=()=>previewCall('pon');
document.getElementById('tile-gallery').onclick=()=>{
 show('<h2>新艾利都 · 牌面图鉴</h2><p>万／饼／索各九张，七种字牌，三种红五。每门一张红五已加入牌山，和牌判断按普通五处理。</p><div id="tile-catalog"></div><p class="catalog-note">牌局已支持吃／碰，开门后不可立直；完整役种和计分规则待接入。</p>');
 const catalog=document.getElementById('tile-catalog');
 const families=[['万子 · 绯红墨印',Array.from({length:9},(_,i)=>i)],['饼子 · 音轨环芯',Array.from({length:9},(_,i)=>9+i)],['索子 · 以太节能',Array.from({length:9},(_,i)=>18+i)],['字牌 · 方位印记',[27,28,29,30,31,32,33]],['赤五 · 红色共鸣',[34,35,36]]];
 for(const [name,ids] of families){const section=document.createElement('section'),h=document.createElement('h3'),row=document.createElement('div');h.textContent=name;row.className='catalog-row';ids.forEach(id=>row.appendChild(tile(id)));section.append(h,row);catalog.appendChild(section)}
};
