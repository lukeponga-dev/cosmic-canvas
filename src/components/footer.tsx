'use client';

import { useState, useEffect } from 'react';

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // This effect ensures the year is updated on the client-side,
    // preventing a hydration mismatch if the component is rendered
    // server-side around new year's eve.
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-8 w-full shrink-0 border-t border-border/40">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>
          &copy; {year} Cosmic Canvas. All rights reserved.
        </p>
        <p className="mt-1">
          Powered by NASA's APOD API.
        </p>
      </div>
    </footer>
  );
}
