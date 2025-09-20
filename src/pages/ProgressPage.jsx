import { useState, useEffect } from 'react'

const ProgressPage = () => {
  const [entries, setEntries] = useState([])
  const [timeframe, setTimeframe] = useState('week') // week, month, all

  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('mentalHealthEntries')
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  // Filter entries based on timeframe
  const getFilteredEntries = () => {
    if (timeframe === 'all') return entries

    const now = new Date()
    const cutoffDate = new Date()
    
    if (timeframe === 'week') {
      cutoffDate.setDate(now.getDate() - 7)
    } else if (timeframe === 'month') {
      cutoffDate.setDate(now.getDate() - 30)
    }

    return entries.filter(entry => {
      const entryDate = new Date(entry.date)
      return entryDate >= cutoffDate
    })
  }

  const filteredEntries = getFilteredEntries()

  // Calculate mood statistics
  const getMoodStats = () => {
    if (filteredEntries.length === 0) return {}

    const moodCounts = filteredEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1
      return acc
    }, {})

    const totalEntries = filteredEntries.length
    const moodPercentages = {}
    
    Object.keys(moodCounts).forEach(mood => {
      moodPercentages[mood] = Math.round((moodCounts[mood] / totalEntries) * 100)
    })

    return { counts: moodCounts, percentages: moodPercentages, total: totalEntries }
  }

  // Calculate averages
  const getAverages = () => {
    if (filteredEntries.length === 0) return {}

    const sleepEntries = filteredEntries.filter(entry => entry.sleepHours)
    const exerciseEntries = filteredEntries.filter(entry => entry.exerciseMinutes)

    const avgSleep = sleepEntries.length > 0 
      ? sleepEntries.reduce((sum, entry) => sum + entry.sleepHours, 0) / sleepEntries.length
      : 0

    const avgExercise = exerciseEntries.length > 0
      ? exerciseEntries.reduce((sum, entry) => sum + entry.exerciseMinutes, 0) / exerciseEntries.length
      : 0

    return {
      sleep: avgSleep.toFixed(1),
      exercise: Math.round(avgExercise),
      sleepEntries: sleepEntries.length,
      exerciseEntries: exerciseEntries.length
    }
  }

  const moodStats = getMoodStats()
  const averages = getAverages()

  const moodInfo = {
    great: { emoji: '😊', label: 'Great', color: 'bg-green-50 border-green-200 text-green-800', barColor: 'bg-green-500' },
    good: { emoji: '🙂', label: 'Good', color: 'bg-lime-50 border-lime-200 text-lime-800', barColor: 'bg-lime-500' },
    okay: { emoji: '😐', label: 'Okay', color: 'bg-yellow-50 border-yellow-200 text-yellow-800', barColor: 'bg-yellow-500' },
    low: { emoji: '😔', label: 'Low', color: 'bg-orange-50 border-orange-200 text-orange-800', barColor: 'bg-orange-500' },
    struggling: { emoji: '😞', label: 'Struggling', color: 'bg-red-50 border-red-200 text-red-800', barColor: 'bg-red-500' }
  }

  // Calculate mood trend (simplified)
  const getMoodTrend = () => {
    if (filteredEntries.length < 2) return null

    const moodValues = { struggling: 1, low: 2, okay: 3, good: 4, great: 5 }
    const recentEntries = filteredEntries.slice(0, Math.min(5, filteredEntries.length))
    const olderEntries = filteredEntries.slice(Math.min(5, filteredEntries.length), Math.min(10, filteredEntries.length))

    if (olderEntries.length === 0) return null

    const recentAvg = recentEntries.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / recentEntries.length
    const olderAvg = olderEntries.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / olderEntries.length

    const diff = recentAvg - olderAvg
    if (diff > 0.2) return 'improving'
    if (diff < -0.2) return 'declining'
    return 'stable'
  }

  const moodTrend = getMoodTrend()

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
          Your Progress
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
          Track your mental health journey and see patterns in your mood, sleep, and activities.
        </p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-center mb-12">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
          {[
            { value: 'week', label: 'Last 7 days' },
            { value: 'month', label: 'Last 30 days' },
            { value: 'all', label: 'All time' }
          ].map((option) => (
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

      {filteredEntries.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-9xl mb-8">📊</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">No data yet</h2>
          <p className="text-gray-600 text-lg">Start tracking your mood to see your progress here!</p>
        </div>
      ) : (
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
      )}

      {filteredEntries.length > 0 && (
        <>
          {/* Mood Distribution */}
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

          {/* Mood Trend */}
          {moodTrend && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-3xl mr-3">📈</span>
                Recent Trend
              </h2>
              <div className="flex items-center space-x-6">
                {moodTrend === 'improving' && (
                  <>
                    <div className="text-6xl">📈</div>
                    <div className="bg-green-50 p-6 rounded-xl border border-green-200 flex-1">
                      <p className="font-bold text-xl text-green-700 mb-2">Improving ✨</p>
                      <p className="text-green-600 leading-relaxed">Your recent mood entries show an upward trend. Keep up the great work!</p>
                    </div>
                  </>
                )}
                {moodTrend === 'declining' && (
                  <>
                    <div className="text-6xl">📉</div>
                    <div className="bg-orange-50 p-6 rounded-xl border border-orange-200 flex-1">
                      <p className="font-bold text-xl text-orange-700 mb-2">Needs Attention 🤗</p>
                      <p className="text-orange-600 leading-relaxed">Consider reaching out for support if needed. You're not alone in this journey.</p>
                    </div>
                  </>
                )}
                {moodTrend === 'stable' && (
                  <>
                    <div className="text-6xl">📊</div>
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 flex-1">
                      <p className="font-bold text-xl text-blue-700 mb-2">Stable 🎯</p>
                      <p className="text-blue-600 leading-relaxed">Your mood has been relatively consistent. Consistency is a sign of good self-awareness.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 shadow-lg">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
              <span className="text-3xl mr-3">💡</span>
              Insights & Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {averages.sleep && parseFloat(averages.sleep) < 7 && (
                <div className="bg-white bg-opacity-70 p-6 rounded-xl border border-blue-200">
                  <div className="text-2xl mb-3">�</div>
                  <p className="text-blue-800 font-medium">Consider aiming for 7-9 hours of sleep per night for better mental health.</p>
                </div>
              )}
              {averages.exercise && parseInt(averages.exercise) < 30 && (
                <div className="bg-white bg-opacity-70 p-6 rounded-xl border border-blue-200">
                  <div className="text-2xl mb-3">🏃‍♀️</div>
                  <p className="text-blue-800 font-medium">Try to get at least 30 minutes of physical activity most days of the week.</p>
                </div>
              )}
              {filteredEntries.length >= 7 && (
                <div className="bg-white bg-opacity-70 p-6 rounded-xl border border-blue-200">
                  <div className="text-2xl mb-3">🎉</div>
                  <p className="text-blue-800 font-medium">Great job tracking consistently! Regular self-monitoring is a powerful tool for mental health.</p>
                </div>
              )}
              <div className="bg-white bg-opacity-70 p-6 rounded-xl border border-blue-200">
                <div className="text-2xl mb-3">📚</div>
                <p className="text-blue-800 font-medium">Remember: tracking patterns can help you and healthcare providers understand your mental health better.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ProgressPage