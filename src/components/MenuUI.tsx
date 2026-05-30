import { Rectangle, Text } from 'phaser-jsx';

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
        text="Build shelter for the creatures before the storm!"
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
      <Rectangle
        x={640}
        y={420}
        width={200}
        height={54}
        fillColor={0x2255cc}
        originX={0.5}
        originY={0.5}
        onPointerDown={() => {
          onPlay(1);
        }}
      />
      <Text
        x={640}
        y={420}
        text="Play"
        style={{
          fontFamily: FONT,
          fontSize: 28,
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 4,
        }}
        originX={0.5}
        originY={0.5}
        onPointerDown={() => {
          onPlay(1);
        }}
      />
    </>
  );
}
