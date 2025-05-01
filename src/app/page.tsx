'use client';

import { motion, MotionValue, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useMouseWheel } from 'react-use';

const DEGREE_INCREMENT = 360;

function useWheel() {
  const mouseWheel = useMouseWheel() / 270;
  const rawWheelValueUnadjusted = useMotionValue(0);

  useEffect(() => {
    rawWheelValueUnadjusted.set(mouseWheel);
  }, [mouseWheel]);

  const roundedWheel = useTransform(
    rawWheelValueUnadjusted,
    (value) => Math.round(value) * DEGREE_INCREMENT,
  );

  const roundedWheelValue = useSpring(roundedWheel, {
    damping: 50,
    mass: 1,
    stiffness: 200,
    bounce: 0.2,
    restSpeed: 5,
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

  return { roundedWheelValue, rawWheelValue };
}

type RotatingSquaresProps = {
  numSquares: number;
  roundedWheelValue: MotionValue<number>;
};

function RotatingSquares({ numSquares, roundedWheelValue }: RotatingSquaresProps) {
  const normalizedRotation = useTransform(roundedWheelValue, (value: number) => {
    const normalized = (((value + 180) % 360) + 360) % 360;
    return normalized;
  });

  const [activeIndex, setActiveIndex] = useState(0);

  const HALF_CIRCLE_ROTATION_RANGE = 130;
  const halfCircleRotation = useTransform(
    normalizedRotation,
    [0, 360],
    [-HALF_CIRCLE_ROTATION_RANGE, HALF_CIRCLE_ROTATION_RANGE],
  );

  useEffect(() => {
    const unsubscribe = roundedWheelValue.onChange((value) => {
      const newIndex = Math.floor((value + 180) / 360) % numSquares;
      setActiveIndex(newIndex);
    });

    return unsubscribe;
  }, [numSquares, roundedWheelValue]);

  const squareStyles = [
    { backgroundColor: '#F87171', borderRadius: '16px' },
    { backgroundColor: '#60A5FA', borderRadius: '8px 32px 8px 32px' },
    { backgroundColor: '#34D399', borderRadius: '50%' },
    { backgroundColor: '#A78BFA', borderRadius: '16px 16px 48px 48px' },
    { backgroundColor: '#FBBF24', borderRadius: '8px' },
    { backgroundColor: '#EC4899', borderRadius: '24px 8px 24px 8px' },
    { backgroundColor: '#A3E635', borderRadius: '32px 32px 8px 8px' },
    { backgroundColor: '#38BDF8', borderRadius: '8px 48px 48px 8px' },
    { backgroundColor: '#FB923C', borderRadius: '50% 0 50% 0' },
    { backgroundColor: '#818CF8', borderRadius: '32px' },
  ];

  return (
    <div className="relative size-64">
      {Array.from({ length: numSquares }, (_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 left-0 flex size-64 items-center justify-center text-5xl font-bold text-white"
          initial={{ opacity: 0 }}
          animate={{
            opacity: activeIndex === i ? 1 : 0,
          }}
          style={{
            ...squareStyles[i % squareStyles.length],
            rotate: halfCircleRotation,
            transformOrigin: 'center 200%',
            position: 'absolute',
          }}
          transition={{
            opacity: { duration: 0.3 },
          }}
        >
          {i}
        </motion.div>
      ))}
    </div>
  );
}

export default function Page() {
  const colors = ['#F8D0E7', '#B8F2E6', '#E0C3FC', '#D4F8E8', '#FFFACD'];
  const { roundedWheelValue, rawWheelValue } = useWheel();

  const bobValue = useTransform(rawWheelValue, (value) => {
    const maxVelocity = 200;
    const velocityAdjustment =
      1 - Math.min(Math.abs(roundedWheelValue.getVelocity()), maxVelocity) / maxVelocity;
    if (velocityAdjustment < 0.05) return 0;

    const amplitude = 100;
    const curve = Math.sin(((value / DEGREE_INCREMENT) % 1) * Math.PI);
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

  const colorIndex = useTransform(roundedWheelValue, (value: number) => {
    const normalizedValue = ((value % 360) + 360) % 360;
    return (normalizedValue / 360) * colors.length;
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
    <div className="overflow-none h-screen bg-gray-100">
      <div className="h-full pt-18">
        <motion.div className="relative h-full" style={{ transform: bobMotion }}>
          <motion.svg
            width="100%"
            height="100%"
            viewBox="0 0 300 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute -left-[40%] size-[180%]"
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
            <RotatingSquares numSquares={10} roundedWheelValue={roundedWheelValue} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
