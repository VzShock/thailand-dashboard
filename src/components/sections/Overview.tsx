'use client';

import tripOverview from '../../../data/trip-overview.json';
import { useTracker } from '@/hooks/useTracker';
import food from '../../../data/food.json';
import activities from '../../../data/activities.json';
import shopping from '../../../data/shopping.json';
import health from '../../../data/health.json';

export default function Overview() {
  const { getOverallProgress, isLoaded } = useTracker();
  
  // Calculate total items for each section
  const sectionTotals = {
    food: food.foods.length,
    activities: Object.values(activities.categories).reduce(
      (sum, category) => sum + category.activities.length, 
      0
    ),
    shopping: shopping.locations.length,
    health: 0, // Health section doesn't have trackable items (emergency contacts)
    vaccinations: health.vaccinations.vaccines.length,
  };
  
  const overallProgress = getOverallProgress(sectionTotals);

  return (
    <div className="space-y-6">
      {/* Overall Progress Card */}
      {isLoaded && overallProgress.total > 0 && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            Your Thailand Adventure Progress
          </h2>
          <div className="bg-white/20 rounded-full h-4 mb-4">
            <div 
              className="bg-white h-4 rounded-full transition-all duration-500"
              style={{ width: `${(overallProgress.completed / overallProgress.total) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg">
              {overallProgress.completed} of {overallProgress.total} items completed
            </span>
            <span className="text-2xl font-bold">
              {Math.round((overallProgress.completed / overallProgress.total) * 100)}%
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {/* Flight Details */}
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
        <h2 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg">
            ✈️
          </span>
          Flight Details
        </h2>
        <div className="space-y-4">
          <div>
            <div className="font-semibold">Outbound: {tripOverview.flightDetails.outbound.date}</div>
            <div>{tripOverview.flightDetails.outbound.route}</div>
            <div className="text-gray-700 text-sm">Total: {tripOverview.flightDetails.outbound.duration}</div>
          </div>
          <div>
            <div className="font-semibold">Return: {tripOverview.flightDetails.return.date}</div>
            <div>{tripOverview.flightDetails.return.route}</div>
            <div className="text-gray-700 text-sm">Total: {tripOverview.flightDetails.return.duration}</div>
          </div>
        </div>
      </div>

      {/* Journey Stats */}
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
        <h2 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg">
            📅
          </span>
          Journey Stats
        </h2>
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">{tripOverview.journeyStats.totalDays} Days</div>
          <div className="text-gray-700 mb-4">Total Adventure Time</div>
          <div className="space-y-2">
            <div>💼 {tripOverview.journeyStats.workDays} Work Days</div>
            <div>🏖️ {tripOverview.journeyStats.vacationDays} Vacation Days</div>
            <div>📍 {tripOverview.journeyStats.destinations} Destinations</div>
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
        <h2 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg">
            💰
          </span>
          Budget Overview
        </h2>
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">{tripOverview.budgetOverview.totalRange}</div>
          <div className="text-gray-700 mb-4">Total for 56 days</div>
          <div className="space-y-2">
            <div>💵 {tripOverview.budgetOverview.dailyRange}</div>
            <div>🏨 {tripOverview.budgetOverview.type}</div>
            <div>✨ {tripOverview.budgetOverview.includes}</div>
          </div>
        </div>
      </div>

      {/* Work Hours */}
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
        <h2 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg">
            🕐
          </span>
          Work Hours ({tripOverview.workSchedule.timezone})
        </h2>
        <div className="space-y-3">
          <div>
            <strong>Paris:</strong> {tripOverview.workSchedule.parisTime}
          </div>
          <div>
            <strong>Bangkok:</strong> {tripOverview.workSchedule.bangkokTime}
          </div>
          <div className="bg-gray-100 p-3 rounded-lg">
            <div className="text-blue-600 font-bold">Morning Freedom!</div>
            <div className="text-sm">{tripOverview.workSchedule.morningFreedom}</div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}