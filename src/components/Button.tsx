import { Graphics, Text, useEffect, useRef, useState } from 'phaser-jsx';
import type { Dispatch, SetStateAction } from 'react';

const FONT = '"Lucida Grande", Helvetica, Arial, sans-serif';

export type SetVisible = Dispatch<SetStateAction<boolean>>;

interface ButtonProps {
  x: number;
  y: number;
  text: string;
  width?: number;
  height?: number;
  bgColor?: number;
  bgHoverColor?: number;
  textColor?: string;
  fontSize?: number;
  onClick: () => void;
  onLoad?: (setVisible: SetVisible) => void;
}

export function Button({
  x,
  y,
  text,
  width = 140,
  height = 50,
  bgColor = 0xaa2200,
  bgHoverColor = 0xcc4400,
  textColor = '#ffffff',
  fontSize = 18,
  onClick,
  onLoad,
}: ButtonProps) {
  const [visible, setVisible] = useState(true);
  const graphicsRef = useRef<Phaser.GameObjects.Graphics | null>(null);

  onLoad?.(setVisible);

  useEffect(() => {
    const graphics = graphicsRef.current;
    if (!graphics) return;
    const halfW = width / 2;
    const halfH = height / 2;
    graphics.setInteractive(
      new Phaser.Geom.Rectangle(-halfW, -halfH, width, height),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Phaser.Geom.Rectangle.Contains,
    );
  }, [width, height]);

  const drawButton = (color: number) => {
    const graphics = graphicsRef.current;
    if (!graphics) return;
    const radius = 8;
    const halfW = width / 2;
    const halfH = height / 2;
    graphics.clear();
    graphics.fillStyle(color, 1);
    graphics.fillRoundedRect(-halfW, -halfH, width, height, radius);
  };

  return (
    <>
      {visible && (
        <>
          <Graphics
            x={x}
            y={y}
            depth={12}
            ref={(g: Phaser.GameObjects.Graphics | null) => {
              graphicsRef.current = g;
              if (g) drawButton(bgColor);
            }}
            onPointerOver={() => {
              drawButton(bgHoverColor);
              graphicsRef.current?.scene.input.setDefaultCursor('pointer');
            }}
            onPointerOut={() => {
              drawButton(bgColor);
              graphicsRef.current?.scene.input.setDefaultCursor('default');
            }}
            onPointerDown={onClick}
          />
          <Text
            x={x}
            y={y}
            text={text}
            style={{
              fontFamily: FONT,
              fontSize,
              color: textColor,
              stroke: '#000000',
              strokeThickness: 3,
            }}
            originX={0.5}
            originY={0.5}
            depth={13}
          />
        </>
      )}
    </>
  );
}
