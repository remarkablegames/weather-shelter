import Phaser from 'phaser';

import * as scenes from './scenes';

/**
 * https://rexrainbow.github.io/phaser3-rex-notes/docs/site/game/
 */
new Phaser.Game({
  width: 1280,
  height: 720,
  title: 'Weather Shelter',
  url: import.meta.env.VITE_APP_HOMEPAGE,
  version: import.meta.env.VITE_APP_VERSION,
  scene: [
    scenes.Boot,
    ...Object.values(scenes).filter((scene) => scene !== scenes.Boot),
  ],
  physics: {
    default: 'matter',
    matter: {
      gravity: { x: 0, y: 1 },
      // debug: import.meta.env.DEV,
    },
  },
  pixelArt: true,
  disableContextMenu: import.meta.env.PROD,
  backgroundColor: '#2a1a3a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
});
