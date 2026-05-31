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
