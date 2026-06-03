'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { insforge } from '@/lib/insforge-client';
import posthog from 'posthog-js';

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const oauthError = new URLSearchParams(window.location.search).get('error');
      if (oauthError) {
        router.replace('/login');
        return;
      }

      // SDK auto-detected insforge_code at module init time and is exchanging it
      // asynchronously. getCurrentUser() awaits authCallbackHandled before returning.
      const { data, error } = await insforge.auth.getCurrentUser();

      if (error || !data?.user) {
        router.replace('/login');
        return;
      }

      const user = data.user;
      posthog.identify(user.id, {
        email: user.email,
      });
      posthog.capture('user_signed_in', {
        provider: user.providers?.[0],
      });

      const token = (insforge.getHttpClient() as Record<string, unknown>).userToken as
        | string
        | undefined;

      if (token) {
        const maxAge = 60 * 60 * 24 * 7;
        document.cookie = `insforge_token=${token}; path=/; SameSite=Lax; max-age=${maxAge}`;
      }

      router.replace('/dashboard');
    };

    handleCallback();
  }, [router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--gradient-hero)' }}
    >
      <div className="flex flex-col items-center gap-3">
        <Spinner />
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
          Signing you in…
        </p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Loading"
    >
      <circle cx="12" cy="12" r="10" stroke="var(--color-border)" strokeWidth="3" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="var(--color-accent)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
