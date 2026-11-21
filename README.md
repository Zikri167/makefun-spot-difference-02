![best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)
![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/rank/Zikri167.svg)
![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/reward/Zikri167.svg)

# Twin Atlas: Spot the Difference

An original campaign spot-the-difference game. Two near-identical, richly
illustrated pictures sit side by side; the right one hides **12 differences**.
Work through six hand-drawn procedural scenes, in order:

1. **Coral Kingdom** — an underwater reef with a turtle, a diver and a treasure chest
2. **Alpine Postcard** — a snowy village of chalets, skiers and a cable car
3. **Souk at Dusk** — a desert market of lanterns, spices, pottery and a camel
4. **Clockwork Workshop** — clocks, gears, blueprints and a small robot
5. **Harvest Fair** — a ferris wheel, balloons, pumpkins and a scarecrow
6. **Starlight Observatory** — a domed observatory, planets and a campfire

Every scene is drawn on canvas from a fixed seed, so the pictures are
identical on every load and the only difference between the panels is the
12 hidden changes: objects removed or added, colors shifted, things moved,
resized, mirrored, counts changed in repeated patterns, and tiny details
swapped (clock hands, a sign letter, a flag's stripes).

## How to play

- Click a difference in **either** picture; a golden numbered ring marks it on both.
- Wrong clicks cost 5 seconds and 25 points and reset your streak.
- Consecutive finds raise a streak multiplier up to **x4** (150 points per find).
- **Hints (H):** 3 per scene — a soft glow pulses near one unfound difference, 15 s apart.
- A draining timer bar (red and pulsing under 30 s) plus a completion time bonus keep the pressure on.
- Pause with **Esc/P**, restart any time, mute with **M**. Finish a scene to unlock the next and earn 1–3 stars.

All art is procedural canvas drawing and all sound is synthesized WebAudio —
no assets, no network, no build step.

## Run it

```sh
node serve.ts        # serves game/ at http://localhost:8080
# or any static server rooted at game/
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `game/` and `screenshots/` to the output directory and
writes `dossier.json` with the vendored `buildDossier`.

## Layout

- `game/index.html`, `game/styles.css` — page shell, HUD, overlays
- `game/src/main.js` — entry; `game.js` — controller; `board.js` — panel rendering
- `game/src/scene-*.js` — one file per scene: its drawing and its 12 differences
- `game/src/rng.js`, `painter.js`, `audio.js`, `differences.js`, `hud.js`, `input.js`, `state.js`, `scenes.js`

MIT licensed.
