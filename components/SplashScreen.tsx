// components/SplashScreen.tsx
'use client';

import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

interface SplashScreenProps {
  onLoadComplete: () => void;
}

export function SplashScreen({ onLoadComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onLoadComplete, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <MapPin className="w-14 h-14 text-cyan-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-white mb-3">
          DeKUT Navigator
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-cyan-100 mb-8">
          Your Campus Guide
        </p>

        {/* Loading Dots */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Loading Text */}
        <p className="text-white text-sm">
          Loading map...
        </p>
      </div>
    </div>
  );
}