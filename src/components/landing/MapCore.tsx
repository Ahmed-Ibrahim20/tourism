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

interface MappedPoint {
  id: number | string;
  slug: string;
  name: string;
  nameEn: string;
  info: string;
  infoEn: string;
  lat: number;
  lng: number;
  image: string;
  rawDestination?: ApiDestination;
}

/* ── Full Master List of Egypt Destinations offered across Dahab Dream Tour ── */
const MASTER_MAP_DESTINATIONS: MappedPoint[] = [
  {
    id: 'cairo',
    slug: 'cairo',
    name: 'القاهرة',
    nameEn: 'Cairo',
    info: 'عاصمة التاريخ والثقافة ومتحف الكنوز الفرعونية.',
    infoEn: 'Capital of history, culture, and Pharaonic treasures.',
    lat: 30.0444,
    lng: 31.2357,
    image: '/images/cairo-skyline.jpg',
  },
  {
    id: 'giza',
    slug: 'giza',
    name: 'أهرامات الجيزة',
    nameEn: 'Giza Pyramids',
    info: 'عظمة مصر القديمة في مشهد أيقوني يجمع الأهرامات والصحراء.',
    infoEn: 'The grandeur of Ancient Egypt in an iconic desert landscape.',
    lat: 29.9792,
    lng: 31.1342,
    image: '/images/giza-pyramids.jpg',
  },
  {
    id: 'dahab',
    slug: 'dahab',
    name: 'دهب',
    nameEn: 'Dahab',
    info: 'مياه تركوازية صافية وجبال سيناء وأجواء هادئة لا تُنسى.',
    infoEn: 'Turquoise waters, Sinai mountains, and unforgettable laid-back vibes.',
    lat: 28.5015,
    lng: 34.5097,
    image: '/images/dahab.png',
  },
  {
    id: 'sharm',
    slug: 'sharm',
    name: 'شرم الشيخ',
    nameEn: 'Sharm El-Sheikh',
    info: 'شواطئ ساحرة ومياه زرقاء صافية في واحدة من أجمل وجهات البحر الأحمر.',
    infoEn: 'Charming beaches and crystal blue waters in the Red Sea.',
    lat: 27.9158,
    lng: 34.3338,
    image: '/images/sharm.png',
  },
  {
    id: 'hurghada',
    slug: 'hurghada',
    name: 'الغردقة',
    nameEn: 'Hurghada',
    info: 'بحر فيروزي وشعاب مرجانية خلابة لعشاق البحر والمغامرة.',
    infoEn: 'Turquoise sea and magnificent coral reefs for adventure lovers.',
    lat: 27.2579,
    lng: 33.8116,
    image: '/images/hurghada.png',
  },
  {
    id: 'elgouna',
    slug: 'elgouna',
    name: 'الجونة',
    nameEn: 'El Gouna',
    info: 'منتجعات فاخرة وقنوات مائية ساحرة للراحة والاسترخاء.',
    infoEn: 'Luxury resorts and enchanted lagoons for relaxation.',
    lat: 27.3942,
    lng: 33.6782,
    image: '/images/hotel-luxury.png',
  },
  {
    id: 'luxor',
    slug: 'luxor',
    name: 'الأقصر',
    nameEn: 'Luxor',
    info: 'رحلة عبر التاريخ بين المعابد والآثار الفرعونية العظيمة.',
    infoEn: 'A journey through history among ancient temples and monuments.',
    lat: 25.6872,
    lng: 32.6396,
    image: '/images/luxor-temples.jpg',
  },
  {
    id: 'aswan',
    slug: 'aswan',
    name: 'أسوان',
    nameEn: 'Aswan',
    info: 'جمال النيل والطبيعة الهادئة وسحر الثقافة النوبية الأصيلة.',
    infoEn: 'Nile beauty, tranquil nature, and authentic Nubian culture.',
    lat: 24.0889,
    lng: 32.8998,
    image: '/images/abu-simbel.jpg',
  },
  {
    id: 'nile',
    slug: 'nile',
    name: 'رحلة النيل الملكية',
    nameEn: 'Nile Cruise',
    info: 'إبحار أسطوري فاخر بين معابد الأقصر وأسوان عند المغيب.',
    infoEn: 'Legendary luxury sailing between Luxor and Aswan temples at sunset.',
    lat: 25.0000,
    lng: 32.7000,
    image: '/images/nile-cruise.jpg',
  },
  {
    id: 'alexandria',
    slug: 'alexandria',
    name: 'الإسكندرية',
    nameEn: 'Alexandria',
    info: 'عروس البحر المتوسط وتاريخ عريق يجمع الثقافات.',
    infoEn: 'Pearl of the Mediterranean with rich history blending cultures.',
    lat: 31.2001,
    lng: 29.9187,
    image: '/images/alexandria-library.jpg',
  },
  {
    id: 'siwa',
    slug: 'siwa',
    name: 'واحة سيوة',
    nameEn: 'Siwa Oasis',
    info: 'واحة ساحرة تجمع بين النخيل والبحيرات والينابيع وسط الصحراء.',
    infoEn: 'Enchanting oasis blending palms, salt lakes, and desert springs.',
    lat: 29.2032,
    lng: 25.5195,
    image: '/images/hero/01-giza.jpg',
  },
  {
    id: 'whitedesert',
    slug: 'whitedesert',
    name: 'الصحراء البيضاء',
    nameEn: 'White Desert',
    info: 'عالم من الصخور البيضاء الغريبة وسط واحدة من أروع صحارى مصر.',
    infoEn: 'A surreal landscape of white chalk rock formations in the desert.',
    lat: 27.0607,
    lng: 27.9700,
    image: '/images/experience-desert.png',
  },
  {
    id: 'sinai',
    slug: 'sinai',
    name: 'جبل سيناء',
    nameEn: 'Mount Sinai',
    info: 'قمم مقدسة وشروق شمس ساحر يغير القلوب.',
    infoEn: 'Sacred peaks and breathtaking sunrise over majestic mountain ranges.',
    lat: 28.5391,
    lng: 33.9750,
    image: '/images/hero/08-sinai.jpg',
  },
];

