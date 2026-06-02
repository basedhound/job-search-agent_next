import Image from "next/image";

const manageFeatures = [
  {
    title: "Find jobs that actually fit",
    description:
      "Filter by title and location, paste a job link. Get matched roles you can quickly scan.",
  },
  {
    title: "Tailor resumes faster",
    description:
      "Create role-specific resumes without starting from scratch. Adjust voice and generate in seconds.",
  },
  {
    title: "Keep track of every application",
    description:
      "Keep a clear view of who you've found, queued, applied. Your activity and progress all stay in one simple place.",
  },
];

const confidenceFeatures = [
  {
    title: "Understand your match score",
    description:
      "See how your profile lines up with each role before you apply. Get a clear breakdown of what fits and what's missing.",
  },
  {
    title: "Generate cover letters quickly",
    description:
      "Write cover letters that feel focused and specific to each role. You can edit AI-generated drafts anytime.",
  },
  {
    title: "Focus on the right roles",
    description:
      "Filter out the fit jobs and skip the ones that actually matter. Spend less time waiting and more time applying.",
  },
];

export function HowItWorks() {
  return (
    <>
      <section className="py-24 px-8 bg-surface">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-3xl font-semibold text-text-primary leading-snug">
              Manage Your Job Search With Ease
            </h2>
            <div className="mt-10 flex flex-col gap-8">
              {manageFeatures.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-accent" />
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border overflow-hidden shadow-sm">
            <Image
              src="/images/jobs-lists.png"
              alt="Jobs list showing match scores and sources"
              width={700}
              height={560}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      <section className="py-24 px-8 bg-background">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="rounded-2xl overflow-hidden shadow-sm">
            <Image
              src="/images/agnet-log.png"
              alt="Agent activity log"
              width={700}
              height={500}
              className="w-full h-auto"
            />
          </div>

          <div>
            <h2 className="text-3xl font-semibold text-text-primary leading-snug">
              Apply With More Confidence, Every Time
            </h2>
            <div className="mt-10 flex flex-col gap-8">
              {confidenceFeatures.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-accent" />
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
