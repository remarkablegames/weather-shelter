import Phaser from 'phaser';

import { Texture } from '../constants';

export class RainDrop extends Phaser.Physics.Matter.Image {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene.matter.world, x, y, Texture.Stone5, undefined, {
      isSensor: true,
      label: 'raindrop',
      restitution: 0,
      friction: 0,
      density: 0.0001,
      ignoreGravity: true,
    });

    scene.add.existing(this);
    this.setScale(0.15);
    this.setDepth(8);
    this.setTint(0x88ccff);
    this.setAlpha(0.7);

    const angle = Phaser.Math.DegToRad(70);
    const speed = 600;
    this.setVelocity(
      Math.cos(angle) * speed * 0.06,
      Math.sin(angle) * speed * 0.06,
    );
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
