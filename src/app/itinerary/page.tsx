'use client';

import SharedLayout from '@/components/SharedLayout';
import Itinerary from '../../components/sections/Itinerary';

export default function ItineraryPage() {
  return (
    <SharedLayout activeSection="itinerary">
      <Itinerary />
    </SharedLayout>
  );
}