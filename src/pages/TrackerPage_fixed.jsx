import { useState, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'

const TrackerPage = () => {
  const [currentMood, setCurrentMood] = useState('')
  const [notes, setNotes] = useState('')
  const [entries, setEntries] = useState([])
  const [sleepHours, setSleepHours] = useState('')
  const [exerciseMinutes, setExerciseMinutes] = useState('')

  // Stress Predictor State
  const [model, setModel] = useState(null)
  const [status, setStatus] = useState({ type: 'loading', message: 'Loading AI model...' })
  const [stressInputs, setStressInputs] = useState({
    stress: 3,
    depression: 2,
    anxiety: 3
  })
  const [stressResult, setStressResult] = useState(null)
  const [reflectionResponses, setReflectionResponses] = useState({})
  const [showStressPredictor, setShowStressPredictor] = useState(false)
  const [showAllEntries, setShowAllEntries] = useState(false)

  const moods = [
    { emoji: '😊', label: 'Great', value: 'great', color: 'bg-green-50 border-green-200 hover:border-green-300 hover:bg-green-100' },
    { emoji: '🙂', label: 'Good', value: 'good', color: 'bg-lime-50 border-lime-200 hover:border-lime-300 hover:bg-lime-100' },
    { emoji: '😐', label: 'Okay', value: 'okay', color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-300 hover:bg-yellow-100' },
    { emoji: '😔', label: 'Low', value: 'low', color: 'bg-orange-50 border-orange-200 hover:border-orange-300 hover:bg-orange-100' },
    { emoji: '😞', label: 'Struggling', value: 'struggling', color: 'bg-red-50 border-red-200 hover:border-red-300 hover:bg-red-100' }
  ]

  // Reflection questions based on output score ranges
  const reflectionQuestions = {
    '0.00-0.20': [
      "What's one small thing you can do today just for yourself?",
      "Did you allow yourself to rest when you needed it today?",
      "Who could you reach out to if you wanted support right now?",
      "When was the last time you felt safe or comforted?",
      "If today feels heavy, what's one thing that might make tomorrow just a little lighter?"
    ],
    '0.21-0.40': [
      "Did you notice any moment of calm or relief today?",
      "What activity helped you feel even slightly better this week?",
      "How much control did you feel over your day?",
      "Did you spend time in a safe or comfortable space today?",
      "Did you give yourself permission to say \"no\" to something that felt draining?"
    ],
    '0.41-0.60': [
      "Did you feel balanced between work, rest, and play today?",
      "What's something you accomplished today, big or small?",
      "Did you take time to check in with your emotions today?",
      "How well did you manage stress this week?",
      "Did you try something new or different this week?"
    ],
    '0.61-0.80': [
      "Did you encourage or support someone else today?",
      "What healthy habit have you been most consistent with this week?",
      "Did you feel motivated to take on a challenge recently?",
      "How proud do you feel about your progress this month?",
      "Did you spend time doing something that brings you joy today?"
    ],
    '0.81-1.00': [
      "What are you most grateful for today?",
      "Did you celebrate something about yourself this week?",
      "How often did you feel deeply connected with others this week?",
      "Did you experience a \"flow state\" doing something you love?",
      "What's one way you can keep nurturing your current positive momentum?"
    ]
  }

  const getQuestionsForScore = (score) => {
    if (score <= 0.20) return { range: '0.00-0.20', questions: reflectionQuestions['0.00-0.20'] }
    if (score <= 0.40) return { range: '0.21-0.40', questions: reflectionQuestions['0.21-0.40'] }
    if (score <= 0.60) return { range: '0.41-0.60', questions: reflectionQuestions['0.41-0.60'] }
    if (score <= 0.80) return { range: '0.61-0.80', questions: reflectionQuestions['0.61-0.80'] }
    return { range: '0.81-1.00', questions: reflectionQuestions['0.81-1.00'] }
  }

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('mentalHealthEntries')
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries)
        setEntries(parsedEntries)
        console.log('✅ Loaded entries from localStorage:', parsedEntries.length, 'entries')
      } catch (error) {
        console.error('❌ Error parsing saved entries:', error)
        localStorage.removeItem('mentalHealthEntries')
      }
    } else {
      console.log('📝 No saved entries found in localStorage')
    }
  }, [])

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('mentalHealthEntries', JSON.stringify(entries))
      console.log('💾 Saved', entries.length, 'entries to localStorage')
    }
  }, [entries])

  // Load the TensorFlow.js model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setStatus({ type: 'loading', message: 'Loading your trained model...' })
        
        // Try to load the model - you'll need to place your model files in the public folder
        const loadedModel = await tf.loadLayersModel('/model.json')
        setModel(loadedModel)
        
        setStatus({ type: 'ready', message: '✅ Your AI model loaded successfully!' })
        
        console.log('✅ Model loaded successfully')
        console.log('Model layers:', loadedModel.layers.length)
        console.log('Model input shape:', loadedModel.inputShape)
        
      } catch (error) {
        console.error('❌ Error loading model:', error)
        setStatus({ 
          type: 'error', 
          message: `❌ Error: ${error.message}. Make sure the model.json file is in the public folder.` 
        })
      }
    }

    loadModel()
  }, [])

  const handleStressInputChange = (field, value) => {
    setStressInputs(prev => ({ ...prev, [field]: parseInt(value) }))
  }

  const handleReflectionResponse = (questionIndex, response) => {
    setReflectionResponses(prev => ({ ...prev, [questionIndex]: response }))
  }

  const predict = async () => {
    if (!model) {
      alert('Model not loaded yet!')
      return
    }
    
    const { stress, depression, anxiety } = stressInputs
    
    // Create input tensor (same format as the Python model)
    const inputTensor = tf.tensor2d([[stress, depression, anxiety]])
    
    // Normalize input (divide by 5.0, same as model training)
    const normalizedInput = inputTensor.div(5.0)
    
    // Make prediction
    const prediction = model.predict(normalizedInput)
    const stressScore = await prediction.data()
    
    // Clean up tensors
    inputTensor.dispose()
    normalizedInput.dispose()
    prediction.dispose()
    
    // Display result
    displayResult(stressScore[0])
  }

  const displayResult = (stressScore) => {
    // Convert model output to lifelong anxiety score (0.5-1.0 scale)
    // Lower model output = higher anxiety, so we invert it
    // Model outputs ~0-1, we want 0.5-1.0 where 1.0 = best mental health
    const lifelongAnxietyScore = 0.5 + (stressScore * 0.5)
    const percentage = Math.round(lifelongAnxietyScore * 100)
    
    // Get reflection questions based on the lifelong score
    const questionData = getQuestionsForScore(lifelongAnxietyScore)
    
    let category, className, emoji, message
    
    // Categorize based on lifelong anxiety score (0.5-1.0 scale)
    if (lifelongAnxietyScore <= 0.60) {
      category = 'High Anxiety (Seek Support)'
      className = 'struggling'
      emoji = '😰'
      message = 'Your anxiety levels are quite high. Consider reaching out for professional support - you don\'t have to go through this alone.'
    } else if (lifelongAnxietyScore <= 0.70) {
      category = 'Moderate Anxiety (Building Resilience)'
      className = 'low'
      emoji = '😔'
      message = 'You\'re experiencing some anxiety, but you\'re building resilience. Focus on healthy coping strategies and self-care.'
    } else if (lifelongAnxietyScore <= 0.80) {
      category = 'Balanced State (Steady Progress)'
      className = 'neutral'
      emoji = '😐'
      message = 'You\'re in a balanced emotional state. This is a good foundation for continued growth and wellbeing.'
    } else if (lifelongAnxietyScore <= 0.90) {
      category = 'Low Anxiety (Thriving)'
      className = 'good'
      emoji = '😊'
      message = 'You\'re managing anxiety well and thriving! Keep nurturing the positive habits that support your mental health.'
    } else {
      category = 'Optimal Mental Health (Flourishing)'
      className = 'thriving'
      emoji = '🌟'
      message = 'You\'re in an optimal mental health state! Consider how you can maintain this and perhaps support others on their journey.'
    }
    
    setStressResult({
      category,
      className,
      emoji,
      message,
      percentage,
      lifelongScore: lifelongAnxietyScore.toFixed(3),
      rawModelOutput: stressScore.toFixed(4),
      questionData
    })
    
    // Reset reflection responses for new questions
    setReflectionResponses({})
  }

  const getStatusBgColor = () => {
    switch (status.type) {
      case 'loading': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'ready': return 'bg-green-50 text-green-700 border-green-200'
      case 'error': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getResultColors = () => {
    if (!stressResult) return ''
    
    switch (stressResult.className) {
      case 'struggling': return 'bg-gradient-to-r from-red-400 to-pink-400 text-white'
      case 'low': return 'bg-gradient-to-r from-orange-400 to-red-400 text-white'
      case 'neutral': return 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
      case 'good': return 'bg-gradient-to-r from-green-400 to-teal-400 text-white'
      case 'thriving': return 'bg-gradient-to-r from-blue-400 to-purple-400 text-white'
      default: return 'bg-gray-100 text-gray-800'
    }
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
      stressData: stressResult ? {
        stressInputs: stressInputs,
        result: stressResult,
        reflectionResponses: reflectionResponses
      } : null
    }

    setEntries([newEntry, ...entries])
    
    // Reset form
    setCurrentMood('')
    setNotes('')
    setSleepHours('')
    setExerciseMinutes('')
    setStressResult(null)
    setReflectionResponses({})
    setShowStressPredictor(false)
  }

  const getMoodEmoji = (moodValue) => {
    const mood = moods.find(m => m.value === moodValue)
    return mood ? mood.emoji : '😐'
  }

  const getMoodLabel = (moodValue) => {
    const mood = moods.find(m => m.value === moodValue)
    return mood ? mood.label : 'Unknown'
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
          Mental Health Tracker
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
          Track your daily mood, sleep, and activities to better understand your mental health patterns.
        </p>
      </div>

      {/* Entry Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
          <span className="text-3xl mr-3">🌟</span>
          How are you feeling today?
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Mood Selection */}
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

          {/* Additional Metrics */}
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

          {/* Notes */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <label className="flex text-lg font-semibold text-blue-800 mb-4 items-center">
              <span className="text-2xl mr-2">📝</span>
              Notes (optional):
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              className="w-full p-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all text-lg resize-none"
              placeholder="What's on your mind? Any specific events or feelings you want to note..."
            />
          </div>

          {/* Stress Predictor Toggle */}
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
            <button
              type="button"
              onClick={() => setShowStressPredictor(!showStressPredictor)}
              className="flex items-center text-lg font-semibold text-purple-800 mb-4 hover:text-purple-900 transition-colors"
            >
              <span className="text-2xl mr-2">🎓</span>
              AI Stress Assessment (optional)
              <span className="ml-2">{showStressPredictor ? '▼' : '▶'}</span>
            </button>
            
            {showStressPredictor && (
              <div className="space-y-6">
                {/* Status */}
                <div className={`p-4 rounded-xl border-2 font-medium text-center ${getStatusBgColor()}`}>
                  {status.message}
                </div>
                
                {/* Input Controls */}
                <div className="space-y-6">
                  {/* Stress Level */}
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <label className="flex items-center text-base font-semibold text-red-800 mb-3">
                      <span className="text-xl mr-2">😰</span>
                      Stress Level (0-5)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={stressInputs.stress}
                      onChange={(e) => handleStressInputChange('stress', e.target.value)}
                      className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-center mt-2">
                      <span className="text-xl font-bold text-red-700">{stressInputs.stress}</span>
                    </div>
                  </div>

                  {/* Depression Score */}
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <label className="flex items-center text-base font-semibold text-indigo-800 mb-3">
                      <span className="text-xl mr-2">😔</span>
                      Depression Score (0-5)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={stressInputs.depression}
                      onChange={(e) => handleStressInputChange('depression', e.target.value)}
                      className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-center mt-2">
                      <span className="text-xl font-bold text-indigo-700">{stressInputs.depression}</span>
                    </div>
                  </div>

                  {/* Anxiety Score */}
                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                    <label className="flex items-center text-base font-semibold text-yellow-800 mb-3">
                      <span className="text-xl mr-2">😟</span>
                      Anxiety Score (0-5)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={stressInputs.anxiety}
                      onChange={(e) => handleStressInputChange('anxiety', e.target.value)}
                      className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-center mt-2">
                      <span className="text-xl font-bold text-yellow-700">{stressInputs.anxiety}</span>
                    </div>
                  </div>
                </div>

                {/* Predict Button */}
                <button
                  type="button"
                  onClick={predict}
                  disabled={!model}
                  className={`w-full py-3 px-6 rounded-xl font-bold text-base transition-all duration-300 ${
                    model 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {model ? 'Analyze Wellbeing ✨' : 'Loading Model...'}
                </button>

                {/* Result */}
                {stressResult && (
                  <div className={`p-6 rounded-xl text-center transition-all duration-500 ${getResultColors()}`}>
                    <div className="text-4xl mb-3">{stressResult.emoji}</div>
                    <div className="text-xl font-bold mb-2">{stressResult.category}</div>
                    <div className="text-lg mb-3">Lifelong Anxiety Score: {stressResult.percentage}% (Scale: 50-100%)</div>
                    <div className="text-sm mb-4 opacity-90">Score: {stressResult.lifelongScore} | Raw Model: {stressResult.rawModelOutput}</div>
                    <div className="text-sm mb-4 opacity-90">{stressResult.message}</div>
                    
                    {/* Reflection Questions with Input Fields */}
                    <div className="bg-white bg-opacity-90 rounded-xl p-4 mt-4 border border-white border-opacity-30">
                      <h4 className="text-lg font-bold mb-3 text-gray-800">💭 Reflection Questions</h4>
                      <p className="text-sm text-gray-600 mb-4">Take a moment to reflect and write your thoughts:</p>
                      <div className="space-y-4">
                        {stressResult.questionData.questions.map((question, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4 text-left border border-gray-200">
                            <div className="flex items-start space-x-3 mb-3">
                              <span className="text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                                {index + 1}
                              </span>
                              <p className="text-sm leading-relaxed text-gray-800">{question}</p>
                            </div>
                            <textarea
                              value={reflectionResponses[index] || ''}
                              onChange={(e) => handleReflectionResponse(index, e.target.value)}
                              rows="2"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all text-sm resize-none"
                              placeholder="Write your thoughts here..."
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Save Entry ✨
          </button>
        </form>
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
          <span className="text-3xl mr-3">📚</span>
          Recent Entries
        </h2>
        
        {entries.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No entries yet</h3>
            <p className="text-gray-500">Start tracking your mood above to see your journey!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Show recent entries (first 5) */}
            {entries.slice(0, 5).map((entry) => (
              <div key={entry.id} className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
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
            ))}
            
            {/* Show more entries button/dropdown */}
            {entries.length > 5 && (
              <div className="mt-6">
                <button
                  onClick={() => setShowAllEntries(!showAllEntries)}
                  className="w-full bg-gradient-to-r from-gray-100 to-blue-100 text-gray-700 py-3 px-6 rounded-xl hover:from-gray-200 hover:to-blue-200 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                >
                  <span>{showAllEntries ? 'Hide Older Entries' : `View ${entries.length - 5} Older Entries`}</span>
                  <span>{showAllEntries ? '▲' : '▼'}</span>
                </button>
                
                {/* Older entries (collapsible) */}
                {showAllEntries && (
                  <div className="mt-4 space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">📚 Older Journal Entries</h3>
                    {entries.slice(5).map((entry) => (
                      <div key={entry.id} className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
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
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackerPage