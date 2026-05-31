import Phaser from 'phaser';

import { Texture } from '../constants';

const RAINDROP_KEY = 'rainDropSprite';

export function ensureRainDropTexture(scene: Phaser.Scene) {
  if (scene.textures.exists(RAINDROP_KEY)) return;
  const g = scene.add.graphics();
  g.fillStyle(0xaaddff, 1);
  g.fillRect(0, 0, 2, 10);
  g.generateTexture(RAINDROP_KEY, 2, 10);
  g.destroy();
}

export class RainDrop extends Phaser.Physics.Matter.Image {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene.matter.world, x, y, RAINDROP_KEY, undefined, {
      isSensor: true,
      label: 'raindrop',
      restitution: 0,
      friction: 0,
      ignoreGravity: true,
    });

    scene.add.existing(this);
    this.setDepth(16);
    this.setAlpha(0.8);
    this.setAngle(10);

    this.setVelocity(8, 55);
  }
}

export class Debris extends Phaser.Physics.Matter.Image {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    const stoneTextures = [
      Texture.Stone1,
      Texture.Stone2,
      Texture.Stone3,
      Texture.Stone4,
    ];
    const tex = stoneTextures[Math.floor(Math.random() * stoneTextures.length)];

    super(scene.matter.world, x, y, tex, undefined, {
      restitution: 0.3,
      friction: 0.5,
      density: 0.02,
      label: 'debris',
    });

    scene.add.existing(this);
    this.setScale(2.5);
    this.setDepth(7);
    this.setAngularVelocity(Phaser.Math.FloatBetween(-0.05, 0.05));
    this.setVelocity(
      Phaser.Math.FloatBetween(-1, 1),
      Phaser.Math.FloatBetween(3, 6),
    );
  }
}
