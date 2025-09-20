import { useState, useEffect } from 'react'
import { 
  getCurrencyBalance, 
  getTransactionHistory, 
  getEarningsByCategory, 
  formatCurrency,
  awardBadgeEarned,
  hasEarnedReward,
  TRANSACTION_TYPES
} from '../utils/currencySystem'
import { calculateAllAchievements } from '../utils/achievementCalculations'
import { getBadges } from '../constants/badgeConstants'
import ProfileStats from '../components/ProfileStats'
import CurrencyActivity from '../components/CurrencyActivity'
import BadgeDisplay from '../components/BadgeDisplay'
import PlantCompanion from '../components/PlantCompanion'
import PlantShop from '../components/PlantShop'

const ProfilePage = () => {
  const [entries, setEntries] = useState([])
  const [achievements, setAchievements] = useState({})
  const [currencyBalance, setCurrencyBalance] = useState(0)
  const [lifetimeEarned, setLifetimeEarned] = useState(0)
  const [recentTransactions, setRecentTransactions] = useState([])
  const [earningsByCategory, setEarningsByCategory] = useState({})
  const [showPlantShop, setShowPlantShop] = useState(false)

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('mentalHealthEntries') || '[]')
    setEntries(savedEntries)
    
    // Calculate achievements using the utility function
    const calculatedAchievements = calculateAllAchievements(savedEntries)
    setAchievements(calculatedAchievements)
    
    // Load currency data
    loadCurrencyData()
    setEarningsByCategory(getEarningsByCategory())
  }, [])

  useEffect(() => {
    // Listen for currency updates from plant purchases
    const handleCurrencyUpdate = () => {
      loadCurrencyData()
    }
    
    window.addEventListener('currencyUpdated', handleCurrencyUpdate)
    return () => window.removeEventListener('currencyUpdated', handleCurrencyUpdate)
  }, [])

  const loadCurrencyData = () => {
    setCurrencyBalance(getCurrencyBalance())
    const transactions = getTransactionHistory()
    setRecentTransactions(transactions)
    setLifetimeEarned(transactions.reduce((sum, t) => sum + (t.amount > 0 ? t.amount : 0), 0))
  }

  const handlePlantPurchase = (result) => {
    setCurrencyBalance(result.remainingCoins)
    loadCurrencyData() // Refresh transaction history
  }

  // Get badges with current achievements
  const badges = getBadges(achievements, entries)

  // Award currency for newly earned badges
  useEffect(() => {
    badges.forEach(badge => {
      if (badge.earned && !hasEarnedReward(TRANSACTION_TYPES.BADGE_EARNED, badge.id)) {
        awardBadgeEarned(badge.id, badge.name)
        // Trigger currency update event
        window.dispatchEvent(new CustomEvent('currencyUpdated'))
      }
    })
  }, [achievements])

  const earnedBadges = badges.filter(badge => badge.earned)
  const totalBadges = badges.length

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
        
        <ProfileStats 
          currentCoins={currencyBalance}
          lifetimeEarned={lifetimeEarned}
          achievements={achievements}
          earnedBadges={earnedBadges.length}
          totalBadges={totalBadges}
        />

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Badge Collection Progress</span>
            <span className="text-sm text-gray-500">{Math.round((earnedBadges.length / totalBadges) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-1000 ease-out rounded-full"
              style={{ width: `${Math.round((earnedBadges.length / totalBadges) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Plant Companion & Shop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <PlantCompanion onPlantUpdate={loadCurrencyData} />
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">🛍️ Plant Care</h3>
            <button
              onClick={() => setShowPlantShop(!showPlantShop)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              {showPlantShop ? 'Hide Shop' : 'Open Shop'}
            </button>
          </div>
          
          {showPlantShop ? (
            <PlantShop 
              userCoins={currencyBalance} 
              onPurchase={handlePlantPurchase}
            />
          ) : (
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-8 border border-emerald-200 text-center">
              <div className="text-4xl mb-4">🛍️</div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Plant Shop</h4>
              <p className="text-gray-600 mb-4">
                Care for your plant companion! Buy water, fertilizer, and decorations to help your plant grow and thrive.
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-2xl mb-1">💧</div>
                  <div className="text-gray-700">Water</div>
                  <div className="text-green-600 font-bold">25 🪙</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">🌰</div>
                  <div className="text-gray-700">Fertilizer</div>
                  <div className="text-green-600 font-bold">75 🪙</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">🎨</div>
                  <div className="text-gray-700">Decorations</div>
                  <div className="text-green-600 font-bold">100+ 🪙</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Currency Activity */}
      {recentTransactions.length > 0 && (
        <div className="mb-12">
          <CurrencyActivity transactions={recentTransactions} />
        </div>
      )}

      {/* Badges */}
      <BadgeDisplay badges={badges} />
    </div>
  )
}

export default ProfilePage