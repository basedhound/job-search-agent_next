'use client';

import { useState, useRef } from 'react';
import { ResumePreview } from '@/components/profile/ResumePreview';

interface Props {
  resumeUrl?: string | null;
  resumeUploadedAt?: string | null;
}

export function ResumeUpload({ resumeUrl, resumeUploadedAt }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentResumeUrl, setCurrentResumeUrl] = useState<string | null>(resumeUrl ?? null);
  const [uploadedAt, setUploadedAt] = useState<string | null>(resumeUploadedAt ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are supported');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setUploadError('File size must be under 3MB');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/resume/upload', { method: 'POST', body: formData });
      const result = (await res.json()) as { success: boolean; url?: string; error?: string };

      if (!result.success) {
        setUploadError(result.error ?? 'Upload failed');
        return;
      }

      setCurrentResumeUrl(result.url ?? null);
      setUploadedAt(
        new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      );
    } catch {
      setUploadError('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  return (
    <div
      className="bg-surface border border-border"
      style={{
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)',
      }}
    >
      <h2 className="text-base font-semibold text-text-primary mb-1">Resume</h2>
      <p className="text-sm text-text-secondary mb-4">
        Upload an existing resume to auto fill the profile, or generate a new tailored one from
        your details below.
      </p>

      {currentResumeUrl && uploadedAt ? (
        <div className="mb-4">
          <ResumePreview
            fileName="resume.pdf"
            uploadedAt={uploadedAt}
            downloadUrl={currentResumeUrl}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Replace resume
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleChange}
          />
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 py-8 cursor-pointer transition-colors"
          style={{
            border: `1.5px dashed ${isDragging ? 'var(--color-accent)' : 'var(--color-border-muted)'}`,
            borderRadius: 'var(--radius-lg)',
            background: isDragging ? 'var(--color-accent-muted)' : 'var(--color-surface-secondary)',
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleChange}
          />

          {isUploading ? (
            <p className="text-sm font-medium text-text-secondary">Uploading...</p>
          ) : (
            <>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                <path
                  d="M18 24V12M18 12L13.5 16.5M18 12L22.5 16.5"
                  stroke="var(--color-text-muted)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 27H27M9 22.5C6.515 22.5 4.5 20.485 4.5 18C4.5 15.515 6.515 13.5 9 13.5C9.033 13.5 9.066 13.5 9.099 13.501C9.034 13.175 9 12.841 9 12.5C9 9.462 11.462 7 14.5 7C16.268 7 17.845 7.83 18.875 9.12C19.535 8.72 20.305 8.5 21.125 8.5C23.471 8.5 25.375 10.404 25.375 12.75C25.375 12.916 25.364 13.08 25.343 13.241C25.395 13.235 25.447 13.232 25.5 13.232C27.433 13.232 29 14.799 29 16.732C29 18.665 27.433 20.232 25.5 20.232H27"
                  stroke="var(--color-text-muted)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>

              <div className="text-center">
                <p className="text-sm font-medium text-text-primary">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-text-muted mt-0.5">PDF formatting only. Maximum file size 3MB</p>
              </div>

              <button
                type="button"
                className="mt-1 text-sm font-medium px-4 py-2 bg-surface border border-border text-text-primary hover:bg-surface-secondary transition-colors"
                style={{ borderRadius: 'var(--radius-md)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                Select Resume
              </button>
            </>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-sm text-error mt-2">{uploadError}</p>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <p className="text-sm text-text-secondary">
          Need a fresh document based on this Profile below?
        </p>
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-medium text-white hover:opacity-90 transition-opacity px-4 py-2"
          style={{
            background: 'var(--color-accent)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M7 1v12M1 7h12"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Generate Resume from Profile
        </button>
      </div>
    </div>
  );
}
