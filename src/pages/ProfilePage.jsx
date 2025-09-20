import { useState, useEffect } from 'react'

const ProfilePage = () => {
  const [entries, setEntries] = useState([])
  const [achievements, setAchievements] = useState({})

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]')
    setEntries(savedEntries)
    calculateAchievements(savedEntries)
  }, [])

  const calculateAchievements = (entries) => {
    const now = new Date()
    const sortedEntries = entries.sort((a, b) => new Date(b.date) - new Date(a.date))
    
    const achievements = {
      // Exercise streaks
      exerciseStreak: calculateExerciseStreak(sortedEntries),
      exerciseTotal: entries.filter(e => e.exerciseMinutes > 0).length,
      
      // Sleep consistency
      sleepStreak: calculateSleepStreak(sortedEntries),
      goodSleepCount: entries.filter(e => e.sleepHours >= 7 && e.sleepHours <= 9).length,
      
      // Stress & Anxiety improvements
      stressImprovement: calculateStressImprovement(sortedEntries),
      anxietyReduction: calculateAnxietyReduction(sortedEntries),
      
      // Journal consistency
      journalStreak: calculateJournalStreak(sortedEntries),
      totalEntries: entries.length,
      
      // Mood improvements
      positivityStreak: calculatePositivityStreak(sortedEntries),
      moodImprovement: calculateMoodImprovement(sortedEntries),
      
      // Reflection engagement
      reflectionCount: entries.filter(e => e.reflectionResponses && Object.keys(e.reflectionResponses).length > 0).length,
      
      // Wellness milestones
      wellnessScore: calculateAverageWellness(sortedEntries),
      consistencyScore: calculateConsistencyScore(sortedEntries)
    }
    
    setAchievements(achievements)
  }

  const calculateExerciseStreak = (entries) => {
    let streak = 0
    for (const entry of entries) {
      if (entry.exerciseMinutes > 0) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  const calculateSleepStreak = (entries) => {
    let streak = 0
    for (const entry of entries) {
      if (entry.sleepHours >= 7 && entry.sleepHours <= 9) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  const calculateJournalStreak = (entries) => {
    if (entries.length === 0) return 0
    
    const today = new Date()
    let streak = 0
    let checkDate = new Date(today)
    
    for (let i = 0; i < entries.length; i++) {
      const entryDate = new Date(entries[i].date)
      const daysDiff = Math.floor((checkDate - entryDate) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === streak) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
    
    return streak
  }

  const calculatePositivityStreak = (entries) => {
    let streak = 0
    const positiveMoods = ['good', 'great']
    
    for (const entry of entries) {
      if (positiveMoods.includes(entry.mood)) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  const calculateStressImprovement = (entries) => {
    const recentEntries = entries.slice(0, 7)
    const olderEntries = entries.slice(7, 14)
    
    if (recentEntries.length === 0 || olderEntries.length === 0) return 0
    
    const recentAvg = recentEntries
      .filter(e => e.stressData?.result?.percentage)
      .reduce((sum, e) => sum + e.stressData.result.percentage, 0) / recentEntries.length
    
    const olderAvg = olderEntries
      .filter(e => e.stressData?.result?.percentage)
      .reduce((sum, e) => sum + e.stressData.result.percentage, 0) / olderEntries.length
    
    return Math.max(0, Math.round(recentAvg - olderAvg))
  }

  const calculateAnxietyReduction = (entries) => {
    const stressEntries = entries.filter(e => e.stressData?.result?.percentage)
    if (stressEntries.length < 5) return 0
    
    const recent = stressEntries.slice(0, 3)
    const older = stressEntries.slice(-3)
    
    const recentAvg = recent.reduce((sum, e) => sum + e.stressData.result.percentage, 0) / recent.length
    const olderAvg = older.reduce((sum, e) => sum + e.stressData.result.percentage, 0) / older.length
    
    return Math.max(0, Math.round(recentAvg - olderAvg))
  }

  const calculateMoodImprovement = (entries) => {
    const moodValues = { struggling: 1, low: 2, okay: 3, good: 4, great: 5 }
    const recentEntries = entries.slice(0, 7)
    const olderEntries = entries.slice(7, 14)
    
    if (recentEntries.length === 0 || olderEntries.length === 0) return 0
    
    const recentAvg = recentEntries.reduce((sum, e) => sum + moodValues[e.mood], 0) / recentEntries.length
    const olderAvg = olderEntries.reduce((sum, e) => sum + moodValues[e.mood], 0) / olderEntries.length
    
    return Math.max(0, Number((recentAvg - olderAvg).toFixed(1)))
  }

  const calculateAverageWellness = (entries) => {
    const stressEntries = entries.filter(e => e.stressData?.result?.percentage)
    if (stressEntries.length === 0) return 0
    
    return Math.round(stressEntries.reduce((sum, e) => sum + e.stressData.result.percentage, 0) / stressEntries.length)
  }

  const calculateConsistencyScore = (entries) => {
    if (entries.length === 0) return 0
    
    const last30Days = entries.filter(e => {
      const entryDate = new Date(e.date)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return entryDate >= thirtyDaysAgo
    })
    
    return Math.round((last30Days.length / 30) * 100)
  }

  const badges = [
    // Exercise Badges
    {
      id: 'exercise-starter',
      name: 'Exercise Starter',
      description: 'Log your first workout',
      icon: '🏃‍♀️',
      condition: achievements.exerciseTotal >= 1,
      earned: achievements.exerciseTotal >= 1,
      color: 'from-green-400 to-green-600'
    },
    {
      id: 'exercise-warrior',
      name: 'Exercise Warrior',
      description: '7-day exercise streak',
      icon: '💪',
      condition: achievements.exerciseStreak >= 7,
      earned: achievements.exerciseStreak >= 7,
      color: 'from-orange-400 to-orange-600'
    },
    {
      id: 'fitness-champion',
      name: 'Fitness Champion',
      description: '30 days of exercise logged',
      icon: '🏆',
      condition: achievements.exerciseTotal >= 30,
      earned: achievements.exerciseTotal >= 30,
      color: 'from-yellow-400 to-yellow-600'
    },
    
    // Sleep Badges
    {
      id: 'sleep-conscious',
      name: 'Sleep Conscious',
      description: 'Track your first good night\'s sleep',
      icon: '😴',
      condition: achievements.goodSleepCount >= 1,
      earned: achievements.goodSleepCount >= 1,
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'sleep-master',
      name: 'Sleep Master',
      description: '7 consecutive nights of healthy sleep',
      icon: '🌙',
      condition: achievements.sleepStreak >= 7,
      earned: achievements.sleepStreak >= 7,
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      id: 'dream-keeper',
      name: 'Dream Keeper',
      description: '30 nights of quality sleep',
      icon: '✨',
      condition: achievements.goodSleepCount >= 30,
      earned: achievements.goodSleepCount >= 30,
      color: 'from-purple-400 to-purple-600'
    },
    
    // Stress & Anxiety Badges
    {
      id: 'stress-aware',
      name: 'Stress Aware',
      description: 'Complete your first AI stress assessment',
      icon: '🧠',
      condition: entries.some(e => e.stressData?.result),
      earned: entries.some(e => e.stressData?.result),
      color: 'from-teal-400 to-teal-600'
    },
    {
      id: 'anxiety-reducer',
      name: 'Anxiety Reducer',
      description: 'Improve stress levels by 10%',
      icon: '🌱',
      condition: achievements.stressImprovement >= 10,
      earned: achievements.stressImprovement >= 10,
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      id: 'zen-master',
      name: 'Zen Master',
      description: 'Achieve 80%+ average wellness score',
      icon: '🧘‍♀️',
      condition: achievements.wellnessScore >= 80,
      earned: achievements.wellnessScore >= 80,
      color: 'from-cyan-400 to-cyan-600'
    },
    
    // Journal & Reflection Badges
    {
      id: 'journal-rookie',
      name: 'Journal Rookie',
      description: 'Write your first journal entry',
      icon: '📝',
      condition: achievements.totalEntries >= 1,
      earned: achievements.totalEntries >= 1,
      color: 'from-pink-400 to-pink-600'
    },
    {
      id: 'reflection-enthusiast',
      name: 'Reflection Enthusiast',
      description: 'Complete 10 reflection sessions',
      icon: '💭',
      condition: achievements.reflectionCount >= 10,
      earned: achievements.reflectionCount >= 10,
      color: 'from-rose-400 to-rose-600'
    },
    {
      id: 'consistent-chronicler',
      name: 'Consistent Chronicler',
      description: '14-day journaling streak',
      icon: '📚',
      condition: achievements.journalStreak >= 14,
      earned: achievements.journalStreak >= 14,
      color: 'from-amber-400 to-amber-600'
    },
    
    // Mood & Positivity Badges
    {
      id: 'positivity-spark',
      name: 'Positivity Spark',
      description: 'Log 3 consecutive positive moods',
      icon: '😊',
      condition: achievements.positivityStreak >= 3,
      earned: achievements.positivityStreak >= 3,
      color: 'from-lime-400 to-lime-600'
    },
    {
      id: 'mood-booster',
      name: 'Mood Booster',
      description: 'Improve mood trend by 1 point',
      icon: '📈',
      condition: achievements.moodImprovement >= 1,
      earned: achievements.moodImprovement >= 1,
      color: 'from-sky-400 to-sky-600'
    },
    {
      id: 'consistency-king',
      name: 'Consistency King',
      description: 'Maintain 80% journal consistency',
      icon: '👑',
      condition: achievements.consistencyScore >= 80,
      earned: achievements.consistencyScore >= 80,
      color: 'from-violet-400 to-violet-600'
    }
  ]

  const earnedBadges = badges.filter(badge => badge.earned)
  const totalBadges = badges.length
  const completionPercentage = Math.round((earnedBadges.length / totalBadges) * 100)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <img src="icon.png" alt="Logo" className="h-12" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Your Profile
          </h1>
        </div>
        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
          Track your achievements and celebrate your mental health journey milestones
        </p>
      </div>

      {/* Profile Stats */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
          <span className="text-3xl mr-3">📊</span>
          Your Stats
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="text-2xl mb-2">📝</div>
            <div className="text-2xl font-bold text-blue-600">{achievements.totalEntries}</div>
            <div className="text-sm text-blue-600">Total Entries</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <div className="text-2xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-green-600">{achievements.journalStreak}</div>
            <div className="text-sm text-green-600">Current Streak</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <div className="text-2xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-purple-600">{earnedBadges.length}/{totalBadges}</div>
            <div className="text-sm text-purple-600">Badges Earned</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
            <div className="text-2xl mb-2">✨</div>
            <div className="text-2xl font-bold text-orange-600">{achievements.wellnessScore}%</div>
            <div className="text-sm text-orange-600">Avg Wellness</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Badge Collection Progress</span>
            <span className="text-sm text-gray-500">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-1000 ease-out rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
            <span className="text-3xl mr-3">🎖️</span>
            Earned Badges ({earnedBadges.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnedBadges.map((badge) => (
              <div 
                key={badge.id}
                className={`relative bg-gradient-to-br ${badge.color} rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl`}
              >
                <div className="absolute top-2 right-2">
                  <div className="bg-white bg-opacity-20 rounded-full p-1">
                    <span className="text-xs">✓</span>
                  </div>
                </div>
                <div className="text-4xl mb-3">{badge.icon}</div>
                <h3 className="font-bold text-lg mb-2">{badge.name}</h3>
                <p className="text-sm opacity-90">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Badges */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
          <span className="text-3xl mr-3">🏅</span>
          All Achievements
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className={`relative rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-lg ${
                badge.earned 
                  ? `bg-gradient-to-br ${badge.color} text-white border-transparent shadow-lg`
                  : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300'
              }`}
            >
              {badge.earned && (
                <div className="absolute top-2 right-2">
                  <div className="bg-white bg-opacity-20 rounded-full p-1">
                    <span className="text-xs">✓</span>
                  </div>
                </div>
              )}
              <div className={`text-4xl mb-3 ${badge.earned ? '' : 'grayscale'}`}>
                {badge.icon}
              </div>
              <h3 className={`font-bold text-lg mb-2 ${badge.earned ? '' : 'text-gray-500'}`}>
                {badge.name}
              </h3>
              <p className={`text-sm ${badge.earned ? 'opacity-90' : 'text-gray-400'}`}>
                {badge.description}
              </p>
              {!badge.earned && (
                <div className="absolute inset-0 bg-gray-200 bg-opacity-30 rounded-xl flex items-center justify-center">
                  <span className="text-6xl opacity-20">🔒</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage