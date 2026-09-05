import ArticleDetailsClient from "./_client";

export function generateStaticParams() {
  const ids = Array.from({ length: 100 }, (_, i) => String(i + 1));
  const expIds = Array.from({ length: 100 }, (_, i) => `exp-${i + 1}`);
  const commonSlugs = ['view', 'default', 'safari-experience', 'diving-experience', 'nile-cruise'];
  const allParams = Array.from(new Set([...ids, ...expIds, ...commonSlugs]));
  return allParams.map((id) => ({ id }));
}

export default function ArticleDetailsPage() {
  return <ArticleDetailsClient />;
}
