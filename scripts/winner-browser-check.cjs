const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true}),p=await b.newPage({viewport:{width:1280,height:960}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:8080/?test');await p.waitForFunction(()=>mahjongTest.decision);
 assert(await p.evaluate(()=>document.querySelector('.world').contains(document.getElementById('hand'))&&document.querySelector('.world').contains(document.getElementById('melds'))));
 for(let id=1;id<4;id++){const back=p.locator('#backs'+id);assert(await back.locator('.tile-back').count()>0);assert.equal(await back.locator('img').count(),0)}
 await p.evaluate(()=>mahjongTest.match.dispose());
 const names=['nicole','billy','miyabi','ellen'];
 for(let id=0;id<4;id++){
  await p.evaluate(id=>{const a=mahjongTest,l=a.match.model.player_id.indexOf(id),r={l,baojia:null,shoupai:'m123p456s789z11555',fu:40,fanshu:2,defen:2700,hupai:[{name:'門前清自摸和',fanshu:1},{name:'役牌 白',fanshu:1}],fenpei:[-900,-900,-900,-900]};r.fenpei[l]=2700;a.showVictory({type:'result',result:r})},id);
  await p.locator('#victory-art').evaluate(e=>e.decode());assert((await p.locator('#victory-art').getAttribute('src')).includes(names[id]));assert.equal(await p.locator('#modal').isVisible(),false);
  if(id===1)await p.screenshot({path:'/tmp/zzz-billy-reveal.png'});
  await p.locator('#reveal-result').click();assert.equal(await p.locator('#victory').isVisible(),false);await p.locator('.settlement-art').evaluate(e=>e.decode());assert((await p.locator('.settlement-art').getAttribute('src')).includes(names[id]));assert.equal(await p.locator('.settlement p').count(),4);
  if(id===2)await p.screenshot({path:'/tmp/zzz-miyabi-results.png'});
  await p.evaluate(()=>document.getElementById('modal').close());
 }
 await p.setViewportSize({width:390,height:844});
 await p.evaluate(()=>{const a=mahjongTest;a.showVictory({type:'result',result:{l:0,baojia:1,shoupai:'m123p456s789z11555',fu:40,fanshu:2,defen:2600,hupai:[{name:'役牌 白',fanshu:1}],fenpei:[2600,-2600,0,0]}})});await p.locator('#reveal-result').click();await p.screenshot({path:'/tmp/zzz-winner-mobile.png'});assert(await p.evaluate(()=>{const d=document.getElementById('modal');return d.scrollWidth<=d.clientWidth+2}));await p.locator('#next').scrollIntoViewIfNeeded();assert(await p.locator('#next').isVisible());assert.deepEqual(errors,[]);await b.close();console.log('PASS: table racks, hidden opponents, four distinct win portraits, click-to-reveal settlement, mobile result layout')})().catch(e=>{console.error(e);process.exit(1)});
