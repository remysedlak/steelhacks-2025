import React from 'react'

const MetricsInput = ({ sleepHours, setSleepHours, exerciseMinutes, setExerciseMinutes }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
        <label className="flex text-lg font-semibold text-purple-800 mb-4 items-center">
          <span className="text-2xl mr-2">💤</span>
          Hours of sleep last night:
        </label>
        <input
          type="number"
          min="0"
          max="24"
          step="0.5"
          value={sleepHours}
          onChange={(e) => setSleepHours(e.target.value)}
          className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all text-lg"
          placeholder="e.g., 7.5"
        />
      </div>
      <div className="bg-green-50 p-6 rounded-xl border border-green-100">
        <label className="flex text-lg font-semibold text-green-800 mb-4 items-center">
          <span className="text-2xl mr-2">🏃</span>
          Exercise/physical activity (minutes):
        </label>
        <input
          type="number"
          min="0"
          value={exerciseMinutes}
          onChange={(e) => setExerciseMinutes(e.target.value)}
          className="w-full p-4 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-400 transition-all text-lg"
          placeholder="e.g., 30"
        />
      </div>
    </div>
  )
}

export default MetricsInput