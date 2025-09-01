import { useState, useEffect, useCallback, useRef } from 'react';
import { EditableItinerary, EditablePhase, EditableTransport, generateId } from '@/types/itinerary';

interface UseItineraryReturn {
  itinerary: EditableItinerary | null;
  isLoaded: boolean;
  isLoading: boolean;
  isSaving: boolean;
  editMode: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
  
  // Edit mode controls
  toggleEditMode: () => void;
  setEditMode: (enabled: boolean) => void;
  
  // Phase operations
  addPhase: (phase: Partial<EditablePhase>) => Promise<void>;
  updatePhase: (phaseId: string, updates: Partial<EditablePhase>) => Promise<void>;
  deletePhase: (phaseId: string) => Promise<void>;
  reorderPhases: (phaseIds: string[]) => Promise<void>;
  
  // Detail operations
  updateDetails: (phaseId: string, details: string[]) => Promise<void>;
  addDetail: (phaseId: string, detail: string) => Promise<void>;
  updateDetail: (phaseId: string, detailIndex: number, detail: string) => Promise<void>;
  deleteDetail: (phaseId: string, detailIndex: number) => Promise<void>;
  
  // Transport operations
  updateTransport: (phaseId: string, transport: EditableTransport, isNext: boolean) => Promise<void>;
  
  // Utility operations
  reloadData: () => Promise<void>;
  saveData: () => Promise<void>;
  discardChanges: () => Promise<void>;
}

// Simple debounce hook
function useDebounceCallback<T>(callback: (arg: T) => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  return useCallback((arg: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(arg);
    }, delay);
  }, [callback, delay]);
}

