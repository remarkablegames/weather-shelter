import Phaser from 'phaser';

import { Scene, Texture } from '../constants';

/**
 * Scene for generating cover art images.
 *
 * Usage:
 * 1. Open the game with `?cover` query param
 * 2. Right-click and save the canvas, or use browser console:
 *    `game.canvas.toDataURL('image/png')` to get a data URL
 */
export class CoverArt extends Phaser.Scene {
  constructor() {
    super({ key: Scene.CoverArt });
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    const aspectRatio = width / height;

    // Adjust layout for square vs wide formats
    const isSquare = aspectRatio < 1.2;
    const titleY = height * (isSquare ? 0.25 : 0.2);
    const subtitleY = height * (isSquare ? 0.22 : 0.3);
    const sceneY = height * (isSquare ? 0.6 : 0.65);

    // Background - same as the game
    this.createBackground(width, height);

    // Dark overlay for mood (like the game's storm overlay at low opacity)
    const moodOverlay = this.add.graphics();
    moodOverlay.fillStyle(0x100820, 0.3);
    moodOverlay.fillRect(0, 0, width, height);

    // Title - larger for square format since it will be used as an icon
    const title = this.add.text(width / 2, titleY, 'WEATHER\nSHELTER', {
      fontFamily: 'sans-serif',
      fontSize: isSquare ? 105 : 72,
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6,
      align: 'center',
    });
    title.setOrigin(0.5);

    // Subtitle - hide for square to keep it clean as icon
    if (!isSquare) {
      const subtitle = this.add.text(
        width / 2,
        subtitleY,
        'Build. Protect. Survive.',
        {
          fontFamily: 'sans-serif',
          fontSize: '28px',
          color: '#cccccc',
        },
      );
      subtitle.setOrigin(0.5);
    }

    // Scene composition - animals with shelter
    this.addSceneComposition(width / 2, sceneY, isSquare);

    // Subtle vignette for focus
    this.addVignette(width, height);

    // Alternative: Auto-export after a delay (uncomment to use)
    // this.time.delayedCall(100, () => {
    //   const dataUrl = this.game.canvas.toDataURL('image/png');
    //   console.log('Cover art data URL:', dataUrl);
    // });
  }

  private createBackground(width: number, height: number) {
    // Same layered backgrounds as the game
    [
      Texture.SwampBg1,
      Texture.SwampBg2,
      Texture.SwampBg3,
      Texture.SwampBg4,
      Texture.SwampBg5,
    ].forEach((tex) => {
      this.add.image(0, 0, tex).setOrigin(0).setDisplaySize(width, height);
    });
  }

  private addSceneComposition(
    centerX: number,
    centerY: number,
    isSquare: boolean,
  ) {
    // Scale down for square format
    const scale = isSquare ? 1.7 : 1;

    // Try to use game sprites if available
    const hasAnimals = this.textures.exists(Texture.FoxIdle1);

    if (hasAnimals) {
      // Add blocks forming a shelter (drawn first so animals appear in front)
      const blockTexture = Texture.Box1;
      if (this.textures.exists(blockTexture)) {
        // Base row
        this.add
          .image(centerX - 70 * scale, centerY + 75 * scale, Texture.Box1)
          .setScale(2.2 * scale);
        this.add
          .image(centerX, centerY + 75 * scale, Texture.Box2)
          .setScale(2.2 * scale);
        this.add
          .image(centerX + 70 * scale, centerY + 75 * scale, Texture.Box3)
          .setScale(2.2 * scale);

        // Second row (offset for shelter structure)
        this.add
          .image(centerX - 50 * scale, centerY + 35 * scale, Texture.Box4)
          .setScale(2 * scale);
        this.add
          .image(centerX + 50 * scale, centerY + 35 * scale, Texture.Box5)
          .setScale(2 * scale);

        // Roof/top
        this.add
          .image(centerX, centerY - 5 * scale, Texture.Box6)
          .setScale(2 * scale);
      }

      // Add animals (positioned to look like they're protected by shelter)
      const animalY = centerY + 65 * scale;

      const animal1 = this.add.image(
        centerX - 90 * scale,
        animalY,
        Texture.FoxIdle1,
      );
      animal1.setScale(3 * scale);

      // Frog sits slightly lower due to spritesheet origin differences
      const animal2 = this.add.image(
        centerX + 90 * scale,
        animalY + 15 * scale,
        Texture.FrogSprite,
      );
      animal2.setScale(3 * scale);
    } else {
      // Fallback shapes if textures not loaded
      this.addFallbackComposition(centerX, centerY);
    }

    // Rain effect - more directional and concentrated
    const rainGraphics = this.add.graphics();
    rainGraphics.lineStyle(2, 0xaabbff, 0.5);

    // Create rain that appears to fall diagonally
    for (let i = 0; i < 60; i++) {
      const x = Phaser.Math.Between(-50, this.scale.width + 50);
      const y = Phaser.Math.Between(0, this.scale.height - 150);
      const length = Phaser.Math.Between(12, 20);
      rainGraphics.lineBetween(x, y, x - 3, y + length);
    }
  }

  private addFallbackComposition(centerX: number, centerY: number) {
    const graphics = this.add.graphics();

    // Animals (colored rectangles as placeholders)
    graphics.fillStyle(0xffaa00);
    graphics.fillRect(centerX - 120, centerY + 40, 40, 40);
    graphics.fillRect(centerX + 80, centerY + 40, 40, 40);

    // Shelter blocks
    graphics.fillStyle(0x8b4513);
    // Walls
    graphics.fillRect(centerX - 80, centerY + 60, 40, 40);
    graphics.fillRect(centerX + 40, centerY + 60, 40, 40);
    // Roof
    graphics.fillRect(centerX - 60, centerY + 20, 120, 30);
  }

  private addVignette(width: number, height: number) {
    // Subtle vignette to focus attention on center
    const vignette = this.add.graphics();
    vignette.fillStyle(0x000000, 0.2);
    vignette.fillRect(0, 0, width, height);

    // Clear out the center
    vignette.fillStyle(0x000000, 0);
    vignette.fillCircle(width / 2, height / 2, Math.min(width, height) * 0.4);
  }
}
