import { Suspense } from 'react';
import BookingDetailsClient from './_client';

export const dynamicParams = false;

export function generateStaticParams() {
  const numericIds = Array.from({ length: 100 }, (_, i) => String(i + 1));
  const bkgIds = Array.from({ length: 100 }, (_, i) => `BKG-${i + 1}`);
  const commonIds = ['view', 'default', 'BKG-100001', 'BKG-100002'];
  const allIds = Array.from(new Set([...numericIds, ...bkgIds, ...commonIds]));
  return allIds.map((id) => ({ id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams?.id || 'default';

  return (
    <Suspense fallback={<div className="min-h-screen bg-navy flex items-center justify-center text-cyan">Loading...</div>}>
      <BookingDetailsClient id={id} />
    </Suspense>
  );
}

