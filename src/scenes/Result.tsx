import Phaser from 'phaser';
import { render } from 'phaser-jsx';

import { ResultUI } from '../components';
import { LEVELS, Scene, Texture } from '../constants';

interface ResultData {
  survived: number;
  total: number;
  level: number;
}

export class Result extends Phaser.Scene {
  constructor() {
    super({ key: Scene.Result });
  }

  create(data: ResultData) {
    const { width, height } = this.scale;
    const { survived, total, level } = data;

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
    overlay.fillStyle(0x000000, 0.55);
    overlay.fillRect(0, 0, width, height);

    if (survived === total) {
      const best = parseInt(localStorage.getItem('bestLevel') ?? '0', 10);
      if (level > best) {
        localStorage.setItem('bestLevel', String(level));
      }
    }

    const hasNextLevel = survived === total && level < LEVELS.length;

    render(
      <ResultUI
        survived={survived}
        total={total}
        level={level}
        hasNextLevel={hasNextLevel}
        onRetry={() => this.scene.start(Scene.Game, { level })}
        onNext={() => this.scene.start(Scene.Game, { level: level + 1 })}
        onMenu={() => this.scene.start(Scene.Menu)}
      />,
      this,
    );
  }
}
