'use client';

import { useRef, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useItinerary } from '@/hooks/useItinerary';
import { EditablePhase } from '@/types/itinerary';
import PhaseEditor from '@/components/itinerary/PhaseEditor';
import DetailsList from '@/components/itinerary/DetailsList';
import TransportEditor from '@/components/itinerary/TransportEditor';

export default function Itinerary() {
  const {
    itinerary,
    isLoaded,
    isLoading,
    isSaving,
    editMode,
    error,
    hasUnsavedChanges,
    toggleEditMode,
    updatePhase,
    deletePhase,
    updateDetails,
    reorderPhases,
    addPhase,
    updateTransport,
  } = useItinerary();
  const [targetCard, setTargetCard] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToCard = (index: number) => {
    if (cardRefs.current[index]) {
      setTargetCard(index);
      
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Use instant scroll if spamming, smooth scroll otherwise
      const behavior = Math.abs(index - targetCard) > 1 ? 'auto' : 'smooth';
      
      cardRefs.current[index]?.scrollIntoView({
        behavior,
        block: 'center'
      });
    }
  };

  const goToPrevious = () => {
    if (targetCard > 0) {
      scrollToCard(targetCard - 1);
    }
  };

  const goToNext = () => {
    if (itinerary && targetCard < itinerary.phases.length - 1) {
      scrollToCard(targetCard + 1);
    }
  };

  // Handle drag end for reordering phases
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !itinerary) return;
    
    const { source, destination } = result;
    if (source.index === destination.index) return;
    
    // Create new order based on drag result
    const newPhases = Array.from(itinerary.phases);
    const [reorderedPhase] = newPhases.splice(source.index, 1);
    newPhases.splice(destination.index, 0, reorderedPhase);
    
    // Get the new phase IDs in order
    const newPhaseIds = newPhases.map(phase => phase.id);
    
    try {
      await reorderPhases(newPhaseIds);
    } catch (error) {
      console.error('Failed to reorder phases:', error);
    }
  };

  // Handle adding a new phase
  const handleAddPhase = async () => {
    if (!itinerary) return;
    
    const newPhaseNumber = itinerary.phases.length + 1;
    const newPhase = {
      title: `New Phase ${newPhaseNumber}`,
      dates: 'TBD',
      arrivalDay: 'TBD',
      departureDay: 'TBD',
      details: ['Activity to be planned'],
    };
    
    try {
      await addPhase(newPhase);
      // Scroll to the new phase
      setTimeout(() => {
        const newIndex = itinerary.phases.length;
        scrollToCard(newIndex);
      }, 100);
    } catch (error) {
      console.error('Failed to add new phase:', error);
    }
  };

  const getLocationIcon = (title: string) => {
    if (title.toLowerCase().includes('bangkok')) return '🏙️';
    if (title.toLowerCase().includes('chiang mai')) return '🏛️';
    if (title.toLowerCase().includes('pai')) return '🏔️';
    if (title.toLowerCase().includes('samui')) return '🏝️';
    if (title.toLowerCase().includes('tao')) return '🤿';
    if (title.toLowerCase().includes('phangan')) return '🌙';
    if (title.toLowerCase().includes('khao sok')) return '🌿';
    if (title.toLowerCase().includes('krabi') || title.toLowerCase().includes('railay')) return '🧗';
    if (title.toLowerCase().includes('trang') || title.toLowerCase().includes('mook')) return '⛱️';
    if (title.toLowerCase().includes('prachuap')) return '🐚';
    return '📍';
  };

  // Loading state - show loading for initial load and when no data
  if (isLoading || !isLoaded) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading itinerary...</p>
        </div>
      </div>
    );
  }

  // Handle case where data failed to load
  if (!itinerary) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 shadow-lg">
        <div className="text-center">
          <div className="text-yellow-600 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Itinerary Data</h3>
          <p className="text-yellow-600 mb-4">The itinerary data could not be loaded.</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 shadow-lg">
        <div className="text-center">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Itinerary</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg relative">
      <div className="text-center mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-blue-600">
              {itinerary.title}
            </h2>
            {hasUnsavedChanges && (
              <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                Unsaved changes
              </span>
            )}
            {isSaving && (
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
                Saving...
              </span>
            )}
          </div>
          <button
            onClick={toggleEditMode}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              editMode
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {editMode ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                View Mode
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Mode
              </>
            )}
          </button>
        </div>
        <div className="flex justify-center gap-6 text-sm font-medium text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>{itinerary.stats.destinations} Destinations</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>{itinerary.stats.islandTime} Island Days</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span>{itinerary.stats.workDays} Work Days</span>
          </div>
        </div>
      </div>
      
      {/* Fixed Navigation buttons - Bottom Right */}
      <div className="fixed bottom-16 right-6 z-30 flex flex-col gap-3 md:bottom-6">
        {/* Progress indicator */}
        <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-full px-3 py-2 shadow-lg text-xs font-medium text-gray-700 text-center min-w-[60px]">
          {targetCard + 1}/{itinerary.phases.length}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={goToPrevious}
            disabled={targetCard === 0}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full shadow-lg hover:shadow-xl disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">↑</span>
          </button>
          
          <button
            onClick={goToNext}
            disabled={targetCard === itinerary.phases.length - 1}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full shadow-lg hover:shadow-xl disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">↓</span>
          </button>
        </div>
      </div>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-3 md:left-6 top-0 bottom-0 w-0.5 md:w-1 bg-gradient-to-b from-blue-400 via-indigo-500 to-purple-600 rounded-full"></div>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="phases" isDropDisabled={!editMode}>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-4 ${snapshot.isDraggingOver ? 'bg-blue-50/50 rounded-lg p-2' : ''}`}
              >
                {itinerary.phases.map((phase: EditablePhase, index) => (
                  <Draggable 
                    key={phase.id} 
                    draggableId={phase.id} 
                    index={index}
                    isDragDisabled={!editMode}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={(el) => {
                          cardRefs.current[index] = el;
                          provided.innerRef(el);
                        }}
                        {...provided.draggableProps}
                        className={`relative ${snapshot.isDragging ? 'z-50' : ''}`}
                      >
                        <div 
                          className={`absolute left-0 md:left-2 w-6 h-6 md:w-8 md:h-8 bg-white border-2 md:border-4 border-indigo-500 rounded-full items-center justify-center z-[5] shadow-lg ${
                            editMode ? 'cursor-grab active:cursor-grabbing' : ''
                          } ${snapshot.isDragging ? 'border-blue-400 bg-blue-50' : ''} flex`}
                          {...provided.dragHandleProps}
                        >
                          <span className="text-xs md:text-sm">{getLocationIcon(phase.title)}</span>
                        </div>
              
              {/* Content card - More compact on mobile */}
              <div className="ml-10 md:ml-16">
                <div className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 border ${
                  editMode ? 'border-blue-200' : 'border-gray-100'
                }`}>
                  {/* Header with edit capability */}
                  <div className="mb-3">
                    <PhaseEditor
                      phase={phase}
                      onUpdate={(updates) => updatePhase(phase.id, updates)}
                      onDelete={() => deletePhase(phase.id)}
                      editMode={editMode}
                    />
                  </div>

                  {/* Content grid with editable details */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <DetailsList
                        details={phase.details}
                        onUpdateDetails={(details) => updateDetails(phase.id, details)}
                        editMode={editMode}
                      />
                    </div>

                    {/* Editable transport options */}
                    <TransportEditor
                      transport={phase.nextTransport || phase.finalTransport}
                      onUpdate={(transport) => {
                        const isNext = !!phase.nextTransport;
                        const isFinal = !!phase.finalTransport;
                        
                        if (transport) {
                          updateTransport(phase.id, transport, isNext || !isFinal);
                        } else {
                          // Delete transport
                          updatePhase(phase.id, {
                            [isNext ? 'nextTransport' : 'finalTransport']: undefined
                          });
                        }
                      }}
                      editMode={editMode}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
        
        {/* Add Phase Button (only in edit mode) */}
        {editMode && (
          <div className="relative mt-4">
            <div className="absolute left-0 md:left-2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-full flex items-center justify-center z-[5] shadow-lg cursor-pointer transition-all duration-300 hover:scale-110">
              <button
                onClick={handleAddPhase}
                className="w-full h-full flex items-center justify-center text-white text-xs md:text-sm"
                title="Add new phase"
              >
                ➕
              </button>
            </div>
            <div className="ml-10 md:ml-16">
              <button
                onClick={handleAddPhase}
                className="w-full bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-lg p-4 border-2 border-dashed border-green-300 hover:border-green-400 transition-all duration-300 group"
              >
                <div className="flex items-center justify-center gap-2 text-green-700 group-hover:text-green-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-medium">Add New Phase</span>
                </div>
                <p className="text-green-600 text-xs mt-1 group-hover:text-green-700">
                  Click to add another destination to your journey
                </p>
              </button>
            </div>
          </div>
        )}
        
        {/* Compact end marker */}
        <div className="relative mt-4">
          <div className="absolute left-0 md:left-2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center z-[5] shadow-lg">
            <span className="text-white text-xs md:text-sm">🏁</span>
          </div>
          <div className="ml-10 md:ml-16">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 border border-purple-200">
              <h3 className="font-bold text-purple-800 text-sm">Journey Complete!</h3>
              <p className="text-purple-600 text-xs mt-1">
                {itinerary.stats.totalDays} days across {itinerary.stats.destinations} amazing destinations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}