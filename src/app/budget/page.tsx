'use client';

import SharedLayout from '@/components/SharedLayout';
import Budget from '@/components/sections/Budget';

export default function BudgetPage() {
  return (
    <SharedLayout activeSection="budget">
      <Budget />
    </SharedLayout>
  );
}