import Link from 'next/link';
import { GalleryVerticalEnd } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-5xl items-center justify-between">
        <Link href="/">
          <h1 className="font-headline text-2xl font-bold tracking-tighter text-primary sm:text-3xl">
            Cosmic Canvas
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/gallery">
              <GalleryVerticalEnd />
              <span className="ml-2 hidden sm:inline">Gallery</span>
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
