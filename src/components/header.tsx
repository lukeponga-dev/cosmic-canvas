import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-5xl items-center justify-between">
        <h1 className="font-headline text-2xl font-bold tracking-tighter text-primary sm:text-3xl">
          Cosmic Canvas
        </h1>
        <ThemeToggle />
      </div>
    </header>
  );
}
