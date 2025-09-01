'use client';

import { useRouter } from 'next/navigation';
import tripOverview from '../../data/trip-overview.json';

export default function Header() {
  const router = useRouter();

  return (
    <header className="text-center text-white mb-10 animate-fade-in">
      <h1 
        className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg cursor-pointer hover:scale-105 transition-transform"
        onClick={() => router.push('/')}
      >
        🍄🐔 {tripOverview.title}
      </h1>
      <div className="text-lg md:text-xl text-white/95 mb-4 font-medium">
        {tripOverview.duration} of Remote Work & Thai Magic | {tripOverview.dates}
      </div>
      <div className="bg-white/20 inline-block px-6 py-2 rounded-full text-lg backdrop-blur-sm">
        ✈️ {tripOverview.travelers}&apos;s {tripOverview.subtitle} 🏝️
      </div>
    </header>
  );
}