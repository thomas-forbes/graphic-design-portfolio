'use client';

import CirclePage from '@/app/CirclePage';
import { WheelContextProvider } from '@/app/WheelContext';

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

export default function Page() {
  const colors = [
    // project 1
    '#bfdbfe',
    '#bae6fd',
    // project 2
    '#a7f3d0',
    '#bbf7d0',
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
