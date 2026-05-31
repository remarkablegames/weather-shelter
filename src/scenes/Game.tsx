import Phaser from 'phaser';
import { render } from 'phaser-jsx';

import { HUD } from '../components';
import type { SetSurvivors, SetTimer } from '../components/HUD';
import { Scene, Texture } from '../constants';
import { Block, Creature } from '../gameobjects';
import {
  Debris,
  ensureRainDropTexture,
  RainDrop,
} from '../gameobjects/Weather';
import { BlockType, LevelConfig, LEVELS } from '../types/level';

const BLOCK_SCALE = 2;
const CREATURE_SCALE = 3;
const BLOCK_SPAWN_X_MIN = 200;
const BLOCK_SPAWN_X_MAX = 1100;
const CREATURE_Y_OFFSET = 48;
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
  private rainTimer?: Phaser.Time.TimerEvent;
  private debrisTimer?: Phaser.Time.TimerEvent;
  private countdownTimer?: Phaser.Time.TimerEvent;
  private setTimer!: SetTimer;
  private setSurvivors!: SetSurvivors;
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
    ensureRainDropTexture(this);
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

  private startRain() {
    const interval = this.config.weather.rainIntervalMs;
    this.rainTimer = this.time.addEvent({
      delay: interval,
      loop: true,
      callback: () => {
        if (this.phase !== 'storm') return;
        const x = Phaser.Math.Between(-20, this.scale.width + 20);
        const drop = new RainDrop(this, x, -10);
        this.time.delayedCall(2500, () => {
          if (drop.active) drop.destroy();
        });
      },
    });
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

    this.startRain();
    this.setupRainCollisions();

    if (this.config.weather.hasDebris) {
      this.startDebris();
    }

    // storm timer
    this.time.delayedCall(this.config.weather.stormDurationMs, () => {
      this.endStorm();
    });
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

  private setupRainCollisions() {
    this.matter.world.on(
      Phaser.Physics.Matter.Events.COLLISION_START,
      (
        _event: Phaser.Physics.Matter.Events.CollisionStartEvent,
        bodyA: MatterJS.BodyType,
        bodyB: MatterJS.BodyType,
      ) => {
        const isRain = (b: MatterJS.BodyType) => b.label === 'raindrop';
        const isCreature = (b: MatterJS.BodyType) => b.label === 'creature';

        let rainBody: MatterJS.BodyType | null = null;
        let otherBody: MatterJS.BodyType | null = null;

        if (isRain(bodyA)) {
          rainBody = bodyA;
          otherBody = bodyB;
        } else if (isRain(bodyB)) {
          rainBody = bodyB;
          otherBody = bodyA;
        }

        if (!rainBody || !otherBody) return;

        const rainDrop = rainBody.gameObject as RainDrop | null;
        if (rainDrop?.active) rainDrop.destroy();

        if (isCreature(otherBody)) {
          const creature = otherBody.gameObject as Creature | null;
          creature?.takeDamage();
        }
      },
    );
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
    this.creatures.forEach((creature) => {
      if (!creature.isDead) {
        (creature.body as MatterJS.BodyType).force.x +=
          this.config.weather.windForce;
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

  update() {
    this.creatures.forEach((creature) => {
      creature.update();
    });
    this.applyWind();
    this.drawWindStreaks();
    this.updateSurvivorsHUD();
  }
}
