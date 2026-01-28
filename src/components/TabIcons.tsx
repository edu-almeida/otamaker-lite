import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface IconProps {
  color: string;
  filled?: boolean;
}

interface HeartIconProps extends IconProps {
  size?: number;
  showFace?: boolean;
}

export const HomeIcon: React.FC<IconProps> = ({ color, filled }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth={filled ? 0 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SearchIcon: React.FC<IconProps> = ({ color, filled }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Circle
      cx={11}
      cy={11}
      r={8}
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth={filled ? 0 : 2}
    />
    <Path
      d="M21 21l-4.35-4.35"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

export const LibraryIcon: React.FC<IconProps> = ({ color, filled }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    {/* Base book shape */}
    <Path
      d="M4 19.5A2.5 2.5 0 016.5 17H20"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth={filled ? 0 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Detail lines for "pages" effect when outline */}
    {!filled && (
      <Path
        d="M8 6h8M8 10h8M8 14h8"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    )}
  </Svg>
);

export const InfoIcon: React.FC<IconProps> = ({ color, filled }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={filled ? 0 : 2} fill={filled ? color : "none"} />
    <Path d="M12 16v-4" stroke={filled ? "#FFF" : color} strokeWidth={2} strokeLinecap="round" />
    <Circle cx={12} cy={8} r={1} fill={filled ? "#FFF" : color} />
  </Svg>
);

export const HeartIcon: React.FC<HeartIconProps> = ({ color, filled, size = 24, showFace = false }) => {
  // Face color: White if filled (on primary bg), same color as stroke if outline
  const faceColor = filled ? "#FFFFFF" : color;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Heart Shape */}
      <Path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Face - Only visible if showFace is true */}
      {showFace && (
        <>
          {/* Eyes */}
          <Circle cx={8.5} cy={10} r={1.5} fill={faceColor} />
          <Circle cx={15.5} cy={10} r={1.5} fill={faceColor} />

          {/* Mouth - Always Happy if we are showing the face on activation */}
          <Path d="M8 14.5 Q12 18.5 16 14.5" stroke={faceColor} strokeWidth={1.5} strokeLinecap="round" />
        </>
      )}
    </Svg>
  );
};
