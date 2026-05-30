import { Rectangle, Text } from 'phaser-jsx';

const FONT = '"Lucida Grande", Helvetica, Arial, sans-serif';

interface ResultUIProps {
  survived: number;
  total: number;
  level: number;
  hasNextLevel: boolean;
  onRetry: () => void;
  onNext: () => void;
  onMenu: () => void;
}

export function ResultUI({
  survived,
  total,
  level,
  hasNextLevel,
  onRetry,
  onNext,
  onMenu,
}: ResultUIProps) {
  const passed = survived === total;
  const title = passed ? 'All Safe!' : 'Storm Damage!';
  const titleColor = passed ? '#88ff88' : '#ff6644';

  return (
    <>
      <Text
        x={640}
        y={200}
        text={title}
        style={{
          fontFamily: FONT,
          fontSize: 56,
          color: titleColor,
          stroke: '#000000',
          strokeThickness: 7,
        }}
        originX={0.5}
        originY={0.5}
      />
      <Text
        x={640}
        y={285}
        text={`${String(survived)} / ${String(total)} creatures survived`}
        style={{
          fontFamily: FONT,
          fontSize: 28,
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 4,
        }}
        originX={0.5}
        originY={0.5}
      />
      <Text
        x={640}
        y={330}
        text={`Level ${String(level)}`}
        style={{
          fontFamily: FONT,
          fontSize: 20,
          color: '#aaaaaa',
          stroke: '#000000',
          strokeThickness: 3,
        }}
        originX={0.5}
        originY={0.5}
      />

      <Rectangle
        x={640}
        y={420}
        width={180}
        height={50}
        fillColor={0x882222}
        originX={0.5}
        originY={0.5}
        onPointerDown={onRetry}
      />
      <Text
        x={640}
        y={420}
        text="Retry"
        style={{
          fontFamily: FONT,
          fontSize: 26,
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 4,
        }}
        originX={0.5}
        originY={0.5}
        onPointerDown={onRetry}
      />

      {hasNextLevel && (
        <>
          <Rectangle
            x={640}
            y={490}
            width={180}
            height={50}
            fillColor={0x225522}
            originX={0.5}
            originY={0.5}
            onPointerDown={onNext}
          />
          <Text
            x={640}
            y={490}
            text="Next Level"
            style={{
              fontFamily: FONT,
              fontSize: 26,
              color: '#ffffff',
              stroke: '#000000',
              strokeThickness: 4,
            }}
            originX={0.5}
            originY={0.5}
            onPointerDown={onNext}
          />
        </>
      )}

      <Text
        x={640}
        y={hasNextLevel ? 555 : 490}
        text="Main Menu"
        style={{
          fontFamily: FONT,
          fontSize: 20,
          color: '#aaccff',
          stroke: '#000000',
          strokeThickness: 3,
        }}
        originX={0.5}
        originY={0.5}
        onPointerDown={onMenu}
      />
    </>
  );
}
