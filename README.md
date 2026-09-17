# Nicole Riichi Club

A browser-based Zenless Zone Zero fan mahjong prototype with independent character layers and generated six-frame discard animations.

## Run locally

Serve the `dist` directory with any static HTTP server, for example:

```sh
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080 in your browser. No build step or API keys are needed.

## Verify game logic

```sh
node check.cjs
```

## Structure

- `dist/index.html`: game interface
- `dist/style.css`: responsive layout and layered scene
- `dist/game.js`: closed-hand practice rules, bots and animation timing
- `dist/*-action6.png`: one transparent six-frame sheet per character
- `dist/floor-layer.png`, `dist/table-layer.png`: independent environment assets
- `check.cjs`: game state, animation ownership and timing regression checks

## Scope

Four-player closed-hand draw/discard practice, basic bots, tenpai/riichi and self-draw shape detection. No calls, ron, full scoring or tournament progression yet. Character animations use six generated key poses rather than skeletal animation.

Discard animations play when a tile is discarded. The in-game motion toggle and the system reduced-motion preference disable discard animations, including character poses. Browser visual verification is still needed; the automated checks verify animation triggers and timing only.

Unofficial fan project. Zenless Zone Zero characters belong to their respective rights holders. No license to the underlying characters is implied.


## New Eridu artwork collection

- `dist/chi-fx.png` and `dist/pon-fx.png`: generated transparent comic callouts with prismatic sunlight flares.
- `dist/tile-shell.png`: generated ivory/black/pink/cyan tile frame. Exact symbols are rendered by the game for legibility.
- `dist/tiles/`: 37 exported transparent PNG tiles (360 × 500), covering 27 suit tiles, seven honors and three red fives. `manifest.json` maps IDs to filenames.
- The preview controls show chi/pon artwork without changing the hand. Actual chi/pon meld rules remain unimplemented.
- One red five per suit replaces an ordinary five in the 136-tile wall. Hand recognition normalizes red fives to ordinary fives; scoring remains unimplemented.
- Red fives have a static glow; selected tiles have a warm prismatic glow. Callout animation respects reduced-motion preferences and the motion toggle.
- `ASSET-PROMPTS.md` records the built-in image-generation prompts. Tile symbols and PNG exports are deterministic browser renders of the generated frame plus code-drawn symbols.

To regenerate tile exports, serve `dist` locally, install Playwright and Chrome, and run `node scripts/export-tiles.cjs`. `PLAYWRIGHT_MODULE` can point to an existing Playwright installation. Browser verification: `node scripts/visual-check.cjs` with the same local server.
