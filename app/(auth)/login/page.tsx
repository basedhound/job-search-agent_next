'use client';

import Image from 'next/image';
import { useState } from 'react';
import { insforge } from '@/lib/insforge-client';

export default function LoginPage() {
  const [loading, setLoading] = useState<'google' | 'github' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (provider: 'google' | 'github') => {
    setLoading(provider);
    setError(null);
    try {
      const { error: oauthError } = await insforge.auth.signInWithOAuth({
        provider,
        redirectTo: `${window.location.origin}/callback`,
      });
      if (oauthError) {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'var(--gradient-hero)' }}
    >
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0px 8px 24px rgba(0,0,0,0.08), 0px 2px 6px rgba(0,0,0,0.04)',
            padding: '40px 36px 36px',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
            <Image
              src="/logo.png"
              alt="JobPilot"
              width={130}
              height={44}
              priority
            />
          </div>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1
              style={{
                fontSize: '20px',
                fontWeight: 600,
                lineHeight: '28px',
                color: 'var(--color-text-primary)',
                margin: 0,
              }}
            >
              Sign in to your account
            </h1>
            <p
              style={{
                fontSize: '14px',
                lineHeight: '20px',
                color: 'var(--color-text-muted)',
                marginTop: '6px',
              }}
            >
              Choose a provider to continue
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => signIn('google')}
              disabled={loading !== null}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '11px 16px',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border-muted)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--color-text-primary)',
                cursor: loading !== null ? 'not-allowed' : 'pointer',
                opacity: loading !== null ? 0.5 : 1,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                if (loading === null) e.currentTarget.style.background = 'var(--color-surface-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-surface)';
              }}
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
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '11px 16px',
                background: 'var(--color-overlay-dark)',
                border: '1px solid transparent',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--color-accent-foreground)',
                cursor: loading !== null ? 'not-allowed' : 'pointer',
                opacity: loading !== null ? 0.5 : 1,
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => {
                if (loading === null) e.currentTarget.style.opacity = '0.88';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = loading !== null ? '0.5' : '1';
              }}
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

          {/* Error */}
          {error && (
            <p
              style={{
                marginTop: '14px',
                fontSize: '13px',
                textAlign: 'center',
                color: 'var(--color-error)',
              }}
            >
              {error}
            </p>
          )}

          {/* Divider */}
          <div
            style={{
              marginTop: '24px',
              borderTop: '1px solid var(--color-border)',
            }}
          />

          {/* Legal */}
          <p
            style={{
              marginTop: '20px',
              fontSize: '12px',
              lineHeight: '18px',
              textAlign: 'center',
              color: 'var(--color-text-muted)',
            }}
          >
            By signing in, you agree to our{' '}
            <span style={{ color: 'var(--color-text-secondary)' }}>Terms of Service</span>
            {' '}and{' '}
            <span style={{ color: 'var(--color-text-secondary)' }}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12Z" />
    </svg>
  );
}
