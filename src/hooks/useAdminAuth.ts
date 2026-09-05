'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { apiService } from '@/services/api';

type VerifyStatus = 'idle' | 'verifying' | 'verified' | 'unauthorized' | 'forbidden';

interface UseAdminAuthReturn {
  isVerified: boolean;
  isLoading: boolean;
  status: VerifyStatus;
}

/**
 * Verifies that:
 *  1. There is a token in the Zustand store (client-side check).
 *  2. The token is still valid on the backend (GET /auth/profile).
 *  3. The user has an elevated role (op_tier1 or op_tier2).
 *
 * On failure, clears the auth store and redirects to /login.
 */
export function useAdminAuth(): UseAdminAuthReturn {
  const router = useRouter();
  const { isAuthenticated, user, token, logout } = useAuth();
  const [status, setStatus] = useState<VerifyStatus>('idle');

  const ADMIN_ROLES = ['op_tier1', 'op_tier2'] as const;

  const verify = useCallback(async () => {
    // ── Fast client-side check ──────────────────────────────────────────
    if (!isAuthenticated || !token) {
      setStatus('unauthorized');
      router.replace('/login');
      return;
    }

    // ── Role check on cached user ────────────────────────────────────────
    if (user && !ADMIN_ROLES.includes(user.role as (typeof ADMIN_ROLES)[number])) {
      setStatus('forbidden');
      router.replace('/');
      return;
    }

    // ── Server-side token verification ──────────────────────────────────
    setStatus('verifying');
    try {
      const response = await apiService.auth.getProfile();

      if (!response.success || !response.data) {
        throw new Error('Profile fetch failed');
      }

      const freshUser = response.data;

      // Re-check role from the authoritative backend response
      if (!ADMIN_ROLES.includes(freshUser.role as (typeof ADMIN_ROLES)[number])) {
        logout();
        setStatus('forbidden');
        router.replace('/');
        return;
      }

      setStatus('verified');
    } catch {
      // 401 / 403 / network errors all land here
      logout();
      setStatus('unauthorized');
      router.replace('/login');
    }
  }, [isAuthenticated, token, user, logout, router]);

  useEffect(() => {
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return {
    isVerified: status === 'verified',
    isLoading: status === 'idle' || status === 'verifying',
    status,
  };
}
