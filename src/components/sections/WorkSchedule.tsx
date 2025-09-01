'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths } from 'date-fns';
import itinerary from '../../../data/itinerary_new.json';

interface WorkDay {
  morning: boolean;
  afternoon: boolean;
  location?: string;
  isTravelDay?: boolean;
}

interface WorkScheduleData {
  title: string;
  description: string;
  schedule: Record<string, WorkDay>;
}

export default function WorkSchedule() {
  const [scheduleData, setScheduleData] = useState<WorkScheduleData | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 8, 1)); // September 2025
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    totalWorkDays: 0, 
    totalOffDays: 0, 
    weekendDays: 0,
    weekdayCount: 0,
    fullDays: 0,
    halfDays: 0 
  });
  const [locations, setLocations] = useState<string[]>([]);

  // Alternating color pattern for locations
  const colorPattern = [
    'bg-blue-100 border-blue-300',
    'bg-orange-100 border-orange-300',
    'bg-red-100 border-red-300',
    'bg-green-100 border-green-300',
    'bg-purple-100 border-purple-300',
    'bg-yellow-100 border-yellow-300'
  ];

  const getLocationColor = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const workStatus = scheduleData?.schedule[dateStr];
    if (!workStatus?.location) return 'bg-gray-50 border-gray-200';
    
    // Find the location in the ordered list to get its index
    const locationIndex = locations.indexOf(workStatus.location);
    if (locationIndex === -1) return 'bg-gray-50 border-gray-200';
    
    // Use modulo to cycle through colors
    return colorPattern[locationIndex % colorPattern.length];
  };

  // Extract unique locations from itinerary
  useEffect(() => {
    const uniqueLocations = new Set<string>();
    itinerary.phases.forEach(phase => {
      // Extract location from phase title
      const location = phase.title;
      uniqueLocations.add(location);
    });
    setLocations(Array.from(uniqueLocations));
  }, []);

  useEffect(() => {
    loadSchedule();
  }, []);

  useEffect(() => {
    if (scheduleData) {
      calculateStats();
    }
  }, [scheduleData]);

  const loadSchedule = async () => {
    try {
      const response = await fetch('/api/work-schedule');
      const data = await response.json();
      setScheduleData(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load work schedule:', error);
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (!scheduleData) return;
    
    let fullDays = 0;
    let halfDays = 0;
    let weekendDays = 0;
    let weekdayCount = 0;
    let totalDays = 0;
    let weekdayWorkDays = 0;
    
    Object.entries(scheduleData.schedule).forEach(([dateStr, day]) => {
      const date = new Date(dateStr);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      totalDays++;
      
      if (isWeekend) {
        weekendDays++;
      } else {
        weekdayCount++;
        
        // Count weekday work (full days = 1, half days = 0.5)
        if (day.morning && day.afternoon) {
          weekdayWorkDays += 1;
        } else if (day.morning || day.afternoon) {
          weekdayWorkDays += 0.5;
        }
      }
      
      // Count all work days (including weekends) for total display
      if (day.morning && day.afternoon) {
        fullDays++;
      } else if (day.morning || day.afternoon) {
        halfDays++;
      }
    });
    
    // Calculate total work days (full days count as 1, half days as 0.5)
    const totalWorkDays = fullDays + (halfDays * 0.5);
    // Calculate weekday-only days off (weekdays - weekday work days)
    const weekdayOffDays = weekdayCount - weekdayWorkDays;
    
    setStats({ 
      totalWorkDays, 
      totalOffDays: weekdayOffDays, // Now represents weekday-only days off
      weekendDays,
      weekdayCount,
      fullDays,
      halfDays 
    });
  };

  const togglePeriod = async (date: string, period: 'morning' | 'afternoon') => {
    if (!scheduleData) return;
    
    const currentValue = scheduleData.schedule[date]?.[period] || false;
    
    try {
      const response = await fetch('/api/work-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          period,
          value: !currentValue
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setScheduleData(data.data);
      }
    } catch (error) {
      console.error('Failed to update schedule:', error);
    }
  };

  const updateLocation = async (date: string, location: string) => {
    if (!scheduleData) return;
    
    try {
      const response = await fetch('/api/work-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          location
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setScheduleData(data.data);
      }
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  };

  const toggleTravelDay = async (date: string) => {
    if (!scheduleData) return;
    
    const currentValue = scheduleData.schedule[date]?.isTravelDay || false;
    
    try {
      const response = await fetch('/api/work-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          isTravelDay: !currentValue
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setScheduleData(data.data);
      }
    } catch (error) {
      console.error('Failed to update travel day:', error);
    }
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const getWorkStatus = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return scheduleData?.schedule[dateStr] || { morning: false, afternoon: false };
  };

  const isInTripRange = (date: Date) => {
    const tripStart = new Date(2025, 8, 3); // Sept 3, 2025
    const tripEnd = new Date(2025, 9, 28); // Oct 28, 2025
    return date >= tripStart && date <= tripEnd;
  };

  if (loading) {
    return <div className="bg-white rounded-2xl p-8 shadow-lg">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-blue-600 mb-2 flex items-center gap-3">
          <span className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
            💼
          </span>
          Work Schedule Tracker
        </h2>
        <p className="text-gray-600">Track your working days during the trip (Sept 3 - Oct 28, 2025)</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8 text-center">
        <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
          <div className="text-3xl font-bold text-blue-600">
            {stats.totalWorkDays.toFixed(1)} days
          </div>
          <div className="text-sm font-medium text-gray-700">Days of Work</div>
          <div className="text-xs text-gray-500 mt-1">
            (out of {stats.weekdayCount} possible weekdays)
          </div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
          <div className="text-3xl font-bold text-green-600">
            {stats.totalOffDays.toFixed(1)} days
          </div>
          <div className="text-sm font-medium text-gray-700">Weekday Days Off</div>
          <div className="text-xs text-gray-500 mt-1">
            (excluding {stats.weekendDays} weekend days)
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={currentMonth <= new Date(2025, 8, 1)}
        >
          ←
        </button>
        <h3 className="text-xl font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={currentMonth >= new Date(2025, 9, 1)}
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        
        {getDaysInMonth().map(date => {
          const workStatus = getWorkStatus(date);
          const inTrip = isInTripRange(date);
          const dateStr = format(date, 'yyyy-MM-dd');
          
          return (
            <div
              key={dateStr}
              className={`border-2 rounded-lg p-2 transition-all relative cursor-pointer ${
                inTrip ? getLocationColor(date) : 'bg-gray-50 border-gray-200 opacity-50'
              }`}
              onClick={(e) => {
                // Only toggle travel day if clicking on the card itself, not on interactive elements
                const target = e.target as HTMLElement;
                if (!target.closest('select') && !target.closest('button') && inTrip) {
                  toggleTravelDay(dateStr);
                }
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-semibold flex-1 text-center">
                  {format(date, 'd')}
                </div>
                {inTrip && workStatus.isTravelDay && (
                  <span
                    className="absolute top-1 right-1 text-xs p-0.5 rounded text-blue-600 bg-white"
                    title="Travel day"
                  >
                    ✈️
                  </span>
                )}
              </div>
              {inTrip && (
                <>
                  <select
                    value={workStatus.location || ''}
                    onChange={(e) => updateLocation(dateStr, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full text-xs px-1 py-1 mb-1 border border-gray-300 rounded bg-white hover:border-blue-400 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select...</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <div className="space-y-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePeriod(dateStr, 'morning');
                      }}
                      className={`w-full text-xs px-1 py-1 rounded transition-colors ${
                        workStatus.morning
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      AM
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePeriod(dateStr, 'afternoon');
                      }}
                      className={`w-full text-xs px-1 py-1 rounded transition-colors ${
                        workStatus.afternoon
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      PM
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">How to use:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Select your location from the dropdown for each day</li>
            <li>• Click AM to mark morning as working (6am-12pm)</li>
            <li>• Click PM to mark afternoon as working (2pm-10pm)</li>
            <li>• Orange = Working, Gray = Free time</li>
            <li>• Colors show different locations at a glance!</li>
          </ul>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Visual Guide:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Click anywhere on the card to mark travel days</li>
            <li>• <span className="text-lg">✈️</span> appears on travel days</li>
            <li>• Colors alternate between destinations for clarity</li>
            <li>• Pattern: Blue → Orange → Red → Green → Purple → Yellow</li>
          </ul>
        </div>
      </div>
    </div>
  );
}