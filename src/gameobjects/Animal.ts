import Phaser from 'phaser';

import { AudioKey, Texture } from '../constants';

enum Animation {
  OpossumIdle = 'OpossumIdle',
  EagleIdle = 'EagleIdle',
  FoxIdle = 'FoxIdle',
  FrogIdle = 'FrogIdle',
  Death = 'Death',
}

const MAX_HEALTH = 100;
const HEALTH_HIT_AMOUNT = 12;
const BAR_WIDTH = 32;
const BAR_HEIGHT = 4;
const BAR_GAP = 4;
const WALK_SPEED = 1.5;
const PATROL_RANGE = 150;

export class Animal extends Phaser.Physics.Matter.Sprite {
  health = MAX_HEALTH;
  isDead = false;
  isStorming = false;

  private healthBar!: Phaser.GameObjects.Graphics;
  private animalType: Texture;
  private barOffsetY = 0;
  private startX = 0;
  private facingRight = true;
  private canMove = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: Texture,
    scale = 2,
    spriteHeight = 32,
  ) {
    super(scene.matter.world, x, y, type, 0);
    this.animalType = type;

    scene.add.existing(this);
    this.setScale(scale);
    this.barOffsetY = -(spriteHeight * scale) / 2 - BAR_GAP;
    this.startX = x;
    this.canMove = type === Texture.OpossumIdle;
    if (this.canMove) {
      this.setFlipX(true);
      this.setFixedRotation();
      this.setFriction(1);
      this.setBounce(0);
    } else {
      this.setStatic(true);
    }
    this.setDepth(6);
    (this.body as MatterJS.BodyType).label = 'animal';
    this.setCollisionCategory(2);
    this.setCollidesWith([1, 2]); // Collide with default and animals

    this.createAnimations();
    this.playIdleAnimation();

    this.healthBar = scene.add.graphics();
    this.healthBar.setDepth(10);
  }

  private createAnimations() {
    const anims = this.scene.anims;

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

    if (!anims.exists(Animation.FrogIdle)) {
      anims.create({
        key: Animation.FrogIdle,
        frames: [
          ...Array.from({ length: 20 }, () => ({
            key: Texture.FrogSprite,
            frame: 0,
          })),
          { key: Texture.FrogSprite, frame: 1 },
          { key: Texture.FrogSprite, frame: 2 },
          { key: Texture.FrogSprite, frame: 3 },
        ],
        frameRate: 6,
        repeat: -1,
      });
    }

    if (!anims.exists(Animation.Death)) {
      anims.create({
        key: Animation.Death,
        frames: anims.generateFrameNumbers(Texture.AnimalDeath, {
          start: 0,
          end: 5,
        }),
        frameRate: 12,
        repeat: 0,
      });
    }
  }

  private playIdleAnimation() {
    switch (this.animalType) {
      case Texture.FrogSprite:
        this.play(Animation.FrogIdle);
        this.setRectangle(75, 60);
        (this.body as MatterJS.BodyType).label = 'animal';
        break;
      case Texture.OpossumIdle:
        this.play(Animation.OpossumIdle);
        this.setRectangle(70, 50);
        (this.body as MatterJS.BodyType).label = 'animal';
        break;
      case Texture.EagleAttack:
        this.play(Animation.EagleIdle);
        break;
      default:
        this.play(Animation.FoxIdle);
        break;
    }
  }

  takeDamage() {
    if (this.isDead || !this.isStorming) return;
    this.health = Math.max(0, this.health - HEALTH_HIT_AMOUNT);
    this.scene.sound.play(AudioKey.Hit, { volume: 0.35 });
    if (this.health <= 0) {
      this.die();
    }
  }

  update() {
    if (this.isDead) {
      return;
    }

    this.correctOrientation();

    if (this.canMove && !this.isStorming) {
      this.updateMovement();
    }

    const t = 1 - this.health / MAX_HEALTH;
    if (t > 0) {
      this.setTint(
        Phaser.Display.Color.GetColor(
          255 - Math.floor(80 * t),
          255 - Math.floor(80 * t),
          Math.min(255, 200 + Math.floor(0xff * t)),
        ),
      );
    } else {
      this.clearTint();
    }

    this.drawHealthBar();
  }

  private drawHealthBar() {
    const bx = this.x - BAR_WIDTH / 2;
    const by = this.y + this.barOffsetY;

    this.healthBar.clear();

    if (!this.isStorming || this.health >= MAX_HEALTH) return;

    this.healthBar.fillStyle(0x000000, 0.6);
    this.healthBar.fillRect(bx, by, BAR_WIDTH, BAR_HEIGHT);

    const fill = (this.health / MAX_HEALTH) * BAR_WIDTH;
    const color =
      this.health > 60 ? 0x44dd44 : this.health > 30 ? 0xffaa00 : 0xff2200;
    this.healthBar.fillStyle(color, 1);
    this.healthBar.fillRect(bx, by, fill, BAR_HEIGHT);
  }

  private correctOrientation() {
    const angle = (this.body as MatterJS.BodyType).angle;
    if (Math.abs(angle) > Math.PI / 2) {
      this.setRotation(0);
      this.setAngularVelocity(0);
    }
  }

  private updateMovement() {
    const displacement = this.x - this.startX;

    if (this.facingRight) {
      if (displacement >= PATROL_RANGE) {
        this.facingRight = false;
        this.setFlipX(false);
      } else {
        this.setVelocityX(WALK_SPEED);
      }
    } else {
      if (displacement <= -PATROL_RANGE) {
        this.facingRight = true;
        this.setFlipX(true);
      } else {
        this.setVelocityX(-WALK_SPEED);
      }
    }
  }

  private die() {
    this.isDead = true;
    this.healthBar.clear();
    this.setTexture(Texture.AnimalDeath);
    this.setVelocityX(0);
    this.play(Animation.Death);
    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.setVisible(false);
    });
  }

  destroy(fromScene?: boolean) {
    this.healthBar.destroy();
    super.destroy(fromScene);
  }
}
