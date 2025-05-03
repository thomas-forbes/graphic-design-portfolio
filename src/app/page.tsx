'use client';

import CirclePage from '@/app/CirclePage';
import { WheelContextProvider } from '@/app/WheelContext';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Image, { ImageProps } from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

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
    <div className="relative max-h-full">
      <div className={cn('h-full w-full opacity-0', isLightboxOpen && 'pointer-events-none')}>
        <Image
          {...props}
          alt={props.alt}
          className={cn('h-full w-full rounded-xl duration-100', props.className)}
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
          className={cn('h-auto max-h-full w-full rounded-xl duration-100', props.className)}
        />
      </motion.div>
      <Lightbox isOpen={isLightboxOpen} onClose={() => setIsLightboxOpen(false)} />
    </div>
  );
}

function Project1() {
  const images1 = [
    {
      src: '/P1/sketch-single-decker.png',
      alt: 'single-decker sketch',
    },
    {
      src: '/P1/final-single-decker.png',
      alt: 'single-decker final',
    },
    {
      src: '/P1/final-double-decker.png',
      alt: 'double-decker final',
    },
  ];
  return (
    <ProjectSection className="grid grid-cols-2 grid-rows-2 gap-5" subtitle="Project 1">
      <div className="flex flex-col justify-around gap-3">
        <div className="flex flex-col gap-5">
          <h2 className="text-4xl font-black">Dublin Bus Icons</h2>
          <p className="font-mono text-slate-700 uppercase">adobe illustrator</p>
        </div>
        <p className="text-light font-mono text-sm text-slate-600">
          I created a pair of isometric bus icons. I developed a unified style with reused line
          patterns and a complementary color system. The process moved from pencil sketches through
          digital refinement, with particular attention paid to maintaining the isometric
          perspective and essential vehicle characteristics.
        </p>
      </div>
      {images1.map((image) => (
        <SquirmImage
          key={image.alt}
          src={image.src}
          alt={image.alt}
          width={500}
          height={500}
          className="h-full w-full bg-white object-contain shadow-xl"
        />
      ))}
    </ProjectSection>
  );
}

function Project2Page1() {
  return (
    <ProjectSection className="flex flex-col gap-8" subtitle="Project 2">
      <h2 className="text-4xl font-black">Mars Logistics Company Business Card</h2>
      <p className="font-mono text-slate-700 uppercase">adobe illustrator</p>
      <p className="text-light font-mono text-sm text-slate-600">
        I designed a minimalist space logistics brand using a rocket motif and atmospheric color
        layers. The design merges Mars&apos; terrain colors with launch sequence imagery, built in
        Illustrator using geometric shapes and clean typography. The final system works across
        business cards and social media while maintaining its visual impact at any scale.
      </p>
      <SquirmImage
        src="/P2/branding.png"
        alt="Project 2"
        width={900}
        height={800}
        className="w-full bg-white object-contain shadow-xl"
      />
    </ProjectSection>
  );
}

function Project2Page2() {
  return (
    <ProjectSection className="grid grid-cols-2 gap-5" subtitle="Project 2">
      {[
        {
          title: 'front',
          item: (
            <SquirmImage
              src="/P2/front.png"
              alt="Project 2"
              width={500}
              height={500}
              className="w-full object-cover shadow-xl"
            />
          ),
        },
        {
          title: 'back',
          item: (
            <SquirmImage
              src="/P2/back.png"
              alt="Project 2"
              width={500}
              height={500}
              className="w-full object-cover shadow-xl"
            />
          ),
        },
      ].map(({ title, item }) => (
        <div key={title} className="flex max-h-full flex-col items-center gap-2">
          <p className="font-mono tracking-widest text-slate-600 uppercase">{title}</p>
          <div className="relative w-full flex-1">
            <div className="absolute inset-0">{item}</div>
          </div>
        </div>
      ))}
    </ProjectSection>
  );
}

function Project3Page1() {
  return (
    <ProjectSection className="grid grid-cols-2 gap-5" subtitle="Project 3">
      <></>
    </ProjectSection>
  );
}

function Project3Page2() {
  const minPage = 0;
  const maxPage = 7;
  const [page, setPage] = useState(minPage);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState(0); // 1 for increment, -1 for decrement

  const incrementPage = useCallback(() => {
    if (page < maxPage) {
      setDirection(1);
      setTransitioning(true);
      setPage(page + 1);
    }
  }, [page, maxPage]);

  const decrementPage = useCallback(() => {
    if (page > minPage) {
      setDirection(-1);
      setTransitioning(true);
      setPage(page - 1);
    }
  }, [page, minPage]);

  return (
    <ProjectSection className="relative h-full w-full" subtitle="Project 3">
      <div className="relative h-full w-full -translate-x-26">
        {Array.from({ length: 8 }).map((_, index) => {
          const isCurrentPage = index === page;
          const isNextPage = index > page;

          // Calculate z-index based on whether we're transitioning and in which direction
          const getZIndex = () => {
            if (transitioning && direction === -1 && index === page + 1) {
              return maxPage + 5; // Keep the page below current extra high during backwards transition
            }
            if (isCurrentPage) {
              return maxPage + 3; // Current page is very high
            }
            return maxPage - Math.abs(index - page);
          };

          return (
            <motion.div
              key={index}
              className={cn(
                'absolute top-0 bottom-0 h-fit cursor-pointer overflow-hidden rounded-xl',
                isCurrentPage || index === page + 1 ? 'shadow-xl' : '',
              )}
              initial={false}
              animate={{
                x: isNextPage ? 'calc(100% + 2rem)' : '0%',
                rotateY: isNextPage ? -5 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                restSpeed: 3,
                restDelta: 0.01,
                onComplete: () => setTransitioning(false),
              }}
              style={{
                originX: isNextPage ? 0 : 1,
                zIndex: getZIndex(),
              }}
              onClick={() => {
                if (isNextPage) incrementPage();
                else if (isCurrentPage) decrementPage();
              }}
            >
              <Image
                src={`/P3/page-00${index + 1}.png`}
                alt="Project 3"
                width={450}
                height={500}
                className="object-contain"
              />
            </motion.div>
          );
        })}
      </div>
    </ProjectSection>
  );
}

function ProjectSection({
  children,
  className,
  subtitle,
}: {
  children: React.ReactNode;
  className: string;
  subtitle: string;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-between gap-5">
      <div className="relative w-full flex-1">
        <div className={cn('absolute inset-0 w-full', className)}>{children}</div>
      </div>
      <p className="font-mono text-lg tracking-widest text-slate-700 uppercase">{subtitle}</p>
    </div>
  );
}

export default function Page() {
  const items = [
    {
      element: <PersonalSection />,
      color: '#ddd6fe',
    },
    {
      element: <Project1 />,
      color: '#bfdbfe',
    },
    {
      element: <Project2Page1 />,
      color: '#a5f3fc',
    },
    {
      element: <Project2Page2 />,
      color: '#99f6e4',
    },
    {
      element: <Project3Page1 />,
      color: '#fed7aa',
    },
    {
      element: <Project3Page2 />,
      color: '#fecaca',
    },
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
