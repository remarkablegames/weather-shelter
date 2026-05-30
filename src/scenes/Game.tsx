import Phaser from 'phaser';
import { render } from 'phaser-jsx';

import { HUD, PhaseLabel } from '../components';
import type { SetSurvivors, SetTimer } from '../components/HUD';
import type { SetPhaseLabel } from '../components/PhaseLabel';
import { Scene, Texture } from '../constants';
import { Block, Creature } from '../gameobjects';
import { Debris, RainDrop } from '../gameobjects/Weather';
import { BlockType, LevelConfig, LEVELS } from '../types/level';

const BLOCK_SCALE = 2;
const CREATURE_SCALE = 3;
const BLOCK_SPAWN_X_MIN = 200;
const BLOCK_SPAWN_X_MAX = 1100;
const CREATURE_Y_OFFSET = 48;
const RAIN_INTERVAL_MS = 200;
const DEBRIS_INTERVAL_MS = 3000;
const WIND_STREAK_COUNT = 12;

type Phase = 'build' | 'storm';

export class Game extends Phaser.Scene {
  private config!: LevelConfig;
  private phase: Phase = 'build';
  private creatures: Creature[] = [];
  private blocks: Block[] = [];
  private groundY = 0;
  private stormOverlay!: Phaser.GameObjects.Graphics;
  private windStreaks!: Phaser.GameObjects.Graphics;
  private rainEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private rainTimer?: Phaser.Time.TimerEvent;
  private debrisTimer?: Phaser.Time.TimerEvent;
  private stormTimer?: Phaser.Time.TimerEvent;
  private countdownTimer?: Phaser.Time.TimerEvent;
  private setTimer!: SetTimer;
  private setSurvivors!: SetSurvivors;
  private setPhaseLabel!: SetPhaseLabel;
  private launchButton!: Phaser.GameObjects.Graphics;
  private launchText!: Phaser.GameObjects.Text;
  private timeLeft = 0;

  constructor() {
    super({ key: Scene.Game });
  }

  init(data: { level?: number }) {
    this.config = LEVELS[(data.level ?? 1) - 1] ?? LEVELS[0];
    this.phase = 'build';
    this.creatures = [];
    this.blocks = [];
    this.timeLeft = this.config.timerSeconds ?? 0;
  }

  create() {
    const { width, height } = this.scale;

    this.groundY = height;
    this.createBackground(width, height);
    this.createGround(width, height);
    this.createRainEmitter();
    this.createHUD();
    this.createCreatures();
    this.spawnBlocks();
    this.createLaunchButton(width);

    this.stormOverlay = this.add.graphics();
    this.stormOverlay.setDepth(15);
    this.stormOverlay.setAlpha(0);

    this.windStreaks = this.add.graphics();
    this.windStreaks.setDepth(9);

    if (this.config.timerSeconds !== null) {
      this.startCountdown();
    }
  }

  private createBackground(width: number, height: number) {
    [
      Texture.SwampBg1,
      Texture.SwampBg2,
      Texture.SwampBg3,
      Texture.SwampBg4,
      Texture.SwampBg5,
    ].forEach((tex, i) => {
      this.add
        .image(0, 0, tex)
        .setOrigin(0)
        .setDisplaySize(width, height)
        .setDepth(i);
    });
  }

  private createGround(width: number, height: number) {
    const groundBody = this.matter.add.rectangle(
      width / 2,
      height + 20,
      width,
      40,
      { isStatic: true, label: 'ground', friction: 1, frictionStatic: 1 },
    );
    void groundBody;
  }

  private createCreatures() {
    const creatureY = this.groundY - CREATURE_Y_OFFSET;
    const positions = [
      { x: 540, y: creatureY },
      { x: 740, y: creatureY },
      { x: 640, y: creatureY },
    ].slice(0, this.config.creatureCount);
    positions.forEach((pos, i) => {
      const type = this.config.creatureTypes[i] ?? Texture.FrogIdle;
      const creature = new Creature(this, pos.x, pos.y, type, CREATURE_SCALE);
      this.creatures.push(creature);
    });
    this.updateSurvivorsHUD();
  }

  private spawnBlocks() {
    const blockTypes: BlockType[] = this.config.blockTypes;
    const count = this.config.blockCount;
    const groundY = this.groundY;

    for (let i = 0; i < count; i++) {
      const type = blockTypes[i % blockTypes.length];
      const x = Phaser.Math.Between(BLOCK_SPAWN_X_MIN, BLOCK_SPAWN_X_MAX);
      const block = new Block(
        this,
        x,
        groundY - 40,
        this.randomTexture(type),
        BLOCK_SCALE,
      );
      this.blocks.push(block);
    }
  }

