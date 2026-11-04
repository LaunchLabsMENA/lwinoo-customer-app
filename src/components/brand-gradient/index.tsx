import { FC } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

type Props = {
  colors: string[];
  id?: string;
};

// Full-bleed vertical gradient, rendered behind screen content.
export const BrandGradient: FC<Props> = ({ colors, id = 'brandGradient' }) => (
  <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
    <Defs>
      <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        {colors.map((c, i) => (
          <Stop key={c + i} offset={i / (colors.length - 1)} stopColor={c} />
        ))}
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
  </Svg>
);
