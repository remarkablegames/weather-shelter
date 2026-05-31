import { Texture } from '../constants';

export type BlockType = 'box' | 'stone' | 'plank';

export interface WeatherConfig {
  rainIntervalMs: number;
  windForce: number;
  hasDebris: boolean;
  stormDurationMs: number;
}

export interface CreatureConfig {
  x: number;
  type: Texture;
  width: number;
  height: number;
}

export interface LevelConfig {
  level: number;
  timerSeconds: number | null;
  creatures: CreatureConfig[];
  blockTypes: BlockType[];
  blockCount: number;
  weather: WeatherConfig;
}

export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    timerSeconds: null,
    creatures: [{ x: 640, type: Texture.FrogSprite, width: 17, height: 20 }],
    blockTypes: ['box', 'stone', 'plank'],
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
    blockTypes: ['box', 'stone', 'plank'],
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
    blockTypes: ['box', 'stone', 'plank'],
    blockCount: 10,
    weather: {
      rainIntervalMs: 60,
      windForce: 0.005,
      hasDebris: true,
      stormDurationMs: 18000,
    },
  },
];
