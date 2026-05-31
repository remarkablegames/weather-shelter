import { LevelConfig } from '../types/level';
import { Texture } from './keys';

export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    timerSeconds: null,
    animals: [{ x: 640, type: Texture.FrogSprite, width: 17, height: 20 }],
    blocks: [
      Texture.Box1,
      Texture.Box2,
      Texture.Box3,
      Texture.Box4,
      Texture.Box5,
    ],
    weather: {
      rainIntervalMs: 100,
      windForce: 0,
      hasDebris: false,
      stormDurationMs: 12000,
    },
    hint: 'Drag boxes to protect the frog from the rain!',
  },

  {
    level: 2,
    timerSeconds: 45,
    animals: [
      { x: 420, type: Texture.FrogSprite, width: 17, height: 20 },
      { x: 860, type: Texture.FrogSprite, width: 17, height: 20 },
    ],
    blocks: [
      Texture.Box1,
      Texture.Box2,
      Texture.Box3,
      Texture.Box4,
      Texture.Box4,
      Texture.Box5,
      Texture.Box5,
      Texture.Box6,
      Texture.Box6,
    ],
    weather: {
      rainIntervalMs: 75,
      windForce: 0.003,
      hasDebris: false,
      stormDurationMs: 12000,
    },
    hint: 'Wind is picking up! Build sturdy shelters.',
  },

  {
    level: 3,
    timerSeconds: 35,
    animals: [
      { x: 420, type: Texture.FrogSprite, width: 17, height: 20 },
      { x: 640, type: Texture.FrogSprite, width: 17, height: 20 },
      { x: 860, type: Texture.FrogSprite, width: 17, height: 20 },
    ],
    blocks: [
      Texture.Box1,
      Texture.Box2,
      Texture.Box3,
      Texture.Box4,
      Texture.Box4,
      Texture.Box5,
      Texture.Box5,
      Texture.Box6,
      Texture.Box6,
      Texture.Stone3,
      Texture.Stone4,
      Texture.Stone5,
    ],
    weather: {
      rainIntervalMs: 50,
      windForce: 0.005,
      hasDebris: true,
      stormDurationMs: 12000,
    },
    hint: 'Watch out for flying debris! Use heavy stones.',
  },

  {
    level: 4,
    timerSeconds: 30,
    animals: [
      { x: 420, type: Texture.FrogSprite, width: 17, height: 20 },
      { x: 860, type: Texture.Opossum, width: 32, height: 24 },
    ],
    blocks: [
      Texture.Box3,
      Texture.Box4,
      Texture.Box5,
      Texture.Box6,
      Texture.Stone3,
      Texture.Stone4,
      Texture.Stone5,
      Texture.Fence1,
      Texture.Fence2,
      Texture.Fence3,
    ],
    weather: {
      rainIntervalMs: 35,
      windForce: 0.008,
      hasDebris: true,
      stormDurationMs: 12000,
    },
    hint: 'Two species to protect! Planks make great roofs.',
  },

  {
    level: 5,
    timerSeconds: 25,
    animals: [
      { x: 420, type: Texture.Opossum, width: 32, height: 24 },
      { x: 860, type: Texture.Opossum, width: 32, height: 24 },
    ],
    blocks: [
      Texture.Box4,
      Texture.Box5,
      Texture.Box6,
      Texture.Stone1,
      Texture.Stone2,
      Texture.Stone3,
      Texture.Stone4,
      Texture.Stone5,
      Texture.Fence1,
      Texture.Fence2,
      Texture.Fence3,
    ],
    weather: {
      rainIntervalMs: 30,
      windForce: 0.012,
      hasDebris: true,
      stormDurationMs: 12000,
    },
    hint: 'Both animals are on the move. Shelter them!',
  },
];
