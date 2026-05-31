import Phaser from 'phaser';
import { render } from 'phaser-jsx';

import { HUD } from '../components';
import type { SetSurvivors, SetTimer } from '../components/HUD';
import { AudioKey, LEVELS, Scene, Texture } from '../constants';
import { Animal, Block } from '../gameobjects';
import {
  Debris,
  ensureRainDropTexture,
  RainDrop,
} from '../gameobjects/Weather';
import { LevelConfig } from '../types/level';
import { fadeInSound, fadeOutSound } from '../utils';

const BLOCK_SCALE = 2;
const ANIMAL_SCALE = 3;
const BLOCK_SPAWN_X_MIN = 200;
const BLOCK_SPAWN_X_MAX = 1100;
const DEBRIS_INTERVAL_MS = 3000;
const WIND_STREAK_COUNT = 12;
const LAUNCH_BUTTON_WIDTH = 140;
const LAUNCH_BUTTON_RIGHT_OFFSET = 160;

type Phase = 'build' | 'storm';

export class Game extends Phaser.Scene {
  private config!: LevelConfig;
  private phase: Phase = 'build';
  private animals: Animal[] = [];
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
  private twilightMusic?: Phaser.Sound.BaseSound;
  private rainMusic?: Phaser.Sound.BaseSound;
  private launchText!: Phaser.GameObjects.Text;
  private timeLeft = 0;

  constructor() {
    super({ key: Scene.Game });
  }

  init(data: { level?: number }) {
    this.config = LEVELS[(data.level ?? 1) - 1] ?? LEVELS[0];
    this.phase = 'build';
    this.animals = [];
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
    this.createAnimals();
    this.spawnBlocks();
    this.createLaunchButton(width);

    this.stormOverlay = this.add.graphics();
    this.stormOverlay.fillStyle(0x100820, 1);
    this.stormOverlay.fillRect(0, 0, width, height);
    this.stormOverlay.setDepth(15);
    this.stormOverlay.setAlpha(0);

    this.windStreaks = this.add.graphics();
    this.windStreaks.setDepth(9);

    this.setupRainCollisions();

    this.twilightMusic = this.sound.add(AudioKey.Twilight, {
      loop: true,
      volume: 0,
    });
    this.twilightMusic.play();
    fadeInSound(this, this.twilightMusic, 0.5, 2000);

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
    this.matter.world.setBounds(0, 0, width, height);
  }

  private createAnimals() {
    this.config.animals.forEach(({ x, type, height }) => {
      const y = this.groundY - (height * ANIMAL_SCALE) / 2;
      const animal = new Animal(this, x, y, type, ANIMAL_SCALE, height);
      this.animals.push(animal);
    });
    this.updateSurvivorsHUD();
  }

  private spawnBlocks() {
    const groundY = this.groundY;
    this.config.blocks.forEach((texture) => {
      const x = Phaser.Math.Between(BLOCK_SPAWN_X_MIN, BLOCK_SPAWN_X_MAX);
      const block = new Block(this, x, groundY - 40, texture, BLOCK_SCALE);
      this.blocks.push(block);
    });
  }

  private createLaunchButton(width: number) {
    this.launchButton = this.add.graphics();
    this.launchButton.setDepth(12);
    this.launchButton.fillStyle(0xaa2200, 1);
    this.launchButton.fillRoundedRect(
      width - LAUNCH_BUTTON_RIGHT_OFFSET,
      20,
      LAUNCH_BUTTON_WIDTH,
      50,
      8,
    );
    this.launchButton.setInteractive(
      new Phaser.Geom.Rectangle(
        width - LAUNCH_BUTTON_RIGHT_OFFSET,
        20,
        LAUNCH_BUTTON_WIDTH,
        50,
      ),
      (rect: Phaser.Geom.Rectangle, x: number, y: number) =>
        Phaser.Geom.Rectangle.Contains(rect, x, y),
    );
    this.launchButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      if (this.phase === 'build') {
        this.startStorm();
      }
    });

    this.launchText = this.add
      .text(
        width - LAUNCH_BUTTON_RIGHT_OFFSET + LAUNCH_BUTTON_WIDTH / 2,
        45,
        'Start Storm',
        {
          fontFamily: '"Lucida Grande", Helvetica, Arial, sans-serif',
          fontSize: 18,
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 3,
        },
      )
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
        initialHint={this.config.hint ?? ''}
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

    this.twilightMusic?.stop();
    this.sound.play(AudioKey.Thunder, { volume: 0.4 });
    this.rainMusic = this.sound.add(AudioKey.Rain, { loop: true });
    this.rainMusic.play();

    this.countdownTimer?.remove();
    this.launchButton.setVisible(false);
    this.launchText.setVisible(false);
    this.setTimer(-1);

    this.blocks.forEach((b) => {
      b.disableDrag();
    });
    this.animals.forEach((c) => {
      c.isStorming = true;
    });

    this.cameras.main.shake(300, 0.01);
    this.flashLightning();

    this.tweens.add({
      targets: this.stormOverlay,
      alpha: 0.15,
      duration: 2000,
    });

    this.children.list
      .filter(
        (obj): obj is Phaser.GameObjects.Image =>
          obj instanceof Phaser.GameObjects.Image && obj.depth < 5,
      )
      .forEach((img) => img.setTint(0x8899aa));

    this.startRain();

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
    flash.fillStyle(0xffffff, 1);
    flash.fillRect(0, 0, this.scale.width, this.scale.height);
    flash.setAlpha(0.5);

    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 150,
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
        const isRain = (body: MatterJS.BodyType) => body.label === 'raindrop';
        const isAnimal = (body: MatterJS.BodyType) => body.label === 'animal';

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

        if (isAnimal(otherBody)) {
          const animal = otherBody.gameObject as Animal | null;
          animal?.takeDamage();
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
    if (this.phase !== 'storm' || this.config.weather.windForce === 0) {
      return;
    }

    this.animals.forEach((animal) => {
      if (!animal.isDead) {
        (animal.body as MatterJS.BodyType).force.x +=
          this.config.weather.windForce;
      }
    });
  }

  private updateSurvivorsHUD() {
    const alive = this.animals.filter((animal) => !animal.isDead).length;
    const total = this.animals.length;
    this.setSurvivors(`❤️ ${String(alive)} / ${String(total)}`);
  }

  private endStorm() {
    this.phase = 'build';
    this.rainTimer?.remove();
    this.debrisTimer?.remove();
    fadeOutSound(this, this.rainMusic, 1500);
    this.animals.forEach((animal) => {
      animal.isStorming = false;
    });

    const survived = this.animals.filter((animal) => !animal.isDead).length;
    const total = this.animals.length;

    this.time.delayedCall(1500, () => {
      this.scene.start(Scene.Result, {
        survived,
        total,
        level: this.config.level,
      });
    });
  }

  update() {
    this.animals.forEach((animal) => {
      animal.update();
    });
    this.applyWind();
    this.drawWindStreaks();
    this.updateSurvivorsHUD();
  }
}
