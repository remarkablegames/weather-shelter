import type Phaser from 'phaser';

/**
 * Fade in a sound from 0 to target volume over a given duration.
 */
export function fadeInSound(
  scene: Phaser.Scene,
  sound: Phaser.Sound.BaseSound,
  targetVolume: number,
  duration: number,
): void {
  const fadeProxy = { volume: 0 };

  scene.tweens.add({
    targets: fadeProxy,
    volume: targetVolume,
    duration,
    onUpdate: () => {
      (sound as Phaser.Sound.WebAudioSound).volume = fadeProxy.volume;
    },
  });
}

/**
 * Fade out a sound over a given duration and stop it when complete.
 */
export function fadeOutSound(
  scene: Phaser.Scene,
  sound: Phaser.Sound.BaseSound | undefined,
  duration: number,
): void {
  if (!sound) return;

  const fadeProxy = {
    volume: (sound as Phaser.Sound.WebAudioSound).volume,
  };

  scene.tweens.add({
    targets: fadeProxy,
    volume: 0,
    duration,
    onUpdate: () => {
      (sound as Phaser.Sound.WebAudioSound).volume = fadeProxy.volume;
    },
    onComplete: () => {
      sound.stop();
    },
  });
}
