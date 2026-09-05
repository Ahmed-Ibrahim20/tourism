'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Loader2, ArrowRight, Star } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { apiService, Destination as ApiDestination } from '@/services/api';
import 'leaflet/dist/leaflet.css';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import dynamic from 'next/dynamic';

const DestinationModal = dynamic(() => import('./DestinationModal'), {
  ssr: false,
});

/* Standard fallback coordinates for Egypt cities if lat/lng are missing in DB */
const fallbackGeoCoords: Record<string, { lat: number; lng: number; defaultImg: string; nameEn: string }> = {
  cairo: { lat: 29.9792, lng: 31.1342, defaultImg: '/images/hero/01-giza.jpg', nameEn: 'Cairo & Giza' },
  giza: { lat: 29.9792, lng: 31.1342, defaultImg: '/images/hero/01-giza.jpg', nameEn: 'Giza' },
  dahab: { lat: 28.5015, lng: 34.5097, defaultImg: '/images/hero/02-dahab.jpg', nameEn: 'Dahab' },
  hurghada: { lat: 27.2579, lng: 33.8116, defaultImg: '/images/hero/03-hurghada.jpg', nameEn: 'Hurghada' },
  sharm: { lat: 27.9158, lng: 34.3338, defaultImg: '/images/hero/04-sharm.jpg', nameEn: 'Sharm El-Sheikh' },
  'sharm-el-sheikh': { lat: 27.9158, lng: 34.3338, defaultImg: '/images/hero/04-sharm.jpg', nameEn: 'Sharm El-Sheikh' },
  luxor: { lat: 25.6872, lng: 32.6396, defaultImg: '/images/hero/05-luxor.jpg', nameEn: 'Luxor' },
  aswan: { lat: 24.0889, lng: 32.8998, defaultImg: '/images/hero/07-nile.jpg', nameEn: 'Aswan' },
  alexandria: { lat: 31.2001, lng: 29.9187, defaultImg: '/images/hero/06-alexandria.jpg', nameEn: 'Alexandria' },
  sinai: { lat: 28.5391, lng: 33.9750, defaultImg: '/images/hero/08-sinai.jpg', nameEn: 'Sinai' },
  nile: { lat: 24.0889, lng: 32.8998, defaultImg: '/images/hero/07-nile.jpg', nameEn: 'Nile Cruise' },
};

interface MappedPoint {
  id: number | string;
  slug: string;
  name: string;
  nameEn: string;
  info: string;
  lat: number;
  lng: number;
  image: string;
  rawDestination: ApiDestination;
}

