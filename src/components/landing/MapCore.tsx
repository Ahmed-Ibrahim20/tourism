'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, ArrowRight, X, Plane } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import { useI18n } from '@/lib/i18n';
import 'leaflet/dist/leaflet.css';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

/* ═══════════════════════════════════════════════════════════════════════════
 *  LIVE GEOGRAPHIC COORDINATE SYSTEM & DATA
 * ═══════════════════════════════════════════════════════════════════════════ */

interface Destination {
  id: string;
  nameKey: string;
  infoKey: string;
  lat: number;
  lng: number;
  image: string;
  rating: number;
  priceFrom: number;
  taglineKey: string;
  color: string;
}

const destinations: Destination[] = [
  { id: 'aswan', nameKey: 'aswan.name', infoKey: 'map.gizaInfo', lat: 24.0889, lng: 32.8998, image: '/images/hero/01-giza.jpg', rating: 5.0, priceFrom: 180, taglineKey: 'aswan.tagline', color: '#00D4FF' },
  { id: 'alexandria', nameKey: 'alexandria.name', infoKey: 'map.alexandriaInfo', lat: 31.2001, lng: 29.9187, image: '/images/hero/06-alexandria.jpg', rating: 4.8, priceFrom: 200, taglineKey: 'alexandria.tagline', color: '#67E8F9' },
  { id: 'dahab', nameKey: 'dahab.name', infoKey: 'map.dahabInfo', lat: 28.5015, lng: 34.5097, image: '/images/hero/02-dahab.jpg', rating: 4.9, priceFrom: 150, taglineKey: 'dahab.tagline', color: '#0891B2' },
  { id: 'hurghada', nameKey: 'hurghada.name', infoKey: 'map.hurghadaInfo', lat: 27.2579, lng: 33.8116, image: '/images/hero/03-hurghada.jpg', rating: 4.8, priceFrom: 550, taglineKey: 'hurghada.tagline', color: '#00D4FF' },
  { id: 'sharm', nameKey: 'sharm.name', infoKey: 'map.sharmInfo', lat: 27.9158, lng: 34.3338, image: '/images/hero/04-sharm.jpg', rating: 4.9, priceFrom: 400, taglineKey: 'sharm.tagline', color: '#67E8F9' },
  { id: 'luxor', nameKey: 'luxor.name', infoKey: 'map.luxorInfo', lat: 25.6872, lng: 32.6396, image: '/images/hero/05-luxor.jpg', rating: 5.0, priceFrom: 250, taglineKey: 'luxor.tagline', color: '#0891B2' },
  { id: 'nile', nameKey: 'nile.name', infoKey: 'map.nileInfo', lat: 24.0889, lng: 32.8998, image: '/images/hero/07-nile.jpg', rating: 4.9, priceFrom: 850, taglineKey: 'nile.tagline', color: '#00D4FF' },
  { id: 'sinai', nameKey: 'sinai.name', infoKey: 'map.sinaiInfo', lat: 28.5391, lng: 33.9750, image: '/images/hero/08-sinai.jpg', rating: 4.8, priceFrom: 120, taglineKey: 'sinai.tagline', color: '#67E8F9' },
];

/* Hub-and-spoke flight lines originating from Aswan */
const aswanHub = destinations[0];
const flightPaths = destinations.slice(1).map(dest => [
  [aswanHub.lat, aswanHub.lng] as [number, number],
  [dest.lat, dest.lng] as [number, number]
]);

