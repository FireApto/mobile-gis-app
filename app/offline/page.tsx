'use client';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          📡 You're Offline
        </h1>
        <p className="text-gray-600 mb-6">
          Please check your internet connection
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}