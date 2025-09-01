'use client';

import SharedLayout from '@/components/SharedLayout';
import Health from '@/components/sections/Health';

export default function HealthPage() {
  return (
    <SharedLayout activeSection="health">
      <Health />
    </SharedLayout>
  );
}