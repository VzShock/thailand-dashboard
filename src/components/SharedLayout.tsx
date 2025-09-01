'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { AnimatedNav } from '@/components/AnimatedNav';

type SectionType = 'overview' | 'itinerary' | 'food' | 'activities' | 'shopping' | 'health' | 'budget' | 'checklist' | 'work' | 'currency';

interface SharedLayoutProps {
  children: ReactNode;
  activeSection: SectionType;
  onSectionChange?: (section: SectionType) => void;
}

export default function SharedLayout({ children, activeSection, onSectionChange }: SharedLayoutProps) {
  const router = useRouter();

  const handleSectionChange = (section: SectionType) => {
    if (onSectionChange) {
      onSectionChange(section);
      return;
    }
    
    // Default navigation logic for dedicated routes using Next.js router
    const routes: Record<SectionType, string> = {
      overview: '/',
      itinerary: '/itinerary',
      food: '/food',
      activities: '/activities', 
      shopping: '/shopping',
      health: '/health',
      budget: '/budget',
      checklist: '/checklist',
      work: '/work',
      currency: '/currency'
    };
    
    router.push(routes[section]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600">
      <AnimatedNav activeSection={activeSection} onSectionChange={handleSectionChange} />
      <div className="max-w-7xl mx-auto px-3 py-3 md:px-5 md:py-5">
        <Header />
        <main className="mt-4 md:mt-8 mb-20 md:mb-8">
          {children}
        </main>
      </div>
    </div>
  );
}