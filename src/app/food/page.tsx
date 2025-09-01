'use client';

import SharedLayout from '@/components/SharedLayout';
import Food from '@/components/sections/Food';

export default function FoodPage() {
  return (
    <SharedLayout activeSection="food">
      <Food />
    </SharedLayout>
  );
}