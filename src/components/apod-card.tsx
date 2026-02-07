'use client';

import { useState } from 'react';
import Image from 'next/image';
import { format, isValid, parseISO } from 'date-fns';
import { Sparkles, Loader2, Info, Baby, PenLine } from 'lucide-react';

import { type ApodData } from '@/lib/types';
import { getApodAction } from '@/app/actions';
import { generateApodDescription } from '@/ai/flows/generate-apod-description';
import { generateApodExplanationELI5 } from '@/ai/flows/generate-apod-explanation-eli5';
import { generateApodHaiku } from '@/ai/flows/generate-apod-haiku';
import { DatePicker } from '@/components/date-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type ApodCardProps = {
  initialApodData: ApodData;
};

type GeneratingState = 'none' | 'description' | 'eli5' | 'haiku';

export function ApodCard({ initialApodData }: ApodCardProps) {
  const [apodData, setApodData] = useState<ApodData>(initialApodData);
  const [date, setDate] = useState<Date | undefined>(parseISO(initialApodData.date));
  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [aiELI5, setAiELI5] = useState<string | null>(null);
  const [aiHaiku, setAiHaiku] = useState<string | null>(null);
  const [generating, setGenerating] = useState<GeneratingState>('none');
  const [isFetchingNewDate, setIsFetchingNewDate] = useState(false);
  const { toast } = useToast();

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    setAiDescription(null);
    setAiELI5(null);
    setAiHaiku(null);
    if (newDate) {
      setIsFetchingNewDate(true);
      getApodAction(newDate)
        .then(result => {
          if (result.error || !result.data) {
            toast({
              variant: 'destructive',
              title: 'Error fetching picture',
              description: result.error || 'Could not load the picture for the selected date.',
            });
          } else {
            setApodData(result.data);
          }
        })
        .finally(() => {
          setIsFetchingNewDate(false);
        });
    }
  };
  
  const handleGenerateDescription = async () => {
    setGenerating('description');
    setAiDescription(null);
    try {
      const result = await generateApodDescription({
        imageUrl: apodData.url,
        title: apodData.title,
      });
      setAiDescription(result.description);
    } catch (error) {
      console.error('Error generating AI description:', error);
      toast({
        variant: 'destructive',
        title: 'Error generating description',
        description: 'The AI seems to be lost in space. Please try again.',
      });
    } finally {
      setGenerating('none');
    }
  };

  const handleGenerateELI5 = async () => {
    setGenerating('eli5');
    setAiELI5(null);
    try {
      const result = await generateApodExplanationELI5({
        imageUrl: apodData.url,
        title: apodData.title,
      });
      setAiELI5(result.explanation);
    } catch (error) {
      console.error('Error generating ELI5 explanation:', error);
      toast({
        variant: 'destructive',
        title: 'Error generating explanation',
        description: 'The AI seems to be lost in space. Please try again.',
      });
    } finally {
      setGenerating('none');
    }
  };

  const handleGenerateHaiku = async () => {
    setGenerating('haiku');
    setAiHaiku(null);
    try {
      const result = await generateApodHaiku({
        imageUrl: apodData.url,
        title: apodData.title,
      });
      setAiHaiku(result.haiku);
    } catch (error) {
      console.error('Error generating haiku:', error);
      toast({
        variant: 'destructive',
        title: 'Error generating haiku',
        description: 'The AI seems to be lost in space. Please try again.',
      });
    } finally {
      setGenerating('none');
    }
  };

  const { title, explanation, url, media_type, copyright } = apodData;
  const displayDate = date && isValid(date) ? format(date, 'MMMM d, yyyy') : 'Invalid date';

  const isLoading = generating !== 'none' || isFetchingNewDate;

  return (
    <div className="w-full bg-gradient-to-b from-background to-blue-950/50 flex-1">
      <div className="container mx-auto max-w-4xl px-2 py-4 sm:px-4 sm:py-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between mb-8">
          <h2 className="text-xl font-semibold text-center sm:text-left font-headline">
            Picture of the Day for {isFetchingNewDate ? '...' : displayDate}
          </h2>
          <DatePicker date={date} setDate={handleDateChange} />
        </div>
        
        <Card className="w-full overflow-hidden border-border bg-card/50 backdrop-blur-sm transition-all duration-500">
            <CardHeader>
              {isFetchingNewDate ? <Skeleton className="h-8 w-3/4 mb-2" /> : <CardTitle className="font-headline text-2xl sm:text-3xl text-primary">{title}</CardTitle>}
              {isFetchingNewDate ? <Skeleton className="h-4 w-1/2" /> : (copyright && <CardDescription>Image Credit & Copyright: {copyright}</CardDescription>)}
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {isFetchingNewDate ? (
                  <Skeleton className="aspect-video w-full" />
                ) : media_type === 'image' ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                    <Image
                      src={url}
                      alt={title}
                      fill
                      className="object-contain"
                      data-ai-hint="space nebula"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full">
                    <iframe
                      src={url}
                      title={title}
                      frameBorder="0"
                      allow="encrypted-media"
                      allowFullScreen
                      className="h-full w-full rounded-lg"
                    />
                  </div>
                )}
                
                {isFetchingNewDate ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ) : (
                  <p className="leading-relaxed text-foreground/90">{explanation}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                <Button onClick={handleGenerateDescription} disabled={isLoading} className="w-full">
                  {generating === 'description' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {generating === 'description' ? 'Generating...' : 'AI Description'}
                </Button>
                 <Button onClick={handleGenerateELI5} disabled={isLoading} variant="secondary" className="w-full">
                  {generating === 'eli5' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Baby className="mr-2 h-4 w-4" />
                  )}
                  {generating === 'eli5' ? 'Explaining...' : 'ELI5'}
                </Button>
                <Button onClick={handleGenerateHaiku} disabled={isLoading} variant="secondary" className="w-full">
                  {generating === 'haiku' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PenLine className="mr-2 h-4 w-4" />
                  )}
                  {generating === 'haiku' ? 'Writing...' : 'Haiku'}
                </button>
              </div>

              {(generating || aiDescription || aiELI5 || aiHaiku) && (
                <Accordion type="single" collapsible className="w-full" defaultValue={aiDescription ? 'desc-item' : aiELI5 ? 'eli5-item' : 'haiku-item'}>
                  { (generating === 'description' || aiDescription) && (
                      <AccordionItem value="desc-item" className="border-accent/30">
                      <AccordionTrigger className="text-accent hover:no-underline">
                          <div className="flex items-center gap-2">
                          <Info className="h-5 w-5" />
                          AI Generated Description
                          </div>
                      </AccordionTrigger>
                      <AccordionContent>
                          {generating === 'description' && (
                          <div className="space-y-2 pt-2">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-3/4" />
                          </div>
                          )}
                          {aiDescription && (
                          <p className="leading-relaxed text-foreground/90 pt-2">{aiDescription}</p>
                          )}
                      </AccordionContent>
                      </AccordionItem>
                  )}
                  { (generating === 'eli5' || aiELI5) && (
                      <AccordionItem value="eli5-item" className="border-accent/30">
                      <AccordionTrigger className="text-accent hover:no-underline">
                          <div className="flex items-center gap-2">
                          <Baby className="h-5 w-5" />
                          ELI5 Explanation
                          </div>
                      </AccordionTrigger>
                      <AccordionContent>
                          {generating === 'eli5' && (
                          <div className="space-y-2 pt-2">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-3/4" />
                          </div>
                          )}
                          {aiELI5 && (
                          <p className="leading-relaxed text-foreground/90 pt-2">{aiELI5}</p>
                          )}
                      </AccordionContent>
                      </AccordionItem>
                  )}
                   { (generating === 'haiku' || aiHaiku) && (
                      <AccordionItem value="haiku-item" className="border-accent/30">
                      <AccordionTrigger className="text-accent hover:no-underline">
                          <div className="flex items-center gap-2">
                          <PenLine className="h-5 w-5" />
                          AI Generated Haiku
                          </div>
                      </AccordionTrigger>
                      <AccordionContent>
                          {generating === 'haiku' && (
                          <div className="space-y-2 pt-2">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-1/2" />
                              <Skeleton className="h-4 w-full" />
                          </div>
                          )}
                          {aiHaiku && (
                          <p className="leading-relaxed text-foreground/90 pt-2 whitespace-pre-line text-center italic text-lg">{aiHaiku}</p>
                          )}
                      </AccordionContent>
                      </AccordionItem>
                  )}
                </Accordion>
              )}
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
