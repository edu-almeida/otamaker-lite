import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export const HomeIcon = ({ color, filled }) => (
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

export const SearchIcon = ({ color, filled }) => (
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

export const DownloadIcon = ({ color, filled }) => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
            d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        {filled && <Path d="M7 10l5 5 5-5H7z" fill={color} stroke="none" />}
    </Svg>
);
// Note: Download icon stroke-only typically relies on the Line/Polyline.
// For "filled" download, we often just make the arrow thicker or fill the bottom tray.
// Simplified for minimalism: The Cloud download visual is also common.
export const InfoIcon = ({ color, filled }) => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={filled ? 0 : 2} fill={filled ? color : "none"} />
        <Path d="M12 16v-4" stroke={filled ? "#FFF" : color} strokeWidth={2} strokeLinecap="round" />
        <Circle cx={12} cy={8} r={1} fill={filled ? "#FFF" : color} />
    </Svg>
);
