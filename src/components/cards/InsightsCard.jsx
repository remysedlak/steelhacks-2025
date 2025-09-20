const InsightsCard = ({ averages, filteredEntries }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 shadow-lg">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
        <span className="text-3xl mr-3">💡</span>
        Insights & Tips
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {averages.sleep && parseFloat(averages.sleep) < 7 && (
          <div className="bg-white bg-opacity-70 p-6 rounded-xl border border-blue-200">
            <div className="text-2xl mb-3">😴</div>
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
  )
}

export default InsightsCard