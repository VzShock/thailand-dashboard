'use client';

import { useState, useEffect, useCallback } from 'react';

type TrackerData = {
  food: Record<string, boolean>;
  activities: Record<string, boolean>;
  shopping: Record<string, boolean>;
  health: Record<string, boolean>;
  vaccinations: Record<string, boolean>;
};

const defaultData: TrackerData = {
  food: {},
  activities: {},
  shopping: {},
  health: {},
  vaccinations: {},
};

export function useTracker() {
  const [trackerData, setTrackerData] = useState<TrackerData>(defaultData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load shared data from API on mount
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tracker');
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setTrackerData({ ...defaultData, ...result.data });
        }
      } else {
        console.warn('Failed to load tracker data from server, using defaults');
      }
    } catch (error) {
      console.error('Error loading tracker data:', error);
      // Fallback to localStorage for offline support
      try {
        const saved = localStorage.getItem('thailand-trip-tracker');
        if (saved) {
          const parsedData = JSON.parse(saved);
          setTrackerData({ ...defaultData, ...parsedData });
        }
      } catch (localError) {
        console.error('Error loading from localStorage:', localError);
      }
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Save shared data to API with localStorage backup
  const saveData = useCallback(async (data: TrackerData) => {
    try {
      const response = await fetch('/api/tracker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        throw new Error('Failed to save to server');
      }

      // Also save to localStorage as backup
      localStorage.setItem('thailand-trip-tracker', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving tracker data:', error);
      // Fallback to localStorage only
      try {
        localStorage.setItem('thailand-trip-tracker', JSON.stringify(data));
      } catch (localError) {
        console.error('Error saving to localStorage:', localError);
      }
    }
  }, []);

  const toggleItem = async (section: keyof TrackerData, itemId: string) => {
    const newValue = !trackerData[section][itemId];
    
    // Optimistically update UI
    const newData = {
      ...trackerData,
      [section]: {
        ...trackerData[section],
        [itemId]: newValue,
      },
    };
    setTrackerData(newData);
    
    // Save to server
    await saveData(newData);
  };

  const isChecked = (section: keyof TrackerData, itemId: string): boolean => {
    return trackerData[section][itemId] || false;
  };

  const getProgress = (section: keyof TrackerData, totalItems: number): { completed: number; total: number } => {
    const sectionData = trackerData[section];
    const completed = Object.values(sectionData).filter(Boolean).length;
    return { completed, total: totalItems };
  };

  const getOverallProgress = (sectionTotals: Record<keyof TrackerData, number>): { completed: number; total: number } => {
    let totalCompleted = 0;
    let totalItems = 0;

    Object.entries(sectionTotals).forEach(([section, total]) => {
      const progress = getProgress(section as keyof TrackerData, total);
      totalCompleted += progress.completed;
      totalItems += progress.total;
    });

    return { completed: totalCompleted, total: totalItems };
  };

  return {
    toggleItem,
    isChecked,
    getProgress,
    getOverallProgress,
    isLoaded,
    isLoading,
    reloadData: loadData,
  };
}