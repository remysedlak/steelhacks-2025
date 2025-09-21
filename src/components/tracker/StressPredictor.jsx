import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import * as tf from '@tensorflow/tfjs'

const StressPredictor = forwardRef(({ onStressResult }, ref) => {
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
  const [manualAnxietyScore, setManualAnxietyScore] = useState(0.5)
  const [useManualRating, setUseManualRating] = useState(false)

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

  // Load the TensorFlow.js model
  useEffect(() => {
    let isMounted = true
    
    const loadModel = async () => {
      try {
        if (!isMounted) return
        
        setStatus({ type: 'loading', message: 'Loading your trained model...' })
        
        // Check if model is already loaded globally to prevent duplicate registration
        if (window.globalStressModel) {
          if (isMounted) {
            setModel(window.globalStressModel)
            setStatus({ type: 'ready', message: '✅ Your AI model loaded successfully!' })
          }
          return
        }
        
        // Try to load the model - you'll need to place your model files in the public folder
        const loadedModel = await tf.loadLayersModel('/model.json')
        
        if (isMounted) {
          // Store model globally to prevent re-loading
          window.globalStressModel = loadedModel
          setModel(loadedModel)
          setStatus({ type: 'ready', message: '✅ Your AI model loaded successfully!' })
          
          console.log('✅ Model loaded successfully')
          console.log('Model layers:', loadedModel.layers.length)
          console.log('Model input shape:', loadedModel.inputShape)
        }
        
      } catch (error) {
        console.error('❌ Error loading model:', error)
        if (isMounted) {
          setStatus({ 
            type: 'error', 
            message: `❌ Error: ${error.message}. Make sure the model.json file is in the public folder.` 
          })
        }
      }
    }

    loadModel()
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false
    }
  }, [])

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      // Don't dispose the global model as other components might be using it
      // Just clean up local state
      setModel(null)
      setStressResult(null)
      setReflectionResponses({})
    }
  }, [])

  const handleStressInputChange = (field, value) => {
    setStressInputs(prev => ({ ...prev, [field]: parseInt(value) }))
  }

  const handleReflectionResponse = (questionIndex, response) => {
    setReflectionResponses(prev => ({ ...prev, [questionIndex]: response }))
  }

  const predict = async () => {
    if (useManualRating) {
      // Use manual anxiety score instead of AI prediction
      displayResult(manualAnxietyScore)
      return
    }
    
    if (!model) {
      alert('Model not loaded yet!')
      return
    }
    
    try {
      const { stress, depression, anxiety } = stressInputs
      
      // Create input tensor (same format as the Python model)
      const inputTensor = tf.tensor2d([[stress, depression, anxiety]])
      
      // Normalize input (divide by 5.0, same as model training)
      const normalizedInput = inputTensor.div(5.0)
      
      // Make prediction
      const prediction = model.predict(normalizedInput)
      const stressScore = await prediction.data()
      
      // Clean up tensors immediately to prevent memory leaks
      inputTensor.dispose()
      normalizedInput.dispose()
      prediction.dispose()
      
      // Display result
      displayResult(stressScore[0])
      
    } catch (error) {
      console.error('❌ Error during prediction:', error)
      alert('Error making prediction. Please try again.')
    }
  }

  const displayResult = (stressScore) => {
    // Convert model output to lifelong anxiety score (0-1.0 scale)
    // For manual ratings: use score directly (1.0 = high anxiety, 0.0 = no anxiety)
    // For AI model: invert the score since model outputs wellness (1.0 = good, 0.0 = bad)
    const lifelongAnxietyScore = useManualRating ? stressScore : (1.0 - stressScore)
    const percentage = Math.round(lifelongAnxietyScore * 100)
    
    // Get reflection questions based on the lifelong score (inverted for questions)
    const questionScore = 1.0 - lifelongAnxietyScore // Invert for question selection
    const questionData = getQuestionsForScore(questionScore)
    
    let category, className, emoji, message
    
    // Categorize based on anxiety score (1.0 = high anxiety, 0.0 = no anxiety)
    if (lifelongAnxietyScore >= 0.80) {
      category = 'High Anxiety (Seek Support)'
      className = 'struggling'
      emoji = '😰'
      message = 'Your anxiety levels are quite high. Consider reaching out for professional support - you don\'t have to go through this alone.'
    } else if (lifelongAnxietyScore >= 0.60) {
      category = 'Moderate Anxiety (Building Resilience)'
      className = 'low'
      emoji = '😔'
      message = 'You\'re experiencing some anxiety, but you\'re building resilience. Focus on healthy coping strategies and self-care.'
    } else if (lifelongAnxietyScore >= 0.40) {
      category = 'Balanced State (Steady Progress)'
      className = 'neutral'
      emoji = '😐'
      message = 'You\'re in a balanced emotional state. This is a good foundation for continued growth and wellbeing.'
    } else if (lifelongAnxietyScore >= 0.20) {
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
    
    const result = {
      category,
      className,
      emoji,
      message,
      percentage,
      lifelongScore: lifelongAnxietyScore.toFixed(3),
      rawModelOutput: stressScore.toFixed(4),
      questionData,
      isManualRating: useManualRating
    }
    
    setStressResult(result)
    
    // Pass the result up to the parent component
    if (onStressResult) {
      onStressResult({
        stressInputs: stressInputs,
        result: result,
        reflectionResponses: reflectionResponses
      })
    }
    
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

  // Reset the result when form is submitted externally
  const resetResult = () => {
    setStressResult(null)
    setReflectionResponses({})
    setShowStressPredictor(false)
    setUseManualRating(false)
    setManualAnxietyScore(0.5)
  }

  // Expose reset function to parent
  useImperativeHandle(ref, () => ({
    resetResult
  }))

  return (
    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
      <button
        type="button"
        onClick={() => setShowStressPredictor(!showStressPredictor)}
        className="flex items-center text-lg font-semibold text-purple-800 mb-4 hover:text-purple-900 transition-colors"
      >
        <span className="text-2xl mr-2">🎓</span>
        Stress Assessment (optional)
        <span className="ml-2">{showStressPredictor ? '▼' : '▶'}</span>
      </button>
      
      {showStressPredictor && (
        <div className="space-y-6">
          {/* Status */}
          <div className={`p-4 rounded-xl border-2 font-medium text-center ${getStatusBgColor()}`}>
            {status.message}
          </div>
          
          {/* Assessment Method Selection */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Choose Assessment Method:</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="assessmentMethod"
                  checked={!useManualRating}
                  onChange={() => setUseManualRating(false)}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700">
                  <span className="font-medium">AI Assessment</span> - Answer stress, depression, and anxiety questions for AI analysis
                </span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="assessmentMethod"
                  checked={useManualRating}
                  onChange={() => setUseManualRating(true)}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700">
                  <span className="font-medium">Manual Rating</span> - Rate your own anxiety level directly
                </span>
              </label>
            </div>
          </div>
          
          {/* Manual Anxiety Rating */}
          {useManualRating && (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <label className="flex items-center text-base font-semibold text-blue-800 mb-3">
                <span className="text-xl mr-2">💭</span>
                Your Anxiety Rating (0.0 = No Anxiety, 1.0 = High Anxiety)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={manualAnxietyScore}
                onChange={(e) => setManualAnxietyScore(parseFloat(e.target.value))}
                className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer mb-3"
              />
              <div className="flex justify-between text-sm text-blue-700 mb-2">
                <span>No Anxiety (0.0)</span>
                <span>Moderate (0.5)</span>
                <span>High Anxiety (1.0)</span>
              </div>
              <div className="text-center">
                <span className="text-xl font-bold text-blue-700">{manualAnxietyScore.toFixed(2)}</span>
                <span className="text-sm text-blue-600 ml-2">({Math.round(manualAnxietyScore * 100)}%)</span>
              </div>
            </div>
          )}
          
          {/* AI Input Controls */}
          {!useManualRating && (
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
          )}

          {/* Predict Button */}
          <button
            type="button"
            onClick={predict}
            disabled={!useManualRating && !model}
            className={`w-full py-3 px-6 rounded-xl font-bold text-base transition-all duration-300 ${
              (useManualRating || model) 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {useManualRating 
              ? 'Analyze Manual Rating ✨' 
              : (model ? 'Analyze Wellbeing ✨' : 'Loading Model...')
            }
          </button>

          {/* Result */}
          {stressResult && (
            <div className={`p-6 rounded-xl text-center transition-all duration-500 ${getResultColors()}`}>
              <div className="text-4xl mb-3">{stressResult.emoji}</div>
              <div className="text-xl font-bold mb-2">{stressResult.category}</div>
              <div className="text-lg mb-3">Anxiety Score: {stressResult.percentage}% (Scale: 0-100%, higher = more anxiety)</div>
              <div className="text-sm mb-2 opacity-90">
                {stressResult.isManualRating ? (
                  <>Assessment Type: Manual Self-Rating | Score: {stressResult.lifelongScore}</>
                ) : (
                  <>Assessment Type: AI Analysis | Score: {stressResult.lifelongScore} | Raw Model: {stressResult.rawModelOutput}</>
                )}
              </div>
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
                        className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all text-sm resize-none"
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
  )
})

export default StressPredictor