import { moodInfo } from '../../constants/moodConstants'

const MoodDistributionChart = ({ moodStats }) => {
  if (!moodStats || !moodStats.percentages) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
          <span className="text-3xl mr-3">🎨</span>
          Mood Distribution
        </h2>
        <p className="text-gray-500 text-center">No mood data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
        <span className="text-3xl mr-3">🎨</span>
        Mood Distribution
      </h2>
      <div className="space-y-6">
        {Object.entries(moodStats.percentages).map(([mood, percentage]) => (
          <div key={mood} className="group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <span className="text-3xl">{moodInfo[mood]?.emoji}</span>
                <span className="font-bold text-lg">{moodInfo[mood]?.label}</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-gray-800">
                  {percentage}%
                </span>
                <div className="text-sm text-gray-500">
                  {moodStats.counts[mood]} entries
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ease-out ${moodInfo[mood]?.barColor} shadow-sm`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MoodDistributionChart