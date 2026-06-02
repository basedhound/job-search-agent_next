import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-overlay py-7 px-6">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="JobPilot"
            width={110}
            height={28}
            className="h-7 w-auto"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-sm text-text-muted hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="text-sm text-text-muted hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-sm text-text-muted hover:text-white transition-colors"
          >
            Terms & Conditions
          </Link>
        </nav>
      </div>
    </footer>
  );
}
