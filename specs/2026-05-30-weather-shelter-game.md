# Weather Shelter Game

Replace the existing Phaser 3 starter platformer with a physics-based puzzle game where the player drags and stacks building blocks to shelter tiny sunnyland animals (frog, opossum, eagle) before mixed bad weather (rain, wind, debris) strikes, across progressive levels with a tutorial first.

---

## Game Overview

- **Phases**: Build phase → Storm phase → Result screen
- **Level 1**: Tutorial — no timer, rain only, 1 frog to shelter, 3 block types
- **Level 2+**: Countdown timer, increasing creature count, worse weather (wind added L2, debris added L3+), more/different blocks
- **Damage model**: each creature has a **soaked meter** (0–100%) that fills while exposed to rain/wind during the storm, and drains slowly when sheltered. When it hits 100% the death animation plays and the creature is gone.
- **Win condition**: storm ends with all creatures alive (soaked meter never reached 100%)
- **Lose condition**: one or more creatures die during the storm (meter hit 100%); storm always plays to completion before showing the Result screen
- **Result screen**: shows survivors count (e.g. "2/3 creatures survived"); pass = all survived, fail = any died

---

## Architecture

### New Scenes

| Scene    | Purpose                                                      |
| -------- | ------------------------------------------------------------ |
| `Boot`   | Preload all sunnyland + swamp assets (keep existing, extend) |
| `Menu`   | Title screen + level select                                  |
| `Game`   | Main gameplay (build + storm phases)                         |
| `Result` | Level pass/fail screen                                       |

### New Game Objects

| Class      | Description                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------- |
| `Creature` | Animated sunnyland animal (eagle/fox/frog/opossum idle), physics body, tracks `isProtected` |
| `Block`    | Draggable/droppable physics block (plank, box, roof wedge), different sizes/masses          |
| `RainDrop` | Falling/angled rain projectile; deactivates on hitting a block                              |
| `Debris`   | Heavy falling object; destroys blocks on impact                                             |

### New Components

| Component    | Description                                |
| ------------ | ------------------------------------------ |
| `HUD`        | Timer countdown + "creatures safe" counter |
| `PhaseLabel` | Animated "BUILD!" / "STORM!" overlay       |

### New Constants/Types

- `Scene` enum: add `Menu`, `Game`, `Result`
- `Texture` enum: all new sprite keys
- `LevelConfig` type: timer, creatures, blocks available, weather intensity

---

## Implementation Steps

### 1. Extend constants (`src/constants/keys.ts`)

Add new `Scene` and `Texture` enum values for all new assets.

### 2. Extend Boot scene (`src/scenes/Boot.ts`)

Load sunnyland creature sprites:

- `frog-idle.png` (spritesheet, 4 frames)
- `opossum/spritesheet.png` (6-frame idle)
- `eagle-attack.png` (spritesheet)
- FX: `enemy-death.png` for creature-hit effect

Load swamp assets:

- Background: `swamp/background/layers/1–5.png` (parallax layers)
- Blocks: `swamp/objects/boxes/1–6.png`, `swamp/objects/stones/1–5.png`, `swamp/objects/fence/1–3.png`
- Debris: `swamp/objects/stones/` (heavier variants)

### 3. Add `LevelConfig` type (`src/types/level.ts`)

```ts
interface LevelConfig {
  level: number;
  timerSeconds: number | null; // null = no timer (tutorial)
  creatureCount: number;
  blockTypes: BlockType[];
  weather: WeatherConfig;
}
```

### 4. Create `Creature` game object (`src/gameobjects/Creature.ts`)

- Extends `Phaser.Physics.Matter.Sprite`
- Plays idle animation for its type
- `soakedMeter`: 0–100 float, tracked per creature
- `isExposed`: computed each frame — true if no block body covers the creature from above (raycasting or bounds check)
- Each frame during storm: if `isExposed`, increment `soakedMeter` by rate (faster in wind, slower for rain only); if sheltered, decrement slowly
- A small **soaked bar** rendered above the creature (Phaser `Graphics`, red fill on dark bg) updates each frame
- At `soakedMeter >= 100`: play `enemy-death` spritesheet animation, disable physics body, mark `isDead = true`
- Creature idle animation subtly changes as meter fills: normal idle → slower/hunched idle tint shift (blue tint applied via `setTint`)

### 5. Create `Block` game object (`src/gameobjects/Block.ts`)

- Extends `Phaser.Physics.Matter.Image`
- During build phase: pointer drag via `setInteractive({ cursor: 'grab' })` + a `Matter.Constraint` that pins the body to the pointer position
- On drop: destroy constraint, body falls and settles under gravity with rotation
- Three types: `Box` (swamp box sprites 1–6), `Stone` (swamp stone sprites, heavy/slow), `Plank` (swamp fence sprites, thin/long)
- **Physics body shapes** (AI-traced per sprite, passed to `Matter.Bodies.fromVertices`):
  - `Box` variants: default rectangle (shape already matches bounds)
  - `Stone` variants: custom polygon vertices traced from each sprite's silhouette (e.g. stone/1 = 6-point irregular boulder, stone/2 = tall rectangle, stone/3 = skewed parallelogram)
  - `Plank` variants: thin 4-point polygon matching the diagonal angle of each fence sprite
  - Vertex arrays defined in a `BLOCK_SHAPES` constant in `src/constants/`
