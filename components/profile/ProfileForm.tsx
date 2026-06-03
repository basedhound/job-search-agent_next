'use client';

import { useState, KeyboardEvent } from 'react';
import { saveProfile, type WorkExperience } from '@/actions/profile';

type Education = {
  degree?: string;
  fieldOfStudy?: string;
  institution?: string;
  graduationYear?: string;
};

type ProfileInitialData = {
  full_name?: string | null;
  phone?: string | null;
  location?: string | null;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  work_authorization?: string | null;
  current_title?: string | null;
  experience_level?: string | null;
  years_experience?: number | null;
  skills?: string[] | null;
  industries?: string[] | null;
  work_experience?: WorkExperience[] | null;
  education?: Education | null;
  job_titles_seeking?: string[] | null;
  remote_preference?: string | null;
  salary_expectation?: string | null;
  preferred_locations?: string[] | null;
  cover_letter_tone?: string | null;
};

interface Props {
  initialData?: Record<string, unknown> | null;
  userEmail: string;
}

const inputClass =
  'w-full bg-surface border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors';

const selectClass =
  'w-full bg-surface border border-border px-3 py-2 text-sm text-text-primary outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors appearance-none cursor-pointer';

const labelClass = 'block text-xs font-medium uppercase tracking-wide text-text-secondary mb-1.5';

const sectionHeadingClass = 'text-sm font-semibold text-text-primary mb-4';

const cardStyle = {
  borderRadius: 'var(--radius-xl)',
  padding: '24px',
  boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)',
};

const inputStyle = { borderRadius: 'var(--radius-md)' };

const defaultWorkExperience: WorkExperience = {
  id: '1',
  companyName: '',
  jobTitle: '',
  startDate: '',
  endDate: '',
  currentlyWorking: false,
  responsibilities: '',
};

