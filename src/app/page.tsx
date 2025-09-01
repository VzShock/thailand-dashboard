'use client';

import SharedLayout from '@/components/SharedLayout';
import Overview from '@/components/sections/Overview';

export default function Home() {
  return (
    <SharedLayout activeSection="overview">
      <Overview />
    </SharedLayout>
  );
}
