import Phaser from 'phaser';

import { BLOCK_SHAPES, Texture } from '../constants';
import type { BlockShape } from '../constants/shapes';

const DRAG_SCALE = 1.08;

export class Block extends Phaser.Physics.Matter.Image {
  isDragging = false;

  private baseScale: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: Texture,
    scale = 2,
  ) {
    const shape: BlockShape | null = BLOCK_SHAPES[texture] ?? null;
    const verts = shape?.verts ?? null;
    const offset = shape?.offset;

    const bodyOptions: Phaser.Types.Physics.Matter.MatterBodyConfig = {
      restitution: 0.1,
      friction: 0.8,
      frictionStatic: 1,
      density: texture.startsWith('Stone') ? 0.008 : 0.003,
    };

    if (verts) {
      bodyOptions.vertices = verts;
    }

    super(scene.matter.world, x, y, texture, undefined, bodyOptions);

    this.baseScale = scale;
    scene.add.existing(this);
    this.setScale(scale);
    this.setDepth(7);

    if (offset) {
      const w = this.width || 1;
      const h = this.height || 1;
      this.setOrigin(0.5 - offset.x / w, 0.5 - offset.y / h);
    }

    this.setInteractive({ cursor: 'grab' });

    this.on(Phaser.Input.Events.POINTER_OVER, this.onPointerOver);
    this.on(Phaser.Input.Events.POINTER_OUT, this.onPointerOut);
    this.on(Phaser.Input.Events.POINTER_DOWN, this.onPointerDown);
  }

  private onPointerOver = () => {
    if (this.isDragging) return;
    this.setTint(0xddeeff);
    this.scene.input.setDefaultCursor('grab');
  };

  private onPointerOut = () => {
    if (this.isDragging) return;
    this.clearTint();
    this.scene.input.setDefaultCursor('default');
  };

  private onPointerDown = (pointer: Phaser.Input.Pointer) => {
    if (this.isDragging) return;
    this.startDrag(pointer);
  };

  startDrag(pointer: Phaser.Input.Pointer) {
    this.isDragging = true;
    this.setTint(0xffffff);
    this.setScale(this.baseScale * DRAG_SCALE);
    this.scene.input.setDefaultCursor('grabbing');
    this.setDepth(12);
    this.setStatic(true);

    this.scene.input.on(Phaser.Input.Events.POINTER_MOVE, this.onPointerMove);
    this.scene.input.on(Phaser.Input.Events.POINTER_UP, this.endDrag);
    this.setPosition(pointer.x, pointer.y);
  }

  private onPointerMove = (pointer: Phaser.Input.Pointer) => {
    if (!this.isDragging) return;
    this.scene.matter.body.setPosition(
      this.body as MatterJS.BodyType,
      { x: pointer.x, y: pointer.y },
      false,
    );
  };

  endDrag = () => {
    if (!this.isDragging) return;
    this.isDragging = false;

    this.setStatic(false);
    this.clearTint();
    this.setScale(this.baseScale);
    this.setDepth(7);
    this.scene.input.setDefaultCursor('default');
    this.scene.input.off(Phaser.Input.Events.POINTER_MOVE, this.onPointerMove);
    this.scene.input.off(Phaser.Input.Events.POINTER_UP, this.endDrag);
  };

  disableDrag() {
    this.endDrag();
    this.removeInteractive();
    this.scene.input.setDefaultCursor('default');
  }

  destroy(fromScene?: boolean) {
    super.destroy(fromScene);
  }
}