- **Drag feedback UX:**
  - **Always (build phase)**: every draggable block renders a permanent colored `Graphics` outline (e.g. dashed yellow border); outline is destroyed when the storm phase begins
  - `pointerover`: additionally apply white tint (`setTint(0xddddff)`), cursor → `grab`
  - `pointerout`: clear tint, cursor → default; permanent outline remains
  - Dragging: scale to 1.05×, outline brightens to solid white, cursor → `grabbing`
  - On drop: scale back to 1×, outline returns to default yellow dashed style

### 6. Create `RainDrop` & `Debris` game objects (`src/gameobjects/Weather.ts`)

- `RainDrop`: small fast Matter dynamic body, diagonal velocity, destroyed on block collision via Matter collision events
- `Debris`: larger Matter body with high mass, can rotate and knock blocks on impact, triggers creature damage on contact

### 7. Add `Menu` scene (`src/scenes/Menu.tsx`)

- Title + "Play" button → starts Level 1
- phaser-jsx `Text` + `Rectangle` for buttons

### 8. Add `Game` scene (`src/scenes/Game.tsx`)

This is the core scene with two sub-phases:

**Build phase:**

- Render swamp background parallax layers (`swamp/background/layers/1–5.png`)
- Spawn creatures at fixed positions (per level config)
- Render block palette on left edge; player drags blocks into scene
- Show HUD timer (if not tutorial)
- "Launch Storm" button (or timer auto-triggers)

**Storm phase:**

- Disable block dragging, enable full physics
- **Background transition**: tween layer 1 sky tint from blue-grey → dark purple/charcoal (`0x2a1a3a`) over 2s; add a semi-transparent dark `Graphics` overlay that fades in
- **Rain visual**: Phaser particle emitter using a procedurally generated 2×8px white-grey texture, emitted at ~70° angle in dense streams from the top edge
- **Rain physics**: spawn `RainDrop` Matter bodies at intervals from top-right; destroyed on collision with any block (deflected by shelter); trigger `takeDamage()` on creature contact
- **Wind**: apply `setForce` horizontally on exposed creature Matter bodies each frame; add horizontal white streak `Graphics` lines across scene for visual effect
- **Debris** (level 3+): spawn stone sprites as high-mass Matter bodies falling from top, rotating on descent
- Detect creature hits → mark creature as harmed
- After storm duration ends → tween sky back, fade out overlay, emit `stormEnd` event

**Phase transition:**

- Camera shake on storm start
- `PhaseLabel` "STORM!" label flashes in then fades
- Lightning flash: instantaneous white full-screen `Graphics` overlay at opacity 0.8, immediately tweened to 0 over 150ms; repeat 1–2 times

### 9. Add `Result` scene (`src/scenes/Result.tsx`)

- Show pass/fail, creatures saved count
- "Next Level" / "Retry" buttons
- Save progress to `localStorage`

### 10. Add `HUD` & `PhaseLabel` components (`src/components/`)

- `HUD.tsx`: countdown timer text + creatures-safe counter
- `PhaseLabel.tsx`: large centered label that fades in/out

### 11. Wire up scene index and update `src/index.ts`

- Add `Menu`, `Game`, `Result` to scene list
- Remove old `Main` scene
- Update `Boot` to start `Menu`
- Switch physics config from `arcade` to `matter` (`{ default: 'matter', matter: { gravity: { y: 1 }, debug: import.meta.env.DEV } }`)
- Set canvas to **`1280×720`** (16:9); background layers (576×324) scaled up ~2.22× to fill width
- Add `pixelArt: true` to game config (enables nearest-neighbour scaling, keeps pixel art crisp at any display size)

### 12. Remove old game objects and assets

- Delete `src/gameobjects/Player.ts`, `src/gameobjects/Star.ts` (replaced entirely)
- Remove references in `src/gameobjects/index.ts` exports
- Delete unused public assets: `public/images/platform.png`, `public/images/star.png`, `public/sprites/dude.png`, `public/backgrounds/sky.png`

---

## Asset Mapping

| Asset file                                                 | Usage                                    |
| ---------------------------------------------------------- | ---------------------------------------- |
| `swamp/background/layers/1–5.png`                          | Parallax background layers               |
| `swamp/objects/boxes/1–6.png`                              | Box-type draggable blocks                |
| `swamp/objects/stones/1–5.png`                             | Stone-type blocks (heavy) + storm debris |
| `swamp/objects/fence/1–3.png`                              | Plank-type blocks (thin/long)            |
| `sunnyland/characters/frog/spritesheets/frog-idle.png`     | Frog creature idle animation             |
| `sunnyland/characters/opossum/spritesheet.png`             | Opossum creature idle                    |
| `sunnyland/characters/eagle/spritesheets/eagle-attack.png` | Eagle creature                           |
| `sunnyland/characters/foxy/sprites/idle/player-idle-*.png` | Fox creature idle frames                 |
| `sunnyland/misc/fx/spritesheets/enemy-death.png`           | Creature-hit FX                          |

---

## Scope Notes

- No audio in initial implementation
- `localStorage` used only for highest completed level
- Physics: **Matter.js** (replaces Arcade in `src/index.ts` config); enables block rotation, friction, stable stacking, and toppling
- Drag-and-drop via `Phaser.Physics.Matter.MatterGameObject` pointer events + `Matter.Constraint` to follow the pointer during drag
- Creatures use Matter static bodies; rain/debris use Matter dynamic bodies
