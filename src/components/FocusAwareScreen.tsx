import React, { useState, useEffect, ComponentType } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { ScreenSkeleton } from './Skeleton';

export function withFocusAwareness<P extends object>(Component: ComponentType<P>) {
  return function FocusAwareComponent(props: P) {
    const isFocused = useIsFocused();
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
      if (isFocused) {
        const timer = setTimeout(() => setShouldRender(true), 50);
        return () => clearTimeout(timer);
      } else {
        setShouldRender(false);
      }
    }, [isFocused]);

    if (!shouldRender) {
      return <ScreenSkeleton />;
    }

    return <Component {...props} />;
  };
}
