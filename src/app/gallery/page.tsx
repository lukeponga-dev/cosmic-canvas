
import React from 'react';
import { getRecentApods } from '@/lib/nasa';
import { ApodData } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function GallerySkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                    <CardContent className="p-0">
                        <Skeleton className="w-full aspect-square" />
                    </CardContent>
                    <CardFooter className="p-4">
                        <Skeleton className="h-5 w-3/4" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}


export default async function GalleryPage() {
  let recentApods: ApodData[] = [];
  let error = null;

  try {
    recentApods = await getRecentApods(12);
  } catch (e: any) {
    error = e.message || 'An unknown error occurred.';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-headline mb-8 text-center">
        Recent Cosmic Images
      </h1>
      {error ? (
         <div className="flex-1 flex items-center justify-center p-4">
            <div className="container mx-auto max-w-2xl text-center">
                <div className="bg-destructive/80 backdrop-blur-sm border border-destructive p-6 rounded-lg text-destructive-foreground">
                    <h2 className="text-xl font-bold font-headline">Oops, a cosmic anomaly!</h2>
                    <p className="mt-2">{error}</p>
                </div>
            </div>
        </div>
      ) : (
        <React.Suspense fallback={<GallerySkeleton />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentApods.filter(apod => apod.media_type === 'image').map((apod) => (
                <Link href={`/apod?date=${apod.date}`} key={apod.date}>
                    <Card className="overflow-hidden hover:shadow-lg hover:border-primary transition-all duration-300 h-full flex flex-col">
                        <CardContent className="p-0 aspect-square relative flex-grow">
                            <Image
                                src={apod.url}
                                alt={apod.title}
                                fill
                                className="object-cover"
                                data-ai-hint="galaxy stars"
                            />
                        </CardContent>
                        <CardFooter className="p-4">
                            <h3 className="font-semibold text-sm truncate" title={apod.title}>{apod.title}</h3>
                        </CardFooter>
                    </Card>
                </Link>
            ))}
            </div>
        </React.Suspense>
      )}
    </div>
  );
}
