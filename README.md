# Nicole · Riichi Club

A four-player Japanese riichi mahjong fan game with Zenless Zone Zero inspired comic artwork and 37 custom PNG tile faces.

## Play locally

```sh
npm ci
npm run build
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080/. The committed `dist` also runs directly on a static server without installation. No API key or backend is required.

## Rules and play

- Four players start with 25,000 points. East match, random initial dealer, dealer continuation, honba, riichi deposits, bankruptcy and South extension when nobody reaches 30,000.
- Human and three AI opponents can chi, pon, open kan, concealed kan, added kan, riichi, ron and tsumo. Calls are offered only when legal, and kuikae is disallowed.
- Kan draws from the dead wall and reveals another dora indicator immediately. Added kan can be robbed. Four kans by multiple players abort the hand.
- Standard yaku, fu/han scoring, red/ura/kan dora, furiten, temporary/riichi furiten, call priorities, double ron, abortive draws and exhaustive-draw payments use the pinned majiang-core rule engine.
- Confirm each settlement to continue. Download the match record at the final ranking screen.
- Selected house rules appear in the in-game rules dialog. This is an unofficial fan project, not a certified tournament client; opponents run locally and online multiplayer is not included.

Double-tap the same tile within 450 ms to discard; the first tap selects it. Arrow keys select legal tiles; Enter discards. Escape skips the current optional actions. During riichi selection only legal declaration discards are enabled.

## Artwork

The actual hand, discards, melds, dora and results all use `dist/tiles/*.png`: 27 suit tiles, seven honors and three red fives. Red fives retain a warm glow. Chi, pon and kan play transparent comic callouts, and discard animations retain the generated six-pose character sheets. Reduced motion is respected.

`ASSET-PROMPTS.md` records image-generation prompts. All assets are bundled locally. Character rights belong to their respective rights holders; no license to the underlying characters is implied.

## Development and checks

- `src/engine.js`: rule configuration, human decisions and restart-safe match scheduler.
- `src/game.js`: UI, PNG tile rendering, actions, results and effects.
- `src/ai-worker.js`: AI runs in independent Web Workers to keep the UI responsive.
- `scripts/build.cjs`: builds browser bundles into `dist`.

```sh
npm test
npm run build
npm run test:browser
```

Browser checks require Playwright and Chrome plus the local server on port 8080. Set `PLAYWRIGHT_MODULE` to reuse an installed Playwright runtime. Tests cover rule integration, a complete East match, payments, calls/kan, furiten, actual browser kan and worker-backed settlement, PNG loading, mobile layout and restart. The `?test` URL enables local test access; normal play does not expose opponent hands through the read-only integration.

Export the existing PNG collection with `node scripts/export-tiles.cjs /absolute/output/directory`.

## Dependencies and attribution

Rule engine: [@kobalab/majiang-core](https://github.com/kobalab/majiang-core) 1.4.1. AI: [@kobalab/majiang-ai](https://github.com/kobalab/majiang-ai) 1.2.0. Both are MIT licensed; see `dist/THIRD-PARTY-NOTICES.txt`. This project preserves its generated artwork independently of those libraries.


## Table racks and character victories

All concealed hands and melds now sit on the table. Opponents show anonymous backs only; clicking your own table tiles retains the original selection/discard controls.

Each winner has a generated full-body transparent PNG in `dist/winners/`: Nicole, Billy, Miyabi and Ellen. A win first opens the matching character reveal; clicking “查看立绘与结算” opens their portrait alongside the winning hand, yaku and payments. Confirming settlement continues the match. The flow also supports sequential winners and mobile scrolling. Exact built-in image-generation prompts are in `dist/winners/prompts.json`.

Additional browser checks: `node scripts/winner-browser-check.cjs`.


## Call options and action artwork

Only currently legal actions appear above the hand, arranged from right to left without an outer panel; selecting one filters the available tile combinations, and a second selection confirms the call. Concealed/added Kan uses the same Kan control on your turn. Pass declines all response choices (Chi/Pon/Kan/Ron). On your own turn it dismisses Riichi/Tsumo/Kan options without discarding or ending your turn; options reset on the next decision. Pass, Riichi, Ron and Tsumo use transparent generated artwork, and actual riichi deposits appear beside each player on the table.

Every character has three distinct action illustrations in `dist/calls/` (`nicole`, `billy`, `miyabi`, `ellen` × `chi`, `pon`, `kan`). Gameplay maps each call to the acting character; the preview character selector lets you inspect all twelve without changing the hand. Reduced motion keeps a static illustration.

The build writes content-versioned CSS and game URLs and versions the AI worker. This fixes mixed cached stylesheet/game versions that could hide or misplace table racks. Always run `npm run build` after editing source or CSS. Short windows keep a minimum table size instead of collapsing it.

Additional UI checks: `node scripts/call-options-browser-check.cjs`.

### 手机全屏牌桌

页面填满可用屏幕并适配安全区，支持 2:3、1:1、长竖屏与横屏。手机手牌固定在底部；顶部「点数」查看四家实时点数，「菜单」提供声音、动作、规则、重开、光线与演出预览。支持 Fullscreen API 的浏览器可在菜单进入原生全屏。扩展地面覆盖整个场景，原角色待机、吃碰杠演出和结算保留。

### Language selection

Menu → Language supports 简体中文, English, and 日本語. The browser remembers the selection when local storage is available. Changing language preserves the active hand and translates controls, live status, accessibility labels, rules, score panels, and results. Generated tile/call artwork stays unchanged.

### Scene resources

Menu → Scene styles offers independent floor and table choices for Nicole, Billy, Miyabi, and Ellen. Choices persist locally and do not reset the hand. Nicole uses portrait or landscape floor artwork according to the window aspect ratio; other floors use square compositions suitable for both crops. All tables preserve the shared board coordinates. Character nameplates float over the seated characters.

### Start screen and playable characters

Choose Nicole, Billy, Miyabi or Ellen before starting. The chosen character occupies your bottom seat, with matching idle/discard sprites, call illustrations, riichi cut-in, scores and victory art. The other three characters become AI opponents. Your choice is remembered locally; Menu → New match returns to character selection after confirming the reset. Existing winner portraits are reused for the lobby.

### Settings and local match history

After Start match, a confirmation dialog offers ending rules: single hand, East, or East–South; extension below 30,000, bankruptcy, and final dealer finish. Confirm and deal starts the match with these rules; closing the dialog returns to character selection. General Settings contains sound and motion controls. Sound and animation preferences apply immediately and persist. Completed matches save automatically in this browser (latest 20), with final standings and full JSON record export. Unfinished matches are not recorded; storage failures show a message at settlement.

Each hand opens with staggered tile dealing from the table center to all four racks. Input waits until dealing finishes. Motion off or reduced-motion skips the animation.
