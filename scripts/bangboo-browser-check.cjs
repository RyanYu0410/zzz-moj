const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage();
 await page.goto('http://localhost:8080/');await page.locator('#start-play').click();
 await page.locator('#round-toggle img').evaluate(e=>e.decode());
 for(const viewport of [{width:1280,height:960},{width:390,height:844}]){
  await page.setViewportSize(viewport);
  await page.locator('#round-toggle').click();
  await page.waitForFunction(()=>document.querySelector('#round-toggle').getAttribute('aria-expanded')==='true');
  assert(await page.locator('#round-info').isVisible());
  assert.equal(await page.locator('#round-info-title').textContent(),await page.locator('#round-label').textContent());
  const box=await page.locator('#round-info').boundingBox();assert(box.x>=0&&box.y>=0&&box.x+box.width<=viewport.width&&box.y+box.height<=viewport.height);
  await page.keyboard.press('Escape');assert(!(await page.locator('#round-info').isVisible()));
  await page.locator('#round-toggle').click();await page.locator('.round-info-close').click();assert(!(await page.locator('#round-info').isVisible()));
 }
 await browser.close();console.log('PASS: Bangboo opens live round details, Escape and close dismiss, desktop/mobile fit');
})().catch(e=>{console.error(e);process.exit(1)});
