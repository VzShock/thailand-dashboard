import { useState, useEffect } from 'react';
import { EditablePhase } from '@/types/itinerary';

interface PhaseEditorProps {
  phase: EditablePhase;
  onUpdate: (updates: Partial<EditablePhase>) => void;
  onDelete: () => void;
  editMode: boolean;
}

export default function PhaseEditor({
  phase,
  onUpdate,
  onDelete,
  editMode,
}: PhaseEditorProps) {
  const [localTitle, setLocalTitle] = useState(phase.title);
  const [localDates, setLocalDates] = useState(phase.dates);
  const [localArrivalDay, setLocalArrivalDay] = useState(phase.arrivalDay);
  const [localDepartureDay, setLocalDepartureDay] = useState(phase.departureDay);

  // Update local state when phase prop changes
  useEffect(() => {
    setLocalTitle(phase.title);
    setLocalDates(phase.dates);
    setLocalArrivalDay(phase.arrivalDay);
    setLocalDepartureDay(phase.departureDay);
  }, [phase]);

  // Auto-save handlers
  const handleTitleChange = (value: string) => {
    setLocalTitle(value);
    onUpdate({ title: value });
  };

  const handleDatesChange = (value: string) => {
    setLocalDates(value);
    onUpdate({ dates: value });
  };

  const handleArrivalDayChange = (value: string) => {
    setLocalArrivalDay(value);
    onUpdate({ arrivalDay: value });
  };

  const handleDepartureDayChange = (value: string) => {
    setLocalDepartureDay(value);
    onUpdate({ departureDay: value });
  };

  if (!editMode) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs font-medium">
              Phase {phase.number}
            </span>
            <span className="text-indigo-600 font-medium text-sm">{localDates}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800">{localTitle}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs font-medium">
            Phase {phase.number}
          </span>
          {editMode && (
            <button
              onClick={onDelete}
              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete phase"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <input
            type="text"
            value={localTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-3 py-2 text-lg font-bold text-gray-800 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Phase title"
          />
        </div>
        
        <div>
          <input
            type="text"
            value={localDates}
            onChange={(e) => handleDatesChange(e.target.value)}
            className="w-full px-3 py-2 text-sm font-medium text-indigo-600 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Sep 3-9 (6 nights)"
          />
        </div>
        
        <div>
          <input
            type="text"
            value={localArrivalDay}
            onChange={(e) => handleArrivalDayChange(e.target.value)}
            className="w-full px-2 py-1 text-sm text-gray-600 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Wed Sep 3"
          />
        </div>
        
        <div>
          <input
            type="text"
            value={localDepartureDay}
            onChange={(e) => handleDepartureDayChange(e.target.value)}
            className="w-full px-2 py-1 text-sm text-gray-600 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Tue Sep 9"
          />
        </div>
      </div>
    </div>
  );
}