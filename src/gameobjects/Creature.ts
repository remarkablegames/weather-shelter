import Phaser from 'phaser';

import { Texture } from '../constants';

enum Animation {
  FrogIdle = 'FrogIdle',
  OpossumIdle = 'OpossumIdle',
  EagleIdle = 'EagleIdle',
  FoxIdle = 'FoxIdle',
  Death = 'CreatureDeath',
}

const SOAK_FILL_RATE = 8;
const SOAK_DRAIN_RATE = 3;
const BAR_WIDTH = 32;
const BAR_HEIGHT = 4;
const BAR_OFFSET_Y = -24;

export class Creature extends Phaser.Physics.Matter.Sprite {
  soakedMeter = 0;
  isDead = false;
  isStorming = false;

  private soakBar!: Phaser.GameObjects.Graphics;
  private creatureType: Texture;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: Texture,
    scale = 2,
  ) {
    super(scene.matter.world, x, y, type, 0);
    this.creatureType = type;

    scene.add.existing(this);
    this.setScale(scale);
    this.setStatic(true);
    this.setDepth(6);

    this.createAnimations();
    this.playIdleAnimation();

    this.soakBar = scene.add.graphics();
    this.soakBar.setDepth(10);
  }

  private createAnimations() {
    const anims = this.scene.anims;

    if (!anims.exists(Animation.FrogIdle)) {
      anims.create({
        key: Animation.FrogIdle,
        frames: anims.generateFrameNumbers(Texture.FrogIdle, {
          start: 0,
          end: 3,
        }),
        frameRate: 6,
        repeat: -1,
      });
    }

    if (!anims.exists(Animation.OpossumIdle)) {
      anims.create({
        key: Animation.OpossumIdle,
        frames: anims.generateFrameNumbers(Texture.OpossumIdle, {
          start: 0,
          end: 5,
        }),
        frameRate: 6,
        repeat: -1,
      });
    }

    if (!anims.exists(Animation.EagleIdle)) {
      anims.create({
        key: Animation.EagleIdle,
        frames: anims.generateFrameNumbers(Texture.EagleAttack, {
          start: 0,
          end: 3,
        }),
        frameRate: 6,
        repeat: -1,
      });
    }

    if (!anims.exists(Animation.FoxIdle)) {
      anims.create({
        key: Animation.FoxIdle,
        frames: [
          { key: Texture.FoxIdle1 },
          { key: Texture.FoxIdle2 },
          { key: Texture.FoxIdle3 },
          { key: Texture.FoxIdle4 },
        ],
        frameRate: 6,
        repeat: -1,
      });
    }

    if (!anims.exists(Animation.Death)) {
      anims.create({
        key: Animation.Death,
        frames: anims.generateFrameNumbers(Texture.EnemyDeath, {
          start: 0,
          end: 5,
        }),
        frameRate: 12,
        repeat: 0,
      });
    }
  }

  private playIdleAnimation() {
    switch (this.creatureType) {
      case Texture.FrogIdle:
        this.play(Animation.FrogIdle);
        break;
      case Texture.OpossumIdle:
        this.play(Animation.OpossumIdle);
        break;
      case Texture.EagleAttack:
        this.play(Animation.EagleIdle);
        break;
      default:
        this.play(Animation.FoxIdle);
        break;
    }
  }

  get isExposed(): boolean {
    if (!this.isStorming) return false;
    const bodies = this.scene.matter.world.getAllBodies();
    const myX = this.x;
    const myTop = this.y - this.displayHeight / 2;

    for (const body of bodies) {
      if (body === (this.body as MatterJS.BodyType)) continue;
      const bounds = body.bounds;
      if (
        bounds.min.x < myX + 8 &&
        bounds.max.x > myX - 8 &&
        bounds.max.y < myTop &&
        bounds.max.y > myTop - 200
      ) {
        return false;
      }
    }
    return true;
  }

  update(delta: number) {
    if (this.isDead) return;

    if (this.isStorming) {
      if (this.isExposed) {
        this.soakedMeter = Math.min(
          100,
          this.soakedMeter + SOAK_FILL_RATE * (delta / 1000),
        );
      } else {
        this.soakedMeter = Math.max(
          0,
          this.soakedMeter - SOAK_DRAIN_RATE * (delta / 1000),
        );
      }

      const t = this.soakedMeter / 100;
      const blue = Math.floor(0xff * t);
      this.setTint(
        Phaser.Display.Color.GetColor(
          255 - Math.floor(80 * t),
          255 - Math.floor(80 * t),
          Math.min(255, 200 + blue),
        ),
      );

      if (this.soakedMeter >= 100) {
        this.die();
        return;
      }
    }

    this.drawSoakBar();
  }

  private drawSoakBar() {
    const bx = this.x - BAR_WIDTH / 2;
    const by = this.y + BAR_OFFSET_Y;

    this.soakBar.clear();

    if (!this.isStorming || this.soakedMeter <= 0) return;

    this.soakBar.fillStyle(0x000000, 0.6);
    this.soakBar.fillRect(bx, by, BAR_WIDTH, BAR_HEIGHT);

    const fill = (this.soakedMeter / 100) * BAR_WIDTH;
    const color =
      this.soakedMeter < 50
        ? 0x44aaff
        : this.soakedMeter < 80
          ? 0xff8800
          : 0xff2200;
    this.soakBar.fillStyle(color, 1);
    this.soakBar.fillRect(bx, by, fill, BAR_HEIGHT);
  }

  private die() {
    this.isDead = true;
    this.soakBar.clear();
    this.setTexture(Texture.EnemyDeath);
    this.play(Animation.Death);
    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.setVisible(false);
    });
  }

  destroy(fromScene?: boolean) {
    this.soakBar.destroy();
    super.destroy(fromScene);
  }
}
