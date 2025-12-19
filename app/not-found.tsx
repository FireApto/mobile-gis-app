// app/not-found.tsx
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center p-4">
      <div className="text-center text-white">
        <MapPin className="w-24 h-24 mx-auto mb-4 opacity-50" />
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-8">Page not found</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-white text-cyan-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Back to Map
        </Link>
      </div>
    </div>
  );
}