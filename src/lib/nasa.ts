import { type ApodData } from '@/lib/types';
import { format, subDays } from 'date-fns';

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


export async function getRecentApods(count: number): Promise<ApodData[]> {
    const apiKey = NASA_API_KEY || 'DEMO_KEY';

    if (!apiKey) {
        throw new Error('NASA_API_KEY environment variable is not set and no DEMO_KEY is available.');
    }

    const endDate = new Date();
    const startDate = subDays(endDate, count - 1);

    const startDateString = format(startDate, 'yyyy-MM-dd');
    const endDateString = format(endDate, 'yyyy-MM-dd');

    const url = `${API_URL}?api_key=${apiKey}&start_date=${startDateString}&end_date=${endDateString}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || 'Failed to fetch recent APOD data');
    }

    const data = await res.json();

    if (data.code && data.msg) {
        throw new Error(data.msg);
    }
    
    // Sort the data by date in descending order to ensure the most recent is first.
    return data.sort((a: ApodData, b: ApodData) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
