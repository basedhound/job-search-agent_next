import Image from "next/image";
import Link from "next/link";

export function Features() {
  return (
    <>
      <section className="py-24 px-8 bg-surface">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold text-accent uppercase tracking-widest">
            Success Stories
          </p>
          <blockquote className="mt-6 text-2xl font-medium text-text-primary leading-relaxed">
            &ldquo;I used to spend my evenings copy-pasting resumes. Now I open
            my dashboard to see interviews waiting. It feels like cheating. Had
            3 offers on the table simultaneously.&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="/images/user-icon.png"
                alt="Tom Wilson"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-text-primary">
                Tom Wilson
              </p>
              <p className="text-sm text-text-secondary">Junior Developer</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-8" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-text-primary leading-tight">
            Your next job search can feel a lot less overwhelming
          </h2>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 px-6 py-3 rounded-lg bg-overlay text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Get Started →
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-surface border border-border text-text-primary text-sm font-medium hover:bg-surface-secondary transition-colors"
            >
              Find Your First Match
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
