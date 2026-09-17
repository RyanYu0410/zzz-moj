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

Reduced-motion mode preserves non-flashing pose changes while skipping flight, shake and burst effects. Use the in-game action check to view character poses.

Unofficial fan project. Zenless Zone Zero characters belong to their respective rights holders. No license to the underlying characters is implied.
