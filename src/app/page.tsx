'use client';

import {
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useKey, useMouseWheel, useWindowSize } from 'react-use';

const DEGREE_INCREMENT = 90;

function useWheel() {
  const mouseWheel = (useMouseWheel() / 220) * -1;
  const mouseWheelOffset = useRef(0);
  const lastMouseWheel = useRef(0);

  const rawWheelValueUnadjusted = useMotionValue(0);

  useKey('ArrowUp', () => {
    rawWheelValueUnadjusted.set(rawWheelValueUnadjusted.get() - 1);
  });

  useKey('ArrowRight', () => {
    rawWheelValueUnadjusted.set(rawWheelValueUnadjusted.get() - 1);
  });

  useKey('ArrowDown', () => {
    rawWheelValueUnadjusted.set(rawWheelValueUnadjusted.get() + 1);
  });

  useKey('ArrowLeft', () => {
    rawWheelValueUnadjusted.set(rawWheelValueUnadjusted.get() + 1);
  });

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
    restSpeed: 0.5,
    restDelta: 0.05,
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

function PersonalSection() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-12">
        <h1 className="text-8xl font-black tracking-[0.005em] text-slate-950">Thomas Forbes</h1>
        <p className="font-mono text-sm tracking-[0.015em] text-slate-700 uppercase">
          &quot;to approach obstacles not as impediments, but as creative catalysts&quot; - Ryan
          Holiday
        </p>
        <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-5 *:h-54">
          <div className="row-span-2 !h-auto rounded-xl bg-gray-100"></div>
          <div className="rounded-xl bg-gray-100"></div>
          <div className="rounded-xl bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
}

type RotatingContainerProps = {
  children: React.ReactNode[];
  roundedWheelValue: MotionValue<number>;
};

function RotatingContainer({ children, roundedWheelValue }: RotatingContainerProps) {
  const normalizedRotation = useTransform(roundedWheelValue, (value: number) => {
    const v = (value * 360) / DEGREE_INCREMENT;
    const normalized = (((v + 180) % 360) + 360) % 360;
    return normalized;
  });

  const [activeIndex, setActiveIndex] = useState(0);

  const HALF_CIRCLE_ROTATION_RANGE = 90;
  const halfCircleRotation = useTransform(
    normalizedRotation,
    [0, 360],
    [-HALF_CIRCLE_ROTATION_RANGE, HALF_CIRCLE_ROTATION_RANGE],
  );

  const newChildren = useMemo(() => children.flat(), [children]);

  useMotionValueEvent(roundedWheelValue, 'change', (value) => {
    const newIndex = Math.abs(Math.round(value / DEGREE_INCREMENT)) % newChildren.length;
    setActiveIndex(newIndex);
  });

  return (
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
  );
}

type SquareProps = {
  index: number;
  style: React.CSSProperties;
};

function Square({ index, style }: SquareProps) {
  return (
    <div
      className="flex size-64 items-center justify-center text-5xl font-bold text-white"
      style={style}
    >
      {index}
    </div>
  );
}

function RotatingSquares({
  numSquares,
  roundedWheelValue,
}: {
  numSquares: number;
  roundedWheelValue: MotionValue<number>;
}) {
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
    <RotatingContainer roundedWheelValue={roundedWheelValue}>
      <PersonalSection />
      {Array.from({ length: numSquares }, (_, i) => (
        <Square key={i} index={i} style={squareStyles[i % squareStyles.length]} />
      ))}
    </RotatingContainer>
  );
}

export default function Page() {
  const colors = [
    // personal
    '#ddd6fe',
    // project 1
    '#bfdbfe',
    '#bae6fd',
    // project 2
    '#a7f3d0',
    '#bbf7d0',
    // project 3
    '#fed7aa',
    '#fecaca',

    // ---
    // '#B8F2E6',
    // '#E0C3FC',
    // '#D4F8E8',
    // '#FFFACD',
  ];
  const { roundedWheelValue, rawWheelValue } = useWheel();

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

  const currentColor = useTransform(rawWheelValue, (value) => {
    const rawColorIndex = value / DEGREE_INCREMENT;

    const normalizedIndex = Math.abs(Math.round(rawColorIndex)) % colors.length;

    // const nextIndex = normalizedIndex + 1;
    // const progress =  1 //(normalizedIndex - rawColorIndex) % 1;

    return colors[normalizedIndex];
    // return `color-mix(in srgb, ${colors[normalizedIndex]} ${progress * 100}%, ${
    //   colors[nextIndex]
    // } ${(1 - progress) * 100}%)`;
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

  const { width, height } = useWindowSize({ initialWidth: 1000, initialHeight: 1000 });

  // TODO: fix init circle size
  const circleSize = Math.max(width, height) * 1.8;
  console.log(width, height, circleSize);

  return (
    <div className="overflow-none h-screen bg-gray-100">
      <div className="h-full pt-18">
        <motion.div className="relative h-full" style={{ transform: bobMotion }}>
          <motion.svg
            key={circleSize}
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
              left: (width - circleSize) / 2,
            }}
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
