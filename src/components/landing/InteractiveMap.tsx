'use client';

import dynamic from 'next/dynamic';

// Leaflet requires the window object to be defined. We isolate it into a pure client-side component using ssr: false.
const MapCore = dynamic(() => import('./MapCore'), {
  ssr: false,
  loading: () => (
    <section className="relative w-full overflow-hidden py-20 md:py-32 flex justify-center items-center h-[700px]">
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-[#0B1D35] to-navy opacity-80" />
      <div className="relative text-cyan text-lg font-black tracking-widest uppercase animate-pulse">
        Initializing Geographic Radars...
      </div>
    </section>
  ),
});

export default function InteractiveMap() {
  return <MapCore />;
}
