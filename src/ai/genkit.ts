import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY, apiVersion: 'v1'})],
  model: 'googleai/gemini-pro',
});
