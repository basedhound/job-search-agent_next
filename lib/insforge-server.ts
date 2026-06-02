import { createClient } from '@insforge/sdk';
import { cookies } from 'next/headers';

export const createInsforgeServer = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('insforge_token')?.value;

  const client = createClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    isServerMode: true,
  });

  if (token) {
    client.setAccessToken(token);
  }

  return client;
};
