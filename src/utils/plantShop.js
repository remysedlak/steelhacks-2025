// Plant shop system for purchasing care items and decorations

export const SHOP_CATEGORIES = {
  CARE: 'care',
  DECORATIONS: 'decorations',
  SPECIAL: 'special'
}

export const SHOP_ITEMS = {
  // Care Items
  water: {
    id: 'water',
    name: 'Fresh Water',
    description: 'Refreshing water to keep your plant healthy. Restores 15 health and grows the plant.',
    emoji: '💧',
    price: 25,
    category: SHOP_CATEGORIES.CARE,
    type: 'consumable',
    cooldown: 6 * 60 * 60 * 1000, // 6 hours
    effects: { health: 15, growth: '1-3' }
  },
  
  fertilizer: {
    id: 'fertilizer',
    name: 'Plant Fertilizer',
    description: 'Nutrient-rich fertilizer for rapid growth. Restores 30 health and significant growth boost.',
    emoji: '🌰',
    price: 75,
    category: SHOP_CATEGORIES.CARE,
    type: 'consumable',
    cooldown: 24 * 60 * 60 * 1000, // 24 hours
    effects: { health: 30, growth: '3-8' }
  },
  
  // Decoration Items
  rainbow_pot: {
    id: 'rainbow_pot',
    name: 'Rainbow Pot',
    description: 'A beautiful rainbow-colored pot that makes your plant extra cheerful!',
    emoji: '🌈',
    price: 150,
    category: SHOP_CATEGORIES.DECORATIONS,
    type: 'decoration',
    rarity: 'common'
  },
  
  golden_pot: {
    id: 'golden_pot',
    name: 'Golden Pot',
    description: 'An elegant golden pot fit for royalty. Shows off your plant in style.',
    emoji: '✨',
    price: 300,
    category: SHOP_CATEGORIES.DECORATIONS,
    type: 'decoration',
    rarity: 'rare'
  },
  
  flower_crown: {
    id: 'flower_crown',
    name: 'Flower Crown',
    description: 'A delicate crown of flowers to make your plant feel special.',
    emoji: '🌸',
    price: 200,
    category: SHOP_CATEGORIES.DECORATIONS,
    type: 'decoration',
    rarity: 'common'
  },
  
  butterfly_friend: {
    id: 'butterfly_friend',
    name: 'Butterfly Friend',
    description: 'A colorful butterfly companion that loves to visit your plant.',
    emoji: '🦋',
    price: 250,
    category: SHOP_CATEGORIES.DECORATIONS,
    type: 'decoration',
    rarity: 'uncommon'
  },
  
  sun_hat: {
    id: 'sun_hat',
    name: 'Tiny Sun Hat',
    description: 'Protects your plant from harsh sunlight while looking adorable.',
    emoji: '🎩',
    price: 180,
    category: SHOP_CATEGORIES.DECORATIONS,
    type: 'decoration',
    rarity: 'common'
  },
  
  fairy_lights: {
    id: 'fairy_lights',
    name: 'Fairy Lights',
    description: 'Magical twinkling lights that make your plant glow beautifully.',
    emoji: '💫',
    price: 350,
    category: SHOP_CATEGORIES.DECORATIONS,
    type: 'decoration',
    rarity: 'rare'
  },
  
  love_heart: {
    id: 'love_heart',
    name: 'Love Heart',
    description: 'Show your plant some love with this sweet floating heart.',
    emoji: '💕',
    price: 100,
    category: SHOP_CATEGORIES.DECORATIONS,
    type: 'decoration',
    rarity: 'common'
  },
  
  // Special Items
  growth_potion: {
    id: 'growth_potion',
    name: 'Growth Potion',
    description: 'A powerful potion that instantly boosts your plant\'s size significantly!',
    emoji: '🧪',
    price: 500,
    category: SHOP_CATEGORIES.SPECIAL,
    type: 'consumable',
    cooldown: 48 * 60 * 60 * 1000, // 48 hours
    effects: { health: 50, growth: '10-15' },
    rarity: 'legendary'
  },
  
  healing_elixir: {
    id: 'healing_elixir',
    name: 'Healing Elixir',
    description: 'Completely restores your plant\'s health and gives a small growth boost.',
    emoji: '💚',
    price: 200,
    category: SHOP_CATEGORIES.SPECIAL,
    type: 'consumable',
    cooldown: 12 * 60 * 60 * 1000, // 12 hours
    effects: { health: 'full', growth: '2-4' },
    rarity: 'uncommon'
  }
}

export const getShopItemsByCategory = (category) => {
  return Object.values(SHOP_ITEMS).filter(item => item.category === category)
}

