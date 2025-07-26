import { getApod } from '@/lib/nasa';
import { ApodCard } from '@/components/apod-card';
import { parseISO } from 'date-fns';

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  let apodData;
  let error = null;
  const dateStr = searchParams?.date;
  const selectedDate = dateStr ? parseISO(dateStr) : undefined;
  
  try {
    apodData = await getApod(selectedDate);
  } catch (e: any) {
    error = e.message || 'An unknown error occurred.';
  }

  return (
    <div className="w-full bg-gradient-to-b from-background to-indigo-950/50 flex-1 flex flex-col">
      {apodData ? (
        <ApodCard initialApodData={apodData} />
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
            <div className="container mx-auto max-w-2xl text-center">
                <div className="bg-destructive/80 backdrop-blur-sm border border-destructive p-6 rounded-lg text-destructive-foreground">
                    <h2 className="text-xl font-bold font-headline">Oops, a cosmic anomaly!</h2>
                    <p className="mt-2">{error}</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
