import { Texture } from '../constants';

export type BlockType = 'box' | 'stone' | 'plank';

export interface WeatherConfig {
  rainIntervalMs: number;
  windForce: number;
  hasDebris: boolean;
  stormDurationMs: number;
}

export interface LevelConfig {
  level: number;
  timerSeconds: number | null;
  creatureCount: number;
  creatureTypes: Texture[];
  blockTypes: BlockType[];
  blockCount: number;
  weather: WeatherConfig;
}

export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    timerSeconds: null,
    creatureCount: 1,
    creatureTypes: [Texture.FrogIdle],
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
    creatureCount: 2,
    creatureTypes: [Texture.FrogIdle, Texture.OpossumIdle],
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
    creatureCount: 3,
    creatureTypes: [Texture.FrogIdle, Texture.OpossumIdle, Texture.EagleAttack],
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
