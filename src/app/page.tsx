
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex items-center justify-center text-center px-4">
        <div className="relative max-w-3xl">
          {/* Background Glow */}
          <div className="absolute -top-20 -left-40 w-[400px] h-[400px] bg-primary/20 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-20 -right-40 w-[400px] h-[400px] bg-accent/20 rounded-full filter blur-3xl opacity-30 animate-pulse delay-2000"></div>

          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-4">
              Explore the Universe
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
              Journey through the cosmos with stunning images and expert explanations from NASA's Astronomy Picture of the Day.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="group">
                <Link href="/apod">
                  See Today's Picture
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
