import { type ApodData } from '@/lib/types';
import { format } from 'date-fns';

const NASA_API_KEY = process.env.NASA_API_KEY;
const API_URL = 'https://api.nasa.gov/planetary/apod';

export async function getApod(date?: Date): Promise<ApodData> {
  const apiKey = NASA_API_KEY || 'DEMO_KEY';
  
  if (!apiKey) {
    throw new Error('NASA_API_KEY environment variable is not set and no DEMO_KEY is available.');
  }

  const dateString = date ? format(date, 'yyyy-MM-dd') : '';
  const url = `${API_URL}?api_key=${apiKey}${dateString ? `&date=${dateString}` : ''}`;
  
  const res = await fetch(url, { next: { revalidate: 3600 } }); // Revalidate every hour

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || 'Failed to fetch APOD data');
  }

  const data = await res.json();
  
  // The API sometimes returns an error object with a 200 status code
  if (data.code && data.msg) {
    throw new Error(data.msg);
  }

  return data;
}
