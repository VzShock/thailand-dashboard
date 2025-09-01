'use client';

import SharedLayout from '@/components/SharedLayout';
import Shopping from '@/components/sections/Shopping';

export default function ShoppingPage() {
  return (
    <SharedLayout activeSection="shopping">
      <Shopping />
    </SharedLayout>
  );
}