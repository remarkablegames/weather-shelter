# Weather Shelter Game

Replace the existing Phaser 3 starter platformer with a physics-based puzzle game where the player drags and stacks building blocks to shelter tiny sunnyland animals (frog, opossum, eagle) before mixed bad weather (rain, wind, debris) strikes, across progressive levels with a tutorial first.

---

## Game Overview

- **Phases**: Build phase → Storm phase → Result screen
- **Level 1**: Tutorial — no timer, rain only, 1 frog to shelter, 3 block types
- **Level 2+**: Countdown timer, increasing animal count, worse weather (wind added L2, debris added L3+), more/different blocks
- **Damage model**: each animal has a **health bar** (0–100) that decreases when hit by a `RainDrop` physics body. Rain drops are sensor bodies that call `animal.takeDamage()` on collision and self-destroy. Sheltered animals (rain blocked by stacked blocks) take no damage. Health does not regenerate.
- **Win condition**: storm ends with all animals alive (health never reached 0)
- **Lose condition**: one or more animals die during the storm (health hit 0); storm always plays to completion before showing the Result screen
- **Result screen**: shows survivors count (e.g. "2/3 animals survived"); pass = all survived, fail = any died

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

| Class      | Description                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------- |
| `Animal`   | Animated sunnyland animal (eagle/fox/frog/opossum idle), physics body, health bar, `takeDamage()` |
| `Block`    | Draggable/droppable physics block (plank, box, roof wedge), different sizes/masses                |
| `RainDrop` | Falling/angled rain projectile; deactivates on hitting a block                                    |
| `Debris`   | Heavy falling object; destroys blocks on impact                                                   |

### New Components

| Component | Description                              |
| --------- | ---------------------------------------- |
| `HUD`     | Timer countdown + "animals safe" counter |

### New Constants/Types

- `Scene` enum: add `Menu`, `Game`, `Result`
- `Texture` enum: all new sprite keys
- `LevelConfig` type: timer, animals, blocks available, weather intensity

---

## Implementation Steps

### 1. Extend constants (`src/constants/keys.ts`)

Add new `Scene` and `Texture` enum values for all new assets.

### 2. Extend Boot scene (`src/scenes/Boot.ts`)

Load sunnyland animal sprites:

- `frog-idle.png` (spritesheet, 4 frames)
- `opossum/spritesheet.png` (6-frame idle)
- `eagle-attack.png` (spritesheet)
- FX: `enemy-death.png` for animal-hit effect

Load swamp assets:

- Background: `swamp/background/layers/1–5.png` (parallax layers)
- Blocks: `swamp/objects/boxes/1–6.png`, `swamp/objects/stones/1–5.png`, `swamp/objects/fence/1–3.png`
- Debris: `swamp/objects/stones/` (heavier variants)

### 3. Add `LevelConfig` type (`src/types/level.ts`)

```ts
interface LevelConfig {
  level: number;
  timerSeconds: number | null; // null = no timer (tutorial)
  animals: AnimalConfig[];
  blocks: Texture[];
  weather: WeatherConfig;
}
```

### 4. Create `Animal` game object (`src/gameobjects/Animal.ts`)

- Extends `Phaser.Physics.Matter.Sprite`
- Plays idle animation for its type
- `health`: 0–100 integer, starts at 100
- `takeDamage()`: called by collision handler when a `RainDrop` hits; subtracts `HEALTH_HIT_AMOUNT` (12); triggers death at 0
- A small **health bar** rendered above the animal (Phaser `Graphics`, green→orange→red fill on dark bg) — hidden at full health, shown when any damage taken
- At `health <= 0`: play `enemy-death` spritesheet animation, disable physics body, mark `isDead = true`
- Body labeled `'animal'` for collision detection
- Tint shifts bluer as health decreases (visual feedback)

### 5. Create `Block` game object (`src/gameobjects/Block.ts`)

