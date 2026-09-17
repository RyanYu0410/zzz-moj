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

Click a tile twice to discard, or select it and use the discard button. Arrow keys select legal tiles; Enter discards. Escape skips a call. During riichi selection only legal declaration discards are enabled.

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
