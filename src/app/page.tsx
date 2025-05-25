'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Oyun bileşenini client-side only olarak yükle
const GameComponent = dynamic(() => import('@/components/Game'), { 
  ssr: false,
  loading: () => (
    <div className="text-white text-2xl font-pixel">Yükleniyor...</div>
  )
}) as React.ComponentType;

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Oyun assetlerinin yüklenmesi için kısa bir gecikme
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <div className="text-white text-2xl font-pixel">Yükleniyor...</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <GameComponent />
    </main>
  );
}
