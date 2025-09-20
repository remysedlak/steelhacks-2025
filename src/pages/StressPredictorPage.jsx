import { useState, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'

const StressPredictorPage = () => {
  const [model, setModel] = useState(null)
  const [status, setStatus] = useState({ type: 'loading', message: 'Loading AI model...' })
  const [inputs, setInputs] = useState({
    stress: 3,
    depression: 2,
    anxiety: 3
  })
  const [result, setResult] = useState(null)
  const [debugMode, setDebugMode] = useState(false)
  const [debugInfo, setDebugInfo] = useState({
    modelLoaded: false,
    inputValues: '-',
    normalizedInput: '-',
    rawPrediction: '-',
    modelWeights: '-'
  })

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
    const loadModel = async () => {
      try {
        setStatus({ type: 'loading', message: 'Loading your trained model...' })
        
        // Try to load the model - you'll need to place your model files in the public folder
        const loadedModel = await tf.loadLayersModel('/model.json')
        setModel(loadedModel)
        
        setStatus({ type: 'ready', message: '✅ Your AI model loaded successfully!' })
        
        // Show model info in debug
        if (debugMode) {
          const weights = loadedModel.getWeights()
          if (weights.length > 0) {
            const kernelData = await weights[0].data()
            const biasData = await weights[1].data()
            setDebugInfo(prev => ({
              ...prev,
              modelLoaded: true,
              modelWeights: `Kernel: [${Array.from(kernelData).map(x => x.toFixed(4)).join(', ')}], Bias: ${biasData[0].toFixed(4)}`
            }))
          }
        }
        
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
  }, [debugMode])

  // Update slider values and debug info
  useEffect(() => {
    if (debugMode) {
      setDebugInfo(prev => ({
        ...prev,
        inputValues: `[${inputs.stress}, ${inputs.depression}, ${inputs.anxiety}]`,
        normalizedInput: `[${(inputs.stress/5).toFixed(3)}, ${(inputs.depression/5).toFixed(3)}, ${(inputs.anxiety/5).toFixed(3)}]`
      }))
    }
  }, [inputs, debugMode])

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseInt(value) }))
  }

  const setTestValues = (stress, depression, anxiety) => {
    setInputs({ stress, depression, anxiety })
  }

  const predict = async () => {
    if (!model) {
      alert('Model not loaded yet!')
      return
    }
    
    const { stress, depression, anxiety } = inputs
    
    console.log('Input values:', [stress, depression, anxiety])
    
    // Create input tensor (same format as the Python model)
    const inputTensor = tf.tensor2d([[stress, depression, anxiety]])
    console.log('Input tensor shape:', inputTensor.shape)
    
    // Normalize input (divide by 5.0, same as model training)
    const normalizedInput = inputTensor.div(5.0)
    const normalizedData = await normalizedInput.data()
    console.log('Normalized input:', Array.from(normalizedData))
    
    // Make prediction
    const prediction = model.predict(normalizedInput)
    const stressScore = await prediction.data()
    
    console.log('Raw prediction:', stressScore[0])
    console.log('Prediction shape:', prediction.shape)
    
    // Update debug info
    if (debugMode) {
      setDebugInfo(prev => ({
        ...prev,
        rawPrediction: stressScore[0].toFixed(6),
        modelLoaded: true
      }))
    }
    
    // Clean up tensors
    inputTensor.dispose()
    normalizedInput.dispose()
    prediction.dispose()
    
    // Display result
    displayResult(stressScore[0])
  }

  const displayResult = (stressScore) => {
    // Use the raw model output as the wellbeing score (higher = better wellbeing)
    const wellbeingScore = stressScore
    const percentage = Math.round(wellbeingScore * 100)
    
    // Get reflection questions based on the wellbeing score
    const questionData = getQuestionsForScore(wellbeingScore)
    
    let category, className, emoji, message
    
    // Categorize based on wellbeing score (higher = better)
    if (wellbeingScore <= 0.20) {
      category = 'Struggling (Lowest State)'
      className = 'struggling'
      emoji = '😰'
      message = 'It sounds like things are really tough right now. Please consider reaching out for support - you don\'t have to go through this alone.'
    } else if (wellbeingScore <= 0.40) {
      category = 'Low (But Stabilizing)'
      className = 'low'
      emoji = '�'
      message = 'You might be going through a difficult time, but there are signs of stability. Small steps forward can make a big difference.'
    } else if (wellbeingScore <= 0.60) {
      category = 'Neutral (Middle Ground)'
      className = 'neutral'
      emoji = '😐'
      message = 'You seem to be in a balanced state. This is a good time to reflect on what\'s working and what could be improved.'
    } else if (wellbeingScore <= 0.80) {
      category = 'Doing Well (Growing)'
      className = 'good'
      emoji = '😊'
      message = 'You appear to be doing well and growing! Keep nurturing the positive habits and connections in your life.'
    } else {
      category = 'Thriving (Highest State)'
      className = 'thriving'
      emoji = '🌟'
      message = 'You seem to be thriving! This is wonderful - consider how you can maintain this positive momentum and perhaps support others too.'
    }
    
    setResult({
      category,
      className,
      emoji,
      message,
      percentage,
      wellbeingScore: wellbeingScore.toFixed(4),
      questionData
    })
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
    if (!result) return ''
    
    switch (result.className) {
      case 'struggling': return 'bg-gradient-to-r from-red-400 to-pink-400 text-white'
      case 'low': return 'bg-gradient-to-r from-orange-400 to-red-400 text-white'
      case 'neutral': return 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
      case 'good': return 'bg-gradient-to-r from-green-400 to-teal-400 text-white'
      case 'thriving': return 'bg-gradient-to-r from-blue-400 to-purple-400 text-white'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🎓 Student Stress Predictor
          </h1>
          <p className="text-gray-600 text-lg">AI-Powered Stress Level Assessment</p>
        </div>
        
        {/* Status */}
        <div className={`mb-8 p-4 rounded-xl border-2 font-medium text-center ${getStatusBgColor()}`}>
          {status.message}
        </div>
        
        {/* Input Controls */}
        <div className="space-y-8">
          {/* Stress Level */}
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
            <label className="flex items-center text-lg font-semibold text-red-800 mb-4">
              <span className="text-2xl mr-3">😰</span>
              Stress Level (0-5)
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="5"
                value={inputs.stress}
                onChange={(e) => handleInputChange('stress', e.target.value)}
                className="w-full h-3 bg-red-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #fca5a5 0%, #fca5a5 ${(inputs.stress/5)*100}%, #fecaca ${(inputs.stress/5)*100}%, #fecaca 100%)`
                }}
              />
              <div className="text-center mt-3">
                <span className="text-2xl font-bold text-red-700">{inputs.stress}</span>
              </div>
            </div>
          </div>

          {/* Depression Score */}
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <label className="flex items-center text-lg font-semibold text-indigo-800 mb-4">
              <span className="text-2xl mr-3">😔</span>
              Depression Score (0-5)
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="5"
                value={inputs.depression}
                onChange={(e) => handleInputChange('depression', e.target.value)}
                className="w-full h-3 bg-indigo-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #a5b4fc 0%, #a5b4fc ${(inputs.depression/5)*100}%, #c7d2fe ${(inputs.depression/5)*100}%, #c7d2fe 100%)`
                }}
              />
              <div className="text-center mt-3">
                <span className="text-2xl font-bold text-indigo-700">{inputs.depression}</span>
              </div>
            </div>
          </div>

          {/* Anxiety Score */}
          <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
            <label className="flex items-center text-lg font-semibold text-yellow-800 mb-4">
              <span className="text-2xl mr-3">😟</span>
              Anxiety Score (0-5)
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="5"
                value={inputs.anxiety}
                onChange={(e) => handleInputChange('anxiety', e.target.value)}
                className="w-full h-3 bg-yellow-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #fde047 0%, #fde047 ${(inputs.anxiety/5)*100}%, #fef3c7 ${(inputs.anxiety/5)*100}%, #fef3c7 100%)`
                }}
              />
              <div className="text-center mt-3">
                <span className="text-2xl font-bold text-yellow-700">{inputs.anxiety}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Predict Button */}
        <button
          onClick={predict}
          disabled={!model}
          className={`w-full mt-8 py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
            model 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-105 hover:shadow-xl' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {model ? 'Predict Stress Level ✨' : 'Loading Model...'}
        </button>

        {/* Result */}
        {result && (
          <div className={`mt-8 p-8 rounded-2xl text-center transition-all duration-500 ${getResultColors()}`}>
            <div className="text-6xl mb-4">{result.emoji}</div>
            <div className="text-2xl font-bold mb-3">{result.category}</div>
            <div className="text-xl mb-4">Wellbeing Score: {result.percentage}%</div>
            <div className="text-lg mb-6 opacity-90">
              Model Output: {result.wellbeingScore} (Range: {result.questionData.range})
            </div>
            <div className="text-base opacity-90 mb-6">{result.message}</div>
            
            {/* Reflection Questions */}
            <div className="bg-white bg-opacity-90 rounded-xl p-6 mt-6 border border-white border-opacity-30">
              <h3 className="text-xl font-bold mb-4 text-gray-800">💭 Reflection Questions for You</h3>
              <p className="text-sm text-gray-600 mb-4">Take a moment to reflect on these questions based on your current state:</p>
              <div className="space-y-3">
                {result.questionData.questions.map((question, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 text-left border border-gray-200 shadow-sm">
                    <div className="flex items-start space-x-3">
                      <span className="text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-base leading-relaxed text-gray-800">{question}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-sm text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p>💡 <strong>Tip:</strong> Consider journaling your thoughts about these questions or discussing them with someone you trust.</p>
              </div>
            </div>
          </div>
        )}

        {/* Test Examples */}
        <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Test Examples:</h3>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setTestValues(0,0,0)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
            >
              No Stress (0,0,0)
            </button>
            <button 
              onClick={() => setTestValues(1,1,1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              Low Stress (1,1,1)
            </button>
            <button 
              onClick={() => setTestValues(3,3,3)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
            >
              Medium (3,3,3)
            </button>
            <button 
              onClick={() => setTestValues(5,5,5)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            >
              Maximum Stress (5,5,5)
            </button>
            <button 
              onClick={() => setTestValues(4,3,5)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
            >
              Training Example (4,3,5)
            </button>
          </div>
        </div>

        {/* Debug Info */}
        {debugMode && (
          <div className="mt-8 p-6 bg-gray-100 rounded-2xl border border-gray-300 font-mono text-sm">
            <strong className="text-gray-800">Debug Information:</strong><br />
            Model loaded: <span className="text-blue-600">{debugInfo.modelLoaded ? 'Yes' : 'No'}</span><br />
            Input values: <span className="text-blue-600">{debugInfo.inputValues}</span><br />
            Normalized input: <span className="text-blue-600">{debugInfo.normalizedInput}</span><br />
            Raw prediction: <span className="text-blue-600">{debugInfo.rawPrediction}</span><br />
            Model weights: <span className="text-blue-600">{debugInfo.modelWeights}</span><br />
          </div>
        )}
        
        {/* Model Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="mb-2">Uses your actual trained model weights</p>
          <p className="mb-4">Runs completely offline in your browser</p>
          <button
            onClick={() => setDebugMode(!debugMode)}
            className="text-purple-600 hover:text-purple-800 underline transition-colors"
          >
            {debugMode ? 'Hide' : 'Show'} Debug Info
          </button>
        </div>
      </div>
    </div>
  )
}

export default StressPredictorPage