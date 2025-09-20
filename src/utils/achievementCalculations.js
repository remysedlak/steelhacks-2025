// Achievement calculation utilities for ProfilePage

export const calculateExerciseStreak = (entries) => {
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

export const calculateSleepStreak = (entries) => {
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

export const calculateJournalStreak = (entries) => {
  if (entries.length === 0) return 0
  
  // Sort entries by date (most recent first)
  const sortedEntries = entries.sort((a, b) => new Date(b.date) - new Date(a.date))
  
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset to start of day for accurate comparison
  
  let streak = 0
  let currentCheckDate = new Date(today)
  
  // Get unique entry dates (in case there are multiple entries per day)
  const entryDates = [...new Set(sortedEntries.map(entry => {
    const date = new Date(entry.date)
    date.setHours(0, 0, 0, 0)
    return date.getTime()
  }))].sort((a, b) => b - a) // Sort timestamps descending (most recent first)
  
  // Check each day starting from today
  for (let i = 0; i < entryDates.length; i++) {
    const entryDate = new Date(entryDates[i])
    const daysDiff = Math.floor((currentCheckDate - entryDate) / (1000 * 60 * 60 * 24))
    
    if (daysDiff === streak) {
      // Found entry for the expected day
      streak++
      currentCheckDate.setDate(currentCheckDate.getDate() - 1)
    } else if (daysDiff > streak) {
      // Gap in entries, streak breaks
      break
    }
  }
  
  return streak
}

export const calculatePositivityStreak = (entries) => {
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

export const calculateStressImprovement = (entries) => {
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

export const calculateAnxietyReduction = (entries) => {
  const stressEntries = entries.filter(e => e.stressData?.result?.percentage)
  if (stressEntries.length < 5) return 0
  
  const recent = stressEntries.slice(0, 3)
  const older = stressEntries.slice(-3)
  
  const recentAvg = recent.reduce((sum, e) => sum + e.stressData.result.percentage, 0) / recent.length
  const olderAvg = older.reduce((sum, e) => sum + e.stressData.result.percentage, 0) / older.length
  
  return Math.max(0, Math.round(recentAvg - olderAvg))
}

export const calculateMoodImprovement = (entries) => {
  const moodValues = { struggling: 1, low: 2, okay: 3, good: 4, great: 5 }
  const recentEntries = entries.slice(0, 7)
  const olderEntries = entries.slice(7, 14)
  
  if (recentEntries.length === 0 || olderEntries.length === 0) return 0
  
  const recentAvg = recentEntries.reduce((sum, e) => sum + moodValues[e.mood], 0) / recentEntries.length
  const olderAvg = olderEntries.reduce((sum, e) => sum + moodValues[e.mood], 0) / olderEntries.length
  
  return Math.max(0, Number((recentAvg - olderAvg).toFixed(1)))
}

export const calculateAverageWellness = (entries) => {
  const stressEntries = entries.filter(e => e.stressData?.result?.percentage)
  if (stressEntries.length === 0) return 0
  
  return Math.round(stressEntries.reduce((sum, e) => sum + e.stressData.result.percentage, 0) / stressEntries.length)
}

export const calculateConsistencyScore = (entries) => {
  if (entries.length === 0) return 0
  
  const last30Days = entries.filter(e => {
    const entryDate = new Date(e.date)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return entryDate >= thirtyDaysAgo
  })
  
  return Math.round((last30Days.length / 30) * 100)
}

export const calculateAllAchievements = (entries) => {
  const sortedEntries = entries.sort((a, b) => new Date(b.date) - new Date(a.date))
  
  return {
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
}