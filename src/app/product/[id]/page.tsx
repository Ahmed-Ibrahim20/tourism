import { Suspense } from 'react';
import ProductDetailPageClient from './_client';

export const dynamicParams = true;

export function generateStaticParams() {
  const ids = Array.from({ length: 100 }, (_, i) => String(i + 1));
  const catIds = Array.from({ length: 100 }, (_, i) => `cat-${i + 1}`);
  const pkgIds = Array.from({ length: 100 }, (_, i) => `pkg-${i + 1}`);
  const commonSlugs = ['view', 'default', 'aliquam-vel-dolor-ve', 'dahab-tour', 'sharm-resort', 'honeymoon-package'];
  
  const allParams = Array.from(new Set([...ids, ...catIds, ...pkgIds, ...commonSlugs]));
  return allParams.map((id) => ({ id }));
}

export default function Page({ params }: { params: any }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy flex items-center justify-center text-cyan">Loading...</div>}>
      <ProductDetailPageClient params={params} />
    </Suspense>
  );
}

