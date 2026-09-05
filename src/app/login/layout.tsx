'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

/**
 * If the user is already authenticated, redirect them away from /login:
 *  - admin/manager  → /admin
 *  - regular user   → /
 */
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      const isAdmin = user.role === 'op_tier1' || user.role === 'op_tier2';
      router.replace(isAdmin ? '/admin' : '/');
    }
  }, [isAuthenticated, user, router]);

  return <>{children}</>;
}