/* ═══════════════════════════════════════════════════════════════════════════
 *  MAIN EGYPT MAP COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

export default function InteractiveMap() {
  const { t } = useI18n();
  const [activeId, setActiveId] = useState<string | null>(null);

  // Focus the map heavily on Egypt
  const mapCenter: [number, number] = [27.0, 31.0];

  return (
    <section id="map" className="relative w-full overflow-hidden py-20 md:py-32">
      {/* Heavy CSS Customizations for Leaflet overrides and Native Animations */}
      <style suppressHydrationWarning>{`
        /* Strip Leaflet's standard white styling */
        .leaflet-container { background: #050D19 !important; font-family: inherit; }
        .leaflet-control-container .leaflet-control-attribution { background: rgba(0,0,0,0.5) !important; color: #67E8F9; border-radius: 4px; padding: 0 4px; border: none; }
        .leaflet-control-zoom a { background: #0A192F !important; color: #00D4FF !important; border-color: rgba(0,212,255,0.2) !important; }
        .leaflet-popup-content-wrapper { background: transparent !important; box-shadow: none !important; margin: 0; padding: 0; pointer-events: auto; }
        .leaflet-popup-tip-container { display: none !important; }
        .leaflet-popup-content { margin: 0 !important; line-height: inherit !important; width: auto !important; }

        @keyframes mapPulse {
          0% { transform: scale(1) translate(-50%, -50%); opacity: 0.6; }
          100% { transform: scale(3.5) translate(-50%, -50%); opacity: 0; }
        }
        .map-pulse-1 { animation: mapPulse 2.5s cubic-bezier(0.1, 0, 0.4, 1) infinite; transform-origin: top left; }
        .map-pulse-2 { animation: mapPulse 2.5s cubic-bezier(0.1, 0, 0.4, 1) infinite; transform-origin: top left; }
        
        .animated-poly path {
          stroke-dasharray: 8 8;
          animation: flyPath 25s linear infinite;
        }
        @keyframes flyPath {
          to { stroke-dashoffset: -200; }
        }
        
        /* Ensure popup sits slightly above the marker */
        .leaflet-popup { margin-bottom: 20px; }
      `}</style>

      {/* Atmospheric Background & Glows */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-[#0B1D35] to-navy" />
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-[600px] w-[600px] rounded-full bg-cyan/[0.03] " />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="glass mb-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan shadow-sm">
              <Plane className="h-4 w-4" />
              {t('map.subtitle')}
            </span>
          </div>
          <h2 className="gradient-text mb-4 text-3xl font-black tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 sm:text-4xl md:text-5xl lg:text-6xl">
            {t('map.title')}
          </h2>
        </div>

        {/* Map Container */}
        <div
          className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-cyan/15 bg-[#050D19] shadow-[0_0_80px_rgba(0,212,255,0.05),_inset_0_0_100px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-1000 delay-300 z-10"
          style={{ height: '700px' }}
        >
          <MapContainer 
            center={mapCenter} 
            zoom={6} 
            minZoom={5}
            maxZoom={10}
            scrollWheelZoom={false} // Prevent page scroll trapping
            className="h-full w-full"
            style={{ zIndex: 1 }}
          >
            {/* Extremely aesthetic dark tile layer from CartoDB */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Flight Routes connecting Giza to other cities */}
            {flightPaths.map((path, i) => (
              <Polyline 
                key={i} 
                positions={path} 
                color="#00D4FF" 
                weight={2.5} 
                opacity={0.4} 
                className="animated-poly" 
              />
            ))}

            {/* Live Interactive Markers */}
            {destinations.map((dest, index) => {
              const isActive = activeId === dest.id;
              
              // We construct standard HTML for Leaflet's divIcon using ReactDOMServer to avoid Turbopack TSX parser bugs
              const iconHtml = renderToString(
                <div className={`relative w-full h-full flex items-center justify-center pointer-events-none group ${isActive ? 'scale-125' : 'hover:-translate-y-1 hover:scale-110'} transition-transform duration-300`}>
                   {/* Pulsing Rings */}
                   <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 rounded-full map-pulse-1 pointer-events-none" style={{ backgroundColor: dest.color, animationDelay: `${index * 0.2}s` }} />
                   <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 rounded-full border map-pulse-2 pointer-events-none" style={{ borderColor: dest.color, animationDelay: `${index * 0.2 + 0.4}s` }} />
                   
                   {/* Marker Body */}
                   <div className="relative flex h-8 w-8 items-center justify-center rounded-full border shadow-[0_4px_16px_rgba(0,0,0,0.8)] pointer-events-auto transition-colors" 
                        style={{ backgroundColor: isActive ? 'rgba(0,212,255,0.2)' : 'rgba(10,25,47,0.95)', borderColor: isActive ? '#00D4FF' : 'rgba(0,212,255,0.3)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={dest.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                   </div>

                   {/* Mini Label Tag below marker */}
                   <div className="absolute top-[35px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="px-2 py-0.5 rounded text-[9px] font-black tracking-widest text-[#00D4FF] uppercase bg-black/60 backdrop-blur-md border border-cyan/20 whitespace-nowrap shadow-xl">
                        {t(dest.nameKey)}
                      </div>
                   </div>
                </div>
              );

              const customIcon = L.divIcon({
                html: iconHtml,
                className: '',
                iconSize: [40, 40],
                iconAnchor: [20, 20],
                popupAnchor: [0, -20],
              });

              return (
                <Marker 
                  key={dest.id} 
                  position={[dest.lat, dest.lng]} 
                  icon={customIcon}
                  eventHandlers={{
                    click: () => setActiveId(dest.id)
                  }}
                >
                  <Popup minWidth={320} maxWidth={320} className="custom-luxury-popup" keepInView={true}>
                     <DestinationCard dest={dest} onClose={() => {
                        setActiveId(null);
                        // Hack to close popup since react-leaflet manages it internally
                        document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
                     }} t={t} />
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  DESTINATION DETAIL CARD (Injected seamlessly inside Leaflet Popup)
 * ═══════════════════════════════════════════════════════════════════════════ */

function DestinationCard({ dest, onClose, t }: { dest: Destination; onClose: () => void; t: any }) {
  return (
    <div className="w-[320px] pointer-events-auto p-1 animate-in fade-in zoom-in-95 duration-300">
      <div className="glass-strong overflow-hidden rounded-[1.5rem] border border-cyan/30 bg-[#0A192F]/95 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        {/* Top Image Banner */}
        <div className="relative h-[180px] w-full group">
          <Image src={dest.image} alt={t(dest.nameKey)} fill className="object-cover transition-transform duration-[3s] group-hover:scale-110" sizes="320px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/20 to-transparent" />
          
          <div className="absolute bottom-3 left-4 rtl:left-auto rtl:right-4 rounded bg-cyan/90 border border-cyan px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-navy shadow-[0_0_15px_rgba(0,212,255,0.5)]">
            Verified Destination
          </div>
        </div>

        {/* Content details */}
        <div className="p-5 pt-3">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1 pe-2">
              <h4 className="text-xl font-bold text-white drop-shadow-sm truncate tracking-tight">{t(dest.nameKey)}</h4>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-cyan-light truncate">{t(dest.taglineKey)}</p>
            </div>
            <div className="flex items-center gap-1 rounded border border-white/5 bg-white/5 px-2 py-1 backdrop-blur-sm shadow-inner shrink-0">
              <Star className="h-3.5 w-3.5 fill-[#FBBF24] text-[#FBBF24]" />
              <span className="text-xs font-bold text-white">{dest.rating}</span>
            </div>
          </div>
          
          <div className="my-4 h-[1px] w-full bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
          
          <p className="text-xs leading-relaxed text-slate-300 mb-4 line-clamp-3">
            {t(dest.infoKey)}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-0.5">{t('from')}</p>
              <p className="text-2xl font-black text-white shrink-0">${dest.priceFrom}</p>
            </div>
            <a
              href="#destinations"
              onClick={(e) => { e.preventDefault(); onClose(); }}
              className="group flex flex-1 ms-4 justify-center items-center gap-2 rounded-xl bg-cyan px-4 py-2.5 text-[13px] font-black text-navy transition-all hover:bg-cyan-light hover:shadow-[0_0_20px_rgba(0,212,255,0.5)]"
            >
              {t('destinations.cta')} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
