import React from 'react'

const MoodSelector = ({ currentMood, setCurrentMood, moods }) => {
  return (
    <div>
      <label className="block text-lg font-semibold text-gray-700 mb-6">Select your mood:</label>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {moods.map((mood) => (
          <button
            key={mood.value}
            type="button"
            onClick={() => setCurrentMood(mood.value)}
            className={`p-6 rounded-2xl border-2 text-center transition-all duration-200 transform hover:scale-105 ${
              currentMood === mood.value 
                ? mood.color + ' ring-4 ring-blue-300 scale-105 shadow-lg' 
                : mood.color + ' shadow-md hover:shadow-lg'
            }`}
          >
            <div className="text-4xl mb-3">{mood.emoji}</div>
            <div className="text-sm font-semibold text-gray-700">{mood.label}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default MoodSelector