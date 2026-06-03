'use client';

import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";

export function Hero() {
  return (
    <section className="py-24 px-8" style={{ background: "var(--gradient-hero)" }}>
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-text-primary leading-tight">
            Job hunting is hard.
            <br />
            Your tools shouldn&apos;t be.
          </h1>
          <p className="mt-5 text-lg text-text-secondary max-w-lg mx-auto leading-relaxed">
            Find better job matches, tailor your resume for every role, and keep
            everything organized in one place.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 px-6 py-3 rounded-lg bg-overlay text-white text-sm font-medium hover:opacity-90 transition-opacity"
              onClick={() => posthog.capture('cta_clicked', { cta_label: 'Get Started', cta_section: 'hero' })}
            >
              Get Started →
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-surface border border-border text-text-primary text-sm font-medium hover:bg-surface-secondary transition-colors"
              onClick={() => posthog.capture('cta_clicked', { cta_label: 'Find Your First Match', cta_section: 'hero' })}
            >
              Find Your First Match
            </Link>
          </div>
        </div>

        <div className="mt-16 max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-border-light">
            <Image
              src="/images/dashboard-demo.png"
              alt="JobPilot Dashboard Preview"
              width={1200}
              height={750}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
