'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a simplified, "Explain Like I'm Five" (ELI5)
 * description of NASA's Astronomy Picture of the Day (APOD).
 *
 * - generateApodExplanationELI5 - A function that takes an image URL and title and returns a simple explanation.
 * - GenerateApodExplanationELI5Input - The input type for the generateApodExplanationELI5 function.
 * - GenerateApodExplanationELI5Output - The return type for the generateApodExplanationELI5 function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateApodExplanationELI5InputSchema = z.object({
  imageUrl: z.string().describe('URL of the APOD image.'),
  title: z.string().describe('Title of the APOD image.'),
});
export type GenerateApodExplanationELI5Input = z.infer<
  typeof GenerateApodExplanationELI5InputSchema
>;

const GenerateApodExplanationELI5OutputSchema = z.object({
  explanation: z.string().describe('AI-generated ELI5 explanation of the APOD image.'),
});
export type GenerateApodExplanationELI5Output = z.infer<
  typeof GenerateApodExplanationELI5OutputSchema
>;

export async function generateApodExplanationELI5(
  input: GenerateApodExplanationELI5Input
): Promise<GenerateApodExplanationELI5Output> {
  return generateApodExplanationELI5Flow(input);
}

const generateApodExplanationELI5Flow = ai.defineFlow(
  {
    name: 'generateApodExplanationELI5Flow',
    inputSchema: GenerateApodExplanationELI5InputSchema,
    outputSchema: GenerateApodExplanationELI5OutputSchema,
  },
  async input => {
    const { text } = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest',
      prompt: [
        { text: `You are a friendly and enthusiastic science teacher who loves explaining complex space topics to young children. Your task is to explain an astronomy picture in a very simple and fun way, as if you were talking to a five-year-old. Use simple words, short sentences, and fun analogies.\n\n  Title: ${input.title}\n\n  Simple Explanation:` },
        { media: { url: input.imageUrl } },
      ],
    });
    return { explanation: text() };
  }
);
