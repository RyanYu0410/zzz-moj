'use strict';
const THEMES={nicole:{floor:'floor-expanded.png',wide:'floor-layer.png',table:'table-layer.png'},billy:{floor:'themes/billy-floor.png',table:'themes/billy-table.png'},miyabi:{floor:'themes/miyabi-floor.png',table:'themes/miyabi-table.png'},ellen:{floor:'themes/ellen-floor.png',table:'themes/ellen-table.png'}};
function initSceneResources(){
 const floorSelect=document.getElementById('floor-theme'),tableSelect=document.getElementById('table-theme'),status=document.getElementById('scene-resource-status');
 const state={floor:'nicole',table:'nicole'};try{const saved=JSON.parse(localStorage.getItem('riichi-scene')||'{}');for(const key of ['floor','table'])if(THEMES[saved[key]])state[key]=saved[key]}catch{}
 const versions={floor:0,table:0};
 function floorPath(){const theme=THEMES[state.floor];return theme.wide&&innerWidth/innerHeight>=2/3?theme.wide:theme.floor}
 let lastFloor='';function fitGround(){const path=floorPath();if(path!==lastFloor){document.body.style.setProperty('--floor-image',`url("${path}")`);lastFloor=path}}
 async function select(kind,value,save=true){const serial=++versions[kind];const previous=state[kind],entry=THEMES[value];if(!entry)return;const path=kind==='table'?entry.table:(entry.wide&&innerWidth/innerHeight>=2/3?entry.wide:entry.floor);const image=new Image();image.src=path;
 try{await image.decode();if(serial!==versions[kind])return;state[kind]=value;if(kind==='table')document.querySelector('.table-layer').src=path;else fitGround();status.textContent='';if(save)try{localStorage.setItem('riichi-scene',JSON.stringify(state))}catch{}}
 catch{if(serial!==versions[kind])return;(kind==='floor'?floorSelect:tableSelect).value=previous;status.textContent='素材载入失败，请重试。'}
 }
 floorSelect.value=state.floor;tableSelect.value=state.table;fitGround();select('table',state.table,false);
 floorSelect.addEventListener('change',()=>select('floor',floorSelect.value));tableSelect.addEventListener('change',()=>select('table',tableSelect.value));
 window.addEventListener('resize',fitGround);
}
module.exports={initSceneResources};
