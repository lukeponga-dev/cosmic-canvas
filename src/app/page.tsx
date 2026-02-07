
import { ApodCard } from "@/components/apod-card";
import { getApod } from "@/lib/nasa";
import { startOfToday } from 'date-fns';

export default async function Home() {
  const today = startOfToday();
  const apodData = await getApod(today);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <ApodCard initialApodData={apodData} />
    </main>
  );
}
