import { useState, useEffect } from 'react'
import { 
  awardGoalCompletion, 
  awardGoalCreation, 
  formatCurrency, 
  REWARDS 
} from '../utils/currencySystem'

const GoalsPage = () => {
  const [goals, setGoals] = useState([])
  const [newGoal, setNewGoal] = useState('')
  const [filter, setFilter] = useState('all') // all, active, completed
  const [isInitialLoad, setIsInitialLoad] = useState(true) // Track initial load

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('userGoals')
    if (savedGoals && savedGoals !== 'undefined' && savedGoals !== 'null') {
      try {
        const parsedGoals = JSON.parse(savedGoals)
        if (Array.isArray(parsedGoals)) {
          setGoals(parsedGoals)
        } else {
          setGoals([])
        }
      } catch (error) {
        console.error('Error parsing saved goals:', error)
        setGoals([])
      }
    } else {
      setGoals([])
    }
    setIsInitialLoad(false) // Mark initial load as complete
  }, [])

  // Save goals to localStorage whenever goals change (but not on initial load)
  useEffect(() => {
    if (!isInitialLoad) { // Only save after initial load is complete
      try {
        localStorage.setItem('userGoals', JSON.stringify(goals))
      } catch (error) {
        console.error('Error saving goals to localStorage:', error)
      }
    }
  }, [goals, isInitialLoad])

  // Add a new goal
  const addGoal = () => {
    if (newGoal.trim()) {
      const goalId = Date.now()
      const goal = {
        id: goalId,
        text: newGoal.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
      }
      
      const updatedGoals = [goal, ...goals]
      setGoals(updatedGoals)
      setNewGoal('')
      
      // Award currency for creating a goal and trigger currency update
      setTimeout(() => {
        awardGoalCreation(goalId)
        window.dispatchEvent(new CustomEvent('currencyUpdated'))
      }, 100) // Small delay to ensure state is updated
    }
  }

  // Toggle goal completion
  const toggleGoal = (id) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === id) {
        const wasCompleted = goal.completed
        const newCompleted = !goal.completed
        
        // Award currency only when completing (not uncompleting)
        if (!wasCompleted && newCompleted) {
          setTimeout(() => {
            awardGoalCompletion(goal.id)
            window.dispatchEvent(new CustomEvent('currencyUpdated'))
          }, 100)
        }
        
        return { 
          ...goal, 
          completed: newCompleted,
          completedAt: newCompleted ? new Date().toISOString() : null
        }
      }
      return goal
    })
    
    setGoals(updatedGoals)
  }

  // Delete a goal
  const deleteGoal = (id) => {
    const updatedGoals = goals.filter(goal => goal.id !== id)
    setGoals(updatedGoals)
  }

  // Filter goals based on current filter
  const filteredGoals = goals.filter(goal => {
    if (filter === 'active') return !goal.completed
    if (filter === 'completed') return goal.completed
    return true
  })

  // Statistics
  const totalGoals = goals.length
  const completedGoals = goals.filter(goal => goal.completed).length
  const activeGoals = totalGoals - completedGoals
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addGoal()
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          🎯 Goals & Achievements
        </h1>
        <p className="text-gray-600 text-lg">
          Set meaningful goals and track your progress toward achieving them
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl font-bold text-gray-800">{totalGoals}</div>
          <div className="text-sm text-gray-600">Total Goals</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-2xl font-bold text-blue-600">{activeGoals}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="text-3xl mb-2">📈</div>
          <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
          <div className="text-sm text-gray-600">Completion Rate</div>
        </div>
      </div>

      {/* Add New Goal */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Goal</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What would you like to achieve?"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          />
          <button
            onClick={addGoal}
            disabled={!newGoal.trim()}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
          >
            Add Goal
          </button>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          💡 Creating a goal earns you {formatCurrency(REWARDS.GOAL_CREATE)} • Completing it earns {formatCurrency(REWARDS.GOAL_COMPLETE)}!
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-100">
          {['all', 'active', 'completed'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize ${
                filter === filterType
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {filterType} {filterType === 'all' ? `(${totalGoals})` : filterType === 'active' ? `(${activeGoals})` : `(${completedGoals})`}
            </button>
          ))}
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {filter === 'all' ? 'No goals yet' : filter === 'active' ? 'No active goals' : 'No completed goals'}
            </h3>
            <p className="text-gray-500">
              {filter === 'all' ? 'Start by adding your first goal!' : filter === 'active' ? 'All your goals are completed! 🎉' : 'Complete some goals to see them here'}
            </p>
          </div>
        ) : (
          filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 transition-all duration-200 hover:shadow-xl ${
                goal.completed ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <button
                    onClick={() => toggleGoal(goal.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      goal.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {goal.completed && <span className="text-sm">✓</span>}
                  </button>
                  
                  <div className="flex-1">
                    <p className={`text-lg ${goal.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {goal.text}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Created: {new Date(goal.createdAt).toLocaleDateString()}</span>
                      {goal.completed && goal.completedAt && (
                        <span className="text-green-600">
                          Completed: {new Date(goal.completedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Delete goal"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Motivation Section */}
      {totalGoals > 0 && (
        <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100">
          <h3 className="text-2xl font-semibold text-green-800 mb-4">Keep Going! 🌟</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-700 mb-2">Progress Overview</h4>
              <div className="w-full bg-green-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <p className="text-green-600 text-sm">
                You've completed {completedGoals} out of {totalGoals} goals ({completionRate}%)
              </p>
            </div>
            <div>
              <h4 className="font-medium text-green-700 mb-2">Motivation</h4>
              <p className="text-green-600 text-sm leading-relaxed">
                {completionRate >= 80 ? "Amazing work! You're crushing your goals! 🎉" :
                 completionRate >= 50 ? "Great progress! Keep up the momentum! 💪" :
                 completionRate >= 25 ? "You're on the right track! Stay focused! 🎯" :
                 "Every journey starts with a single step. Keep going! 🌱"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GoalsPage