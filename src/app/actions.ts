'use server';

import { getApod } from '@/lib/nasa';
import { type ApodData } from '@/lib/types';

export async function getApodAction(date: Date): Promise<{data: ApodData | null, error: string | null}> {
  try {
    const apodData = await getApod(date);
    return { data: apodData, error: null };
  } catch (e: any) {
    console.error('Failed to fetch APOD in action:', e);
    return { data: null, error: e.message || 'Failed to fetch new image.' };
  }
}
