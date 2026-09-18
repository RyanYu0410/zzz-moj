const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://localhost:8080/?test');await page.waitForFunction(()=>mahjongTest.decision);await page.evaluate(()=>mahjongTest.match.dispose());
for(const [w,h] of [[390,844],[400,600],[700,700],[844,390],[1440,900]]){
 await page.setViewportSize({width:w,height:h});await page.waitForTimeout(120);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight));
 for(const selector of ['#hand','#chi','#pon','#kan','#discard','#round-toggle','#scores-toggle','#menu-toggle']){const b=await page.locator(selector).boundingBox();assert(b&&b.x>=-1&&b.y>=0&&b.x+b.width<=w+1&&b.y+b.height<=h+1,selector+' outside '+w+'x'+h)}
 await page.locator('#scores-toggle').click();assert(await page.locator('#score0').isVisible());assert.equal(await page.locator('#score0 b').textContent(),await page.locator('#my-points').textContent());await page.keyboard.press('Escape');
 await page.locator('#menu-toggle').click();assert(await page.locator('#motion').isVisible());await page.locator('#motion').click();assert.equal(await page.locator('.bangboo-idle').evaluate(e=>getComputedStyle(e).animationName),'none');await page.locator('#motion').click();await page.keyboard.press('Escape');
 await page.screenshot({path:'/tmp/mahjong-fullscreen-'+w+'x'+h+'.png'});
}
assert.deepEqual(errors,[]);await browser.close();console.log('PASS: full viewport phone, 2:3, square, landscape, desktop; hands/buttons inside viewport, score and menu drawers, idle controls');})().catch(e=>{console.error(e);process.exit(1)});
