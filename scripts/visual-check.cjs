const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'}),page=await browser.newPage({viewport:{width:1280,height:960}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith('http://localhost')&&r.status()>=400)errors.push(r.url())});
 await page.goto('http://localhost:8080/?test');
 await page.waitForFunction(()=>mahjongTest.decision,{},{timeout:20000});
 assert.equal(await page.locator('.scoreboard b').count(),4);
 assert(await page.locator('#hand .png-tile img').count()>=13);
 await page.locator('#tile-gallery').click();assert.equal(await page.locator('#tile-catalog .png-tile img').count(),37);await page.locator('#close').click();
 // A deterministic, physically valid wall retains 136 tiles and gives the dealer a concealed kan.
 await page.evaluate(()=>{
  const api=mahjongTest;api.newGame(0);const m=api.match,original=m.qipai.bind(m);m.speed=0;
  m.qipai=function(){const shan=new api.Majiang.Shan(api.RULE),pool=shan._pai.slice(),hand=['m1','m1','m1','p1','p2','p3','s4','s5','s6','z1','z1','z2','z2'],draws=['m1','s9'];
   const take=p=>{const i=pool.indexOf(p);if(i<0)throw Error('missing fixture '+p);pool.splice(i,1)};[...hand,...draws].forEach(take);
   const deal=[...hand,...pool.splice(-39)];shan._pai=[...pool,...draws.slice().reverse(),...deal.reverse()];shan._baopai=[shan._pai[4]];shan._fubaopai=[shan._pai[9]];m.qipai=original;original(shan);
  }
 });
 await page.waitForFunction(()=>mahjongTest.decision?.kan?.includes('m1111'));
 await page.locator('#kan').click();await page.getByRole('button',{name:/暗杠/}).click();
 await page.waitForFunction(()=>mahjongTest.decision?.type==='turn'&&mahjongTest.match.model.shoupai[0]._fulou.includes('m1111'));
 assert.equal(await page.locator('#dora .tile').count(),2);
 assert.equal(await page.locator('#melds .tile').count(),4);
 assert.equal(await page.locator('#melds .tile-back').count(),2);
 assert.equal(await page.locator('#hand button').count(),11);
 await page.screenshot({path:'/tmp/zzz-kan-live.png'});
 // Let a real worker-backed match progress through decisions and a settlement.
 let results=0,decisions=0;
 for(let i=0;i<250;i++){
  await page.waitForFunction(()=>!!mahjongTest.decision,{},{timeout:20000});
  const type=await page.evaluate(()=>mahjongTest.decision.type);
  if(['result','draw'].includes(type)){results++;assert(await page.locator('.settlement p').count()===4);await page.screenshot({path:'/tmp/zzz-settlement.png'});await page.locator('#next').click();break}
  if(type==='match')break;
  await page.evaluate(()=>{const a=mahjongTest,d=a.decision;if(d.type==='response')a.submit(d.win?{hule:'-'}:d.calls.length?{fulou:d.calls[0]}:{});else if(d.win)a.submit({hule:'-'});else if(d.kan.length)a.submit({gang:d.kan[0]});else{const h=a.human.shoupai;const best=d.discards.map(p=>({p,n:a.Majiang.Util.xiangting(h.clone().dapai(p))})).sort((a,b)=>a.n-b.n)[0].p;a.submit({dapai:best+(d.riichi.includes(best)?'*':'')})}});decisions++;
 }
 assert(results>0,'real workers reach settlement');
 await page.waitForFunction(()=>mahjongTest.decision);
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/tmp/zzz-match-mobile.png'});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.locator('#preview-kan').click();await page.waitForTimeout(250);assert(await page.locator('#call-fx img').evaluate(e=>e.complete&&e.naturalWidth>0));
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#preview-pon').click();assert.equal(await page.locator('#call-fx img').evaluate(e=>getComputedStyle(e).animationName),'none');
 await page.locator('#new').click();await page.locator('#reset').click();await page.waitForFunction(()=>mahjongTest.decision);assert.equal(await page.locator('#melds .meld').count(),0);
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: PNGs, gallery, real concealed kan/rinshan/dora, worker-backed round settlement ('+decisions+' decisions), mobile, reduced motion and restart');
})().catch(e=>{console.error(e);process.exit(1)});
