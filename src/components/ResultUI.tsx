import { Text, useScene } from 'phaser-jsx';

import { Scene } from '../constants';
import { Button } from './Button';

const FONT = '"Lucida Grande", Helvetica, Arial, sans-serif';

interface ResultUIProps {
  survived: number;
  total: number;
  level: number;
  hasNextLevel: boolean;
}

export function ResultUI({
  survived,
  total,
  level,
  hasNextLevel,
}: ResultUIProps) {
  const scene = useScene();
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
        text={`${String(survived)} / ${String(total)} animals survived`}
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

      <Button
        x={640}
        y={420}
        text="Retry"
        width={180}
        height={50}
        bgColor={0x882222}
        bgHoverColor={0xaa3333}
        fontSize={26}
        onClick={() => scene.scene.start(Scene.Game, { level })}
      />

      {hasNextLevel && (
        <Button
          x={640}
          y={490}
          text="Next Level"
          width={180}
          height={50}
          bgColor={0x225522}
          bgHoverColor={0x336633}
          fontSize={26}
          onClick={() => scene.scene.start(Scene.Game, { level: level + 1 })}
        />
      )}

      <Button
        x={640}
        y={hasNextLevel ? 555 : 490}
        text="Main Menu"
        width={180}
        height={50}
        bgColor={0x334466}
        bgHoverColor={0x4455aa}
        fontSize={20}
        onClick={() => scene.scene.start(Scene.Menu)}
      />
    </>
  );
}
