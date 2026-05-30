import { Text, useState } from 'phaser-jsx';
import type { Dispatch, SetStateAction } from 'react';

const FONT = '"Lucida Grande", Helvetica, Arial, sans-serif';

export type SetPhaseLabel = Dispatch<SetStateAction<string>>;

interface PhaseLabelProps {
  onReady: (setLabel: SetPhaseLabel) => void;
}

export function PhaseLabel({ onReady }: PhaseLabelProps) {
  const [label, setLabel] = useState('BUILD!');

  onReady(setLabel);

  return (
    <Text
      x={640}
      y={360}
      text={label}
      style={{
        fontFamily: FONT,
        fontSize: 72,
        color: '#ffdd00',
        stroke: '#000000',
        strokeThickness: 8,
      }}
      originX={0.5}
      originY={0.5}
      alpha={0}
    />
  );
}
