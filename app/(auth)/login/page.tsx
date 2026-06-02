'use client';

import Image from 'next/image';
import { useState } from 'react';
import { insforge } from '@/lib/insforge-client';

export default function LoginPage() {
  const [loading, setLoading] = useState<'google' | 'github' | null>(null);

  const signIn = async (provider: 'google' | 'github') => {
    setLoading(provider);
    await insforge.auth.signInWithOAuth({
      provider,
      redirectTo: `${window.location.origin}/callback`,
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--gradient-hero)' }}
    >
      <div className="w-full max-w-[400px]">
        <div
          className="rounded-[--radius-xl] border p-8"
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)',
          }}
        >
          {/* Brand */}
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/logo.png"
              alt="JobPilot"
              width={44}
              height={44}
              className="mb-4"
            />
            <h1
              className="text-[22px] font-semibold leading-tight"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Sign in to JobPilot
            </h1>
            <p
              className="text-sm mt-1.5 text-center"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Your AI-powered job hunting assistant
            </p>
          </div>

          {/* OAuth buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => signIn('google')}
              disabled={loading !== null}
              className="flex items-center justify-center gap-2.5 w-full py-2.5 px-4 rounded-[--radius-md] border text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'var(--color-surface-secondary)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'var(--color-surface)')
              }
            >
              {loading === 'google' ? (
                <span style={{ color: 'var(--color-text-muted)' }}>Redirecting…</span>
              ) : (
                <>
                  <GoogleIcon />
                  Continue with Google
                </>
              )}
            </button>

            <button
              onClick={() => signIn('github')}
              disabled={loading !== null}
              className="flex items-center justify-center gap-2.5 w-full py-2.5 px-4 rounded-[--radius-md] text-sm font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style={{ background: 'var(--color-overlay-dark)', color: '#ffffff' }}
            >
              {loading === 'github' ? (
                <span>Redirecting…</span>
              ) : (
                <>
                  <GitHubIcon />
                  Continue with GitHub
                </>
              )}
            </button>
          </div>

          <p
            className="mt-6 text-xs text-center"
            style={{ color: 'var(--color-text-muted)' }}
          >
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12Z" />
    </svg>
  );
}
