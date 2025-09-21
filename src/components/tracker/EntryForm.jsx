import React, { useState, useRef, useEffect } from 'react'
import MoodSelector from './MoodSelector'
import MetricsInput from './MetricsInput'
import StressPredictor from './StressPredictor'

const EntryForm = ({ onSubmit }) => {
  const [currentMood, setCurrentMood] = useState('')
  const [notes, setNotes] = useState('')
  const [sleepHours, setSleepHours] = useState('')
  const [exerciseMinutes, setExerciseMinutes] = useState('')
  const [stressData, setStressData] = useState(null)
  const [customQuestions, setCustomQuestions] = useState([])
  const [showQuestions, setShowQuestions] = useState(false)
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null)
  const stressPredictorRef = useRef()

  const moods = [
    { emoji: '😊', label: 'Great', value: 'great', color: 'bg-green-50 border-green-200 hover:border-green-300 hover:bg-green-100' },
    { emoji: '🙂', label: 'Good', value: 'good', color: 'bg-lime-50 border-lime-200 hover:border-lime-300 hover:bg-lime-100' },
    { emoji: '😐', label: 'Okay', value: 'okay', color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-300 hover:bg-yellow-100' },
    { emoji: '😔', label: 'Low', value: 'low', color: 'bg-orange-50 border-orange-200 hover:border-orange-300 hover:bg-orange-100' },
    { emoji: '😞', label: 'Struggling', value: 'struggling', color: 'bg-red-50 border-red-200 hover:border-red-300 hover:bg-red-100' }
  ]

  // Load custom questions from localStorage
  useEffect(() => {
    const savedQuestions = localStorage.getItem('customJournalQuestions')
    if (savedQuestions) {
      setCustomQuestions(JSON.parse(savedQuestions))
    }
  }, [])

  const handleQuestionSelect = (question, index) => {
    setNotes(question)
    setSelectedQuestionIndex(index)
    setShowQuestions(false)
  }

  const handleStressResult = (stressResult) => {
    setStressData(stressResult)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!currentMood) {
      alert('Please select a mood before submitting')
      return
    }

    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood: currentMood,
      notes: notes,
      sleepHours: sleepHours ? parseInt(sleepHours) : null,
      exerciseMinutes: exerciseMinutes ? parseInt(exerciseMinutes) : null,
      stressData: stressData
    }

    // Call the parent's onSubmit function
    onSubmit(newEntry)
    
    // Reset form
    setCurrentMood('')
    setNotes('')
    setSleepHours('')
    setExerciseMinutes('')
    setStressData(null)
    setSelectedQuestionIndex(null)
    
    // Reset stress predictor component if it exists
    if (stressPredictorRef.current && stressPredictorRef.current.resetResult) {
      stressPredictorRef.current.resetResult()
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
        <span className="text-3xl mr-3">🌟</span>
        How are you feeling today?
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Mood Selection */}
        <MoodSelector 
          currentMood={currentMood}
          setCurrentMood={setCurrentMood}
          moods={moods}
        />

        {/* Additional Metrics */}
        <MetricsInput 
          sleepHours={sleepHours}
          setSleepHours={setSleepHours}
          exerciseMinutes={exerciseMinutes}
          setExerciseMinutes={setExerciseMinutes}
        />

        {/* Journal Questions & Notes */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <label className="flex text-lg font-semibold text-blue-800 items-center">
              <span className="text-2xl mr-2">📝</span>
              Journal & Notes
            </label>
            {customQuestions.length > 0 && (
              <button
                type="button"
                onClick={() => setShowQuestions(!showQuestions)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {showQuestions ? 'Hide Questions' : 'Journal Prompts'}
              </button>
            )}
          </div>

          {/* Custom Questions Dropdown */}
          {showQuestions && customQuestions.length > 0 && (
            <div className="mb-4 bg-white rounded-lg border border-blue-200 p-4">
              <h4 className="text-sm font-semibold text-blue-700 mb-3">Choose a journal prompt to get started:</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {customQuestions.map((question, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleQuestionSelect(question, index)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors text-sm ${
                      selectedQuestionIndex === index
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-200'
                    }`}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="4"
            className="w-full p-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all text-lg resize-none"
            placeholder="What's on your mind? Any specific events or feelings you want to note..."
          />
          
          {customQuestions.length === 0 && (
            <p className="text-blue-600 text-sm mt-2">
              💡 Tip: Add custom journal questions in your Profile to get personalized writing prompts here!
            </p>
          )}
        </div>

        {/* Stress Predictor */}
        <StressPredictor 
          ref={stressPredictorRef}
          onStressResult={handleStressResult}
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Save Entry ✨
        </button>
      </form>
    </div>
  )
}

export default EntryForm