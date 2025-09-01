'use client';

import { useState, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import food from '../../../data/food.json';
import { useTracker } from '@/hooks/useTracker';
import { generateFoodId } from '@/utils/itemId';

export default function Food() {
  const { toggleItem, isChecked, getProgress, isLoaded } = useTracker();
  const progress = getProgress('food', food.foods.length);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-2xl p-4 md:p-8 shadow-lg">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 md:p-8 shadow-lg">
      {/* Mobile-optimized Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg md:text-xl">
          🍜
        </span>
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-blue-600">{food.title}</h2>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:hidden">
            {progress.completed}/{progress.total} tried
          </p>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4 text-sm md:text-base hidden md:block">{food.description}</p>
      
      {/* Mobile-optimized Progress Bar */}
      {progress.total > 0 && (
        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-2 md:h-3 mb-2">
            <motion.div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-2 md:h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(progress.completed / progress.total) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs md:text-sm text-gray-600">
            <span className="font-semibold">{progress.completed}</span> of {progress.total} dishes tried 
            <span className="text-green-600 font-medium ml-1">
              ({Math.round((progress.completed / progress.total) * 100)}%)
            </span>
          </p>
        </div>
      )}
      
      {/* Responsive Grid Layout */}
      <div className={`grid ${
        isMobile 
          ? 'grid-cols-1 gap-3' 
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      }`}>
        {food.foods.map((item, index) => {
          const itemId = generateFoodId(item);
          const checked = isChecked('food', itemId);
          
          return (
            <FoodCard
              key={index}
              item={item}
              itemId={itemId}
              checked={checked}
              onToggle={() => toggleItem('food', itemId)}
              isMobile={isMobile}
            />
          );
        })}
      </div>
      
      {/* Mobile Helper Text */}
      {isMobile && (
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700 text-center">
            💡 <strong>Tip:</strong> Swipe right on any dish to mark it as &quot;Tried!&quot; or tap the checkmark
          </p>
        </div>
      )}
    </div>
  );
}

// Mobile-optimized Food Card Component
interface FoodCardProps {
  item: {
    name: string;
    location: string;
    price: string;
    note?: string;
  };
  itemId: string;
  checked: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

function FoodCard({ item, checked, onToggle, isMobile }: FoodCardProps) {
  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (isMobile && info.offset.x > 50 && !checked) {
      // Swipe right to mark as tried
      onToggle();
    }
    // The card will automatically snap back due to dragConstraints
  };

  if (isMobile) {
    return (
      <motion.div className="relative">
        {/* Swipe Action Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-xl flex items-center justify-start pl-4 opacity-0">
          <div className="text-white font-semibold text-sm flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span className="text-xs">Swipe to mark as tried!</span>
          </div>
        </div>

        {/* Card Content */}
        <motion.div
          drag={!checked ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.3}
          onDragEnd={handleDragEnd}
          whileDrag={{ 
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            scale: 1.02,
            x: [0, 60] // Allow dragging to 60px but snap back
          }}
          whileTap={{ scale: 0.98 }}
          dragTransition={{ bounceStiffness: 400, bounceDamping: 25 }}
          className={`border rounded-xl p-4 shadow-md transition-all duration-200 relative z-10 ${
            checked 
              ? 'bg-green-50 border-green-300' 
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 mb-2 leading-tight">
                {item.name}
              </h3>
              <div className="space-y-1">
                <p className="text-xs text-gray-600 truncate">
                  {item.location}
                </p>
                <p className="text-xs text-green-700 font-medium">
                  {item.price}
                </p>
                {item.note && (
                  <p className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1 mt-2">
                    💡 {item.note}
                  </p>
                )}
              </div>
            </div>
            
            {/* Mobile Checkbox */}
            <motion.button
              onClick={onToggle}
              className={`ml-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                checked 
                  ? 'bg-green-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              {checked ? (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="text-sm"
                >
                  ✓
                </motion.span>
              ) : (
                <span className="text-sm">○</span>
              )}
            </motion.button>
          </div>

          {/* Completion Badge - Fixed positioning */}
          {checked && (
            <motion.div
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-20"
            >
              ✓ Tried!
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    );
  }

  // Desktop version
  return (
    <motion.div
      className={`border rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
        checked 
          ? 'bg-green-50 border-green-300' 
          : 'bg-white border-gray-200'
      }`}
      whileHover={{ y: -4 }}
      layout
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">
          {item.name}
        </h3>
        <motion.button
          onClick={onToggle}
          className={`ml-3 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
            checked 
              ? 'bg-green-500 text-white shadow-md' 
              : 'bg-gray-200 text-gray-500 hover:bg-green-200'
          }`}
          whileTap={{ scale: 0.9 }}
        >
          {checked ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xs"
            >
              ✓
            </motion.span>
          ) : null}
        </motion.button>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600">{item.location}</p>
        <p className="text-sm text-green-700 font-medium">{item.price}</p>
        {item.note && (
          <p className="text-sm text-blue-600 bg-blue-50 rounded p-2">
            💡 {item.note}
          </p>
        )}
      </div>

      {checked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2 bg-green-100 rounded-lg text-green-800 text-sm text-center font-medium"
        >
          <span className="mr-2">🎉</span>
          &apos;Tried!&apos;
        </motion.div>
      )}
    </motion.div>
  );
}