import { palette } from './colors';

// Strategy: Shadows should project ONLY downwards (positive height)
// Width 0 prevents side-bleeding (contour effect).
// Opacity is kept low for "Soft" feel.

export const shadows = {
    // Aliases for compatibility
    get sm() { return this.soft },
    get md() { return this.medium },
    get lg() { return this.strong },

    soft: {
        shadowColor: palette.black,
        shadowOffset: { width: 0, height: 4 }, // Only down
        shadowOpacity: 0.08,               // Very subtle
        shadowRadius: 8,                   // Soft spread
        elevation: 2,
    },
    medium: {
        shadowColor: palette.black,
        shadowOffset: { width: 0, height: 6 }, // Deeper down
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 4,
    },
    strong: {
        shadowColor: palette.black,
        shadowOffset: { width: 0, height: 10 }, // Deep projection
        shadowOpacity: 0.18,
        shadowRadius: 20,
        elevation: 10,
    },
    // Useful for floating action buttons or bottom sheets
    top: {
        shadowColor: palette.black,
        shadowOffset: { width: 0, height: -4 }, // Projects up
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    }
};
