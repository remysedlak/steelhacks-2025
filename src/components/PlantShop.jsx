import React, { useState, useEffect } from 'react'
import { 
  SHOP_ITEMS, 
  SHOP_CATEGORIES, 
  getShopItemsByCategory, 
  canPurchaseItem, 
  purchaseShopItem,
  getRarityColor,
  getRarityTextColor
} from '../utils/plantShop'
import { getPlantState, savePlantState } from '../utils/plantSystem'
import { deductCurrency, addTransaction, TRANSACTION_TYPES } from '../utils/currencySystem'

const PlantShop = ({ userCoins, onPurchase }) => {
  const [selectedCategory, setSelectedCategory] = useState(SHOP_CATEGORIES.CARE)
  const [plantState, setPlantState] = useState(null)
  const [purchaseMessage, setPurchaseMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'

  useEffect(() => {
    setPlantState(getPlantState())
    
    // Listen for plant updates
    const handlePlantUpdate = (event) => {
      setPlantState(event.detail)
    }
    
    window.addEventListener('plantUpdated', handlePlantUpdate)
    return () => window.removeEventListener('plantUpdated', handlePlantUpdate)
  }, [])

  const showMessage = (message, type) => {
    setPurchaseMessage(message)
    setMessageType(type)
    setTimeout(() => {
      setPurchaseMessage('')
      setMessageType('')
    }, 3000)
  }

  const handlePurchase = async (item) => {
    try {
      if (!plantState) {
        throw new Error('Plant data not loaded')
      }

      const result = purchaseShopItem(item, userCoins, plantState)
      
      // Deduct currency
      deductCurrency(item.price)
      
      // Add transaction record
      addTransaction(
        TRANSACTION_TYPES.PLANT_PURCHASE,
        -item.price,
        `Purchased ${item.name} for plant companion`
      )
      
      // Save updated plant state
      savePlantState(result.newPlantState)
      setPlantState(result.newPlantState)
      
      // Notify parent component
      if (onPurchase) {
        onPurchase(result)
      }
      
      showMessage(`Successfully purchased ${item.name}! ${item.type === 'consumable' ? 'Item used immediately.' : 'Decoration added to your plant!'}`, 'success')
      
      // Trigger currency update event
      window.dispatchEvent(new CustomEvent('currencyUpdated'))
      
    } catch (error) {
      showMessage(error.message, 'error')
    }
  }

  const renderShopItem = (item) => {
    if (!plantState) return null
    
    const purchaseCheck = canPurchaseItem(item, userCoins, plantState)
    const isAffordable = userCoins >= item.price
    const canBuy = purchaseCheck.canPurchase
    
    return (
      <div 
        key={item.id}
        className={`relative rounded-xl p-4 border-2 transition-all duration-300 hover:shadow-lg ${
          canBuy && isAffordable
            ? 'border-green-300 bg-white hover:border-green-400 cursor-pointer'
            : 'border-gray-200 bg-gray-50 cursor-not-allowed'
        }`}
      >
        {/* Rarity indicator for decorations */}
        {item.rarity && (
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${getRarityTextColor(item.rarity)} bg-white border`}>
            {item.rarity.toUpperCase()}
          </div>
        )}
        
        {/* Item icon */}
        <div className="text-4xl text-center mb-3">
          {item.emoji}
        </div>
        
        {/* Item details */}
        <h4 className="font-bold text-gray-800 mb-2 text-center">
          {item.name}
        </h4>
        
        <p className="text-sm text-gray-600 mb-4 text-center leading-relaxed">
          {item.description}
        </p>
        
        {/* Effects for consumables */}
        {item.effects && (
          <div className="mb-4 p-2 bg-green-50 rounded-lg">
            <div className="text-xs font-medium text-green-800 mb-1">Effects:</div>
            <div className="text-xs text-green-700">
              {item.effects.health && (
                <div>💚 Health: +{item.effects.health === 'full' ? '100' : item.effects.health}</div>
              )}
              {item.effects.growth && (
                <div>📈 Growth: +{item.effects.growth}</div>
              )}
            </div>
          </div>
        )}
        
        {/* Cooldown info */}
        {item.cooldown && (
          <div className="mb-4 text-xs text-gray-500 text-center">
            Cooldown: {item.cooldown / (60 * 60 * 1000)} hours
          </div>
        )}
        
        {/* Price and purchase button */}
        <div className="text-center">
          <div className={`text-lg font-bold mb-3 ${isAffordable ? 'text-yellow-600' : 'text-red-500'}`}>
            🪙 {item.price}
          </div>
          
          <button
            onClick={() => handlePurchase(item)}
            disabled={!canBuy || !isAffordable}
            className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
              canBuy && isAffordable
                ? 'bg-green-500 hover:bg-green-600 text-white hover:transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {!isAffordable 
              ? 'Not enough coins'
              : !canBuy 
                ? purchaseCheck.reason
                : item.type === 'decoration' && plantState.decorations.some(d => d.id === item.id)
                  ? 'Already owned'
                  : 'Purchase'
            }
          </button>
        </div>
      </div>
    )
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case SHOP_CATEGORIES.CARE: return '💧'
      case SHOP_CATEGORIES.DECORATIONS: return '🎨'
      case SHOP_CATEGORIES.SPECIAL: return '✨'
      default: return '🛍️'
    }
  }

  const getCategoryName = (category) => {
    switch (category) {
      case SHOP_CATEGORIES.CARE: return 'Plant Care'
      case SHOP_CATEGORIES.DECORATIONS: return 'Decorations'
      case SHOP_CATEGORIES.SPECIAL: return 'Special Items'
      default: return 'Shop'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        🛍️ Plant Shop
        <span className="ml-auto text-lg text-yellow-600 font-bold">
          🪙 {userCoins.toLocaleString()}
        </span>
      </h3>

      {/* Purchase message */}
      {purchaseMessage && (
        <div className={`mb-4 p-3 rounded-lg border ${
          messageType === 'success' 
            ? 'bg-green-100 border-green-300 text-green-800' 
            : 'bg-red-100 border-red-300 text-red-800'
        }`}>
          <div className="flex items-center">
            <span className="text-lg mr-2">
              {messageType === 'success' ? '✅' : '❌'}
            </span>
            {purchaseMessage}
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        {Object.values(SHOP_CATEGORIES).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="mr-2">{getCategoryIcon(category)}</span>
            {getCategoryName(category)}
          </button>
        ))}
      </div>

      {/* Category description */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          {selectedCategory === SHOP_CATEGORIES.CARE && 
            "Keep your plant healthy and growing with water, fertilizer, and other care items."}
          {selectedCategory === SHOP_CATEGORIES.DECORATIONS && 
            "Personalize your plant with beautiful decorations and accessories!"}
          {selectedCategory === SHOP_CATEGORIES.SPECIAL && 
            "Powerful items with special effects and longer cooldowns."}
        </p>
      </div>

      {/* Shop items grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getShopItemsByCategory(selectedCategory).map(renderShopItem)}
      </div>

      {/* Empty state */}
      {getShopItemsByCategory(selectedCategory).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">🛍️</div>
          <p>No items available in this category yet.</p>
          <p className="text-sm">Check back later for new items!</p>
        </div>
      )}
    </div>
  )
}

export default PlantShop