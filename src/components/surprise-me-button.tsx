'use client';

import { useRouter } from 'next/navigation';
import { Wand2 } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { format } from 'date-fns';

export function SurpriseMeButton() {
  const router = useRouter();

  const handleSurpriseMe = () => {
    const startDate = new Date('1995-06-16').getTime();
    const endDate = new Date().getTime();
    const randomTime = startDate + Math.random() * (endDate - startDate);
    const randomDate = new Date(randomTime);
    const formattedDate = format(randomDate, 'yyyy-MM-dd');
    router.push(`/apod?date=${formattedDate}`);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleSurpriseMe}>
            <Wand2 className="h-5 w-5" />
            <span className="sr-only">Surprise Me</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View a random picture</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
