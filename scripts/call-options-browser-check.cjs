const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({viewport:{width:1280,height:960}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().includes('localhost')&&r.status()>=400)errors.push(r.url())});await page.goto('http://localhost:8080/?test');await page.waitForFunction(()=>mahjongTest.decision);
 assert(await page.evaluate(()=>getComputedStyle(document.querySelector('.player-rack')).position==='absolute'));
 for(const kind of ['chi','pon','kan'])assert.equal(await page.locator('#'+kind).isVisible(),true);
 const tiles=await page.locator('#hand img').evaluateAll(els=>els.map(e=>({loaded:e.complete&&e.naturalWidth>0,width:e.getBoundingClientRect().width})));assert(tiles.length>=13&&tiles.every(t=>t.loaded&&t.width>0));
 await page.evaluate(()=>mahjongTest.match.dispose());
 // Feed the normal decision handler isolated response fixtures; rule legality is
 // separately tested through the real engine in check.cjs and visual-check.cjs.
 for(const [kind,meld] of [['chi','m345-'],['pon','m555-'],['kan','m5555-']]){
  await page.evaluate(()=>{mahjongTest.human.onDecision({type:'response',from:3,tile:'m5-',calls:['m345-','m555-','m5555-'],win:false},answer=>window.chosenCall=answer)});
  await page.locator('#'+kind).click();assert.equal(await page.locator('#'+kind).getAttribute('aria-expanded'),'true');assert.equal(await page.locator('#call-choices button').count(),1);await page.locator('#call-choices button').click();assert.equal(await page.evaluate(()=>window.chosenCall.fulou),meld);
 }
 await page.evaluate(()=>{mahjongTest.human.onDecision({type:'turn',discards:[],riichi:[],kan:[],win:false,abort:false},()=>{})});for(const kind of ['chi','pon','kan'])assert.equal(await page.locator('#'+kind).isEnabled(),false);
 const names=['nicole','billy','miyabi','ellen'];
 for(let id=0;id<4;id++)for(const kind of ['chi','pon','kan']){
  if(!await page.locator('#game-menu').isVisible())await page.locator('#menu-toggle').click();await page.locator('#preview-character').selectOption(String(id));await page.locator('#preview-'+kind).click();await page.locator('#call-character').evaluate(e=>e.decode());
  assert.equal(await page.locator('#call-character').getAttribute('src'),'calls/'+names[id]+'-'+kind+'.png');assert.equal(await page.locator('#call-badge').getAttribute('src'),kind+'-fx.png');
  if(id===1&&kind==='kan'){await page.waitForTimeout(400);await page.screenshot({path:'/tmp/zzz-billy-kan-action.png'})}
 }
 await page.setViewportSize({width:390,height:844});if(!await page.locator('#game-menu').isVisible())await page.locator('#menu-toggle').click();await page.locator('#preview-character').selectOption('3');await page.locator('#preview-pon').click();await page.locator('#call-character').evaluate(e=>e.decode());await page.waitForTimeout(400);await page.screenshot({path:'/tmp/zzz-ellen-pon-mobile.png'});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.emulateMedia({reducedMotion:'reduce'});if(!await page.locator('#game-menu').isVisible())await page.locator('#menu-toggle').click();await page.locator('#preview-chi').click();assert.equal(await page.locator('#call-character').evaluate(e=>getComputedStyle(e).animationName),'none');
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: visible tiles, legal-call button selection, all 12 actor/action artworks, mobile and reduced motion');
})().catch(e=>{console.error(e);process.exit(1)});
