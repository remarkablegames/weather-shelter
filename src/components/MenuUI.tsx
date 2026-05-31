import { Text } from 'phaser-jsx';

import { Button } from './Button';

const FONT = '"Lucida Grande", Helvetica, Arial, sans-serif';

interface MenuUIProps {
  onPlay: (level: number) => void;
}

export function MenuUI({ onPlay }: MenuUIProps) {
  return (
    <>
      <Text
        x={640}
        y={220}
        text="Weather Shelter"
        style={{
          fontFamily: FONT,
          fontSize: 52,
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 6,
        }}
        originX={0.5}
        originY={0.5}
      />

      <Text
        x={640}
        y={295}
        text="Build shelter for the animals before the storm!"
        style={{
          fontFamily: FONT,
          fontSize: 20,
          color: '#ccddff',
          stroke: '#000000',
          strokeThickness: 3,
        }}
        originX={0.5}
        originY={0.5}
      />

      <Button
        x={640}
        y={420}
        text="Play"
        width={200}
        height={54}
        fontSize={28}
        bgColor={0x2255cc}
        bgHoverColor={0x4477ee}
        onClick={() => {
          onPlay(1);
        }}
      />
    </>
  );
}
