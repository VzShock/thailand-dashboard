'use client';

import SharedLayout from '@/components/SharedLayout';
import Activities from '@/components/sections/Activities';

export default function ActivitiesPage() {
  return (
    <SharedLayout activeSection="activities">
      <Activities />
    </SharedLayout>
  );
}