export const canPurchaseItem = (item, userCoins, plantState) => {
  // Check if user has enough coins
  if (userCoins < item.price) {
    return { canPurchase: false, reason: 'Not enough RootCoins!' }
  }
  
  // Check cooldowns for consumable items
  if (item.type === 'consumable') {
    const now = Date.now()
    
    if (item.id === 'water') {
      const hoursWithoutWater = (now - plantState.lastWatered) / (1000 * 60 * 60)
      if (hoursWithoutWater < 6) {
        return { canPurchase: false, reason: 'Plant was watered recently!' }
      }
    }
    
    if (item.id === 'fertilizer') {
      if (plantState.lastFertilized && (now - plantState.lastFertilized) < (24 * 60 * 60 * 1000)) {
        return { canPurchase: false, reason: 'Plant was fertilized recently!' }
      }
    }
    
    if (item.id === 'growth_potion') {
      const lastUsed = localStorage.getItem(`lastUsed_${item.id}`)
      if (lastUsed && (now - parseInt(lastUsed)) < item.cooldown) {
        return { canPurchase: false, reason: 'Growth potion used recently!' }
      }
    }
    
    if (item.id === 'healing_elixir') {
      const lastUsed = localStorage.getItem(`lastUsed_${item.id}`)
      if (lastUsed && (now - parseInt(lastUsed)) < item.cooldown) {
        return { canPurchase: false, reason: 'Healing elixir used recently!' }
      }
    }
  }
  
  // Check if decoration is already owned
  if (item.type === 'decoration') {
    const alreadyOwned = plantState.decorations.some(d => d.id === item.id)
    if (alreadyOwned) {
      return { canPurchase: false, reason: 'Already owned!' }
    }
  }
  
  return { canPurchase: true }
}

export const purchaseShopItem = (item, userCoins, plantState) => {
  const purchaseCheck = canPurchaseItem(item, userCoins, plantState)
  if (!purchaseCheck.canPurchase) {
    throw new Error(purchaseCheck.reason)
  }
  
  let updatedPlantState = { ...plantState }
  
  // Apply item effects
  if (item.type === 'consumable') {
    if (item.id === 'water') {
      updatedPlantState = {
        ...updatedPlantState,
        health: Math.min(100, updatedPlantState.health + 15),
        size: updatedPlantState.size + (Math.random() * 2 + 1),
        lastWatered: Date.now(),
        totalWatering: updatedPlantState.totalWatering + 1
      }
    } else if (item.id === 'fertilizer') {
      updatedPlantState = {
        ...updatedPlantState,
        health: Math.min(100, updatedPlantState.health + 30),
        size: updatedPlantState.size + (Math.random() * 5 + 3),
        lastFertilized: Date.now(),
        totalFertilizer: updatedPlantState.totalFertilizer + 1
      }
    } else if (item.id === 'growth_potion') {
      updatedPlantState = {
        ...updatedPlantState,
        health: Math.min(100, updatedPlantState.health + 50),
        size: updatedPlantState.size + (Math.random() * 5 + 10)
      }
      localStorage.setItem(`lastUsed_${item.id}`, Date.now().toString())
    } else if (item.id === 'healing_elixir') {
      updatedPlantState = {
        ...updatedPlantState,
        health: 100,
        size: updatedPlantState.size + (Math.random() * 2 + 2)
      }
      localStorage.setItem(`lastUsed_${item.id}`, Date.now().toString())
    }
  } else if (item.type === 'decoration') {
    updatedPlantState = {
      ...updatedPlantState,
      decorations: [...updatedPlantState.decorations, {
        id: item.id,
        name: item.name,
        emoji: item.emoji,
        purchasedAt: Date.now()
      }]
    }
  }
  
  return {
    newPlantState: updatedPlantState,
    remainingCoins: userCoins - item.price,
    purchasedItem: item
  }
}

export const getRarityColor = (rarity) => {
  switch (rarity) {
    case 'common': return 'from-gray-400 to-gray-600'
    case 'uncommon': return 'from-green-400 to-green-600'
    case 'rare': return 'from-blue-400 to-blue-600'
    case 'legendary': return 'from-purple-400 to-purple-600'
    default: return 'from-gray-400 to-gray-600'
  }
}

export const getRarityTextColor = (rarity) => {
  switch (rarity) {
    case 'common': return 'text-gray-600'
    case 'uncommon': return 'text-green-600'
    case 'rare': return 'text-blue-600'
    case 'legendary': return 'text-purple-600'
    default: return 'text-gray-600'
  }
}