export default function InteractiveMap() {
  const { t, lang, dir } = useI18n();
  const [points, setPoints] = useState<MappedPoint[]>(MASTER_MAP_DESTINATIONS);
  const [loading, setLoading] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<{ id: number | string; name: string; tagline: string; image: string } | null>(null);

  useEffect(() => {
    async function loadMapDestinations() {
      try {
        const res = await apiService.public.destinations.index();
        if (res?.data && res.data.length > 0) {
          // Merge API data into master destination list
          const updatedMaster = MASTER_MAP_DESTINATIONS.map((masterItem) => {
            const match = res.data.find((d) => {
              const slugKey = d.slug.toLowerCase().replace(/[-_]/g, '');
              const masterSlug = masterItem.slug.toLowerCase().replace(/[-_]/g, '');
              return slugKey.includes(masterSlug) || masterSlug.includes(slugKey);
            });

            if (match) {
              const lat = match.latitude && Number(match.latitude) !== 0 ? parseFloat(String(match.latitude)) : masterItem.lat;
              const lng = match.longitude && Number(match.longitude) !== 0 ? parseFloat(String(match.longitude)) : masterItem.lng;
              const nameAr = match.name_translations?.ar || match.name || masterItem.name;
              const nameEn = match.name_translations?.en || match.name_translations?.['en'] || masterItem.nameEn;
              const info = match.short_description_translations?.[lang] || match.short_description || masterItem.info;

              return {
                ...masterItem,
                id: match.id,
                name: nameAr,
                nameEn,
                info,
                lat,
                lng,
                image: match.cover_url || masterItem.image,
                rawDestination: match,
              };
            }

            return masterItem;
          });

          // Also add any backend destinations that weren't in master list
          res.data.forEach((d) => {
            const alreadyInMaster = updatedMaster.some((m) => {
              const slugKey = d.slug.toLowerCase().replace(/[-_]/g, '');
              const masterSlug = m.slug.toLowerCase().replace(/[-_]/g, '');
              return slugKey.includes(masterSlug) || masterSlug.includes(slugKey);
            });

            if (!alreadyInMaster && d.latitude && d.longitude) {
              updatedMaster.push({
                id: d.id,
                slug: d.slug,
                name: d.name_translations?.ar || d.name,
                nameEn: d.name_translations?.en || d.name_translations?.['en'] || d.name,
                info: d.short_description_translations?.[lang] || d.short_description || d.name,
                lat: parseFloat(String(d.latitude)),
                lng: parseFloat(String(d.longitude)),
                image: d.cover_url || '/images/hero/01-giza.jpg',
                rawDestination: d,
              });
            }
          });

          setPoints(updatedMaster);
        }
      } catch (err) {
        // Fallback to MASTER_MAP_DESTINATIONS on API failure
      }
    }

    loadMapDestinations();
  }, [lang]);

  const mapCenter: [number, number] = [27.6, 30.5];

  // Distinct display points
  const displayPoints = points.filter((pt, index, self) => 
    index === self.findIndex((p) => Math.abs(p.lat - pt.lat) < 0.01 && Math.abs(p.lng - pt.lng) < 0.01)
  );

  const centerHub = displayPoints.find(p => p.slug.toLowerCase().includes('cairo') || p.slug.toLowerCase().includes('giza')) || displayPoints[0];
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

      {/* Container with distinct side margins */}
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

        {/* Responsive Map Container */}
        <div className="relative h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px] w-full overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-cyan/30 bg-[#050D19] shadow-[0_0_80px_rgba(0,212,255,0.18)]">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-navy/80 backdrop-blur-md z-30">
                  <div className="flex items-center gap-3 text-cyan font-bold text-sm sm:text-base">
                    <Loader2 className="size-6 animate-spin" />
                    <span>{lang === 'ar' ? 'جاري تحميل الخريطة والوجهات...' : 'Loading map & destinations...'}</span>
                  </div>
                </div>
              ) : (
                <MapContainer
                  center={mapCenter}
                  zoom={5.8}
                  scrollWheelZoom={false}
                  className="h-full w-full z-10"
                >
                  {/* Clean Smooth Dark Tile Layer */}
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

                  {/* Destination Pins plotting coordinates & localized names */}
                  {displayPoints.map((pt) => {
                    const labelText = lang === 'ar' ? pt.name : pt.nameEn;

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
                            ${labelText}
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
                              tagline: lang === 'ar' ? pt.info : (pt.infoEn || pt.info),
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
