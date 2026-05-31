import { LevelConfig } from '../types/level';
import { Texture } from './keys';

export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    timerSeconds: null,
    creatures: [{ x: 640, type: Texture.FrogSprite, width: 17, height: 20 }],
    blockTextures: [
      Texture.Box1,
      Texture.Box2,
      Texture.Box3,
      Texture.Stone1,
      Texture.Stone5,
      Texture.Plank1,
      Texture.Plank2,
    ],
    blockCount: 6,
    weather: {
      rainIntervalMs: 100,
      windForce: 0,
      hasDebris: false,
      stormDurationMs: 12000,
    },
  },

  {
    level: 2,
    timerSeconds: 45,
    creatures: [
      { x: 540, type: Texture.FrogSprite, width: 17, height: 20 },
      { x: 740, type: Texture.OpossumIdle, width: 36, height: 28 },
    ],
    blockTextures: [
      Texture.Box1,
      Texture.Box2,
      Texture.Box3,
      Texture.Box4,
      Texture.Stone2,
      Texture.Stone3,
      Texture.Stone5,
      Texture.Plank1,
      Texture.Plank2,
      Texture.Plank3,
    ],
    blockCount: 8,
    weather: {
      rainIntervalMs: 80,
      windForce: 0.003,
      hasDebris: false,
      stormDurationMs: 15000,
    },
  },

  {
    level: 3,
    timerSeconds: 35,
    creatures: [
      { x: 500, type: Texture.FrogSprite, width: 17, height: 20 },
      { x: 640, type: Texture.OpossumIdle, width: 36, height: 28 },
      { x: 780, type: Texture.EagleAttack, width: 40, height: 40 },
    ],
    blockTextures: [
      Texture.Box1,
      Texture.Box2,
      Texture.Box3,
      Texture.Box4,
      Texture.Box5,
      Texture.Box6,
      Texture.Stone1,
      Texture.Stone2,
      Texture.Stone3,
      Texture.Stone4,
      Texture.Stone5,
      Texture.Plank1,
      Texture.Plank2,
      Texture.Plank3,
    ],
    blockCount: 10,
    weather: {
      rainIntervalMs: 60,
      windForce: 0.005,
      hasDebris: true,
      stormDurationMs: 18000,
    },
  },
];
