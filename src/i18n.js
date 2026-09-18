'use strict';
// Source copy remains Chinese; each node retains its source when switching locales.
const copy = [
 ['四人各 25,000 点。庄家随机，按东一至东四推进；庄家和牌或听牌连庄。无人达到 30,000 点时进入南入延长；飞人结束。','Each player starts with 25,000 points. A random dealer starts East 1–4. The dealer repeats after winning or a tenpai draw. Play extends into South if nobody reaches 30,000; bankruptcy ends the match.','各家25,000点持ち。起家はランダムで東1〜4局を進行。親の和了・聴牌で連荘。30,000点未満なら南入、トビで終了。'],
 ['吃仅限上家；碰、明杠可接任意对手。荣和优先于碰杠，碰杠优先于吃。禁止食替。','Chi is only from the player on your left. Pon and open Kan can use any opponent’s discard. Ron takes priority over Pon/Kan, then Chi. Kuikae is prohibited.','チーは上家からのみ。ポン・大明槓は全員から可能。ロン、ポン・カン、チーの順に優先。喰い替えは禁止。'],
 ['暗杠、加杠、明杠后摸岭上牌并翻杠宝牌。加杠可被抢杠，四杠散了除单人四杠。','All Kans draw a replacement tile and reveal Kan dora. Added Kan can be robbed. Four Kans abort the hand unless all belong to one player.','槓の後は嶺上牌を引き、槓ドラを表示。加槓には槍槓が可能。四槓散了あり（1人の四槓を除く）。'],
 ['和牌必须有役。支持自摸、荣和、振听、同巡振听、立直振听，以及标准役种与符番计分。','A winning hand needs a yaku. Tsumo, Ron, furiten, temporary furiten, riichi furiten, standard yaku and fu/han scoring are supported.','和了には役が必要。ツモ・ロン・振聴・同巡振聴・立直後の振聴と、標準の役・符翻計算に対応。'],
 ['门前听牌可付 1,000 点立直。支持一发、双立直、赤宝牌、里宝牌、杠宝牌；立直后仅允许不改变听牌的暗杠。','A closed tenpai hand may declare Riichi for 1,000 points. Ippatsu, double Riichi, red/ura/Kan dora apply. After Riichi, a concealed Kan must preserve the wait.','門前聴牌で1,000点を供託して立直。一発・ダブル立直・赤ドラ・裏ドラ・槓ドラあり。立直後の暗槓は待ちが変わらない場合のみ。'],
 ['双响有效，三家和流局。流局听牌罚符 3,000 点，供托与本场按规则延续。','Double Ron is allowed; triple Ron aborts the hand. Exhaustive draws use a 3,000-point tenpai payment. Deposits and repeats carry over according to the rules.','ダブロンあり、三家和は流局。流局時のノーテン罰符は3,000点。供託・本場はルールに従って持ち越し。'],
 ['角色位置保持不变；东南西北身份随庄家轮换。结算需确认后进入下一局。','Characters keep their seats; seat winds rotate with the dealer. Confirm the result to start the next hand.','キャラクターの位置は固定で、風は親とともに交代。精算を確認すると次局へ進みます。'],
 ['当前点数和本场进度会重置，四人从 25,000 点开始。','Scores and repeats will reset. Everyone starts with 25,000 points.','点数と本場をリセットし、全員25,000点から開始します。'],
 ['本牌局直接使用这些 PNG；每门一张红五，计入赤宝牌。','These tiles are used in play. Each suit has one red five, counted as red dora.','対局で使用する牌です。各色に赤5が1枚あり、赤ドラとして数えます。'],
 ['上家弃牌可组成顺子时可吃','Chi is available when the left player’s discard completes a sequence.','上家の捨て牌で順子を作れるときにチーできます'],
 ['对手弃牌与你的对子相同时可碰','Pon is available when a discard matches your pair.','対子と同じ牌が捨てられたときにポンできます'],
 ['持有四张同牌或可加杠时开放','Kan is available with four identical tiles or an added Kan.','同じ牌が4枚あるとき、または加槓できるときに選べます'],
 ['荣和优先；跳过荣和会进入振听','Ron has priority. Passing Ron causes furiten.','ロンが優先。ロンを見送ると振聴になります'],
 ['切出高亮牌并支付 1,000 点','Discard a highlighted tile and pay 1,000 points.','選択可能な牌を切り、1,000点を供託します'],
 ['立直后只可摸切、合法暗杠或和牌','After Riichi: discard the drawn tile, make a legal concealed Kan, or win.','立直後はツモ切り・合法な暗槓・和了のみ'],
 ['牌形完成，须有役才能和牌','Complete shape — a yaku is required to win.','和了形です。和了には役が必要です'],
 ['电脑计算中断，请重新开始对局。','AI interrupted. Please start a new match.','AIが停止しました。対局を再開してください。'],
 ['电脑载入失败，请刷新页面后重试。','AI could not load. Please reload the page.','AIの読み込みに失敗しました。再読み込みしてください。'],
 ['当前浏览器不支持全屏','Fullscreen unavailable in this browser','このブラウザでは全画面に非対応'],
 ['点击邦布展开牌局信息','Tap Bangboo for round details','ボンプをタップして局情報を表示'],
 ['查看立绘与结算 ↗','View results ↗','精算を見る ↗'],['确认结算 · 继续','Continue','確認して次へ'],
 ['四人立直麻将 · 东风战','Four-player Riichi · East match','四人リーチ麻雀・東風戦'],
 ['东风战 · 终局','Final standings','東風戦・最終結果'],['重新开始东风战？','Start a new match?','対局をやり直しますか？'],
 ['新艾利都 · 37 张特色牌','New Eridu · 37 tile designs','新エリー都・37種の牌'],
 ['邦布播报 · 東風戦','Bangboo · East match','ボンプ通信・東風戦'],
 ['东风战 · 25,000 点起始','East match · 25,000 starting points','東風戦・25,000点持ち'],
 ['已立直 · 摸切／自摸','Riichi · Draw discard / Tsumo','立直中・ツモ切り／ツモ'],
 ['岭上摸牌 · 请选择出牌','Replacement draw · Choose a discard','嶺上牌・打牌を選択'],
 ['可保持听牌 · 请选择切牌','Tenpai available · Choose a discard','聴牌可能・打牌を選択'],
 ['立直 · 选择切牌','Riichi · Choose a discard','立直・打牌を選択'],
 ['可以鸣牌／荣和','Call or Ron available','鳴き／ロンが可能'],['选择暗杠／加杠','Choose a Kan','暗槓／加槓を選択'],
 ['轮到你出牌','Your turn','あなたの番です'],['正在发牌…','Dealing…','配牌中…'],['新一局开始','New hand','新しい局'],
 ['正在思考…','Thinking…','考え中…'],['本局流局','Drawn hand','流局'],['对局已暂停','Match paused','対局を中断'],
 ['选择一张牌','Select a tile','牌を選択'],['抢杠机会','Robbing a Kan','槍槓の機会'],
 ['关闭牌局信息','Close round details','局情報を閉じる'],['收起牌局信息','Close round details','局情報を閉じる'],
 ['打开游戏菜单','Open game menu','メニューを開く'],['关闭菜单','Close menu','メニューを閉じる'],['关闭点数','Close scores','点数を閉じる'],
 ['点击空白处收起','Tap outside to close','外側をタップして閉じる'],['点击展开 ⌃','Details ⌃','詳細 ⌃'],
 ['预览吃牌演出','Preview Chi','チー演出を見る'],['预览碰牌演出','Preview Pon','ポン演出を見る'],['预览杠牌演出','Preview Kan','カン演出を見る'],
 ['演出角色','Preview character','演出キャラクター'],['演出预览','Preview','演出プレビュー'],['角色演出','Character effects','キャラクター演出'],
 ['四家点数','Player scores','各家の点数'],['牌桌菜单','Game menu','対局メニュー'],['牌局信息','Round details','局情報'],
 ['进入全屏 ↗','Fullscreen ↗','全画面 ↗'],['退出全屏 ↙','Exit fullscreen ↙','全画面を終了 ↙'],
 ['玩法说明','How to play','遊び方'],['动作特效','Motion','演出'],['声音','Sound','サウンド'],['光线：','Lighting: ','照明：'],['切换场景光线','Change lighting','照明を変更'],['日光','Day','昼'],['夜场','Night','夜'],
 ['新对局 ↗','New match ↗','新しい対局 ↗'],['重新开始','Restart','やり直す'],['再开一场','Play again','もう一度'],['保存牌谱','Save game log','牌譜を保存'],
 ['牌面图鉴 ↗','Tile gallery ↗','牌一覧 ↗'],['跳过 · Esc','Pass · Esc','見送り · Esc'],['关闭 ×','Close ×','閉じる ×'],
 ['牌山剩余','Tiles left','残り牌'],['里宝牌指示','Ura dora indicators','裏ドラ表示牌'],['宝牌指示','Dora indicators','ドラ表示牌'],
 ['本场','Honba','本場'],['供托','Deposits','供託'],['取消立直','Cancel','取消'],['已立直','Riichi','立直中'],
 ['暗杠背面','Concealed Kan back','暗槓の裏面'],['明杠／加杠','Open / added Kan','大明槓／加槓'],['张暗牌','concealed tiles','枚の手牌'],
 ['你的桌面手牌','Your hand','あなたの手牌'],['你的桌面副露','Your melds','あなたの副露'],
 ['专属和牌立绘','win illustration','和了イラスト'],['和牌立绘','win illustration','和了イラスト'],['专属动作','action illustration','専用アクション'],['举牌小邦布','Bangboo holding a sign','看板を持つボンプ'],
 ['向听 · 吃碰后不可立直','shanten · Open hands cannot declare Riichi','向聴・鳴くと立直不可'],
 ['规则引擎与 majiang-ai 电脑；MIT 授权。非官方同人作品。','rules and majiang-ai opponents; MIT licensed. Unofficial fan game.','ルールエンジンと majiang-ai を使用。MITライセンス。非公式ファン作品。'],
 ['妮可','Nicole','ニコ'],['比利','Billy','ビリー'],['艾莲','Ellen','エレン'],['雅','Miyabi','雅'],
 ['东家','East','東家'],['南家','South','南家'],['西家','West','西家'],['北家','North','北家'],
 ['荒牌流局','Exhaustive draw','荒牌流局'],['九种九牌','Nine terminals','九種九牌'],['四风连打','Four winds','四風連打'],['四家立直','Four Riichi','四家立直'],['四杠散了','Four Kans','四槓散了'],['三家和流局','Triple Ron','三家和'],['流局满贯','Nagashi Mangan','流し満貫'],
 ['门前清自摸和','Menzen Tsumo','門前清自摸和'],['門前清自摸和','Menzen Tsumo','門前清自摸和'],['ダブル立直','Double Riichi','ダブル立直'],['一発','Ippatsu','一発'],['平和','Pinfu','平和'],['断幺九','Tanyao','断幺九'],['役牌','Yakuhai','役牌'],['一盃口','Iipeikou','一盃口'],['二盃口','Ryanpeikou','二盃口'],['七対子','Chiitoitsu','七対子'],['対々和','Toitoi','対々和'],['三暗刻','Sanankou','三暗刻'],['三槓子','Sankantsu','三槓子'],['三色同順','Sanshoku Doujun','三色同順'],['三色同刻','Sanshoku Doukou','三色同刻'],['一気通貫','Ittsu','一気通貫'],['混全帯幺九','Chanta','混全帯幺九'],['純全帯幺九','Junchan','純全帯幺九'],['混老頭','Honroutou','混老頭'],['小三元','Shousangen','小三元'],['混一色','Honitsu','混一色'],['清一色','Chinitsu','清一色'],['嶺上開花','Rinshan Kaihou','嶺上開花'],['槍槓','Chankan','槍槓'],['海底摸月','Haitei','海底摸月'],['河底撈魚','Houtei','河底撈魚'],['国士無双','Kokushi Musou','国士無双'],['四暗刻','Suuankou','四暗刻'],['大三元','Daisangen','大三元'],['字一色','Tsuuiisou','字一色'],['緑一色','Ryuuiisou','緑一色'],['清老頭','Chinroutou','清老頭'],['小四喜','Shousuushii','小四喜'],['大四喜','Daisuushii','大四喜'],['四槓子','Suukantsu','四槓子'],['九蓮宝燈','Chuuren Poutou','九蓮宝燈'],['天和','Tenhou','天和'],['地和','Chiihou','地和'],['裏ドラ','Ura Dora','裏ドラ'],['赤ドラ','Red Dora','赤ドラ'],['ドラ','Dora','ドラ'],
 ['自摸','Tsumo','ツモ'],['荣和','Ron','ロン'],['放铳','dealt in','放銃'],['听牌','Tenpai','聴牌'],['立直','Riichi','立直'],['暗杠','Concealed Kan','暗槓'],['加杠','Added Kan','加槓'],['吃','Chi','チー'],['碰','Pon','ポン'],['杠','Kan','カン'],['打出','Discard','打牌'],['切出','discards','打牌'],['摸入','drawn','ツモ牌'],
 ['倍役满','× Yakuman','倍役満'],['点数','Scores','点数'],['菜单 ☰','Menu ☰','メニュー ☰'],['番','han','翻'],['符','fu','符'],['点','pts','点'],['枚','tiles','枚'],['庄','Dealer','親'],['等待发牌','Waiting for tiles','配牌待ち'],['选择','Choose ','選択'],['牌组合',' combination','の組合せ'],['使用 ','Uses ','使用：'],['万子','Characters','萬子'],['饼子','Circles','筒子'],['索子','Bamboo','索子'],['字牌','Honors','字牌'],['赤五','Red fives','赤5'],['赤 ','Red ','赤 '],[' / 切',' / Discard',' / 打牌']
];
const digits=['一','二','三','四','五','六','七','八','九'];for(let suit=0;suit<3;suit++)digits.forEach((d,n)=>copy.push([d+['萬','筒','索'][suit],`${n+1} ${['Characters','Circles','Bamboo'][suit]}`,`${d}${['萬','筒','索'][suit]}`]));
copy.push(['東','East','東'],['南','South','南'],['西','West','西'],['北','North','北'],['白','White','白'],['發','Green','發'],['中','Red','中']);
copy.push(['場風','Round wind','場風'],['自風','Seat wind','自風'],['翻牌','Dragon','役牌'],['国士無双十三面','Kokushi 13-sided wait','国士無双十三面'],['四暗刻単騎','Suuankou single wait','四暗刻単騎'],['純正九蓮宝燈','Pure Chuuren Poutou','純正九蓮宝燈']);
const entries=new Map(copy.map(r=>[r[0],r]));const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const pattern=new RegExp([...entries.keys()].sort((a,b)=>b.length-a.length).map(escape).join('|'),'g');
function initLanguage(){
 let locale='zh';try{const saved=localStorage.getItem('riichi-language');if(['zh','en','ja'].includes(saved))locale=saved}catch{}
 const sources=new WeakMap();
 function translate(text){if(locale==='zh')return text;return text.replace(/([东南西北]) (\d+) 局/g,(_,w,n)=>locale==='en'?`${{东:'East',南:'South',西:'West',北:'North'}[w]} ${n}`:`${w==='东'?'東':w}${n}局`).replace(pattern,key=>entries.get(key)[locale==='en'?1:2]);}
 function set(node,key,value,write){let map=sources.get(node);if(!map){map=new Map();sources.set(node,map)}let saved=map.get(key);if(!saved||value!==saved.last)saved={source:value,last:value};const next=translate(saved.source);saved.last=next;map.set(key,saved);if(next!==value)write(next)}
 function walk(root){if(root.nodeType===3){if(root.parentElement?.closest('script,style,#language-select'))return;set(root,'text',root.nodeValue,v=>root.nodeValue=v);return}if(root.nodeType!==1)return;if(root.matches('script,style,#language-select'))return;for(const key of ['title','aria-label','alt'])if(root.hasAttribute(key))set(root,key,root.getAttribute(key),v=>root.setAttribute(key,v));for(const child of root.childNodes)walk(child)}
 const select=document.getElementById('language-select');function apply(){document.documentElement.lang={zh:'zh-CN',en:'en',ja:'ja'}[locale];select.value=locale;walk(document.body)}
 select.addEventListener('change',()=>{locale=select.value;try{localStorage.setItem('riichi-language',locale)}catch{}apply()});
 new MutationObserver(changes=>{for(const m of changes){if(m.type==='childList')for(const n of m.addedNodes)walk(n);else walk(m.target)}}).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','aria-label','alt']});
 apply();
}
module.exports={initLanguage};
