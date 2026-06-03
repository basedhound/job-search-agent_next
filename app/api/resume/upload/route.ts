import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createInsforgeServer } from '@/lib/insforge-server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ success: false, error: 'Only PDF files are supported' }, { status: 400 });
    }

    if (file.size > 3 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size must be under 3MB' }, { status: 400 });
    }

    const insforge = await createInsforgeServer();
    const { data: authData } = await insforge.auth.getCurrentUser();

    if (!authData.user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const userId = authData.user.id;

    const { data: uploadData, error: uploadError } = await insforge.storage
      .from('resumes')
      .uploadAuto(file);

    if (uploadError || !uploadData) {
      console.error('[api/resume/upload] storage upload error', uploadError);
      return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
    }

    const { data: existing } = await insforge.database
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (existing) {
      await insforge.database
        .from('profiles')
        .update({ resume_pdf_url: uploadData.url, updated_at: new Date().toISOString() })
        .eq('id', userId);
    } else {
      await insforge.database
        .from('profiles')
        .insert([{ id: userId, resume_pdf_url: uploadData.url }]);
    }

    revalidatePath('/profile');

    return NextResponse.json({ success: true, url: uploadData.url });
  } catch (error) {
    console.error('[api/resume/upload]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
