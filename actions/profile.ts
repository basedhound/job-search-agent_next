'use server';

import { revalidatePath } from 'next/cache';
import { createInsforgeServer } from '@/lib/insforge-server';
import { calculateCompletion } from '@/lib/profile-completion';
import { getPostHogClient } from '@/lib/posthog-server';

export type WorkExperience = {
  id: string;
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  responsibilities: string;
};

export type ProfileFormData = {
  fullName: string;
  phone: string;
  location: string;
  linkedInUrl: string;
  portfolioUrl: string;
  workAuthorization: string;
  currentTitle: string;
  experienceLevel: string;
  yearsExperience: string;
  skills: string[];
  industries: string[];
  workExperiences: WorkExperience[];
  highestDegree: string;
  fieldOfStudy: string;
  institution: string;
  graduationYear: string;
  jobTitlesSeeking: string;
  remotePreference: string;
  salaryExpectation: string;
  preferredLocations: string;
  coverLetterTone: string;
};

export async function saveProfile(data: ProfileFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const insforge = await createInsforgeServer();
    const { data: authData, error: authError } = await insforge.auth.getCurrentUser();

    if (authError || !authData.user) {
      return { success: false, error: 'Not authenticated' };
    }

    const userId = authData.user.id;

    const { data: existing } = await insforge.database
      .from('profiles')
      .select('id, is_complete')
      .eq('id', userId)
      .maybeSingle();

    const wasComplete = (existing as { is_complete?: boolean } | null)?.is_complete ?? false;

    const jobTitlesSeeking = data.jobTitlesSeeking
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const preferredLocations = data.preferredLocations
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean);

    const { isComplete } = calculateCompletion({
      full_name: data.fullName,
      phone: data.phone,
      location: data.location,
      current_title: data.currentTitle,
      skills: data.skills,
      work_experience: data.workExperiences,
      education: { degree: data.highestDegree },
      job_titles_seeking: jobTitlesSeeking,
    });

    const payload = {
      full_name: data.fullName,
      phone: data.phone,
      location: data.location,
      linkedin_url: data.linkedInUrl,
      portfolio_url: data.portfolioUrl,
      work_authorization: data.workAuthorization,
      current_title: data.currentTitle,
      experience_level: data.experienceLevel,
      years_experience: parseInt(data.yearsExperience, 10) || null,
      skills: data.skills,
      industries: data.industries,
      work_experience: data.workExperiences,
      education: {
        degree: data.highestDegree,
        fieldOfStudy: data.fieldOfStudy,
        institution: data.institution,
        graduationYear: data.graduationYear,
      },
      job_titles_seeking: jobTitlesSeeking,
      remote_preference: data.remotePreference,
      salary_expectation: data.salaryExpectation,
      preferred_locations: preferredLocations,
      cover_letter_tone: data.coverLetterTone,
      is_complete: isComplete,
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      const { error } = await insforge.database
        .from('profiles')
        .update(payload)
        .eq('id', userId);

      if (error) {
        console.error('[actions/profile] update error', error);
        return { success: false, error: 'Failed to save profile' };
      }
    } else {
      const { error } = await insforge.database
        .from('profiles')
        .insert([{ id: userId, ...payload }]);

      if (error) {
        console.error('[actions/profile] insert error', error);
        return { success: false, error: 'Failed to save profile' };
      }
    }

    if (isComplete && !wasComplete) {
      const posthog = getPostHogClient();
      posthog.capture({
        distinctId: userId,
        event: 'profile_completed',
        properties: { userId },
      });
    }

    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error('[actions/profile]', error);
    return { success: false, error: 'Failed to save profile' };
  }
}
