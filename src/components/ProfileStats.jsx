import React from 'react'

const ProfileStats = ({ 
  currentCoins, 
  lifetimeEarned, 
  achievements, 
  earnedBadges, 
  totalBadges 
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {/* Current RootCoins */}
      <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-xl text-white text-center">
        <div className="text-2xl font-bold">🪙 {currentCoins}</div>
        <div className="text-xs opacity-90">Current RootCoins</div>
      </div>

      {/* Lifetime Earned */}
      <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-xl text-white text-center">
        <div className="text-2xl font-bold">💰 {lifetimeEarned}</div>
        <div className="text-xs opacity-90">Lifetime Earned</div>
      </div>

      {/* Total Journal Entries */}
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-xl text-white text-center">
        <div className="text-2xl font-bold">📝 {achievements.totalEntries}</div>
        <div className="text-xs opacity-90">Journal Entries</div>
      </div>

      {/* Current Journal Streak */}
      <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-4 rounded-xl text-white text-center">
        <div className="text-2xl font-bold">🔥 {achievements.journalStreak}</div>
        <div className="text-xs opacity-90">Day Streak</div>
      </div>

      {/* Badges Earned */}
      <div className="bg-gradient-to-br from-pink-400 to-pink-600 p-4 rounded-xl text-white text-center">
        <div className="text-2xl font-bold">🏆 {earnedBadges}/{totalBadges}</div>
        <div className="text-xs opacity-90">Badges Earned</div>
      </div>
    </div>
  )
}

export default ProfileStats