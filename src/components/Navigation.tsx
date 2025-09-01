type SectionType = 'overview' | 'itinerary' | 'food' | 'activities' | 'shopping' | 'health' | 'budget' | 'checklist' | 'work';

interface NavigationProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

const mainNavigationItems: { id: SectionType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'itinerary', label: '56-Day Itinerary' },
  { id: 'food', label: 'Food Journey' },
  { id: 'activities', label: 'Activities & Experiences' },
  { id: 'shopping', label: 'Shopping Guide' },
  { id: 'health', label: 'Health & Safety' },
];

const bottomIcons: { id: SectionType; label: string; icon: string }[] = [
  { id: 'budget', label: 'Budget Planner', icon: '💰' },
  { id: 'checklist', label: 'Master Checklist', icon: '✅' },
  { id: 'work', label: 'Work Schedule', icon: '💼' },
];

export default function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  return (
    <nav className="bg-white rounded-2xl p-5 mb-8 shadow-xl">
      {/* Main navigation buttons */}
      <div className="flex justify-center flex-wrap gap-3 mb-4">
        {mainNavigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`
              px-5 py-3 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105
              ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-md'
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </div>
      
      {/* Bottom icon row */}
      <div className="flex justify-center gap-4 pt-3 border-t border-gray-200">
        {bottomIcons.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`
              flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 transform hover:scale-105
              ${
                activeSection === item.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }
            `}
            title={item.label}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}