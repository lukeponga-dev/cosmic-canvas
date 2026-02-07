'use server';

/**
 * @fileOverview A Genkit flow for describing an image.
 *
 * - describeImage - A function that takes an image and an optional prompt and returns a description.
 * - DescribeImageInput - The input type for the describeImage function.
 * - DescribeImageOutput - The return type for the describeImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Part } from '@google-ai/generativelanguage';

const DescribeImageInputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the image to describe.'),
  prompt: z
    .string()
    .optional()
    .default('Describe this image in a few sentences.'),
});
export type DescribeImageInput = z.infer<typeof DescribeImageInputSchema>;

const DescribeImageOutputSchema = z.object({
  description: z.string().describe('The generated description of the image.'),
});
export type DescribeImageOutput = z.infer<typeof DescribeImageOutputSchema>;

export async function describeImage(input: DescribeImageInput): Promise<DescribeImageOutput> {
  return describeImageFlow(input);
}

const describeImageFlow = ai.defineFlow(
  {
    name: 'describeImageFlow',
    inputSchema: DescribeImageInputSchema,
    outputSchema: DescribeImageOutputSchema,
  },
  async (input) => {
    const { text } = await ai.generate({
      model: 'googleai/gemini-pro-vision',
      prompt: [
        { text: input.prompt },
        { media: { url: input.imageUrl } },
      ],
    });

    return { description: text() };
  }
);
