import Phaser from 'phaser';

import eagleAttack from '/sprites/sunnyland/characters/eagle/spritesheets/eagle-attack.png';
import foxIdle1 from '/sprites/sunnyland/characters/fox/sprites/idle/player-idle-1.png';
import foxIdle2 from '/sprites/sunnyland/characters/fox/sprites/idle/player-idle-2.png';
import foxIdle3 from '/sprites/sunnyland/characters/fox/sprites/idle/player-idle-3.png';
import foxIdle4 from '/sprites/sunnyland/characters/fox/sprites/idle/player-idle-4.png';
import frogIdle from '/sprites/sunnyland/characters/frog/spritesheets/frog-idle.png';
import opossumIdle from '/sprites/sunnyland/characters/opossum/spritesheet.png';
import enemyDeath from '/sprites/sunnyland/misc/fx/spritesheets/enemy-death.png';
import swampBg1 from '/sprites/swamp/background/layers/1.png';
import swampBg2 from '/sprites/swamp/background/layers/2.png';
import swampBg3 from '/sprites/swamp/background/layers/3.png';
import swampBg4 from '/sprites/swamp/background/layers/4.png';
import swampBg5 from '/sprites/swamp/background/layers/5.png';
import box1 from '/sprites/swamp/objects/boxes/1.png';
import box2 from '/sprites/swamp/objects/boxes/2.png';
import box3 from '/sprites/swamp/objects/boxes/3.png';
import box4 from '/sprites/swamp/objects/boxes/4.png';
import box5 from '/sprites/swamp/objects/boxes/5.png';
import box6 from '/sprites/swamp/objects/boxes/6.png';
import plank1 from '/sprites/swamp/objects/fence/1.png';
import plank2 from '/sprites/swamp/objects/fence/2.png';
import plank3 from '/sprites/swamp/objects/fence/3.png';
import stone1 from '/sprites/swamp/objects/stones/1.png';
import stone2 from '/sprites/swamp/objects/stones/2.png';
import stone3 from '/sprites/swamp/objects/stones/3.png';
import stone4 from '/sprites/swamp/objects/stones/4.png';
import stone5 from '/sprites/swamp/objects/stones/5.png';

import { Scene, Texture } from '../constants';

export class Boot extends Phaser.Scene {
  constructor() {
    super({ key: Scene.Boot });
  }

  preload() {
    this.load.image(Texture.SwampBg1, swampBg1);
    this.load.image(Texture.SwampBg2, swampBg2);
    this.load.image(Texture.SwampBg3, swampBg3);
    this.load.image(Texture.SwampBg4, swampBg4);
    this.load.image(Texture.SwampBg5, swampBg5);

    this.load.image(Texture.Box1, box1);
    this.load.image(Texture.Box2, box2);
    this.load.image(Texture.Box3, box3);
    this.load.image(Texture.Box4, box4);
    this.load.image(Texture.Box5, box5);
    this.load.image(Texture.Box6, box6);

    this.load.image(Texture.Stone1, stone1);
    this.load.image(Texture.Stone2, stone2);
    this.load.image(Texture.Stone3, stone3);
    this.load.image(Texture.Stone4, stone4);
    this.load.image(Texture.Stone5, stone5);

    this.load.image(Texture.Plank1, plank1);
    this.load.image(Texture.Plank2, plank2);
    this.load.image(Texture.Plank3, plank3);

    this.load.spritesheet(Texture.FrogIdle, frogIdle, {
      frameWidth: 35,
      frameHeight: 32,
    });
    this.load.spritesheet(Texture.OpossumIdle, opossumIdle, {
      frameWidth: 36,
      frameHeight: 28,
    });
    this.load.spritesheet(Texture.EagleAttack, eagleAttack, {
      frameWidth: 40,
      frameHeight: 41,
    });

    this.load.image(Texture.FoxIdle1, foxIdle1);
    this.load.image(Texture.FoxIdle2, foxIdle2);
    this.load.image(Texture.FoxIdle3, foxIdle3);
    this.load.image(Texture.FoxIdle4, foxIdle4);

    this.load.spritesheet(Texture.EnemyDeath, enemyDeath, {
      frameWidth: 40,
      frameHeight: 41,
    });
  }

  create() {
    this.scene.start(Scene.Menu);
  }
}
