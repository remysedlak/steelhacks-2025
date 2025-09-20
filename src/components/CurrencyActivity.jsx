import React from 'react'

const CurrencyActivity = ({ transactions }) => {
  const recentTransactions = transactions.slice(-5).reverse()

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        💳 Recent Activity
      </h3>
      <div className="space-y-3">
        {recentTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No transactions yet. Complete some activities to earn RootCoins! 🌱
          </p>
        ) : (
          recentTransactions.map((transaction, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">
                  {transaction.type === 'goal_completion' ? '🎯' : 
                   transaction.type === 'journal_entry' ? '📝' : 
                   transaction.type === 'weekly_bonus' ? '🎁' : '💰'}
                </span>
                <div>
                  <div className="font-medium text-gray-800">
                    {transaction.description}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">
                  +{transaction.amount} 🪙
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {transactions.length > 5 && (
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">
            Showing last 5 transactions of {transactions.length} total
          </span>
        </div>
      )}
    </div>
  )
}

export default CurrencyActivity