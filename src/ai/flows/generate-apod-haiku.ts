'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a haiku about NASA's Astronomy Picture of the Day (APOD).
 *
 * - generateApodHaiku - A function that takes an image URL and title and returns a haiku.
 * - GenerateApodHaikuInput - The input type for the generateApodHaiku function.
 * - GenerateApodHaikuOutput - The return type for the generateApodHaiku function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateApodHaikuInputSchema = z.object({
  imageUrl: z.string().describe('URL of the APOD image.'),
  title: z.string().describe('Title of the APOD image.'),
});
export type GenerateApodHaikuInput = z.infer<
  typeof GenerateApodHaikuInputSchema
>;

const GenerateApodHaikuOutputSchema = z.object({
  haiku: z
    .string()
    .describe('A haiku (5-7-5 syllables) about the APOD image.'),
});
export type GenerateApodHaikuOutput = z.infer<
  typeof GenerateApodHaikuOutputSchema
>;

export const generateApodHaiku = ai.defineFlow(
  {
    name: 'generateApodHaiku',
    inputSchema: GenerateApodHaikuInputSchema,
    outputSchema: GenerateApodHaikuOutputSchema,
  },
  async ({imageUrl, title}) => {
    const llmResponse = await ai.generate({
      prompt: `Generate a haiku (5-7-5 syllables) about the following astronomy picture of the day. Be creative and evocative.\n\n      Image Title: ${title}\n      `,
      model: 'googleai/gemini-pro',
      tools: [],
      context: [
        {
          role: 'user',
          content: [{media: {url: imageUrl}}],
        },
      ],
    });

    return {
      haiku: llmResponse.text(),
    };
  }
);
