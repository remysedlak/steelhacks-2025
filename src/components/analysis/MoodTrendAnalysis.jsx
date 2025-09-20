const MoodTrendAnalysis = ({ moodTrend }) => {
  if (!moodTrend) return null

  return (
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
              <p className="font-bold text-xl text-green-700 mb-2">Anxiety Improving ✨</p>
              <p className="text-green-600 leading-relaxed">Your recent mood entries show an upward trend. Keep up the great work!</p>
            </div>
          </>
        )}
        {moodTrend === 'declining' && (
          <>
            <div className="text-6xl">📉</div>
            <div className="bg-orange-50 p-6 rounded-xl border border-orange-200 flex-1">
              <p className="font-bold text-xl text-orange-700 mb-2">Anxiety Needs Attention 🤗</p>
              <p className="text-orange-600 leading-relaxed">Consider reaching out for support if needed. You're not alone in this journey.</p>
            </div>
          </>
        )}
        {moodTrend === 'stable' && (
          <>
            <div className="text-6xl">📊</div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 flex-1">
              <p className="font-bold text-xl text-blue-700 mb-2">Stable Anxiety🎯</p>
              <p className="text-blue-600 leading-relaxed">Your mood has been relatively consistent. Consistency is a sign of good self-awareness.</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MoodTrendAnalysis