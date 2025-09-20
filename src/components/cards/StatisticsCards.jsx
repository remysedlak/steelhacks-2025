const StatisticsCards = ({ moodStats, averages }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      {/* Total Entries */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Total Entries</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {moodStats.total}
            </p>
          </div>
          <div className="text-5xl opacity-80">📝</div>
        </div>
      </div>

      {/* Average Sleep */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Average Sleep</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {averages.sleep}h
            </p>
            <p className="text-xs text-gray-500 mt-1">
              from {averages.sleepEntries} entries
            </p>
          </div>
          <div className="text-5xl opacity-80">💤</div>
        </div>
      </div>

      {/* Average Exercise */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Average Exercise</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              {averages.exercise}min
            </p>
            <p className="text-xs text-gray-500 mt-1">
              from {averages.exerciseEntries} entries
            </p>
          </div>
          <div className="text-5xl opacity-80">🏃</div>
        </div>
      </div>
    </div>
  )
}

export default StatisticsCards