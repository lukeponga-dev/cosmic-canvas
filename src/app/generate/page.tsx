'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { WandSparkles, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { generateImage } from '@/ai/flows/generate-image';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  prompt: z.string().min(5, 'Prompt must be at least 5 characters long.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function GeneratePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<{imageUrl: string; prompt: string} | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedImage(null);
    try {
      const result = await generateImage({ prompt: data.prompt });
      setGeneratedImage({
        imageUrl: result.imageUrl,
        prompt: data.prompt,
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Image',
        description: 'The AI model might be busy. Please try again in a moment.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline pb-2">Cosmic Image Generator</h1>
        <p className="text-lg text-muted-foreground">
          Bring your cosmic visions to life. Describe an image, and our AI will create it for you.
        </p>
      </div>

      <Card className="w-full bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Create Your Image</CardTitle>
          <CardDescription>Enter a prompt to generate a unique, AI-powered image.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Prompt</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., A cat astronaut planting a flag on Mars" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <WandSparkles className="mr-2" />}
                {isLoading ? 'Generating...' : 'Generate Image'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <Card className="w-full mt-8 bg-card/50 backdrop-blur-sm">
          <CardHeader>
             <Skeleton className="h-7 w-3/4 mb-1" />
             <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-square w-full" />
          </CardContent>
        </Card>
      )}

      {generatedImage && (
        <Card className="w-full mt-8 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Your Cosmic Creation</CardTitle>
            <CardDescription>Generated from the prompt: "{generatedImage.prompt}"</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
              <Image 
                src={generatedImage.imageUrl} 
                alt={generatedImage.prompt} 
                fill 
                className="object-cover"
                data-ai-hint="space abstract"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
