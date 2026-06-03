'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";

export function Navbar() {
  const pathname = usePathname();

  const navClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      pathname === href || pathname.startsWith(href + '/')
        ? 'text-accent'
        : 'text-text-dark hover:text-accent'
    }`;

  return (
    <header className="sticky top-0 z-50 h-16 bg-surface border-b border-border">
      <div className="max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="JobPilot"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <nav className="flex items-center gap-8">
          <Link href="/dashboard" className={navClass('/dashboard')}>
            Dashboard
          </Link>
          <Link href="/find-jobs" className={navClass('/find-jobs')}>
            Find Jobs
          </Link>
          <Link href="/profile" className={navClass('/profile')}>
            Profile
          </Link>
        </nav>

        <Link
          href="/login"
          className="px-4 py-2 rounded-lg bg-overlay text-white text-sm font-medium hover:opacity-90 transition-opacity"
          onClick={() => posthog.capture('navbar_cta_clicked', { cta_label: 'Start for free' })}
        >
          Start for free
        </Link>
      </div>
    </header>
  );
}
