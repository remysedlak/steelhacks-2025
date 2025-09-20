// Currency System for Mental Health App
// Prevents abuse and tracks all transactions

const CURRENCY_NAME = 'RootCoins'
const CURRENCY_SYMBOL = '🪙'

// Reward amounts for different achievements
export const REWARDS = {
  GOAL_COMPLETE: 50,
  GOAL_CREATE: 10,
  BADGE_EARNED: 100,
  JOURNAL_ENTRY: 25,
  STREAK_MILESTONE: {
    3: 75,   // 3 days
    7: 150,  // 1 week
    14: 300, // 2 weeks
    30: 500, // 1 month
    60: 750, // 2 months
    100: 1000 // 100 days
  },
  STRESS_ASSESSMENT: 20,
  REFLECTION_COMPLETE: 30,
  WEEKLY_CHECK_IN: 100
}

// Transaction types for tracking
export const TRANSACTION_TYPES = {
  GOAL_COMPLETE: 'goal_complete',
  GOAL_CREATE: 'goal_create',
  BADGE_EARNED: 'badge_earned',
  JOURNAL_ENTRY: 'journal_entry',
  STREAK_MILESTONE: 'streak_milestone',
  STRESS_ASSESSMENT: 'stress_assessment',
  REFLECTION_COMPLETE: 'reflection_complete',
  WEEKLY_CHECK_IN: 'weekly_check_in',
  PLANT_PURCHASE: 'plant_purchase'
}

// Get current currency balance
export const getCurrencyBalance = () => {
  const data = localStorage.getItem('currencyData')
  if (!data) return 0
  
  try {
    const parsed = JSON.parse(data)
    return parsed.balance || 0
  } catch (error) {
    console.error('Error parsing currency data:', error)
    return 0
  }
}

// Get transaction history
export const getTransactionHistory = () => {
  const data = localStorage.getItem('currencyData')
  if (!data) return []
  
  try {
    const parsed = JSON.parse(data)
    return parsed.transactions || []
  } catch (error) {
    console.error('Error parsing currency data:', error)
    return []
  }
}

// Get all currency data
export const getCurrencyData = () => {
  const data = localStorage.getItem('currencyData')
  if (!data) {
    return {
      balance: 0,
      transactions: [],
      earnedRewards: new Set(),
      lastUpdated: new Date().toISOString()
    }
  }
  
  try {
    const parsed = JSON.parse(data)
    return {
      balance: parsed.balance || 0,
      transactions: parsed.transactions || [],
      earnedRewards: new Set(parsed.earnedRewards || []),
      lastUpdated: parsed.lastUpdated || new Date().toISOString()
    }
  } catch (error) {
    console.error('Error parsing currency data:', error)
    return {
      balance: 0,
      transactions: [],
      earnedRewards: new Set(),
      lastUpdated: new Date().toISOString()
    }
  }
}

