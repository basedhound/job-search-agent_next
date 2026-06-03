type ProfileInput = {
  full_name?: string | null;
  phone?: string | null;
  location?: string | null;
  current_title?: string | null;
  skills?: string[] | null;
  work_experience?: unknown[] | null;
  education?: { degree?: string } | null;
  job_titles_seeking?: string[] | null;
};

type CompletionResult = {
  percentage: number;
  missingFields: string[];
  isComplete: boolean;
};

const REQUIRED = [
  { label: 'FULL NAME', check: (p: ProfileInput) => Boolean(p.full_name?.trim()) },
  { label: 'PHONE', check: (p: ProfileInput) => Boolean(p.phone?.trim()) },
  { label: 'LOCATION', check: (p: ProfileInput) => Boolean(p.location?.trim()) },
  { label: 'JOB TITLE', check: (p: ProfileInput) => Boolean(p.current_title?.trim()) },
  { label: 'SKILLS', check: (p: ProfileInput) => Array.isArray(p.skills) && p.skills.length > 0 },
  { label: 'EXPERIENCE', check: (p: ProfileInput) => Array.isArray(p.work_experience) && (p.work_experience as unknown[]).length > 0 },
  { label: 'EDUCATION', check: (p: ProfileInput) => Boolean((p.education as { degree?: string } | null)?.degree) },
  { label: 'JOB TITLES', check: (p: ProfileInput) => Array.isArray(p.job_titles_seeking) && p.job_titles_seeking.length > 0 },
] as const;

export function calculateCompletion(profile: ProfileInput | null): CompletionResult {
  if (!profile) {
    return { percentage: 0, missingFields: REQUIRED.map((f) => f.label), isComplete: false };
  }
  const missingFields = REQUIRED.filter((f) => !f.check(profile)).map((f) => f.label);
  const percentage = Math.round(((REQUIRED.length - missingFields.length) / REQUIRED.length) * 100);
  return { percentage, missingFields, isComplete: missingFields.length === 0 };
}
