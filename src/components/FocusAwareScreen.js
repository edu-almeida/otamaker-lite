import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { ScreenSkeleton } from './Skeleton';

export const withFocusAwareness = (Component) => {
    return (props) => {
        const isFocused = useIsFocused();
        const [shouldRender, setShouldRender] = useState(false);

        useEffect(() => {
            // Immediate update or slight delay? 
            // User wants "Decrease weight of transition" -> so delay heavy render until focused
            if (isFocused) {
                // Determine if we need a slight delay to let the animation settle
                // requestAnimationFrame is usually enough
                const timer = setTimeout(() => setShouldRender(true), 50);
                return () => clearTimeout(timer);
            } else {
                // When focus is lost, should we unmount?
                // User said: "Instead of showing loaded screen... show skeleton" (when transitioning)
                // This implies "Unmount on Blur".
                setShouldRender(false);
            }
        }, [isFocused]);

        if (!shouldRender) {
            return <ScreenSkeleton />;
        }

        return <Component {...props} />;
    };
};