// Save currency data
const saveCurrencyData = (data) => {
  try {
    const toSave = {
      ...data,
      earnedRewards: Array.from(data.earnedRewards),
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem('currencyData', JSON.stringify(toSave))
  } catch (error) {
    console.error('Error saving currency data:', error)
  }
}

// Award currency for an action - with abuse prevention
export const awardCurrency = (amount, type, description, uniqueId = null) => {
  if (!amount || amount <= 0) return false
  
  const currencyData = getCurrencyData()
  
  // Check if this specific reward has already been earned
  if (uniqueId) {
    const rewardKey = `${type}_${uniqueId}`
    if (currencyData.earnedRewards.has(rewardKey)) {
      console.log('Reward already earned for:', rewardKey)
      return false // Already earned this specific reward
    }
    currencyData.earnedRewards.add(rewardKey)
  }
  
  // Create transaction record
  const transaction = {
    id: Date.now() + Math.random(),
    type,
    amount,
    description,
    timestamp: new Date().toISOString(),
    uniqueId
  }
  
  // Update balance and add transaction
  currencyData.balance += amount
  currencyData.transactions.unshift(transaction) // Add to beginning for recent-first order
  
  // Keep only last 1000 transactions to prevent storage bloat
  if (currencyData.transactions.length > 1000) {
    currencyData.transactions = currencyData.transactions.slice(0, 1000)
  }
  
  saveCurrencyData(currencyData)
  
  console.log(`Awarded ${amount} ${CURRENCY_NAME} for: ${description}`)
  return true
}

// Check if a specific reward has been earned
export const hasEarnedReward = (type, uniqueId) => {
  if (!uniqueId) return false
  
  const currencyData = getCurrencyData()
  const rewardKey = `${type}_${uniqueId}`
  return currencyData.earnedRewards.has(rewardKey)
}

// Format currency for display
export const formatCurrency = (amount) => {
  return `${CURRENCY_SYMBOL} ${amount.toLocaleString()}`
}

// Get currency name and symbol
export const getCurrencyInfo = () => ({
  name: CURRENCY_NAME,
  symbol: CURRENCY_SYMBOL
})

// Award currency for goal completion
export const awardGoalCompletion = (goalId) => {
  return awardCurrency(
    REWARDS.GOAL_COMPLETE,
    TRANSACTION_TYPES.GOAL_COMPLETE,
    'Completed a personal goal',
    goalId
  )
}

// Award currency for goal creation
export const awardGoalCreation = (goalId) => {
  return awardCurrency(
    REWARDS.GOAL_CREATE,
    TRANSACTION_TYPES.GOAL_CREATE,
    'Created a new goal',
    goalId
  )
}

// Award currency for badge earned
export const awardBadgeEarned = (badgeId, badgeName) => {
  return awardCurrency(
    REWARDS.BADGE_EARNED,
    TRANSACTION_TYPES.BADGE_EARNED,
    `Earned badge: ${badgeName}`,
    badgeId
  )
}

// Award currency for journal entry
export const awardJournalEntry = (entryId) => {
  return awardCurrency(
    REWARDS.JOURNAL_ENTRY,
    TRANSACTION_TYPES.JOURNAL_ENTRY,
    'Completed a journal entry',
    entryId
  )
}

// Award currency for streak milestones
export const awardStreakMilestone = (streakType, streakLength) => {
  const reward = REWARDS.STREAK_MILESTONE[streakLength]
  if (!reward) return false
  
  return awardCurrency(
    reward,
    TRANSACTION_TYPES.STREAK_MILESTONE,
    `Achieved ${streakLength}-day ${streakType} streak`,
    `${streakType}_${streakLength}`
  )
}

// Award currency for stress assessment
export const awardStressAssessment = (assessmentId) => {
  return awardCurrency(
    REWARDS.STRESS_ASSESSMENT,
    TRANSACTION_TYPES.STRESS_ASSESSMENT,
    'Completed AI stress assessment',
    assessmentId
  )
}

// Award currency for reflection completion
export const awardReflectionComplete = (reflectionId) => {
  return awardCurrency(
    REWARDS.REFLECTION_COMPLETE,
    TRANSACTION_TYPES.REFLECTION_COMPLETE,
    'Completed reflection session',
    reflectionId
  )
}

// Get total earnings by category
export const getEarningsByCategory = () => {
  const transactions = getTransactionHistory()
  const categories = {}
  
  transactions.forEach(transaction => {
    if (!categories[transaction.type]) {
      categories[transaction.type] = {
        total: 0,
        count: 0,
        description: transaction.description.split(':')[0] // Get the base description
      }
    }
    categories[transaction.type].total += transaction.amount
    categories[transaction.type].count += 1
  })
  
  return categories
}

// Get recent transactions (last N transactions)
export const getRecentTransactions = (limit = 10) => {
  const transactions = getTransactionHistory()
  return transactions.slice(0, limit)
}

// Get daily earnings for the last N days
export const getDailyEarnings = (days = 30) => {
  const transactions = getTransactionHistory()
  const now = new Date()
  const dailyEarnings = {}
  
  // Initialize last N days with 0
  for (let i = 0; i < days; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    dailyEarnings[dateStr] = 0
  }
  
  // Sum earnings by day
  transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.timestamp).toISOString().split('T')[0]
    if (dailyEarnings.hasOwnProperty(transactionDate)) {
      dailyEarnings[transactionDate] += transaction.amount
    }
  })
  
  return dailyEarnings
}

// Deduct currency for purchases
export const deductCurrency = (amount) => {
  const data = localStorage.getItem('currencyData')
  let currencyData = { balance: 0, transactions: [] }
  
  if (data) {
    try {
      currencyData = JSON.parse(data)
    } catch (error) {
      console.error('Error parsing currency data:', error)
    }
  }
  
  // Check if user has enough balance
  if (currencyData.balance < amount) {
    throw new Error('Insufficient balance!')
  }
  
  // Deduct amount
  currencyData.balance -= amount
  
  // Save updated data
  localStorage.setItem('currencyData', JSON.stringify(currencyData))
  
  return currencyData.balance
}

// Add a transaction record
export const addTransaction = (type, amount, description, uniqueId = null) => {
  const data = localStorage.getItem('currencyData')
  let currencyData = { balance: 0, transactions: [] }
  
  if (data) {
    try {
      currencyData = JSON.parse(data)
    } catch (error) {
      console.error('Error parsing currency data:', error)
    }
  }
  
  // Create transaction record
  const transaction = {
    id: Date.now() + Math.random(), // Simple unique ID
    type,
    amount,
    description,
    timestamp: Date.now(),
    uniqueId
  }
  
  // Add transaction to history
  currencyData.transactions.unshift(transaction)
  
  // Keep only last 1000 transactions for performance
  if (currencyData.transactions.length > 1000) {
    currencyData.transactions = currencyData.transactions.slice(0, 1000)
  }
  
  // Save updated data
  localStorage.setItem('currencyData', JSON.stringify(currencyData))
  
  return transaction
}

// Export currency constants
export { CURRENCY_NAME, CURRENCY_SYMBOL }