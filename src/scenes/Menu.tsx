import Phaser from 'phaser';
import { render } from 'phaser-jsx';

import { MenuUI } from '../components';
import { Scene, Texture } from '../constants';

export class Menu extends Phaser.Scene {
  constructor() {
    super({ key: Scene.Menu });
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .image(0, 0, Texture.SwampBg1)
      .setOrigin(0)
      .setDisplaySize(width, height);
    this.add
      .image(0, 0, Texture.SwampBg2)
      .setOrigin(0)
      .setDisplaySize(width, height);
    this.add
      .image(0, 0, Texture.SwampBg3)
      .setOrigin(0)
      .setDisplaySize(width, height);
    this.add
      .image(0, 0, Texture.SwampBg4)
      .setOrigin(0)
      .setDisplaySize(width, height);
    this.add
      .image(0, 0, Texture.SwampBg5)
      .setOrigin(0)
      .setDisplaySize(width, height);

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.45);
    overlay.fillRect(0, 0, width, height);

    render(
      <MenuUI
        onPlay={(level: number) => {
          this.scene.start(Scene.Game, { level });
        }}
      />,
      this,
    );
  }
}
