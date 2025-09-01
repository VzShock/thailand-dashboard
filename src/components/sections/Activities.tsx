'use client';

import activities from '../../../data/activities.json';
import { useTracker } from '@/hooks/useTracker';
import { generateActivityId } from '@/utils/itemId';

export default function Activities() {
  const { toggleItem, isChecked, getProgress, isLoaded } = useTracker();
  
  // Count total activities across all categories
  const totalActivities = Object.values(activities.categories).reduce(
    (sum, category) => sum + category.activities.length, 
    0
  );
  const progress = getProgress('activities', totalActivities);

  if (!isLoaded) {
    return <div className="bg-white rounded-2xl p-8 shadow-lg">Loading...</div>;
  }
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-blue-600 mb-4 flex items-center gap-3">
        <span className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
          🎯
        </span>
        {activities.title}
      </h2>
      <p className="text-gray-700 mb-4">{activities.description}</p>
      
      {/* Progress Bar */}
      {progress.total > 0 && (
        <div className="mb-8 bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(progress.completed / progress.total) * 100}%` }}
          ></div>
          <p className="text-sm text-gray-600 mt-2">
            Completed {progress.completed} of {progress.total} activities ({Math.round((progress.completed / progress.total) * 100)}%)
          </p>
        </div>
      )}
      
      <div className="space-y-8">
        {Object.entries(activities.categories).map(([key, category]) => (
          <div key={key}>
            <h3 className="text-2xl font-bold text-blue-600 mb-6">
              {category.title}
            </h3>
            
            <div className="space-y-4">
              {category.activities.map((activity, index) => {
                const itemId = generateActivityId(activity, key);
                const checked = isChecked('activities', itemId);
                
                return (
                  <div
                    key={index}
                    className={`border rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-x-2 ${
                      checked 
                        ? 'bg-blue-50 border-blue-300' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="font-bold text-blue-600 text-lg mb-2">
                          {activity.name}
                        </div>
                        <div className="text-gray-700 text-sm">
                          {activity.description}
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="text-red-500 font-bold text-lg">
                          {activity.price}
                        </div>
                        <div className="text-gray-700 text-xs">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleItem('activities', itemId)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          {checked ? 'Done!' : 'Mark as done'}
                        </span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}