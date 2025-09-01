import { useState } from 'react';

interface DetailsListProps {
  details: string[];
  onUpdateDetails: (details: string[]) => void;
  editMode: boolean;
}

export default function DetailsList({ details, onUpdateDetails, editMode }: DetailsListProps) {
  const [newDetail, setNewDetail] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleUpdateDetail = (index: number, value: string) => {
    const updatedDetails = [...details];
    updatedDetails[index] = value;
    onUpdateDetails(updatedDetails);
  };

  const handleDelete = (index: number) => {
    const updatedDetails = details.filter((_, i) => i !== index);
    onUpdateDetails(updatedDetails);
  };

  const handleAddNew = () => {
    if (newDetail.trim()) {
      onUpdateDetails([...details, newDetail.trim()]);
      setNewDetail('');
      setIsAddingNew(false);
    }
  };

  const handleCancelAdd = () => {
    setNewDetail('');
    setIsAddingNew(false);
  };

  if (!editMode) {
    return (
      <div>
        <h4 className="font-medium text-gray-800 mb-2 text-sm flex items-center gap-1">
          <span>📍</span> Activities
        </h4>
        <div className="space-y-1">
          {details.map((detail, detailIndex) => (
            <div key={detailIndex} className="flex items-start gap-2">
              <div className="w-1 h-1 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700 text-sm">{detail}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-800 text-sm flex items-center gap-1">
          <span>📍</span> Activities
        </h4>
        {!isAddingNew && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
            title="Add activity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        {details.map((detail, detailIndex) => (
          <div key={detailIndex} className="flex items-start gap-2 group">
            <div className="w-1 h-1 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
            
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={detail}
                onChange={(e) => handleUpdateDetail(detailIndex, e.target.value)}
                className="flex-1 px-2 py-1 text-sm bg-white border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Activity description..."
              />
              <button
                onClick={() => handleDelete(detailIndex)}
                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete activity"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        
        {isAddingNew && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1 h-1 bg-indigo-400 rounded-full flex-shrink-0"></div>
            <input
              type="text"
              value={newDetail}
              onChange={(e) => setNewDetail(e.target.value)}
              placeholder="Add new activity..."
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddNew();
                if (e.key === 'Escape') handleCancelAdd();
              }}
              autoFocus
            />
            <button
              onClick={handleAddNew}
              disabled={!newDetail.trim()}
              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Add activity"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              onClick={handleCancelAdd}
              className="p-1 text-gray-500 hover:bg-gray-50 rounded transition-colors"
              title="Cancel"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}