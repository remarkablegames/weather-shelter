import { Texture } from '../constants';

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
  blocks: Texture[];
  weather: WeatherConfig;
}
