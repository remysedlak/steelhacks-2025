import { useState } from 'react'

const QAPage = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null)

  const qaData = [
    {
      id: 1,
      question: "What are some signs of anxiety?",
      answer: "Common signs of anxiety include persistent worry, restlessness, fatigue, difficulty concentrating, muscle tension, and sleep disturbances. Physical symptoms may include rapid heartbeat, sweating, or shortness of breath."
    },
    {
      id: 2,
      question: "How can I practice mindfulness?",
      answer: "Start with 5-10 minutes daily of focused breathing. Pay attention to your breath, body sensations, or surroundings without judgment. Apps like guided meditations can help beginners establish a routine."
    },
    {
      id: 3,
      question: "What are healthy coping strategies for stress?",
      answer: "Effective stress management includes regular exercise, adequate sleep, balanced nutrition, social connections, time in nature, journaling, and relaxation techniques like deep breathing or progressive muscle relaxation."
    },
    {
      id: 4,
      question: "When should I seek professional help?",
      answer: "Consider professional help if symptoms persist for weeks, interfere with daily activities, affect relationships or work, or if you have thoughts of self-harm. Mental health professionals can provide personalized support and treatment options."
    },
    {
      id: 5,
      question: "How can I improve my sleep for better mental health?",
      answer: "Maintain a consistent sleep schedule, create a relaxing bedtime routine, limit screen time before bed, keep your bedroom cool and dark, avoid caffeine late in the day, and consider relaxation techniques."
    }
  ]

  const toggleQuestion = (id) => {
    setSelectedQuestion(selectedQuestion === id ? null : id)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Mental Health Q&A
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
          Find answers to common mental health questions. Click on any question to expand the answer.
        </p>
      </div>

      <div className="space-y-4">
        {qaData.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <button
              onClick={() => toggleQuestion(item.id)}
              className="w-full p-6 text-left flex justify-between items-center hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group"
            >
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors pr-4">
                {item.question}
              </h3>
              <span className={`text-3xl font-light transition-all duration-300 flex-shrink-0 ${
                selectedQuestion === item.id 
                  ? 'text-purple-500 rotate-45 scale-110' 
                  : 'text-blue-500 hover:scale-110 group-hover:text-purple-500'
              }`}>
                +
              </span>
            </button>
            
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
              selectedQuestion === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="px-6 pb-6">
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-gray-700 leading-relaxed text-base">{item.answer}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-lg">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
          <span className="text-3xl mr-3">🆘</span>
          Need Immediate Help?
        </h2>
        <p className="text-blue-700 mb-6 text-lg leading-relaxed">
          If you're experiencing a mental health crisis or having thoughts of self-harm, please reach out for immediate help:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-70 p-4 rounded-xl border border-blue-200">
            <div className="text-2xl mb-2">📞</div>
            <div className="font-semibold text-blue-800">Crisis Lifeline</div>
            <div className="text-blue-700 font-mono text-lg">988</div>
          </div>
          <div className="bg-white bg-opacity-70 p-4 rounded-xl border border-blue-200">
            <div className="text-2xl mb-2">💬</div>
            <div className="font-semibold text-blue-800">Crisis Text Line</div>
            <div className="text-blue-700">Text <span className="font-mono">HOME</span> to <span className="font-mono">741741</span></div>
          </div>
          <div className="bg-white bg-opacity-70 p-4 rounded-xl border border-blue-200">
            <div className="text-2xl mb-2">🚨</div>
            <div className="font-semibold text-blue-800">Emergency</div>
            <div className="text-blue-700 font-mono text-lg">911</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QAPage