export function ProfileForm({ initialData: rawData, userEmail }: Props) {
  const d = rawData as ProfileInitialData | null;
  const edu = d?.education as Education | null;

  const [fullName, setFullName] = useState(d?.full_name ?? '');
  const [phone, setPhone] = useState(d?.phone ?? '');
  const [location, setLocation] = useState(d?.location ?? '');
  const [linkedInUrl, setLinkedInUrl] = useState(d?.linkedin_url ?? '');
  const [portfolioUrl, setPortfolioUrl] = useState(d?.portfolio_url ?? '');
  const [workAuthorization, setWorkAuthorization] = useState(d?.work_authorization ?? 'citizen');

  const [currentTitle, setCurrentTitle] = useState(d?.current_title ?? '');
  const [experienceLevel, setExperienceLevel] = useState(d?.experience_level ?? 'junior');
  const [yearsExperience, setYearsExperience] = useState(
    d?.years_experience != null ? String(d.years_experience) : '',
  );
  const [skills, setSkills] = useState<string[]>(d?.skills ?? []);
  const [skillInput, setSkillInput] = useState('');
  const [industries, setIndustries] = useState<string[]>(d?.industries ?? []);
  const [industryInput, setIndustryInput] = useState('');

  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>(
    d?.work_experience?.length ? (d.work_experience as WorkExperience[]) : [defaultWorkExperience],
  );

  const [highestDegree, setHighestDegree] = useState(edu?.degree ?? 'high_school');
  const [fieldOfStudy, setFieldOfStudy] = useState(edu?.fieldOfStudy ?? '');
  const [institution, setInstitution] = useState(edu?.institution ?? '');
  const [graduationYear, setGraduationYear] = useState(edu?.graduationYear ?? '');

  const [jobTitlesSeeking, setJobTitlesSeeking] = useState(
    d?.job_titles_seeking?.join(', ') ?? '',
  );
  const [remotePreference, setRemotePreference] = useState(d?.remote_preference ?? 'any');
  const [salaryExpectation, setSalaryExpectation] = useState(d?.salary_expectation ?? '');
  const [preferredLocations, setPreferredLocations] = useState(
    d?.preferred_locations?.join(', ') ?? '',
  );
  const [coverLetterTone, setCoverLetterTone] = useState(d?.cover_letter_tone ?? 'formal');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) setSkills([...skills, trimmed]);
    setSkillInput('');
  };

  const removeSkill = (skill: string) => setSkills(skills.filter((s) => s !== skill));

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
  };

  const addIndustry = () => {
    const trimmed = industryInput.trim();
    if (trimmed && !industries.includes(trimmed)) setIndustries([...industries, trimmed]);
    setIndustryInput('');
  };

  const removeIndustry = (industry: string) =>
    setIndustries(industries.filter((i) => i !== industry));

  const handleIndustryKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); addIndustry(); }
  };

  const addWorkExperience = () => {
    setWorkExperiences([
      ...workExperiences,
      {
        id: Date.now().toString(),
        companyName: '',
        jobTitle: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        responsibilities: '',
      },
    ]);
  };

  const removeWorkExperience = (id: string) =>
    setWorkExperiences(workExperiences.filter((w) => w.id !== id));

  const updateWorkExperience = (
    id: string,
    field: keyof WorkExperience,
    value: string | boolean,
  ) => {
    setWorkExperiences(
      workExperiences.map((w) => (w.id === id ? { ...w, [field]: value } : w)),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const result = await saveProfile({
      fullName,
      phone,
      location,
      linkedInUrl,
      portfolioUrl,
      workAuthorization,
      currentTitle,
      experienceLevel,
      yearsExperience,
      skills,
      industries,
      workExperiences,
      highestDegree,
      fieldOfStudy,
      institution,
      graduationYear,
      jobTitlesSeeking,
      remotePreference,
      salaryExpectation,
      preferredLocations,
      coverLetterTone,
    });

    setIsSaving(false);

    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setSaveError(result.error ?? 'Failed to save profile');
    }
  };

  return (
    <div className="bg-surface border border-border" style={cardStyle}>
      <h2 className="text-base font-semibold text-text-primary mb-1">Profile Information</h2>
      <p className="text-sm text-text-secondary mb-6">
        Your profile centrally represents you in agent interactions.
      </p>

      {/* Personal Info */}
      <section className="mb-6">
        <h3 className={sectionHeadingClass}>Personal Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={userEmail}
              disabled
              className={`${inputClass} opacity-50 cursor-not-allowed`}
              style={{ ...inputStyle, background: 'var(--color-surface-secondary)' }}
            />
          </div>
          <div>
            <label className={labelClass}>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="City, Country"
            />
          </div>
          <div>
            <label className={labelClass}>LinkedIn URL</label>
            <input
              type="url"
              value={linkedInUrl}
              onChange={(e) => setLinkedInUrl(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="https://linkedin.com/in/you"
            />
          </div>
          <div>
            <label className={labelClass}>Portfolio / GitHub</label>
            <input
              type="url"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="https://github.com/you"
            />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Work Authorization</label>
            <div className="relative">
              <select
                value={workAuthorization}
                onChange={(e) => setWorkAuthorization(e.target.value)}
                className={selectClass}
                style={inputStyle}
              >
                <option value="citizen">Citizen</option>
                <option value="permanent_resident">Permanent Resident</option>
                <option value="visa_required">Visa Required</option>
              </select>
              <ChevronDownIcon />
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border mb-6" />

      {/* Professional Info */}
      <section className="mb-6">
        <h3 className={sectionHeadingClass}>Professional Info</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Current / Recent Job Title</label>
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="e.g. Frontend Engineer"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Experience Level</label>
              <div className="relative">
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className={selectClass}
                  style={inputStyle}
                >
                  <option value="junior">Junior</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                </select>
                <ChevronDownIcon />
              </div>
            </div>
            <div>
              <label className={labelClass}>Years of Experience</label>
              <input
                type="number"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                className={inputClass}
                style={inputStyle}
                placeholder="e.g. 4"
                min="0"
                max="50"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Skills</label>
            <div
              className="flex flex-wrap gap-2 p-2 border border-border min-h-10.5"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1 text-xs font-medium px-2.5 py-1"
                  style={{
                    background: 'var(--color-accent-light)',
                    color: 'var(--color-accent)',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-0.5 hover:opacity-70 transition-opacity"
                    aria-label={`Remove ${skill}`}
                  >
                    <XSmallIcon />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                className="flex-1 min-w-30 text-sm text-text-primary placeholder:text-text-muted outline-none bg-transparent px-1"
                placeholder={skills.length === 0 ? 'e.g. React, TypeScript...' : ''}
              />
            </div>
            <div className="flex justify-end mt-1.5">
              <button
                type="button"
                onClick={addSkill}
                className="text-xs font-medium text-accent hover:opacity-80 transition-opacity px-3 py-1.5 border border-accent"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Industries Worked In <span className="normal-case">(Optional)</span>
            </label>
            <div
              className="flex flex-wrap gap-2 p-2 border border-border min-h-10.5"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              {industries.map((industry) => (
                <span
                  key={industry}
                  className="flex items-center gap-1 text-xs font-medium px-2.5 py-1"
                  style={{
                    background: 'var(--color-surface-secondary)',
                    color: 'var(--color-text-secondary)',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {industry}
                  <button
                    type="button"
                    onClick={() => removeIndustry(industry)}
                    className="ml-0.5 hover:opacity-70 transition-opacity"
                    aria-label={`Remove ${industry}`}
                  >
                    <XSmallIcon />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={industryInput}
                onChange={(e) => setIndustryInput(e.target.value)}
                onKeyDown={handleIndustryKeyDown}
                className="flex-1 min-w-30 text-sm text-text-primary placeholder:text-text-muted outline-none bg-transparent px-1"
                placeholder={industries.length === 0 ? 'e.g. FinTech, Healthcare...' : ''}
              />
            </div>
            <div className="flex justify-end mt-1.5">
              <button
                type="button"
                onClick={addIndustry}
                className="text-xs font-medium text-accent hover:opacity-80 transition-opacity px-3 py-1.5 border border-accent"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border mb-6" />

      {/* Work Experience */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className={sectionHeadingClass} style={{ marginBottom: 0 }}>
            Work Experience
          </h3>
          <button
            type="button"
            onClick={addWorkExperience}
            className="text-sm font-medium text-accent hover:opacity-80 transition-opacity"
          >
            + Add role
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {workExperiences.map((exp, index) => (
            <div
              key={exp.id}
              className="border border-border p-4"
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                  Role {index + 1}
                </span>
                {workExperiences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeWorkExperience(exp.id)}
                    className="text-xs text-error hover:opacity-80 transition-opacity"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Company Name</label>
                  <input
                    type="text"
                    value={exp.companyName}
                    onChange={(e) => updateWorkExperience(exp.id, 'companyName', e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                    placeholder="e.g. Acme Corp"
                  />
                </div>
                <div>
                  <label className={labelClass}>Job Title</label>
                  <input
                    type="text"
                    value={exp.jobTitle}
                    onChange={(e) => updateWorkExperience(exp.id, 'jobTitle', e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                    placeholder="e.g. Frontend Engineer"
                  />
                </div>
                <div>
                  <label className={labelClass}>Start Date</label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => updateWorkExperience(exp.id, 'startDate', e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                    placeholder="e.g. January 2022"
                  />
                </div>
                <div>
                  <label className={labelClass}>End Date</label>
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) => updateWorkExperience(exp.id, 'endDate', e.target.value)}
                    disabled={exp.currentlyWorking}
                    className={`${inputClass} ${exp.currentlyWorking ? 'opacity-40 cursor-not-allowed' : ''}`}
                    style={{
                      ...inputStyle,
                      ...(exp.currentlyWorking ? { background: 'var(--color-surface-secondary)' } : {}),
                    }}
                    placeholder="e.g. March 2024"
                  />
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exp.currentlyWorking}
                      onChange={(e) =>
                        updateWorkExperience(exp.id, 'currentlyWorking', e.target.checked)
                      }
                      className="w-3.5 h-3.5 accent-accent"
                    />
                    <span className="text-xs text-text-secondary">Currently working here</span>
                  </label>
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Key Responsibilities</label>
                  <textarea
                    value={exp.responsibilities}
                    onChange={(e) =>
                      updateWorkExperience(exp.id, 'responsibilities', e.target.value)
                    }
                    rows={3}
                    className={`${inputClass} resize-none`}
                    style={inputStyle}
                    placeholder="Describe your key responsibilities and achievements..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-border mb-6" />

      {/* Education */}
      <section className="mb-6">
        <h3 className={sectionHeadingClass}>Education</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Highest Degree</label>
            <div className="relative">
              <select
                value={highestDegree}
                onChange={(e) => setHighestDegree(e.target.value)}
                className={selectClass}
                style={inputStyle}
              >
                <option value="high_school">High School</option>
                <option value="associate">Associate Degree</option>
                <option value="bachelor">Bachelor&apos;s Degree</option>
                <option value="master">Master&apos;s Degree</option>
                <option value="phd">PhD</option>
                <option value="other">Other</option>
              </select>
              <ChevronDownIcon />
            </div>
          </div>
          <div>
            <label className={labelClass}>Field of Study</label>
            <input
              type="text"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="e.g. Computer Science"
            />
          </div>
          <div>
            <label className={labelClass}>Institution Name</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="e.g. MIT"
            />
          </div>
          <div>
            <label className={labelClass}>Graduation Year</label>
            <input
              type="text"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="YYYY"
            />
          </div>
        </div>
      </section>

      <div className="border-t border-border mb-6" />

      {/* Job Preferences */}
      <section className="mb-8">
        <h3 className={sectionHeadingClass}>Job Preferences</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Job Titles Seeking</label>
            <input
              type="text"
              value={jobTitlesSeeking}
              onChange={(e) => setJobTitlesSeeking(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="e.g. Frontend Engineer, React Developer"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Remote Preference</label>
              <div className="relative">
                <select
                  value={remotePreference}
                  onChange={(e) => setRemotePreference(e.target.value)}
                  className={selectClass}
                  style={inputStyle}
                >
                  <option value="any">Any</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
                <ChevronDownIcon />
              </div>
            </div>
            <div>
              <label className={labelClass}>
                Salary Expectation <span className="normal-case">(Optional)</span>
              </label>
              <input
                type="text"
                value={salaryExpectation}
                onChange={(e) => setSalaryExpectation(e.target.value)}
                className={inputClass}
                style={inputStyle}
                placeholder="e.g. $80,000"
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>
              Preferred Locations <span className="normal-case">(Optional)</span>
            </label>
            <input
              type="text"
              value={preferredLocations}
              onChange={(e) => setPreferredLocations(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="e.g. New York, London"
            />
          </div>
          <div>
            <label className={labelClass}>Cover Letter Tone</label>
            <div className="relative">
              <select
                value={coverLetterTone}
                onChange={(e) => setCoverLetterTone(e.target.value)}
                className={selectClass}
                style={inputStyle}
              >
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="enthusiastic">Enthusiastic</option>
              </select>
              <ChevronDownIcon />
            </div>
          </div>
        </div>
      </section>

      {saveError && (
        <p className="text-sm text-error mb-4">{saveError}</p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-60"
        style={{
          background: 'var(--color-accent)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Profile'}
      </button>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path
          d="M3.5 5.25L7 8.75L10.5 5.25"
          stroke="var(--color-text-muted)"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function XSmallIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path
        d="M2 2L8 8M8 2L2 8"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
