import Phaser from 'phaser';

import { BLOCK_SHAPES, Texture } from '../constants';
import { BlockType } from '../types/level';

const OUTLINE_COLOR_IDLE = 0xffdd00;
const OUTLINE_COLOR_DRAG = 0xffffff;
const OUTLINE_ALPHA = 0.9;
const DRAG_SCALE = 1.08;

const BOX_TEXTURES: Texture[] = [
  Texture.Box1,
  Texture.Box2,
  Texture.Box3,
  Texture.Box4,
  Texture.Box5,
  Texture.Box6,
];
const STONE_TEXTURES: Texture[] = [
  Texture.Stone1,
  Texture.Stone2,
  Texture.Stone3,
  Texture.Stone4,
  Texture.Stone5,
];
const PLANK_TEXTURES: Texture[] = [
  Texture.Plank1,
  Texture.Plank2,
  Texture.Plank3,
];

export function randomBlockTexture(type: BlockType): Texture {
  switch (type) {
    case 'box':
      return BOX_TEXTURES[Math.floor(Math.random() * BOX_TEXTURES.length)];
    case 'stone':
      return STONE_TEXTURES[Math.floor(Math.random() * STONE_TEXTURES.length)];
    case 'plank':
      return PLANK_TEXTURES[Math.floor(Math.random() * PLANK_TEXTURES.length)];
  }
}

export class Block extends Phaser.Physics.Matter.Image {
  isDragging = false;

  private outline!: Phaser.GameObjects.Graphics;
  private baseScale: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: Texture,
    scale = 2,
  ) {
    const verts = BLOCK_SHAPES[texture] ?? null;
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

    this.outline = scene.add.graphics();
    this.outline.setDepth(8);

    this.setInteractive({ cursor: 'grab' });
    this.drawOutline(OUTLINE_COLOR_IDLE);

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
    this.drawOutline(OUTLINE_COLOR_DRAG);
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
    this.drawOutline(OUTLINE_COLOR_IDLE);

    this.scene.input.off(Phaser.Input.Events.POINTER_MOVE, this.onPointerMove);
    this.scene.input.off(Phaser.Input.Events.POINTER_UP, this.endDrag);
  };

  disableDrag() {
    this.endDrag();
    this.removeInteractive();
    this.outline.clear();
    this.scene.input.setDefaultCursor('default');
  }

  private drawOutline(color: number) {
    this.outline.clear();
    const w = this.displayWidth + 4;
    const h = this.displayHeight + 4;
    this.outline.lineStyle(2, color, OUTLINE_ALPHA);
    this.outline.strokeRect(this.x - w / 2, this.y - h / 2, w, h);
  }

  update() {
    if (this.outline.visible) {
      this.drawOutline(
        this.isDragging ? OUTLINE_COLOR_DRAG : OUTLINE_COLOR_IDLE,
      );
    }
  }

  destroy(fromScene?: boolean) {
    this.outline.destroy();
    super.destroy(fromScene);
  }
}
