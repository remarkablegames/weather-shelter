import { Text, useState } from 'phaser-jsx';
import type { Dispatch, SetStateAction } from 'react';

const FONT = '"Lucida Grande", Helvetica, Arial, sans-serif';

export type SetTimer = Dispatch<SetStateAction<number>>;
export type SetSurvivors = Dispatch<SetStateAction<string>>;

interface HUDProps {
  onReady: (setTimer: SetTimer, setSurvivors: SetSurvivors) => void;
}

export function HUD({ onReady }: HUDProps) {
  const [timer, setTimer] = useState(-1);
  const [survivors, setSurvivors] = useState('');

  onReady(setTimer, setSurvivors);

  return (
    <>
      {timer >= 0 && (
        <Text
          x={640}
          y={20}
          text={`⏱ ${String(timer)}s`}
          style={{
            fontFamily: FONT,
            fontSize: 28,
            color: timer <= 10 ? '#ff4444' : '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
          }}
          originX={0.5}
          originY={0}
        />
      )}
      {survivors !== '' && (
        <Text
          x={16}
          y={16}
          text={survivors}
          style={{
            fontFamily: FONT,
            fontSize: 22,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
          }}
        />
      )}
    </>
  );
}
