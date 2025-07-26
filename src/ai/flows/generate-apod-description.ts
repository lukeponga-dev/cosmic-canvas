'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating AI-powered descriptions of NASA's Astronomy Picture of the Day (APOD).
 *
 * - generateApodDescription - A function that takes an image URL and title and returns an AI-generated description.
 * - GenerateApodDescriptionInput - The input type for the generateApodDescription function.
 * - GenerateApodDescriptionOutput - The return type for the generateApodDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateApodDescriptionInputSchema = z.object({
  imageUrl: z.string().describe('URL of the APOD image.'),
  title: z.string().describe('Title of the APOD image.'),
});
export type GenerateApodDescriptionInput = z.infer<
  typeof GenerateApodDescriptionInputSchema
>;

const GenerateApodDescriptionOutputSchema = z.object({
  description: z.string().describe('AI-generated description of the APOD image.'),
});
export type GenerateApodDescriptionOutput = z.infer<
  typeof GenerateApodDescriptionOutputSchema
>;

export async function generateApodDescription(
  input: GenerateApodDescriptionInput
): Promise<GenerateApodDescriptionOutput> {
  return generateApodDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'apodDescriptionPrompt',
  input: {schema: GenerateApodDescriptionInputSchema},
  output: {schema: GenerateApodDescriptionOutputSchema},
  prompt: `You are an expert astronomy educator. Your task is to generate a concise and informative description of an Astronomy Picture of the Day (APOD) image, given its URL and title.\n\n  Title: {{{title}}}\n  Image URL: {{media url=imageUrl}}\n\n  Description:`
});

const generateApodDescriptionFlow = ai.defineFlow(
  {
    name: 'generateApodDescriptionFlow',
    inputSchema: GenerateApodDescriptionInputSchema,
    outputSchema: GenerateApodDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
