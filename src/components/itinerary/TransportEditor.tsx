'use client';

import { useState } from 'react';
import { EditableTransport, EditableTransportOption, generateId } from '@/types/itinerary';

interface TransportEditorProps {
  transport: EditableTransport | undefined;
  onUpdate: (transport: EditableTransport | undefined) => void;
  editMode: boolean;
}

export default function TransportEditor({ transport, onUpdate, editMode }: TransportEditorProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Helper to add a new transport option
  const addOption = () => {
    if (!transport) return;
    
    const newOption: EditableTransportOption = {
      id: generateId(),
      type: '🚗 New Option',
      method: 'New method',
      duration: '1h',
      cost: '€0'
    };

    onUpdate({
      ...transport,
      options: [...transport.options, newOption]
    });
  };

  // Helper to update an option
  const updateOption = (optionIndex: number, field: keyof EditableTransportOption, value: string) => {
    if (!transport) return;

    const updatedOptions = transport.options.map((option, index) => 
      index === optionIndex ? { ...option, [field]: value } : option
    );

    onUpdate({
      ...transport,
      options: updatedOptions
    });
  };

  // Helper to delete an option
  const deleteOption = (optionIndex: number) => {
    if (!transport) return;

    const updatedOptions = transport.options.filter((_, index) => index !== optionIndex);
    onUpdate({
      ...transport,
      options: updatedOptions
    });
  };

  // Helper to update transport destination
  const updateDestination = (to: string) => {
    if (!transport) return;
    onUpdate({ ...transport, to });
  };

  // Helper to update recommendation
  const updateRecommendation = (recommendation: string) => {
    if (!transport) return;
    onUpdate({ ...transport, recommendation });
  };

  // Helper to create new transport
  const createTransport = () => {
    const newTransport: EditableTransport = {
      id: generateId(),
      to: 'New Destination',
      options: [{
        id: generateId(),
        type: '🚗 Standard',
        method: 'New method',
        duration: '1h',
        cost: '€0'
      }],
      recommendation: ''
    };
    onUpdate(newTransport);
  };

  // Helper to delete entire transport
  const deleteTransport = () => {
    onUpdate(undefined);
  };

  const getTransportIcon = (type: string) => {
    if (type.includes('✈️')) return '✈️';
    if (type.includes('🚆')) return '🚆';
    if (type.includes('🚐')) return '🚐';
    if (type.includes('🛵')) return '🛵';
    if (type.includes('🛥️')) return '⛵';
    if (type.includes('🚌')) return '🚌';
    if (type.includes('🚕')) return '🚕';
    return '🚗';
  };

  // If no transport and not in edit mode, don't show anything
  if (!transport && !editMode) {
    return null;
  }

  // If no transport but in edit mode, show create button
  if (!transport && editMode) {
    return (
      <div>
        <h4 className="font-medium text-gray-800 mb-2 text-sm flex items-center gap-1">
          <span>🚀</span> Next: 
        </h4>
        <button
          onClick={createTransport}
          className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-md p-2 border-2 border-dashed border-blue-300 hover:border-blue-400 transition-all duration-300"
        >
          <div className="flex items-center justify-center gap-2 text-blue-700">
            <span>+</span>
            <span className="text-sm">Add transport options</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Destination header */}
      <div className="mb-2">
        {editMode ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">🚀</span>
            <span className="font-medium text-gray-800 text-sm">Next:</span>
            <input
              type="text"
              value={transport!.to}
              onChange={(e) => updateDestination(e.target.value)}
              className="flex-1 px-2 py-1 text-sm font-medium bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Destination"
            />
            <button
              onClick={deleteTransport}
              className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
              title="Delete transport"
            >
              ×
            </button>
          </div>
        ) : (
          <h4 className="font-medium text-gray-800 mb-2 text-sm flex items-center gap-1">
            <span>🚀</span> Next: {transport!.to}
          </h4>
        )}
      </div>
      
      {/* Transport options */}
      <div className="space-y-2">
        {transport!.options.map((option, optionIndex) => (
          <div key={option.id} className="bg-gray-50 border border-gray-200 rounded-md p-2">
            {editMode ? (
              <>
                {/* Editable option header */}
                <div className="flex items-center justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={option.type}
                      onChange={(e) => updateOption(optionIndex, 'type', e.target.value)}
                      className="px-2 py-1 text-sm font-medium bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Type (e.g., ✈️ Fast)"
                    />
                    <input
                      type="text"
                      value={option.cost}
                      onChange={(e) => updateOption(optionIndex, 'cost', e.target.value)}
                      className="px-2 py-1 text-xs font-bold text-green-600 bg-green-50 border border-green-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Cost"
                    />
                  </div>
                  <button
                    onClick={() => deleteOption(optionIndex)}
                    className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                    title="Delete option"
                  >
                    ×
                  </button>
                </div>
                
                {/* Editable method */}
                <input
                  type="text"
                  value={option.method}
                  onChange={(e) => updateOption(optionIndex, 'method', e.target.value)}
                  className="w-full mb-2 px-2 py-1 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Method description"
                />
                
                {/* Editable duration */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">⏱️</span>
                  <input
                    type="text"
                    value={option.duration}
                    onChange={(e) => updateOption(optionIndex, 'duration', e.target.value)}
                    className="px-2 py-1 text-xs text-gray-500 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Duration"
                  />
                </div>
              </>
            ) : (
              <>
                {/* Read-only view */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <span className="text-sm">{getTransportIcon(option.type)}</span>
                    <span className="font-medium text-gray-800 text-sm">
                      {option.type.replace(/[✈️🚆🚐🛵🛥️🚌🚕]/g, '').trim()}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                    {option.cost}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-1">{option.method}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>⏱️ {option.duration}</span>
                </div>
              </>
            )}
          </div>
        ))}
        
        {/* Add option button (edit mode only) */}
        {editMode && (
          <button
            onClick={addOption}
            className="w-full bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-md p-2 border-2 border-dashed border-green-300 hover:border-green-400 transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-2 text-green-700">
              <span>+</span>
              <span className="text-sm">Add transport option</span>
            </div>
          </button>
        )}
        
        {/* Recommendation */}
        {(transport!.recommendation || editMode) && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-2">
            {editMode ? (
              <div className="flex items-center gap-1">
                <span className="text-xs">💡</span>
                <input
                  type="text"
                  value={transport!.recommendation || ''}
                  onChange={(e) => updateRecommendation(e.target.value)}
                  className="flex-1 px-2 py-1 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Add recommendation..."
                />
              </div>
            ) : (
              transport!.recommendation && (
                <div className="text-xs font-medium text-amber-800 flex items-center gap-1">
                  <span>💡</span>
                  <span>{transport!.recommendation}</span>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}