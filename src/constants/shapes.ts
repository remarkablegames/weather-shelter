export interface VertexPoint {
  x: number;
  y: number;
}

/**
 * Custom Matter.js body vertex arrays per block sprite, relative to sprite centre.
 * Boxes use null (default rectangle body). Stones/planks use polygon approximations
 * traced from the sprite silhouettes.
 *
 * Sprite sizes (px):
 *   Box1:  34×28  Box2:  34×27  Box3: 27×26
 *   Box4:  33×26  Box5:  34×27  Box6: 27×26
 *   Stone1: 63×59 Stone2: 47×57 Stone3: 52×63
 *   Stone4: 57×30 Stone5: 31×31
 *   Plank1: 23×18 Plank2: 25×20 Plank3: 16×13
 */
export const BLOCK_SHAPES: Record<string, VertexPoint[] | null> = {
  Box1: null,
  Box2: null,
  Box3: null,
  Box4: null,
  Box5: null,
  Box6: null,

  // Stone1 (63×59): wide irregular boulder, wider at base, peaked top-left
  Stone1: [
    { x: 62.0, y: 59.5 },
    { x: 0.5, y: 59.0 },
    { x: 1.5, y: 49.0 },
    { x: 11.5, y: 23.0 },
    { x: 13.0, y: 21.5 },
    { x: 18.0, y: 22.5 },
    { x: 20.5, y: 20.0 },
    { x: 24.5, y: 8.0 },
    { x: 30.0, y: 2.5 },
    { x: 35.0, y: 0.5 },
    { x: 44.0, y: 0.5 },
    { x: 54.5, y: 10.0 },
    { x: 57.5, y: 25.0 },
    { x: 57.5, y: 40.0 },
    { x: 63.5, y: 46.0 },
  ],

  // Stone2 (47×57): tall tombstone — narrow top, slightly wider base
  Stone2: [
    { x: -16, y: -28 },
    { x: 16, y: -28 },
    { x: 22, y: -10 },
    { x: 22, y: 28 },
    { x: -22, y: 28 },
    { x: -22, y: -10 },
  ],

  // Stone3 (52×63): tall leaning slab — parallelogram skewed right
  Stone3: [
    { x: -8, y: -31 },
    { x: 20, y: -31 },
    { x: 8, y: 31 },
    { x: -20, y: 31 },
  ],

  // Stone4 (57×30): wide flat boulder, low profile
  Stone4: [
    { x: -26, y: -6 },
    { x: -8, y: -14 },
    { x: 14, y: -12 },
    { x: 28, y: -4 },
    { x: 24, y: 14 },
    { x: -26, y: 14 },
  ],

  // Stone5 (31×31): small round stone — octagon approximation
  Stone5: [
    { x: -8, y: -15 },
    { x: 8, y: -15 },
    { x: 15, y: -4 },
    { x: 15, y: 8 },
    { x: 6, y: 15 },
    { x: -6, y: 15 },
    { x: -15, y: 8 },
    { x: -15, y: -4 },
  ],

  // Plank1 (23×18): diagonal fence piece, thin rectangle at ~30° angle
  Plank1: [
    { x: -11, y: -4 },
    { x: 11, y: -9 },
    { x: 11, y: 4 },
    { x: -11, y: 9 },
  ],

  // Plank2 (25×20): diagonal fence piece, similar angle
  Plank2: [
    { x: -12, y: -4 },
    { x: 12, y: -10 },
    { x: 12, y: 4 },
    { x: -12, y: 10 },
  ],

  // Plank3 (16×13): short diagonal plank
  Plank3: [
    { x: -8, y: -3 },
    { x: 8, y: -6 },
    { x: 8, y: 3 },
    { x: -8, y: 6 },
  ],
};
