import { redirect } from 'next/navigation';
import { createInsforgeServer } from '@/lib/insforge-server';
import { calculateCompletion } from '@/lib/profile-completion';
import { Navbar } from '@/components/layout/Navbar';
import { CompletionIndicator } from '@/components/profile/CompletionIndicator';
import { ConnectedAccounts } from '@/components/profile/ConnectedAccounts';
import { ResumeUpload } from '@/components/profile/ResumeUpload';
import { ProfileForm } from '@/components/profile/ProfileForm';

export default async function ProfilePage() {
  const insforge = await createInsforgeServer();
  const { data: authData } = await insforge.auth.getCurrentUser();

  if (!authData.user) {
    redirect('/login');
  }

  const { data: profile } = await insforge.database
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .maybeSingle();

  const { percentage, missingFields } = calculateCompletion(profile);

  const resumeUploadedAt = profile?.updated_at
    ? new Date(profile.updated_at as string).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen">
        <div
          className="mx-auto px-8 py-8 flex flex-col gap-6"
          style={{ maxWidth: '860px' }}
        >
          {percentage < 100 && (
            <CompletionIndicator
              percentage={percentage}
              missingFields={missingFields}
            />
          )}
          <ConnectedAccounts />
          <ResumeUpload
            resumeUrl={(profile as { resume_pdf_url?: string } | null)?.resume_pdf_url ?? null}
            resumeUploadedAt={resumeUploadedAt}
          />
          <ProfileForm
            initialData={profile as Record<string, unknown> | null}
            userEmail={authData.user.email}
          />
        </div>
      </main>
    </>
  );
}
