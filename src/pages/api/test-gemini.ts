import { NextApiRequest, NextApiResponse } from 'next';
import { generateApodDescription } from '@/ai/flows/generate-apod-description';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await generateApodDescription({
      imageUrl: 'https://www.nasa.gov/wp-content/uploads/2023/12/53393960303-34a0729352-o-min.png',
      title: 'Orion Nebula',
    });
    res.status(200).json(result);
  } catch (error) {
    console.error('Test failed:', error);
    res.status(500).json({ error: 'Test failed' });
  }
}
