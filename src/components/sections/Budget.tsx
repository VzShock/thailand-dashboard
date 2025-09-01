import budget from '../../../data/budget.json';

export default function Budget() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-blue-600 mb-8 flex items-center gap-3">
        <span className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
          💰
        </span>
        {budget.title}
      </h2>
      
      {/* Budget Chart */}
      <div className="flex justify-around items-end h-80 mb-8 bg-gray-50 rounded-xl p-6">
        {budget.categories.map((category, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center cursor-pointer group"
          >
            <div
              className="bg-gradient-to-t from-indigo-500 to-purple-600 rounded-t-lg w-24 transition-all duration-300 hover:-translate-y-3 hover:shadow-lg"
              style={{ height: category.height }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 font-bold text-blue-600 text-sm whitespace-nowrap">
                {category.range}
              </div>
            </div>
            <div className="absolute -bottom-12 text-center text-sm w-32">
              <div className="font-medium">{category.label}</div>
              <div className="text-xs text-gray-700 font-medium">{category.duration}</div>
            </div>
            
            {/* Tooltip on hover */}
            <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
              <div className="font-bold">{category.label}</div>
              <div>{category.range}</div>
              <div className="mt-1">{category.details}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Total Budget */}
      <div className="text-center bg-gray-50 rounded-xl p-6">
        <div className="text-lg">Total Budget Range</div>
        <div className="text-4xl font-bold text-blue-600 my-3">{budget.total.range}</div>
        <div className="text-lg text-gray-700 mb-4">{budget.total.daily}</div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="font-bold text-green-700 mb-2">💡 Budget Tips:</div>
          <div className="text-sm text-green-700 font-medium">{budget.tips}</div>
        </div>
      </div>
    </div>
  );
}