- Extends `Phaser.Physics.Matter.Image`
- During build phase: pointer drag via `setInteractive({ cursor: 'grab' })` + `setStatic(true)` while dragging, direct `Matter.Body.setPosition` on pointer move
- On drop: `setStatic(false)`, body falls and settles under gravity with rotation
- Three types: `Box` (swamp box sprites 1–6), `Stone` (swamp stone sprites, heavy/slow), `Plank` (swamp fence sprites, thin/long)
- **Physics body shapes** (AI-traced per sprite, passed to `Matter.Bodies.fromVertices`):
  - `Box` variants: default rectangle (shape already matches bounds)
  - `Stone` variants: custom polygon vertices traced from each sprite's silhouette (e.g. stone/1 = 6-point irregular boulder, stone/2 = tall rectangle, stone/3 = skewed parallelogram)
  - `Plank` variants: thin 4-point polygon matching the diagonal angle of each fence sprite
  - Vertex arrays defined in a `BLOCK_SHAPES` constant in `src/constants/`
- **Drag feedback UX:**
  - `pointerover`: apply blue tint (`setTint(0xddeeff)`), cursor → `grab`
  - `pointerout`: clear tint, cursor → default
  - Dragging: scale to 1.08×, cursor → `grabbing`
  - On drop: scale back to 1×

### 6. Create `RainDrop` & `Debris` game objects (`src/gameobjects/Weather.ts`)

- `RainDrop`: small fast Matter dynamic body, diagonal velocity, destroyed on block collision via Matter collision events
- `Debris`: larger Matter body with high mass, can rotate and knock blocks on impact, triggers animal damage on contact

### 7. Add `Menu` scene (`src/scenes/Menu.tsx`)

- Title + "Play" button → starts Level 1
- phaser-jsx `Text` + `Rectangle` for buttons

### 8. Add `Game` scene (`src/scenes/Game.tsx`)

This is the core scene with two sub-phases:

**Build phase:**

- Render swamp background parallax layers (`swamp/background/layers/1–5.png`)
- Spawn animals at fixed positions (per level config)
- Spawn `blockCount` blocks randomly along the ground (x range 200–1100); player drags them to build shelter
- Show HUD timer (if not tutorial)
- "Start Storm" button (or timer auto-triggers)

**Storm phase:**

- Disable block dragging, enable full physics
- **Background transition**: tween layer 1 sky tint from blue-grey → dark purple/charcoal (`0x2a1a3a`) over 2s; add a semi-transparent dark `Graphics` overlay that fades in
- **Rain**: spawn `RainDrop` sensor bodies (2×10px procedural texture, blue tint) at `rainIntervalMs` intervals from the top; destroyed on collision with any non-raindrop body; call `animal.takeDamage()` on collision with body labeled `'animal'`
- **Wind**: apply `setForce` horizontally on exposed animal Matter bodies each frame; add horizontal white streak `Graphics` lines across scene for visual effect
- **Debris** (level 3+): spawn stone sprites as high-mass Matter bodies falling from top, rotating on descent
- Detect animal hits → mark animal as harmed
- After storm duration ends → tween sky back, fade out overlay, emit `stormEnd` event

**Phase transition:**

- Camera shake on storm start
- Lightning flash: instantaneous white full-screen `Graphics` overlay at opacity 0.8, immediately tweened to 0 over 150ms; repeat 1–2 times

### 9. Add `Result` scene (`src/scenes/Result.tsx`)

- Show pass/fail, animals saved count
- "Next Level" / "Retry" buttons
- Save progress to `localStorage`

### 10. Add `HUD` component (`src/components/`)

- `HUD.tsx`: countdown timer text + animals-safe counter

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
| `sunnyland/characters/frog/spritesheets/frog-idle.png`     | Frog idle animation                      |
| `sunnyland/characters/opossum/spritesheet.png`             | Opossum idle                             |
| `sunnyland/characters/eagle/spritesheets/eagle-attack.png` | Eagle                                    |
| `sunnyland/characters/foxy/sprites/idle/player-idle-*.png` | Fox idle frames                          |
| `sunnyland/misc/fx/spritesheets/enemy-death.png`           | Animal-hit FX                            |

---

## Scope Notes

- No audio in initial implementation
- `localStorage` used only for highest completed level
- Physics: **Matter.js** (replaces Arcade in `src/index.ts` config); enables block rotation, friction, stable stacking, and toppling
- Drag-and-drop via `Phaser.Physics.Matter.MatterGameObject` pointer events + `setStatic(true)` + direct `Matter.Body.setPosition` during drag
- Animals use Matter static bodies; rain/debris use Matter dynamic bodies
