
import React from 'react';
import { getRecentApods } from '@/lib/nasa';
import { ApodData } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

function GallerySkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 place-items-center">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            ))}
        </div>
    )
}


export default async function GalleryPage() {
    let recentApods: ApodData[] = [];
    let error: string | null = null;

    try {
        recentApods = await getRecentApods(12);
    } catch (e: any) {
        console.error('An error occurred while fetching recent APODs:', e);
        let errorMessage = 'An unknown error occurred.';
        if (e?.message) {
            errorMessage = typeof e.message === 'string' ? e.message : JSON.stringify(e.message);
        }
        error = errorMessage;
    }

    return (
        <div className="w-full bg-gradient-to-b from-background to-blue-950/50 flex-1">
            <div className="container mx-auto px-2 sm:px-4 py-8">
                <h1 className="text-2xl sm:text-3xl font-bold font-headline mb-12 text-center">
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 place-items-center">
                            {recentApods.filter(apod => apod.media_type === 'image').map((apod, index) => (
                                <Link href={`/apod?date=${apod.date}`} key={apod.date} className="flex flex-col items-center gap-2 text-center group">
                                    <div className="w-32 h-32 relative">
                                        <Image
                                            src={apod.url}
                                            alt={apod.title}
                                            fill
                                            className="object-cover rounded-full border-2 border-transparent group-hover:border-primary transition-all duration-300"
                                            data-ai-hint="galaxy stars"
                                            priority={index < 6}
                                        />
                                    </div>
                                    <h3 className="font-semibold text-sm w-32 truncate group-hover:text-primary" title={apod.title}>{apod.title}</h3>
                                </Link>
                            ))}
                        </div>
                    </React.Suspense>
                )}
            </div>
        </div>
    );
}
