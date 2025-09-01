'use client';

import health from '../../../data/health.json';
import { useTracker } from '@/hooks/useTracker';
import { generateVaccinationId } from '@/utils/itemId';

export default function Health() {
  const { toggleItem, isChecked, getProgress, isLoaded } = useTracker();
  const progress = getProgress('vaccinations', health.vaccinations.vaccines.length);

  if (!isLoaded) {
    return <div className="bg-white rounded-2xl p-8 shadow-lg">Loading...</div>;
  }
  return (
    <div className="space-y-6">
      {/* Vaccinations */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-blue-600 mb-4 flex items-center gap-3">
          <span className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
            💉
          </span>
          {health.vaccinations.title}
        </h2>
        <p className="text-gray-700 mb-4">{health.vaccinations.description}</p>
        
        {/* Progress Bar */}
        {progress.total > 0 && (
          <div className="mb-6 bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(progress.completed / progress.total) * 100}%` }}
            ></div>
            <p className="text-sm text-gray-600 mt-2">
              Completed {progress.completed} of {progress.total} vaccinations ({Math.round((progress.completed / progress.total) * 100)}%)
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          {health.vaccinations.vaccines.map((vaccine, index) => {
            const itemId = generateVaccinationId(vaccine);
            const checked = isChecked('vaccinations', itemId);
            
            return (
              <div 
                key={index} 
                className={`flex items-center gap-4 p-4 rounded-xl border-l-4 transition-all duration-300 ${
                  checked 
                    ? 'bg-green-50 border-green-500' 
                    : 'bg-gray-50 border-indigo-500'
                }`}
              >
                <div className="text-2xl">{vaccine.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-blue-600 mb-1">{vaccine.name}</div>
                  <div className="text-gray-700 text-sm">{vaccine.timing}</div>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleItem('vaccinations', itemId)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {checked ? 'Done!' : 'Complete'}
                  </span>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {health.emergency.contacts.map((contact, index) => (
          <div key={index} className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-6">
            <h4 className="text-xl font-bold mb-3">{contact.title}</h4>
            <div className="text-2xl font-bold mb-2">{contact.number}</div>
            <div className="text-sm opacity-90 mb-3">{contact.description}</div>
            <div className="text-sm opacity-80 whitespace-pre-line">{contact.details}</div>
          </div>
        ))}
      </div>
    </div>
  );
}