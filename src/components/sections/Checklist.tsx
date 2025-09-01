'use client';

import { useState, useEffect } from 'react';
import checklist from '../../../data/checklist.json';

export default function Checklist() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem('thailandChecklist');
    if (saved) {
      setCheckedItems(JSON.parse(saved));
    }
  }, []);

  const toggleItem = (id: string) => {
    const newCheckedItems = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(newCheckedItems);
    localStorage.setItem('thailandChecklist', JSON.stringify(newCheckedItems));
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-blue-600 mb-8 flex items-center gap-3">
        <span className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
          ✅
        </span>
        {checklist.title}
      </h2>
      
      <div className="space-y-8">
        {checklist.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-blue-600 mb-4">{section.title}</h3>
            
            <div className="space-y-3">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-gray-100 ${
                    checkedItems[item.id] ? 'bg-green-50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    id={item.id}
                    checked={checkedItems[item.id] || false}
                    onChange={() => toggleItem(item.id)}
                    className="w-5 h-5 text-blue-600 mr-4 cursor-pointer"
                  />
                  <label
                    htmlFor={item.id}
                    className={`flex-1 cursor-pointer ${
                      checkedItems[item.id] ? 'line-through text-gray-600' : 'text-gray-800'
                    }`}
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}