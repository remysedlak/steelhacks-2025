import React from 'react'

const EntryCard = ({ entry, isCompact = false }) => {
  const moods = [
    { emoji: '😊', label: 'Great', value: 'great' },
    { emoji: '🙂', label: 'Good', value: 'good' },
    { emoji: '😐', label: 'Okay', value: 'okay' },
    { emoji: '😔', label: 'Low', value: 'low' },
    { emoji: '😞', label: 'Struggling', value: 'struggling' }
  ]

  const getMoodEmoji = (moodValue) => {
    const mood = moods.find(m => m.value === moodValue)
    return mood ? mood.emoji : '😐'
  }

  const getMoodLabel = (moodValue) => {
    const mood = moods.find(m => m.value === moodValue)
    return mood ? mood.label : 'Unknown'
  }

  if (isCompact) {
    // Compact view for older entries
    return (
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
            <div>
              <span className="font-semibold text-gray-800">{getMoodLabel(entry.mood)}</span>
              <div className="text-xs text-gray-500 flex items-center space-x-2">
                <span>📅 {entry.date}</span>
                <span>⏰ {entry.time}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            {entry.sleepHours && (
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                💤 {entry.sleepHours}h
              </span>
            )}
            {entry.exerciseMinutes && (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                🏃 {entry.exerciseMinutes}min
              </span>
            )}
            {entry.stressData && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                🎓 {entry.stressData.result.percentage}%
              </span>
            )}
          </div>
        </div>
        {entry.notes && (
          <div className="bg-white bg-opacity-60 p-3 rounded-lg border border-gray-200 mb-2">
            <p className="text-gray-700 text-sm italic">"{entry.notes}"</p>
          </div>
        )}
        {entry.stressData && entry.stressData.reflectionResponses && Object.keys(entry.stressData.reflectionResponses).length > 0 && (
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
            <div className="text-xs text-purple-700 mb-2">
              AI Assessment: Stress {entry.stressData.stressInputs.stress}/5, Depression {entry.stressData.stressInputs.depression}/5, Anxiety {entry.stressData.stressInputs.anxiety}/5
            </div>
            <div className="space-y-1">
              {Object.entries(entry.stressData.reflectionResponses).map(([questionIndex, response]) => (
                response && (
                  <div key={questionIndex} className="bg-white p-2 rounded border border-purple-200">
                    <p className="text-xs text-gray-700 italic">"{response}"</p>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Full view for recent entries
  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
          <div>
            <span className="font-bold text-gray-800 text-lg">{getMoodLabel(entry.mood)}</span>
            <div className="text-sm text-gray-500 flex items-center space-x-2">
              <span>📅 {entry.date}</span>
              <span>⏰ {entry.time}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          {entry.sleepHours && (
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
              💤 {entry.sleepHours}h
            </span>
          )}
          {entry.exerciseMinutes && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
              🏃 {entry.exerciseMinutes}min
            </span>
          )}
          {entry.stressData && (
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              🎓 {entry.stressData.result.percentage}% Anxiety Score
            </span>
          )}
        </div>
      </div>
      {entry.notes && (
        <div className="bg-white bg-opacity-50 p-4 rounded-lg border border-blue-100 mb-3">
          <p className="text-gray-700 leading-relaxed italic">"{entry.notes}"</p>
        </div>
      )}
      {entry.stressData && entry.stressData.reflectionResponses && Object.keys(entry.stressData.reflectionResponses).length > 0 && (
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h4 className="text-sm font-semibold text-purple-800 mb-3 flex items-center">
            <span className="mr-2">💭</span>
            Stress Assessment Reflections
          </h4>
          <div className="text-sm text-purple-700 mb-2">
            Stress: {entry.stressData.stressInputs.stress}/5 | 
            Depression: {entry.stressData.stressInputs.depression}/5 | 
            Anxiety: {entry.stressData.stressInputs.anxiety}/5
          </div>
          <div className="space-y-2">
            {Object.entries(entry.stressData.reflectionResponses).map(([questionIndex, response]) => (
              response && (
                <div key={questionIndex} className="bg-white p-3 rounded border border-purple-200">
                  <p className="text-xs text-purple-600 mb-1">Q{parseInt(questionIndex) + 1}: {entry.stressData.result.questionData.questions[questionIndex]}</p>
                  <p className="text-sm text-gray-700 italic">"{response}"</p>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default EntryCard