export default function InteractiveMap() {
  const { t, lang, dir } = useI18n();
  const [points, setPoints] = useState<MappedPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState<{ id: number | string; name: string; tagline: string; image: string } | null>(null);

  useEffect(() => {
    async function loadMapDestinations() {
      setLoading(true);
      try {
        const res = await apiService.public.destinations.index();
        if (res?.data && res.data.length > 0) {
          const mapped: MappedPoint[] = res.data.map((dest) => {
            const slugKey = dest.slug.toLowerCase().replace(/[-_]/g, '');
            const matchedKey = Object.keys(fallbackGeoCoords).find(k => slugKey.includes(k) || k.includes(slugKey)) || 'sharm';
            const fallback = fallbackGeoCoords[matchedKey] || fallbackGeoCoords.sharm;

            const lat = dest.latitude && Number(dest.latitude) !== 0 ? parseFloat(String(dest.latitude)) : fallback.lat;
            const lng = dest.longitude && Number(dest.longitude) !== 0 ? parseFloat(String(dest.longitude)) : fallback.lng;
            
            const nameEn = dest.name_translations?.en || dest.name_translations?.['en'] || fallback.nameEn || dest.name;
            const nameAr = dest.name_translations?.ar || dest.name;
            const info = dest.short_description_translations?.[lang] || dest.short_description || nameAr;

            return {
              id: dest.id,
              slug: dest.slug,
              name: nameAr,
              nameEn,
              info,
              lat,
              lng,
              image: dest.cover_url || fallback.defaultImg,
              rawDestination: dest,
            };
          });

          setPoints(mapped);
        }
      } catch (err) {
        console.warn('Failed to load destinations for interactive map');
      } finally {
        setLoading(false);
      }
    }

    loadMapDestinations();
  }, [lang]);

  const mapCenter: [number, number] = [27.0, 30.8];

  // Deduplicate points if any backend destinations share near-identical coordinates
  const displayPoints = points.filter((pt, index, self) => 
    index === self.findIndex((p) => Math.abs(p.lat - pt.lat) < 0.08 && Math.abs(p.lng - pt.lng) < 0.08)
  );

  const centerHub = displayPoints.find(p => p.slug.toLowerCase().includes('cairo') || p.slug.toLowerCase().includes('giza')) || displayPoints[0] || { lat: 29.9792, lng: 31.1342 };
  const flightPaths = displayPoints.filter(p => p.id !== centerHub.id).map(p => [
    [centerHub.lat, centerHub.lng] as [number, number],
    [p.lat, p.lng] as [number, number]
  ]);

  return (
    <section id="map" className="relative w-full overflow-hidden py-10 md:py-16">
      <style suppressHydrationWarning>{`
        .leaflet-container { background: #050D19 !important; font-family: inherit; }
        .leaflet-control-container .leaflet-control-attribution { background: rgba(5, 13, 25, 0.85) !important; color: #67E8F9; border-radius: 6px; padding: 2px 8px; border: none; font-size: 10px; }
        .leaflet-control-zoom a { background: #0A192F !important; color: #00D4FF !important; border-color: rgba(0,212,255,0.2) !important; }
        .leaflet-popup-content-wrapper { background: transparent !important; box-shadow: none !important; margin: 0; padding: 0; pointer-events: auto; }
        .leaflet-popup-tip-container { display: none !important; }
        .leaflet-popup-content { margin: 0 !important; line-height: inherit !important; width: auto !important; }

        @keyframes mapPulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(3.2); opacity: 0; }
        }
        .map-pulse-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background: rgba(0, 212, 255, 0.45);
          animation: mapPulse 2.2s cubic-bezier(0.1, 0, 0.4, 1) infinite;
        }

        .animated-poly path {
          stroke-dasharray: 6 10;
          animation: flyPath 16s linear infinite;
          filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.9));
        }
        @keyframes flyPath {
          to { stroke-dashoffset: -200; }
        }
      `}</style>

      {/* Atmospheric Background & Glows */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-[#0B1D35] to-navy" />
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-cyan/[0.04]" />

      {/* Container with distinct side margins (يمين وشمال) */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-12 lg:px-20">
        {/* Header */}
        <div className="mb-6 text-center md:mb-10">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="gradient-text text-2xl font-black tracking-tight sm:text-4xl lg:text-5xl py-1">
              {t('map.title')}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-xs font-medium text-slate-400 sm:text-sm">
              {t('map.description')}
            </p>
          </div>
        </div>

        {/* Responsive Map Container with side borders & elegant width */}
        <div className="relative h-[360px] sm:h-[450px] md:h-[500px] lg:h-[540px] w-full overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-cyan/30 bg-[#050D19] shadow-[0_0_80px_rgba(0,212,255,0.18)]">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-navy/80 backdrop-blur-md z-30">
              <div className="flex items-center gap-3 text-cyan font-bold text-sm sm:text-base">
                <Loader2 className="size-6 animate-spin" />
                <span>جاري تحميل الخريطة والوجهات...</span>
              </div>
            </div>
          ) : (
            <MapContainer
              center={mapCenter}
              zoom={5.2}
              scrollWheelZoom={false}
              className="h-full w-full z-10"
            >
              {/* Clean Smooth Dark Tile Layer with ZERO API Key Watermarks */}
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                attribution="&copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
              />

              {/* Radar Flight Path Lines */}
              {flightPaths.map((path, idx) => (
                <Polyline
                  key={idx}
                  positions={path}
                  pathOptions={{
                    color: '#00D4FF',
                    weight: 2.5,
                    opacity: 0.85,
                    className: 'animated-poly',
                  }}
                />
              ))}

              {/* Destination Pins plotting backend coordinates & English Name */}
              {displayPoints.map((pt) => {
                const customIcon = L.divIcon({
                  className: 'custom-leaflet-marker',
                  html: `
                    <div style="position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center;">
                      <div style="
                        background: rgba(10, 25, 47, 0.92);
                        border: 1.5px solid rgba(0, 212, 255, 0.6);
                        color: #00D4FF;
                        font-size: 11px;
                        font-weight: 800;
                        padding: 3px 9px;
                        border-radius: 8px;
                        white-space: nowrap;
                        backdrop-filter: blur(6px);
                        box-shadow: 0 4px 14px rgba(0,0,0,0.7);
                        margin-bottom: 5px;
                        pointer-events: auto;
                        transition: all 0.3s ease;
                      ">
                        ${pt.nameEn}
                      </div>

                      <div style="position: relative; width: 22px; height: 22px;">
                        <div class="map-pulse-ring"></div>
                        <div style="
                          width: 14px;
                          height: 14px;
                          border-radius: 50%;
                          background: #00D4FF;
                          border: 3.5px solid #050D19;
                          box-shadow: 0 0 16px #00D4FF;
                          position: absolute;
                          inset: 0;
                          margin: auto;
                          transition: transform 0.3s ease;
                        "></div>
                      </div>
                    </div>
                  `,
                  iconSize: [140, 54],
                  iconAnchor: [70, 48],
                });

                return (
                  <Marker
                    key={pt.id}
                    position={[pt.lat, pt.lng]}
                    icon={customIcon}
                    eventHandlers={{
                      click: () => {
                        setSelectedDestination({
                          id: pt.id,
                          name: lang === 'ar' ? pt.name : pt.nameEn,
                          tagline: pt.info,
                          image: pt.image,
                        });
                      },
                    }}
                  />
                );
              })}
            </MapContainer>
          )}
        </div>
      </div>

      {/* Destination Modal triggered when clicking ANY pin on the map */}
      <DestinationModal
        key={selectedDestination?.id ?? 'closed-map-modal'}
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
      />
    </section>
  );
}
