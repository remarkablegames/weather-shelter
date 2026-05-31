import { Texture } from '../constants';

export interface WeatherConfig {
  rainIntervalMs: number;
  windForce: number;
  hasDebris: boolean;
  stormDurationMs: number;
}

export interface AnimalConfig {
  x: number;
  type: Texture;
  width: number;
  height: number;
}

export interface LevelConfig {
  level: number;
  timerSeconds: number | null;
  animals: AnimalConfig[];
  blocks: Texture[];
  weather: WeatherConfig;
  hint?: string;
}
