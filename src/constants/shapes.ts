export interface VertexPoint {
  x: number;
  y: number;
}

export interface BlockShape {
  verts: VertexPoint[];
  offset?: { x: number; y: number };
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
export const BLOCK_SHAPES: Record<string, BlockShape | VertexPoint[] | null> = {
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
    { x: 0, y: 56 },
    { x: 0, y: 51 },
    { x: 7, y: 11 },
    { x: 8, y: 8 },
    { x: 10, y: 4 },
    { x: 12, y: 2 },
    { x: 16, y: 0 },
    { x: 30, y: 0 },
    { x: 34, y: 2 },
    { x: 36, y: 4 },
    { x: 38, y: 8 },
    { x: 39, y: 11 },
    { x: 46, y: 51 },
    { x: 46, y: 56 },
  ],

  // Stone3 (52×63): tall leaning slab — parallelogram skewed right
  Stone3: [
    { x: 50, y: 62 },
    { x: 1, y: 62 },
    { x: 0, y: 61 },
    { x: 0, y: 55 },
    { x: 1, y: 50 },
    { x: 12, y: 14 },
    { x: 14, y: 8 },
    { x: 16, y: 5 },
    { x: 17, y: 4 },
    { x: 19, y: 3 },
    { x: 34, y: 0 },
    { x: 43, y: 0 },
    { x: 45, y: 2 },
    { x: 46, y: 4 },
    { x: 49, y: 15 },
    { x: 51, y: 46 },
    { x: 51, y: 61 },
  ],

  // Stone4 (57×30): wide flat boulder, low profile
  Stone4: [
    { x: 0, y: 26 },
    { x: 0, y: 20 },
    { x: 1, y: 15 },
    { x: 2, y: 11 },
    { x: 5, y: 5 },
    { x: 7, y: 3 },
    { x: 9, y: 2 },
    { x: 15, y: 0 },
    { x: 21, y: 0 },
    { x: 23, y: 1 },
    { x: 36, y: 9 },
    { x: 51, y: 22 },
    { x: 54, y: 25 },
    { x: 56, y: 28 },
    { x: 56, y: 29 },
    { x: 2, y: 29 },
    { x: 1, y: 28 },
  ],

  // Stone5 (31×31): small round stone — octagon approximation
  Stone5: [
    { x: 30, y: 28 },
    { x: 30, y: 30 },
    { x: 0, y: 30 },
    { x: 0, y: 29 },
    { x: 1, y: 24 },
    { x: 2, y: 20 },
    { x: 8, y: 5 },
    { x: 9, y: 3 },
    { x: 10, y: 2 },
    { x: 12, y: 1 },
    { x: 15, y: 0 },
    { x: 21, y: 0 },
    { x: 23, y: 1 },
    { x: 27, y: 5 },
    { x: 28, y: 7 },
    { x: 29, y: 16 },
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

  // Ridge1 (89×26): wide flat log, slightly angled left-to-right
  Ridge1: [
    { x: -32, y: -12 },
    { x: -10, y: -12 },
    { x: 44, y: 8 },
    { x: 44, y: 12 },
    { x: -44, y: 12 },
    { x: -44, y: 0 },
  ],

  // Ridge2 (40×28): twin-peaked rock with valley in centre
  Ridge2: [
    { x: -4, y: -8 },
    { x: 4, y: -4 },
    { x: 4, y: -6 },
    { x: 10, y: -14 },
    { x: 18, y: -4 },
    { x: 20, y: 14 },
    { x: -18, y: 14 },
    { x: -18, y: 0 },
  ],

  // Ridge3 (109×41): two crossed logs forming a tent/triangle
  Ridge3: [
    { x: -54, y: 18 },
    { x: -54, y: 8 },
    { x: 0, y: -18 },
    { x: 54, y: 8 },
    { x: 54, y: 18 },
  ],

  // Ridge4 (65×61): tree stump — rook profile, wide crown, narrow waist, wide base
  Ridge4: [
    { x: -18, y: -30 },
    { x: 30, y: -30 },
    { x: 30, y: -8 },
    { x: 16, y: -2 },
    { x: 16, y: 10 },
    { x: 28, y: 16 },
    { x: 28, y: 28 },
    { x: -28, y: 28 },
    { x: -10, y: 16 },
    { x: -10, y: 10 },
    { x: -10, y: -2 },
    { x: -18, y: -8 },
  ],

  // Ridge5 (81×29): wide log sloping upward left-to-right
  Ridge5: [
    { x: -40, y: 4 },
    { x: -10, y: -14 },
    { x: 10, y: -6 },
    { x: 40, y: -14 },
    { x: 40, y: 14 },
    { x: -40, y: 14 },
  ],

  // Ridge6 (47×55): tall main stump with smaller right stump
  Ridge6: {
    verts: [
      { x: -8, y: -26 },
      { x: 8, y: -26 },
      { x: 14, y: -10 },
      { x: 14, y: 4 },
      { x: 22, y: 4 },
      { x: 22, y: 27 },
      { x: -14, y: 27 },
      { x: -14, y: -10 },
    ],
    offset: { x: 2, y: -2 },
  },
};
