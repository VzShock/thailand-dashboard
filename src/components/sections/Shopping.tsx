'use client';

import shopping from '../../../data/shopping.json';
import { useTracker } from '@/hooks/useTracker';
import { generateShoppingId } from '@/utils/itemId';

export default function Shopping() {
  const { toggleItem, isChecked, getProgress, isLoaded } = useTracker();
  const progress = getProgress('shopping', shopping.locations.length);

  if (!isLoaded) {
    return <div className="bg-white rounded-2xl p-8 shadow-lg">Loading...</div>;
  }
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-blue-600 mb-4 flex items-center gap-3">
        <span className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
          🛍️
        </span>
        {shopping.title}
      </h2>
      <p className="text-gray-700 mb-4">{shopping.description}</p>
      
      {/* Progress Bar */}
      {progress.total > 0 && (
        <div className="mb-8 bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(progress.completed / progress.total) * 100}%` }}
          ></div>
          <p className="text-sm text-gray-600 mt-2">
            Visited {progress.completed} of {progress.total} locations ({Math.round((progress.completed / progress.total) * 100)}%)
          </p>
        </div>
      )}
      
      {/* Shopping Locations */}
      <div className="space-y-4 mb-8">
        {shopping.locations.map((location, index) => {
          const itemId = generateShoppingId(location);
          const checked = isChecked('shopping', itemId);
          
          return (
            <div
              key={index}
              className={`border rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 ${
                checked 
                  ? 'bg-purple-50 border-purple-300' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="font-bold text-blue-600 text-lg mb-2">
                    {location.name}
                  </div>
                  <div className="inline-block bg-indigo-500 text-white px-3 py-1 rounded-full text-xs mb-3">
                    {location.type}
                  </div>
                </div>
                <label className="flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleItem('shopping', itemId)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {checked ? 'Visited!' : 'Visit'}
                  </span>
                </label>
              </div>
              <div className="text-gray-700 text-sm mb-2">
                {location.location} | {location.hours}
              </div>
              <div className="text-gray-700 text-sm mb-2">
                {location.description}
              </div>
              <div className="text-red-600 text-sm italic font-medium">
                {location.tip}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* What to Buy */}
      <h3 className="text-2xl font-bold text-blue-600 mb-6">What to Buy:</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(shopping.categories).map(([key, category]) => (
          <div key={key} className="bg-gray-50 p-4 rounded-lg">
            <div className="font-bold text-lg mb-3">
              {category.title}
            </div>
            <ul className="space-y-1">
              {category.items.map((item, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}