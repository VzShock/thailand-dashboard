'use client';

import SharedLayout from '@/components/SharedLayout';
import Checklist from '@/components/sections/Checklist';

export default function ChecklistPage() {
  return (
    <SharedLayout activeSection="checklist">
      <Checklist />
    </SharedLayout>
  );
}