export function useItinerary(): UseItineraryReturn {
  const [itinerary, setItinerary] = useState<EditableItinerary | null>(null);
  const [originalItinerary, setOriginalItinerary] = useState<EditableItinerary | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editMode, setEditModeState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Ensure client-side hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  // Auto-save functionality
  const performSave = useCallback(async (data: EditableItinerary) => {
    if (!data) return;
    
    try {
      setIsSaving(true);
      setError(null);
      
      const response = await fetch('/api/itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save itinerary');
      }
      
      // Update with server response (includes new version)
      setItinerary(result.data);
      setOriginalItinerary(result.data);
      setHasUnsavedChanges(false);
      
    } catch (err) {
      console.error('Error saving itinerary:', err);
      setError(err instanceof Error ? err.message : 'Failed to save itinerary');
    } finally {
      setIsSaving(false);
    }
  }, []);
  
  // Debounced auto-save (2 seconds after last change)
  const debouncedSave = useDebounceCallback(performSave, 2000);
  
  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/itinerary');
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to load itinerary');
      }
      
      setItinerary(result.data);
      setOriginalItinerary(result.data);
      setIsLoaded(true);
      setHasUnsavedChanges(false);
      
    } catch (err) {
      console.error('Error loading itinerary:', err);
      setError(err instanceof Error ? err.message : 'Failed to load itinerary');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Load data on mount, but only after hydration
  useEffect(() => {
    if (isHydrated) {
      loadData();
    }
  }, [loadData, isHydrated]);
  
  // Auto-save when data changes (only in edit mode and after hydration)
  useEffect(() => {
    if (isHydrated && editMode && itinerary && hasUnsavedChanges) {
      debouncedSave(itinerary);
    }
  }, [isHydrated, editMode, itinerary, hasUnsavedChanges, debouncedSave]);
  
  // Helper to update itinerary and mark as changed
  const updateItinerary = useCallback((updater: (prev: EditableItinerary) => EditableItinerary) => {
    setItinerary(prev => {
      if (!prev) return prev;
      const updated = updater(prev);
      setHasUnsavedChanges(true);
      return updated;
    });
  }, []);
  
  // Edit mode controls
  const toggleEditMode = useCallback(() => {
    setEditModeState(prev => !prev);
  }, []);
  
  const setEditMode = useCallback((enabled: boolean) => {
    setEditModeState(enabled);
  }, []);
  
  // Phase operations
  const addPhase = useCallback(async (phaseData: Partial<EditablePhase>) => {
    if (!itinerary) return;
    
    const newPhase: EditablePhase = {
      id: generateId(),
      number: itinerary.phases.length + 1,
      title: phaseData.title || 'New Phase',
      dates: phaseData.dates || '',
      arrivalDay: phaseData.arrivalDay || '',
      departureDay: phaseData.departureDay || '',
      details: phaseData.details || [],
      nextTransport: phaseData.nextTransport,
      finalTransport: phaseData.finalTransport,
    };
    
    updateItinerary(prev => ({
      ...prev,
      phases: [...prev.phases, newPhase],
    }));
  }, [itinerary, updateItinerary]);
  
  const updatePhase = useCallback(async (phaseId: string, updates: Partial<EditablePhase>) => {
    updateItinerary(prev => ({
      ...prev,
      phases: prev.phases.map(phase => 
        phase.id === phaseId ? { ...phase, ...updates } : phase
      ),
    }));
  }, [updateItinerary]);
  
  const deletePhase = useCallback(async (phaseId: string) => {
    updateItinerary(prev => ({
      ...prev,
      phases: prev.phases
        .filter(phase => phase.id !== phaseId)
        .map((phase, index) => ({ ...phase, number: index + 1 })),
    }));
  }, [updateItinerary]);
  
  const reorderPhases = useCallback(async (phaseIds: string[]) => {
    if (!itinerary) return;
    
    const reorderedPhases = phaseIds
      .map(id => itinerary.phases.find(p => p.id === id))
      .filter(Boolean) as EditablePhase[];
    
    if (reorderedPhases.length !== itinerary.phases.length) {
      throw new Error('Invalid phase reorder');
    }
    
    updateItinerary(prev => ({
      ...prev,
      phases: reorderedPhases.map((phase, index) => ({ ...phase, number: index + 1 })),
    }));
  }, [itinerary, updateItinerary]);
  
  // Detail operations
  const updateDetails = useCallback(async (phaseId: string, details: string[]) => {
    updateItinerary(prev => ({
      ...prev,
      phases: prev.phases.map(phase => 
        phase.id === phaseId ? { ...phase, details: [...details] } : phase
      ),
    }));
  }, [updateItinerary]);
  
  const addDetail = useCallback(async (phaseId: string, detail: string) => {
    updateItinerary(prev => ({
      ...prev,
      phases: prev.phases.map(phase => 
        phase.id === phaseId 
          ? { ...phase, details: [...phase.details, detail] }
          : phase
      ),
    }));
  }, [updateItinerary]);
  
  const updateDetail = useCallback(async (phaseId: string, detailIndex: number, detail: string) => {
    updateItinerary(prev => ({
      ...prev,
      phases: prev.phases.map(phase => 
        phase.id === phaseId 
          ? { 
              ...phase, 
              details: phase.details.map((d, i) => i === detailIndex ? detail : d)
            }
          : phase
      ),
    }));
  }, [updateItinerary]);
  
  const deleteDetail = useCallback(async (phaseId: string, detailIndex: number) => {
    updateItinerary(prev => ({
      ...prev,
      phases: prev.phases.map(phase => 
        phase.id === phaseId 
          ? { 
              ...phase, 
              details: phase.details.filter((_, i) => i !== detailIndex)
            }
          : phase
      ),
    }));
  }, [updateItinerary]);
  
  // Transport operations
  const updateTransport = useCallback(async (phaseId: string, transport: EditableTransport, isNext: boolean) => {
    updateItinerary(prev => ({
      ...prev,
      phases: prev.phases.map(phase => 
        phase.id === phaseId 
          ? { 
              ...phase, 
              [isNext ? 'nextTransport' : 'finalTransport']: transport
            }
          : phase
      ),
    }));
  }, [updateItinerary]);
  
  // Utility operations
  const reloadData = useCallback(async () => {
    await loadData();
  }, [loadData]);
  
  const saveData = useCallback(async () => {
    if (itinerary) {
      await performSave(itinerary);
    }
  }, [itinerary, performSave]);
  
  const discardChanges = useCallback(async () => {
    if (originalItinerary) {
      setItinerary(originalItinerary);
      setHasUnsavedChanges(false);
    }
  }, [originalItinerary]);
  
  return {
    itinerary,
    isLoaded,
    isLoading,
    isSaving,
    editMode,
    error,
    hasUnsavedChanges,
    
    // Edit mode controls
    toggleEditMode,
    setEditMode,
    
    // Phase operations
    addPhase,
    updatePhase,
    deletePhase,
    reorderPhases,
    
    // Detail operations
    updateDetails,
    addDetail,
    updateDetail,
    deleteDetail,
    
    // Transport operations
    updateTransport,
    
    // Utility operations
    reloadData,
    saveData,
    discardChanges,
  };
}