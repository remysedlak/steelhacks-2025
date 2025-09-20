import React from 'react'

const BadgeDisplay = ({ badges }) => {
  const earnedBadges = badges.filter(badge => badge.earned)
  const unlockedBadges = badges.filter(badge => !badge.earned)

  return (
    <div className="space-y-6">
      {/* Earned Badges Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          🏆 Your Badges ({earnedBadges.length})
        </h3>
        {earnedBadges.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No badges earned yet. Keep journaling to unlock achievements! 💪
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {earnedBadges.map((badge) => (
              <div 
                key={badge.id} 
                className={`bg-gradient-to-br ${badge.color} p-4 rounded-lg text-white text-center transform hover:scale-105 transition-all shadow-lg`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div className="font-bold text-sm mb-1">{badge.name}</div>
                <div className="text-xs opacity-90">{badge.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Badges Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          🎯 All Achievements ({badges.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div 
              key={badge.id} 
              className={`p-4 rounded-lg text-center transition-all ${
                badge.earned 
                  ? `bg-gradient-to-br ${badge.color} text-white shadow-lg transform hover:scale-105` 
                  : 'bg-gray-100 text-gray-500 border-2 border-dashed border-gray-300'
              }`}
            >
              <div className={`text-3xl mb-2 ${badge.earned ? '' : 'grayscale'}`}>
                {badge.icon}
              </div>
              <div className="font-bold text-sm mb-1">{badge.name}</div>
              <div className="text-xs opacity-90">{badge.description}</div>
              {!badge.earned && (
                <div className="mt-2 text-xs font-medium text-gray-400">
                  🔒 Locked
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BadgeDisplay