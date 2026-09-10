import { Suspense } from "react";
import OffersClient from "./_client";

export const dynamicParams = false;

export function generateStaticParams() {
  const categories = [
    "all",
    "trips",
    "hotels",
    "honeymoon",
    "experiences",
    "tours",
    "diving-marine",
    "safari",
    "sea-trips",
    "nile-cruises",
    "luxor-tours",
    "day-trips",
    "excursions",
    "activities",
    "resorts",
    "villas",
    "apartments",
    "transfers",
    "packages",
    "dahab",
    "hurghada",
    "sharm",
    "luxor",
    "aswan",
    "cairo",
    "alexandria",
    "sinai",
    "nile",
    "view",
    "search",
    "default",
  ];

  const numericIds = Array.from({ length: 100 }, (_, i) => String(i + 1));
  const catIds = Array.from({ length: 100 }, (_, i) => `cat-${i + 1}`);
  const categoryIds = Array.from(
    { length: 100 },
    (_, i) => `category-${i + 1}`,
  );

  const allSlugs = Array.from(
    new Set([...categories, ...numericIds, ...catIds, ...categoryIds]),
  );

  return allSlugs.map((category) => ({ category }));
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-navy flex items-center justify-center text-cyan">
          Loading...
        </div>
      }
    >
      <OffersClient />
    </Suspense>
  );
}
