'use client';

import { DEGREE_INCREMENT, useWheelContext } from '@/app/WheelContext';
import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion';
import { useMemo, useState } from 'react';

import { useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';
import { useWindowSize } from 'react-use';

function useBobMotion() {
  const { roundedWheelValue, rawWheelValue } = useWheelContext();
  const bobValue = useTransform(rawWheelValue, (value) => {
    const maxVelocity = 200;
    const velocityAdjustment =
      1 - Math.min(Math.abs(roundedWheelValue.getVelocity()), maxVelocity) / maxVelocity;
    if (velocityAdjustment < 0.05) return 0;

    const amplitude = 100;
    const curve = Math.sin(((value / DEGREE_INCREMENT) % 1) * Math.PI);
    const translate = curve * amplitude * velocityAdjustment * -1;

    return translate;
  });
  const bobSpring = useSpring(bobValue, {
    damping: 50,
    mass: 1,
    stiffness: 200,
    bounce: 0.2,
    restSpeed: 3,
  });
  const bobMotion = useTransform(bobSpring, (value) => `translateY(${value}px)`);

  return bobMotion;
}

function Circle({ currentColor }: { currentColor: MotionValue<string> }) {
  const { roundedWheelValue } = useWheelContext();

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

  const { width, height } = useWindowSize();

  const circleSize = useMotionValue(1500);
  const circleLeft = useTransform(circleSize, (size) => (width - size) / 2);
  useEffect(() => {
    circleSize.set(Math.max(width, height) * 1.8);
  }, [width, height, circleSize]);
  return (
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute"
      suppressHydrationWarning
      style={{
        filter: shadowColor,
        width: circleSize,
        height: circleSize,
        left: circleLeft,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75 }}
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
  );
}

export default function CirclePage({
  items,
}: {
  items: { element: React.ReactNode; color: string }[];
}) {
  const { roundedWheelValue, rawWheelValue } = useWheelContext();
  const bobMotion = useBobMotion();

  const [activeIndex, setActiveIndex] = useState(0);

  const currentColor = useTransform(rawWheelValue, (value) => {
    const rawColorIndex = value / DEGREE_INCREMENT;
    const normalizedIndex = Math.abs(Math.round(rawColorIndex)) % items.length;
    return items[normalizedIndex].color;
  });

  const normalizedRotation = useTransform(roundedWheelValue, (value: number) => {
    const v = (value * 360) / DEGREE_INCREMENT;
    const normalized = (((v + 180) % 360) + 360) % 360;
    return normalized;
  });

  const HALF_CIRCLE_ROTATION_RANGE = 90;
  const halfCircleRotation = useTransform(
    normalizedRotation,
    [0, 360],
    [-HALF_CIRCLE_ROTATION_RANGE, HALF_CIRCLE_ROTATION_RANGE],
  );

  const newChildren = useMemo(() => items.flatMap((item) => item.element), [items]);

  useMotionValueEvent(roundedWheelValue, 'change', (value) => {
    const newIndex = Math.abs(Math.round(value / DEGREE_INCREMENT)) % newChildren.length;
    setActiveIndex(newIndex);
  });

  return (
    <motion.div className="relative h-full" style={{ transform: bobMotion }}>
      <Circle currentColor={currentColor} />

      <div className="absolute top-0 bottom-0 left-0 flex w-full items-center justify-center">
        <div className="flex h-full w-full flex-col items-center pt-64 pb-10">
          <div className="relative h-full w-full max-w-[724px]">
            {newChildren.map((child, i) => (
              <motion.div
                key={i}
                className="absolute top-0 left-0 h-full w-full items-center"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: activeIndex === i ? 1 : 0,
                }}
                style={{
                  rotate: halfCircleRotation,
                  transformOrigin: 'center 1200px',
                  position: 'absolute',
                }}
                transition={{
                  opacity: { duration: 0 },
                }}
              >
                {child}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
