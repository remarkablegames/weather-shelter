import Phaser from 'phaser';

import clickAudio from '/sounds/click.mp3';
import dragAudio from '/sounds/drag.mp3';
import dropAudio from '/sounds/drop.mp3';
import hitAudio from '/sounds/hit.mp3';
import hoverAudio from '/sounds/hover.mp3';
import rainAudio from '/sounds/rain.mp3';
import thunderAudio from '/sounds/thunder.mp3';
import twilightAudio from '/sounds/twilight.mp3';
import eagleAttack from '/sprites/sunnyland/characters/eagle/spritesheets/eagle-attack.png';
import foxIdle1 from '/sprites/sunnyland/characters/fox/sprites/idle/player-idle-1.png';
import foxIdle2 from '/sprites/sunnyland/characters/fox/sprites/idle/player-idle-2.png';
import foxIdle3 from '/sprites/sunnyland/characters/fox/sprites/idle/player-idle-3.png';
import foxIdle4 from '/sprites/sunnyland/characters/fox/sprites/idle/player-idle-4.png';
import frogIdle from '/sprites/sunnyland/characters/frog/spritesheets/frog-idle.png';
import opossum from '/sprites/sunnyland/characters/opossum/spritesheet.png';
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
import fence1 from '/sprites/swamp/objects/fence/1.png';
import fence2 from '/sprites/swamp/objects/fence/2.png';
import fence3 from '/sprites/swamp/objects/fence/3.png';
import ridge1 from '/sprites/swamp/objects/ridges/1.png';
import ridge2 from '/sprites/swamp/objects/ridges/2.png';
import ridge3 from '/sprites/swamp/objects/ridges/3.png';
import ridge4 from '/sprites/swamp/objects/ridges/4.png';
import ridge5 from '/sprites/swamp/objects/ridges/5.png';
import ridge6 from '/sprites/swamp/objects/ridges/6.png';
import stone1 from '/sprites/swamp/objects/stones/1.png';
import stone2 from '/sprites/swamp/objects/stones/2.png';
import stone3 from '/sprites/swamp/objects/stones/3.png';
import stone4 from '/sprites/swamp/objects/stones/4.png';
import stone5 from '/sprites/swamp/objects/stones/5.png';

import { AudioKey, LEVELS, Scene, Texture } from '../constants';

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

    this.load.image(Texture.Fence1, fence1);
    this.load.image(Texture.Fence2, fence2);
    this.load.image(Texture.Fence3, fence3);

    this.load.image(Texture.Ridge1, ridge1);
    this.load.image(Texture.Ridge2, ridge2);
    this.load.image(Texture.Ridge3, ridge3);
    this.load.image(Texture.Ridge4, ridge4);
    this.load.image(Texture.Ridge5, ridge5);
    this.load.image(Texture.Ridge6, ridge6);

    this.load.spritesheet(Texture.FrogSprite, frogIdle, {
      frameWidth: 35,
      frameHeight: 21,
    });
    this.load.spritesheet(Texture.Opossum, opossum, {
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

    this.load.spritesheet(Texture.AnimalDeath, enemyDeath, {
      frameWidth: 40,
      frameHeight: 41,
    });

    this.load.audio(AudioKey.Twilight, twilightAudio);
    this.load.audio(AudioKey.Thunder, thunderAudio);
    this.load.audio(AudioKey.Rain, rainAudio);
    this.load.audio(AudioKey.Click, clickAudio);
    this.load.audio(AudioKey.Drag, dragAudio);
    this.load.audio(AudioKey.Drop, dropAudio);
    this.load.audio(AudioKey.Hit, hitAudio);
    this.load.audio(AudioKey.Hover, hoverAudio);
  }

  create() {
    const params = new URLSearchParams(window.location.search);

    // Check for cover art mode
    if (params.has('cover')) {
      this.scene.start(Scene.CoverArt);
      return;
    }

    const levelParam = Number(params.get('level'));
    const isValidLevel =
      Number.isInteger(levelParam) &&
      levelParam >= 1 &&
      levelParam <= LEVELS.length;

    if (isValidLevel) {
      this.scene.start(Scene.Game, { level: levelParam });
    } else {
      this.scene.start(Scene.Menu);
    }
  }
}
