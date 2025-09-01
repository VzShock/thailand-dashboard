'use client';

import SharedLayout from '@/components/SharedLayout';
import WorkSchedule from '@/components/sections/WorkSchedule';

export default function WorkPage() {
  return (
    <SharedLayout activeSection="work">
      <WorkSchedule />
    </SharedLayout>
  );
}