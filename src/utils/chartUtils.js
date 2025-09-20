// Chart rendering utilities for mental health tracking

/**
 * Generate SVG path for anxiety chart line
 * @param {Array} chartData - Chart data points
 * @param {Object} chartPadding - Padding configuration
 * @param {number} dataWidth - Chart data width
 * @param {number} dataHeight - Chart data height
 * @param {number} scoreRange - Score range for scaling
 * @returns {string} SVG path string
 */
export const generatePath = (chartData, chartPadding, dataWidth, dataHeight, scoreRange) => {
  if (chartData.length === 0) return ''
  
  return chartData.map((point, index) => {
    const x = chartPadding.left + (index / Math.max(1, chartData.length - 1)) * dataWidth
    // Fix: Use the actual anxiety score range (0.5-1.0) for proper scaling
    const normalizedScore = (point.anxietyScore - 0.5) / 0.5 // Convert 0.5-1.0 to 0-1
    const y = chartPadding.top + normalizedScore * dataHeight
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')
}

/**
 * Get color for anxiety score point
 * @param {number} anxietyScore - Anxiety score (0.0-1.0)
 * @returns {string} Color hex code
 */
export const getAnxietyScoreColor = (anxietyScore) => {
  if (anxietyScore >= 0.8) return '#ef4444' // red - high anxiety (bottom area)
  else if (anxietyScore >= 0.6) return '#f97316' // orange - moderate-high anxiety
  else if (anxietyScore >= 0.4) return '#eab308' // yellow - moderate anxiety
  else if (anxietyScore >= 0.2) return '#84cc16' // light green - mild anxiety
  else return '#22c55e' // green - low anxiety (top area)
}

/**
 * Get color class for stress category
 * @param {string} category - Stress category
 * @returns {string} Tailwind CSS class
 */
export const getStressCategoryColor = (category) => {
  if (category === 'Optimal') return 'from-green-200 to-green-400'
  else if (category === 'Low Anxiety') return 'from-blue-200 to-blue-400'
  else if (category === 'Balanced') return 'from-yellow-200 to-yellow-400'
  else if (category === 'Moderate Anxiety') return 'from-orange-200 to-orange-400'
  else if (category === 'High Anxiety') return 'from-red-200 to-red-400'
  else return 'from-gray-200 to-gray-300'
}

/**
 * Calculate chart dimensions and scales
 * @param {Array} chartData - Chart data points
 * @returns {Object} Chart configuration
 */
export const getChartConfig = (chartData) => {
  const chartHeight = 200
  const chartPadding = { top: 20, right: 20, bottom: 40, left: 50 }
  const chartWidth = Math.max(600, chartData.length * 80) // More space between daily points
  const dataHeight = chartHeight - chartPadding.top - chartPadding.bottom
  const dataWidth = chartWidth - chartPadding.left - chartPadding.right
  
  // Calculate min/max for anxiety score range (0.0 to 1.0, full range)
  const minScore = 0.0 // Always show full range from 0.0
  const maxScore = 1.0 // Always show full range to 1.0
  const scoreRange = maxScore - minScore
  
  return {
    chartHeight,
    chartPadding,
    chartWidth,
    dataHeight,
    dataWidth,
    minScore,
    maxScore,
    scoreRange
  }
}