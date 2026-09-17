// Run against the local static server; PLAYWRIGHT_MODULE may point to a bundled runtime.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({viewport:{width:1000,height:900},deviceScaleFactor:2});
 await page.goto(process.env.PREVIEW_URL||'http://localhost:8080/');
 await page.evaluate(async()=>{await document.fonts.ready;await new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=reject;img.src='tile-shell.png'})});
 await page.evaluate(()=>{
  document.body.innerHTML='<div id="export-tile"></div>';
  const style=document.createElement('style');style.textContent='body{background:transparent;display:block}#export-tile{width:180px;height:250px;padding:15px;display:grid;place-items:center}#export-tile .tile{display:block;width:140px;height:210px;border-radius:12px;box-shadow:none}#export-tile .tile-corner{font-size:23px}#export-tile .tile-tech{font-size:10px}#export-tile .man-number{font-size:67px}#export-tile .man-mark{font-size:60px}#export-tile .honor-mark{font-size:96px}#export-tile .white-dragon{border-width:8px}';document.head.appendChild(style);
 });
 fs.mkdirSync('dist/tiles',{recursive:true});
 const manifest=[];
 for(let id=0;id<37;id++){
  const file=id<27?['man','pin','sou'][Math.floor(id/9)]+'-'+(id%9+1):id<34?['east','south','west','north','white','green','red'][id-27]:['man','pin','sou'][id-34]+'-red-5';
  const label=await page.evaluate(id=>{document.getElementById('export-tile').replaceChildren(tile(id));return tileName(id)},id);
  await page.locator('#export-tile').screenshot({path:'dist/tiles/'+file+'.png',omitBackground:true});
  manifest.push({id,label,file:file+'.png'});
 }
 fs.writeFileSync('dist/tiles/manifest.json',JSON.stringify(manifest,null,2)+'\n');
 await browser.close();console.log('Exported 37 transparent tile PNGs at 360 × 500.');
})().catch(e=>{console.error(e);process.exit(1)});
