// Data processing utilities for mental health tracking

/**
 * Filters entries based on timeframe
 * @param {Array} entries - All entries
 * @param {string} timeframe - 'week', 'month', or 'all'
 * @returns {Array} Filtered entries
 */
export const getFilteredEntries = (entries, timeframe) => {
  if (timeframe === 'all') return entries

  const now = new Date()
  const cutoffDate = new Date()
  
  if (timeframe === 'week') {
    cutoffDate.setDate(now.getDate() - 7)
  } else if (timeframe === 'month') {
    cutoffDate.setDate(now.getDate() - 30)
  }

  return entries.filter(entry => {
    const entryDate = new Date(entry.date)
    return entryDate >= cutoffDate
  })
}

/**
 * Calculate mood statistics from filtered entries
 * @param {Array} filteredEntries - Filtered entries
 * @returns {Object} Mood statistics
 */
export const getMoodStats = (filteredEntries) => {
  if (filteredEntries.length === 0) return {}

  const moodCounts = filteredEntries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1
    return acc
  }, {})

  const totalEntries = filteredEntries.length
  const moodPercentages = {}
  
  Object.keys(moodCounts).forEach(mood => {
    moodPercentages[mood] = Math.round((moodCounts[mood] / totalEntries) * 100)
  })

  return { counts: moodCounts, percentages: moodPercentages, total: totalEntries }
}

/**
 * Calculate sleep and exercise averages
 * @param {Array} filteredEntries - Filtered entries
 * @returns {Object} Averages data
 */
export const getAverages = (filteredEntries) => {
  if (filteredEntries.length === 0) return {}

  const sleepEntries = filteredEntries.filter(entry => entry.sleepHours)
  const exerciseEntries = filteredEntries.filter(entry => entry.exerciseMinutes)

  const avgSleep = sleepEntries.length > 0 
    ? sleepEntries.reduce((sum, entry) => sum + entry.sleepHours, 0) / sleepEntries.length
    : 0

  const avgExercise = exerciseEntries.length > 0
    ? exerciseEntries.reduce((sum, entry) => sum + entry.exerciseMinutes, 0) / exerciseEntries.length
    : 0

  return {
    sleep: avgSleep.toFixed(1),
    exercise: Math.round(avgExercise),
    sleepEntries: sleepEntries.length,
    exerciseEntries: exerciseEntries.length
  }
}

/**
 * Calculate stress level statistics from AI assessments
 * @param {Array} filteredEntries - Filtered entries
 * @returns {Object|null} Stress statistics
 */
export const getStressStats = (filteredEntries) => {
  const stressEntries = filteredEntries.filter(entry => entry.stressData && entry.stressData.result)
  
  if (stressEntries.length === 0) return null

  const scores = stressEntries.map(entry => entry.stressData.result.percentage)
  const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
  
  // Get trend over time
  const recentScores = scores.slice(0, Math.min(3, scores.length))
  const olderScores = scores.slice(Math.min(3, scores.length), Math.min(6, scores.length))
  
  let trend = 'stable'
  if (olderScores.length > 0) {
    const recentAvg = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length
    const olderAvg = olderScores.reduce((sum, score) => sum + score, 0) / olderScores.length
    
    if (recentAvg > olderAvg + 5) trend = 'improving'
    else if (recentAvg < olderAvg - 5) trend = 'declining'
  }

  // Category distribution
  const categories = stressEntries.reduce((acc, entry) => {
    const score = entry.stressData.result.percentage
    let category
    if (score <= 60) category = 'High Anxiety'
    else if (score <= 70) category = 'Moderate Anxiety'
    else if (score <= 80) category = 'Balanced'
    else if (score <= 90) category = 'Low Anxiety'
    else category = 'Optimal'
    
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  return {
    avgScore: avgScore.toFixed(1),
    totalAssessments: stressEntries.length,
    trend,
    categories,
    recentEntries: stressEntries.slice(0, 7),
    scores
  }
}

/**
 * Calculate mood trend (simplified)
 * @param {Array} filteredEntries - Filtered entries
 * @returns {string|null} Trend direction
 */
export const getMoodTrend = (filteredEntries) => {
  if (filteredEntries.length < 2) return null

  const moodValues = { struggling: 1, low: 2, okay: 3, good: 4, great: 5 }
  const recentEntries = filteredEntries.slice(0, Math.min(5, filteredEntries.length))
  const olderEntries = filteredEntries.slice(Math.min(5, filteredEntries.length), Math.min(10, filteredEntries.length))

  if (olderEntries.length === 0) return null

  const recentAvg = recentEntries.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / recentEntries.length
  const olderAvg = olderEntries.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / olderEntries.length

  const diff = recentAvg - olderAvg
  if (diff > 0.2) return 'improving'
  if (diff < -0.2) return 'declining'
  return 'stable'
}

/**
 * Generate time series anxiety score chart data (daily final scores)
 * @param {Array} filteredEntries - Filtered entries
 * @returns {Array} Chart data points
 */
export const getAnxietyChartData = (filteredEntries) => {
  // Group entries by date to get the anxiety scores for each day
  const entriesByDate = {}
  
  filteredEntries.forEach(entry => {
    const dateKey = new Date(entry.date).toDateString()
    if (!entriesByDate[dateKey]) {
      entriesByDate[dateKey] = []
    }
    entriesByDate[dateKey].push(entry)
  })

  // Calculate daily anxiety scores based on actual stress data
  const dailyScores = []
  
  // Sort dates chronologically
  const sortedDates = Object.keys(entriesByDate).sort((a, b) => new Date(a) - new Date(b))
  
  sortedDates.forEach(dateKey => {
    const dayEntries = entriesByDate[dateKey].sort((a, b) => new Date(a.date) - new Date(b.date))
    
    // Process all stress assessments for the day
    let dayAnxietySum = 0
    let dayStressCount = 0
    
    dayEntries.forEach(entry => {
      if (entry.stressData?.result?.lifelongScore !== undefined) {
        // Use the actual anxiety score from the stress assessment
        dayAnxietySum += parseFloat(entry.stressData.result.lifelongScore)
        dayStressCount++
      }
    })
    
    if (dayStressCount > 0) {
      // Calculate average anxiety score for the day
      const avgAnxietyScore = dayAnxietySum / dayStressCount
      
      // Calculate average stress percentage for display
      let dayStressSum = 0
      dayEntries.forEach(entry => {
        if (entry.stressData?.result?.percentage !== undefined) {
          dayStressSum += entry.stressData.result.percentage
        }
      })
      const avgStress = dayStressSum / dayStressCount
      
      dailyScores.push({
        date: new Date(dateKey),
        dateString: new Date(dateKey).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        anxietyScore: avgAnxietyScore,
        avgStress: avgStress,
        mood: dayEntries[dayEntries.length - 1].mood, // Last mood of the day
        fullDate: new Date(dateKey).toLocaleDateString(),
        entryCount: dayEntries.length,
        stressCount: dayStressCount
      })
    }
  })
  
  return dailyScores
}