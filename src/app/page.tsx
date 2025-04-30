'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useEffect, useRef } from 'react';
import { useMouseWheel } from 'react-use';

function useWheel() {
  const mouseWheel = useMouseWheel() / 90;
  const rawWheelValueUnadjusted = useMotionValue(0);
  useEffect(() => {
    rawWheelValueUnadjusted.set(mouseWheel);
  }, [mouseWheel]);

  const roundedWheel = useTransform(rawWheelValueUnadjusted, (value) => Math.round(value) * 30);

  const roundedWheelValue = useSpring(roundedWheel, {
    damping: 50,
    mass: 1,
    stiffness: 200,
    bounce: 0.2,
    restSpeed: 0.1,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      rawWheelValueUnadjusted.set(roundedWheel.get() / 30);
    }, 50);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mouseWheel, roundedWheel]);

  const rawWheelValue = useTransform(rawWheelValueUnadjusted, (value) => value * 30);

  return { roundedWheelValue, rawWheelValue };
}

interface AnimatedClockProps {
  children: ReactNode;
  colors?: string[];
}

function AnimatedClock({
  children,
  colors = ['#F8D0E7', '#B8F2E6', '#E0C3FC', '#D4F8E8', '#FFFACD'],
}: AnimatedClockProps) {
  const { roundedWheelValue, rawWheelValue } = useWheel();

  const bobValue = useTransform(rawWheelValue, (value) => {
    const maxVelocity = 200;
    const velocityAdjustment =
      1 - Math.min(Math.abs(roundedWheelValue.getVelocity()), maxVelocity) / maxVelocity;
    if (velocityAdjustment < 0.05) return 0;

    const amplitude = 55;
    const curve = Math.sin(((value / 30) % 1) * Math.PI);
    const translate = curve * amplitude * velocityAdjustment;

    return translate;
  });
  const bobSpring = useSpring(bobValue, {
    damping: 50,
    mass: 1,
    stiffness: 200,
    bounce: 0.2,
    restSpeed: 0.1,
  });
  const bobMotion = useTransform(bobSpring, (value) => `translateY(${value}px)`);

  const colorIndex = useTransform(roundedWheelValue, [0, 360], [0, colors.length], {
    clamp: false,
  });

  const currentColor = useTransform(colorIndex, (latest) => {
    const normalizedIndex = latest % colors.length;
    const index = Math.floor(normalizedIndex);
    const nextIndex = (index + 1) % colors.length;
    const progress = normalizedIndex - index;
    return `color-mix(in srgb, ${colors[index]} ${(1 - progress) * 100}%, ${
      colors[nextIndex]
    } ${progress * 100}%)`;
  });

  const hourNotchColor = useTransform(
    currentColor,
    (color) => `color-mix(in srgb, ${color} 95%, black)`,
  );
  const minuteNotchColor = useTransform(
    currentColor,
    (color) => `color-mix(in srgb, ${color} 97%, black)`,
  );

  const shadowColor = useTransform(currentColor, (color) => {
    const darkShadow = `color-mix(in srgb, ${color} 50%, rgba(190,190,190,0.6))`;
    const lightShadow = `color-mix(in srgb, ${color} 70%, rgba(255,255,255,0.6))`;
    return `drop-shadow(0px -30px 30px rgba(190,190,190,0.5)) drop-shadow(0px -10px 10px ${darkShadow}) drop-shadow(0px -10px 15px ${lightShadow})`;
  });

  return (
    <motion.div className="relative h-full" style={{ transform: bobMotion }}>
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute -left-[20%] size-[140%]"
        style={{ filter: shadowColor }}
      >
        <g>
          <motion.circle cx="150" cy="150" r="145" fill={currentColor} />
        </g>

        <motion.g style={{ rotate: roundedWheelValue }}>
          {Array.from({ length: 12 }, (_, i) => (
            <motion.line
              key={`hour-${i}`}
              x1="150"
              y1="5"
              x2="150"
              y2="20"
              stroke={hourNotchColor}
              strokeWidth="2"
              opacity="1"
              transform={`rotate(${i * 30} 150 150)`}
            />
          ))}
          {Array.from(
            { length: 60 },
            (_, i) =>
              i % 5 !== 0 && (
                <motion.line
                  key={`minute-${i}`}
                  x1="150"
                  y1="10"
                  x2="150"
                  y2="20"
                  stroke={minuteNotchColor}
                  strokeWidth="1"
                  opacity="0.8"
                  transform={`rotate(${i * 6} 150 150)`}
                />
              ),
          )}
        </motion.g>
      </motion.svg>

      <div className="absolute top-0 bottom-0 left-0 flex w-full items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
}

export default function Page() {
  return (
    <div className="overflow-none h-screen bg-gray-100">
      <div className="h-full pt-18">
        <AnimatedClock>
          <div className="flex flex-col items-center justify-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-gray-500">AM</div>
          </div>
        </AnimatedClock>
      </div>
    </div>
  );
}
