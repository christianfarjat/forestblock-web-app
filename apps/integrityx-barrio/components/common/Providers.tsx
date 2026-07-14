'use client';

import { useEffect } from 'react';
import { initIxbStore } from '@/lib/ixb_store';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void initIxbStore();
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // PWA opcional: si el registro falla la app sigue online-only.
      });
    }
  }, []);
  return <>{children}</>;
}
