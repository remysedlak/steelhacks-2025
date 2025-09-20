import { timeframeOptions } from '../../constants/moodConstants'

const TimeframeSelector = ({ timeframe, setTimeframe }) => {
  return (
    <div className="flex justify-center mb-12">
      <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
        {timeframeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setTimeframe(option.value)}
            className={`px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
              timeframe === option.value
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TimeframeSelector