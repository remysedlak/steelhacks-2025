import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import QAPage from './pages/QAPage'
import TrackerPage from './pages/TrackerPage'
import ProgressPage from './pages/ProgressPage'
import ProfilePage from './pages/ProfilePage'
import GoalsPage from './pages/GoalsPage'
import CurrencyDisplay from './components/ui/CurrencyDisplay'
import StressLevelAnalysis from './components/analysis/StressLevelAnalysis'
import { getFilteredEntries, getStressStats, getAnxietyChartData } from './utils/dataProcessing'
import './index.css'

// Home component
const HomePage = () => {
  const [entries, setEntries] = useState([])

  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('mentalHealthEntries')
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  // Process data for stress analysis (show recent week's data)
  const filteredEntries = getFilteredEntries(entries, 'week')
  const stressStats = getStressStats(filteredEntries)
  const chartData = getAnxietyChartData(filteredEntries)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src="icon.png" alt="Logo" className="h-12" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Rooted Reflections
            </h1>
          </div>
          <p className=" text-center text-xl text-gray-600 mb-8 leading-relaxed">
            Your companion for mental health and wellness
          </p>
        </div>
      {/* Stress Level Analysis Chart at the top */}
      {stressStats && (
        <StressLevelAnalysis stressStats={stressStats} chartData={chartData} />
      )}
      
      <div className="text-center">
        

    

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
        <h2 className="text-3xl font-semibold text-blue-800 mb-6">Welcome to Your Mental Health Journey</h2>
        <p className="text-blue-700 mb-6 text-lg leading-relaxed">
          Take care of your mental health with our simple tools designed to help you understand and improve your wellbeing.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-600">
          <div className="flex items-center justify-center space-x-3 p-4 bg-white bg-opacity-50 rounded-lg">
            <span className="text-2xl">✨</span>
            <span className="font-medium">Track your mood and daily activities</span>
          </div>
          <div className="flex items-center justify-center space-x-3 p-4 bg-white bg-opacity-50 rounded-lg">
            <span className="text-2xl">📈</span>
            <span className="font-medium">Visualize your progress over time</span>
          </div>
          <div className="flex items-center justify-center space-x-3 p-4 bg-white bg-opacity-50 rounded-lg">
            <span className="text-2xl">🎓</span>
            <span className="font-medium">AI-powered stress assessment with reflection</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

// Navigation component
const Navigation = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/qa', label: 'Q&A', icon: '❓' },
    { path: '/tracker', label: 'Tracker', icon: '📝' },
    { path: '/progress', label: 'Progress', icon: '📊' },
    { path: '/goals', label: 'Goals', icon: '🎯' },
    { path: '/profile', label: 'Profile', icon: '🏆' }
  ]

  return (
    <nav className="bg-white backdrop-blur-lg bg-opacity-95 shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200">
            <img src="icon.png" alt="Logo" className="h-8" />
            <span>Rooted Reflections</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <CurrencyDisplay />
            
            <div className="flex space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navigation />
        <main className="py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/qa" element={<QAPage />} />
            <Route path="/tracker" element={<TrackerPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
