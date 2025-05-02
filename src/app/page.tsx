'use client';

import CirclePage from '@/app/CirclePage';
import { WheelContextProvider } from '@/app/WheelContext';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Image, { ImageProps } from 'next/image';
import { useEffect, useRef, useState } from 'react';

function PersonalSection() {
  return (
    <div className="flex h-full flex-col items-center">
      <div className="flex h-full flex-col gap-12">
        <h1 className="text-8xl font-black tracking-[0.005em] text-slate-950">Thomas Forbes</h1>
        <p className="font-mono text-sm tracking-[0.015em] text-slate-700 uppercase">
          &quot;to approach obstacles not as impediments, but as creative catalysts&quot; - Ryan
          Holiday
        </p>
        <div className="relative flex-1">
          <div className="absolute inset-0 flex flex-1 gap-5">
            <div className="flex w-2/6 flex-col gap-5">
              <div className="min-h-56 w-full overflow-hidden rounded-xl bg-white">
                <Image
                  src="/P1/final-single-decker.png"
                  alt="Project 1"
                  width={500}
                  height={300}
                  className="-my-5 min-h-64 w-auto object-contain"
                />
              </div>
              <Image
                className="w-auto rounded-xl bg-gray-100"
                alt="project 2"
                src="/P2/front.png"
                width={300}
                height={500}
              />
            </div>
            <div className="flex w-4/6">
              <Image
                src="/P3/page-001.png"
                alt="Project 3"
                width={600}
                height={700}
                className="h-fit w-full rounded-xl bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Square({ index, style }: { index: number; style: React.CSSProperties }) {
  return (
    <div
      className="flex size-64 items-center justify-center text-5xl font-bold text-white"
      style={style}
    >
      {index}
    </div>
  );
}

function Lightbox({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 -top-18 z-50 h-screen w-screen bg-black/80"
        />
      )}
    </AnimatePresence>
  );
}

function SquirmImage(props: ImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [transform, setTransform] = useState('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (isLightboxOpen) return;
      const rect = image.getBoundingClientRect();
      const xPos = (event.clientX - rect.left) / rect.width - 0.5;
      const yPos = (event.clientY - rect.top) / rect.height - 0.5;

      const amplitude = 30;
      const tiltX = -yPos * amplitude;
      const tiltY = xPos * amplitude;
      console.log('hi');

      setTransform(`perspective(2000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`);
    };

    const handleMouseOut = () => {
      setTransform('');
    };

    image.addEventListener('mousemove', handleMouseMove);
    image.addEventListener('mouseout', handleMouseOut);

    return () => {
      image.removeEventListener('mousemove', handleMouseMove);
      image.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isLightboxOpen]);

  useEffect(() => {
    if (isLightboxOpen) setTransform('');
  }, [isLightboxOpen]);

  return (
    <div className="relative h-full w-full">
      <div className={cn('h-full w-full opacity-0', isLightboxOpen && 'pointer-events-none')}>
        <Image
          {...props}
          alt={props.alt}
          className={cn(
            'h-full w-full rounded-xl bg-white object-contain duration-100',
            props.className,
          )}
        />
      </div>

      <motion.div
        layout
        onClick={() => setIsLightboxOpen(!isLightboxOpen)}
        className={cn(
          'cursor-pointer',
          isLightboxOpen
            ? 'fixed inset-4 z-[60] m-auto max-h-[80vh] max-w-[80vw]'
            : 'absolute inset-0 z-10',
        )}
        transition={{
          layout: { type: 'spring', damping: 20 },
          borderRadius: { duration: 0.2 },
        }}
      >
        <Image
          ref={imageRef}
          {...props}
          alt={props.alt}
          style={{ transform }}
          className={cn(
            'h-full w-full rounded-xl bg-white object-contain duration-100',
            props.className,
          )}
        />
      </motion.div>
      <Lightbox isOpen={isLightboxOpen} onClose={() => setIsLightboxOpen(false)} />
    </div>
  );
}

function ProjectSection() {
  const images = [
    {
      src: '/P1/sketch-double-decker.png',
      alt: 'double-decker sketch',
    },
    {
      src: '/P1/final-double-decker.png',
      alt: 'double-decker final',
    },
    {
      src: '/P1/sketch-single-decker.png',
      alt: 'single-decker sketch',
    },
    {
      src: '/P1/final-single-decker.png',
      alt: 'single-decker final',
    },
  ];
  return (
    <div className="flex h-full flex-col items-center justify-between gap-5">
      <div className="relative w-full flex-1">
        <div className="absolute inset-0 grid w-full flex-1 grid-cols-2 grid-rows-2 gap-5 *:rounded-xl">
          {images.map((image) => (
            <SquirmImage
              key={image.alt}
              src={image.src}
              alt={image.alt}
              width={500}
              height={500}
              className="h-full w-full bg-white object-contain shadow-xl"
            />
          ))}
        </div>
      </div>
      <p className="font-mono text-xl text-slate-700 uppercase">Project 1</p>
    </div>
  );
}

export default function Page() {
  const colors = [
    // project 1
    '#bfdbfe',
    '#bae6fd',
    // project 2
    '#a7f3d0',
    '#ecfccb',
    // project 3
    '#fed7aa',
    '#fecaca',
  ];
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

  const items = [
    {
      element: <PersonalSection />,
      color: '#ddd6fe',
    },
    {
      element: <ProjectSection />,
      color: '#bfdbfe',
    },
    ...Array.from({ length: 6 }, (_, i) => ({
      element: <Square key={i} index={i} style={squareStyles[i % squareStyles.length]} />,
      color: colors[i % colors.length],
    })),
  ];
  return (
    <WheelContextProvider>
      <div className="overflow-none h-screen bg-gray-100">
        <div className="h-full pt-18">
          <CirclePage items={items} />
        </div>
      </div>
    </WheelContextProvider>
  );
}
