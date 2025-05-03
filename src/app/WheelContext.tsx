'use client';

import { MotionValue, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { useKey, useMouseWheel } from 'react-use';

export const DEGREE_INCREMENT = 90;

type WheelContextType = {
  roundedWheelValue: MotionValue<number>;
  rawWheelValue: MotionValue<number>;
};

export function WheelContextProvider({ children }: { children: React.ReactNode }) {
  const mouseWheel = (useMouseWheel() / 220) * -1;
  const mouseWheelOffset = useRef(0);
  const lastMouseWheel = useRef(0);

  const rawWheelValueUnadjusted = useMotionValue(0);

  const increment = useCallback(
    (amount: number) => {
      rawWheelValueUnadjusted.set(rawWheelValueUnadjusted.get() + amount);
      mouseWheelOffset.current += amount;
    },
    [rawWheelValueUnadjusted],
  );

  useKey('ArrowUp', () => increment(-1));
  useKey('ArrowRight', () => increment(-1));
  useKey('ArrowDown', () => increment(1));
  useKey('ArrowLeft', () => increment(1));

  useEffect(() => {
    const delta = mouseWheel - lastMouseWheel.current;
    const MAX_DELTA = 0.03;

    if (Math.abs(delta) > MAX_DELTA) {
      const excess = Math.abs(delta) - MAX_DELTA;
      mouseWheelOffset.current += Math.sign(delta) * excess;
    }

    rawWheelValueUnadjusted.set(mouseWheel - mouseWheelOffset.current);
    lastMouseWheel.current = mouseWheel;
  }, [mouseWheel]);

  const roundedWheel = useTransform(
    rawWheelValueUnadjusted,
    (value) => Math.round(value) * DEGREE_INCREMENT,
  );

  const roundedWheelValue = useSpring(roundedWheel, {
    damping: 50,
    mass: 2,
    bounce: 0.2,
    restSpeed: 10,
    restDelta: 0.01,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      rawWheelValueUnadjusted.set(roundedWheel.get() / DEGREE_INCREMENT);
    }, 50);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mouseWheel, roundedWheel]);

  const rawWheelValue = useTransform(rawWheelValueUnadjusted, (value) => value * DEGREE_INCREMENT);

  return (
    <WheelContext.Provider value={{ roundedWheelValue, rawWheelValue }}>
      {children}
    </WheelContext.Provider>
  );
}

export const WheelContext = createContext<WheelContextType>({} as WheelContextType);

export const useWheelContext = () => useContext(WheelContext);