  private randomTexture(type: BlockType): Texture {
    const boxes = [
      Texture.Box1,
      Texture.Box2,
      Texture.Box3,
      Texture.Box4,
      Texture.Box5,
      Texture.Box6,
    ];
    const stones = [
      Texture.Stone1,
      Texture.Stone2,
      Texture.Stone3,
      Texture.Stone4,
      Texture.Stone5,
    ];
    const planks = [Texture.Plank1, Texture.Plank2, Texture.Plank3];

    const arr = type === 'box' ? boxes : type === 'stone' ? stones : planks;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private createLaunchButton(width: number) {
    this.launchButton = this.add.graphics();
    this.launchButton.setDepth(12);
    this.launchButton.fillStyle(0xaa2200, 1);
    this.launchButton.fillRoundedRect(width - 210, 20, 190, 50, 8);
    this.launchButton.setInteractive(
      new Phaser.Geom.Rectangle(width - 210, 20, 190, 50),
      (rect: Phaser.Geom.Rectangle, x: number, y: number) =>
        Phaser.Geom.Rectangle.Contains(rect, x, y),
    );
    this.launchButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      if (this.phase === 'build') {
        this.startStorm();
      }
    });

    this.launchText = this.add
      .text(width - 115, 45, 'Launch Storm', {
        fontFamily: '"Lucida Grande", Helvetica, Arial, sans-serif',
        fontSize: 18,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(13);
  }

  private createRainEmitter() {
    const rainTexture = this.textures.exists('rainDrop')
      ? null
      : this.textures.createCanvas('rainDrop', 2, 8);
    if (rainTexture) {
      const ctx = rainTexture.getContext();
      ctx.fillStyle = 'rgba(180,220,255,0.8)';
      ctx.fillRect(0, 0, 2, 8);
      rainTexture.refresh();
    }

    this.rainEmitter = this.add.particles(0, 0, 'rainDrop', {
      x: { min: -50, max: this.scale.width + 50 },
      y: -20,
      speedX: { min: 80, max: 140 },
      speedY: { min: 500, max: 700 },
      angle: 70,
      lifespan: 1200,
      frequency: 30,
      quantity: 3,
      alpha: { start: 0.8, end: 0 },
      scaleX: 1,
      scaleY: 1,
      active: false,
    });
    this.rainEmitter.setDepth(11);
  }

  private createHUD() {
    render(
      <HUD
        onReady={(setTimer: SetTimer, setSurvivors: SetSurvivors) => {
          this.setTimer = setTimer;
          this.setSurvivors = setSurvivors;
        }}
      />,
      this,
    );

    render(
      <PhaseLabel
        onReady={(setLabel: SetPhaseLabel) => {
          this.setPhaseLabel = setLabel;
        }}
      />,
      this,
    );
  }

  private startCountdown() {
    this.setTimer(this.timeLeft);

    this.countdownTimer = this.time.addEvent({
      delay: 1000,
      repeat: (this.config.timerSeconds ?? 0) - 1,
      callback: () => {
        this.timeLeft--;
        this.setTimer(this.timeLeft);
        if (this.timeLeft <= 0) {
          this.startStorm();
        }
      },
    });
  }

  private startStorm() {
    if (this.phase === 'storm') return;
    this.phase = 'storm';

    this.countdownTimer?.remove();
    this.launchButton.setVisible(false);
    this.launchText.setVisible(false);
    this.setTimer(-1);

    this.blocks.forEach((b) => {
      b.disableDrag();
    });
    this.creatures.forEach((c) => {
      c.isStorming = true;
    });

    this.cameras.main.shake(500, 0.01);
    this.flashLightning();

    this.tweens.add({
      targets: this.stormOverlay,
      alpha: 1,
      duration: 2000,
      onUpdate: () => {
        const a = this.stormOverlay.alpha * 0.5;
        this.stormOverlay.clear();
        this.stormOverlay.fillStyle(0x100820, a);
        this.stormOverlay.fillRect(0, 0, this.scale.width, this.scale.height);
      },
    });

    const skyLayers = this.children.list.filter(
      (obj): obj is Phaser.GameObjects.Image =>
        obj instanceof Phaser.GameObjects.Image,
    );
    skyLayers.forEach((img) => {
      this.tweens.add({
        targets: img,
        tint: 0x2a1a3a,
        duration: 2000,
      });
    });

    this.rainEmitter.start();
    this.startRainPhysics();

    if (this.config.weather.hasDebris) {
      this.startDebris();
    }

    this.stormTimer = this.time.delayedCall(
      this.config.weather.stormDurationMs,
      () => {
        this.endStorm();
      },
    );
  }

  private flashLightning() {
    const flash = this.add.graphics();
    flash.setDepth(20);
    flash.fillStyle(0xffffff, 0.85);
    flash.fillRect(0, 0, this.scale.width, this.scale.height);

    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 150,
      onComplete: () => {
        flash.destroy();
        this.time.delayedCall(300, () => {
          this.flashLightning2();
        });
      },
    });
  }

  private flashLightning2() {
    const flash = this.add.graphics();
    flash.setDepth(20);
    flash.fillStyle(0xffffff, 0.5);
    flash.fillRect(0, 0, this.scale.width, this.scale.height);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 100,
      onComplete: () => {
        flash.destroy();
      },
    });
  }

  private startRainPhysics() {
    this.rainTimer = this.time.addEvent({
      delay: RAIN_INTERVAL_MS / this.config.weather.rainRate,
      loop: true,
      callback: () => {
        if (this.phase !== 'storm') return;
        const x = Phaser.Math.Between(-50, this.scale.width + 50);
        const drop = new RainDrop(this, x, -10);

        this.matter.world.on(
          'collisionstart',
          (
            _event: Phaser.Physics.Matter.Events.CollisionStartEvent,
            bodyA: MatterJS.BodyType,
            bodyB: MatterJS.BodyType,
          ) => {
            const dropBody = drop.body as MatterJS.BodyType;
            if (bodyA === dropBody || bodyB === dropBody) {
              const other = bodyA === dropBody ? bodyB : bodyA;
              if (other.label !== 'raindrop') {
                drop.destroy();
              }
            }
          },
        );

        this.time.delayedCall(3000, () => {
          if (drop.active) drop.destroy();
        });
      },
    });
  }

  private startDebris() {
    this.debrisTimer = this.time.addEvent({
      delay: DEBRIS_INTERVAL_MS,
      loop: true,
      callback: () => {
        if (this.phase !== 'storm') return;
        const x = Phaser.Math.Between(BLOCK_SPAWN_X_MIN, BLOCK_SPAWN_X_MAX);
        void new Debris(this, x, -40);
      },
    });
  }

  private drawWindStreaks() {
    this.windStreaks.clear();
    if (this.phase !== 'storm' || this.config.weather.windForce === 0) return;
    this.windStreaks.lineStyle(1, 0xeeeeff, 0.25);
    for (let i = 0; i < WIND_STREAK_COUNT; i++) {
      const sx = Phaser.Math.Between(0, this.scale.width);
      const sy = Phaser.Math.Between(0, this.groundY);
      this.windStreaks.lineBetween(sx, sy, sx + 60, sy + 8);
    }
  }

  private applyWind() {
    if (this.config.weather.windForce === 0) return;
    this.creatures.forEach((c) => {
      if (!c.isDead && c.isExposed) {
        (c.body as MatterJS.BodyType).force.x += this.config.weather.windForce;
      }
    });
  }

  private updateSurvivorsHUD() {
    const alive = this.creatures.filter((c) => !c.isDead).length;
    const total = this.creatures.length;
    this.setSurvivors(`🐾 ${String(alive)} / ${String(total)}`);
  }

  private endStorm() {
    this.phase = 'build';
    this.rainEmitter.stop();
    this.rainTimer?.remove();
    this.debrisTimer?.remove();
    this.creatures.forEach((c) => {
      c.isStorming = false;
    });

    const survived = this.creatures.filter((c) => !c.isDead).length;
    const total = this.creatures.length;

    this.time.delayedCall(1500, () => {
      this.scene.start(Scene.Result, {
        survived,
        total,
        level: this.config.level,
      });
    });
  }

  update(_time: number, delta: number) {
    this.creatures.forEach((creature) => {
      creature.update(delta);
    });
    this.blocks.forEach((block) => {
      block.update();
    });
    this.applyWind();
    this.drawWindStreaks();
    this.updateSurvivorsHUD();
  }
}
