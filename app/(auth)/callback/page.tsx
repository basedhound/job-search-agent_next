'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { insforge } from '@/lib/insforge-client';

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('insforge_code');
      const oauthError = params.get('error');

      if (oauthError || !code) {
        router.replace('/login');
        return;
      }

      const { data, error } = await insforge.auth.exchangeOAuthCode(code);

      if (error || !data?.accessToken) {
        router.replace('/login');
        return;
      }

      const maxAge = 60 * 60 * 24 * 7; // 7 days
      document.cookie = `insforge_token=${data.accessToken}; path=/; SameSite=Lax; max-age=${maxAge}`;

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
