import { useState, useEffect } from 'react'
import { getCurrencyBalance, formatCurrency, getCurrencyInfo } from '../../utils/currencySystem'

const CurrencyDisplay = ({ showLabel = true, size = 'normal' }) => {
  const [balance, setBalance] = useState(0)
  const { symbol } = getCurrencyInfo()

  useEffect(() => {
    // Update balance on component mount
    setBalance(getCurrencyBalance())

    // Listen for currency updates (custom event)
    const handleCurrencyUpdate = () => {
      setBalance(getCurrencyBalance())
    }

    window.addEventListener('currencyUpdated', handleCurrencyUpdate)
    
    // Also update periodically to catch any changes
    const interval = setInterval(() => {
      setBalance(getCurrencyBalance())
    }, 5000)

    return () => {
      window.removeEventListener('currencyUpdated', handleCurrencyUpdate)
      clearInterval(interval)
    }
  }, [])

  const sizeClasses = {
    small: 'text-sm',
    normal: 'text-base',
    large: 'text-lg font-semibold'
  }

  return (
    <div className={`flex items-center space-x-1 ${sizeClasses[size]}`}>
      <span className="text-yellow-500">{symbol}</span>
      <span className="font-medium text-gray-700">
        {balance.toLocaleString()}
      </span>
      {showLabel && (
        <span className="text-gray-500 text-sm hidden sm:inline">RootCoins</span>
      )}
    </div>
  )
}

export default CurrencyDisplay