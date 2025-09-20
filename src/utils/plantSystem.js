// Plant companion system for RootCoins spending and engagement

export const PLANT_STAGES = {
  SEED: { id: 'seed', name: 'Seed', emoji: '🌱', minSize: 0, maxSize: 10 },
  SPROUT: { id: 'sprout', name: 'Sprout', emoji: '🌿', minSize: 11, maxSize: 25 },
  SAPLING: { id: 'sapling', name: 'Sapling', emoji: '🌳', minSize: 26, maxSize: 50 },
  YOUNG_TREE: { id: 'young', name: 'Young Tree', emoji: '🌲', minSize: 51, maxSize: 75 },
  MATURE_TREE: { id: 'mature', name: 'Mature Tree', emoji: '🌴', minSize: 76, maxSize: 100 },
  ANCIENT_TREE: { id: 'ancient', name: 'Ancient Tree', emoji: '🎄', minSize: 101, maxSize: 150 }
}

export const PLANT_MOODS = {
  THRIVING: { id: 'thriving', name: 'Thriving', emoji: '✨', healthMin: 80 },
  HAPPY: { id: 'happy', name: 'Happy', emoji: '😊', healthMin: 60 },
  CONTENT: { id: 'content', name: 'Content', emoji: '🙂', healthMin: 40 },
  STRUGGLING: { id: 'struggling', name: 'Struggling', emoji: '😔', healthMin: 20 },
  WILTING: { id: 'wilting', name: 'Wilting', emoji: '🥀', healthMin: 0 }
}

export const getDefaultPlantState = () => ({
  size: 5,
  health: 100,
  lastWatered: Date.now(),
  lastFertilized: null,
  decorations: [],
  totalWatering: 0,
  totalFertilizer: 0,
  plantType: 'default',
  createdAt: Date.now()
})

export const getPlantStage = (size) => {
  for (const stage of Object.values(PLANT_STAGES)) {
    if (size >= stage.minSize && size <= stage.maxSize) {
      return stage
    }
  }
  return PLANT_STAGES.ANCIENT_TREE // Max stage
}

export const getPlantMood = (health) => {
  for (const mood of Object.values(PLANT_MOODS)) {
    if (health >= mood.healthMin) {
      return mood
    }
  }
  return PLANT_MOODS.WILTING
}

export const calculatePlantHealth = (plantState) => {
  const now = Date.now()
  const hoursWithoutWater = (now - plantState.lastWatered) / (1000 * 60 * 60)
  
  // Plant loses health over time without water
  let healthDecay = 0
  if (hoursWithoutWater > 24) {
    healthDecay = Math.min(50, (hoursWithoutWater - 24) * 2) // Loses 2 health per hour after 24 hours
  }
  
  // Fertilizer bonus (if used within last 48 hours)
  let fertilizerBonus = 0
  if (plantState.lastFertilized && (now - plantState.lastFertilized) < (48 * 60 * 60 * 1000)) {
    fertilizerBonus = 20
  }
  
  const newHealth = Math.min(100, Math.max(0, plantState.health - healthDecay + fertilizerBonus))
  return newHealth
}

export const waterPlant = (plantState) => {
  const now = Date.now()
  const hoursWithoutWater = (now - plantState.lastWatered) / (1000 * 60 * 60)
  
  // Can only water every 6 hours to prevent spam
  if (hoursWithoutWater < 6) {
    throw new Error('Plant was watered recently. Wait a bit before watering again!')
  }
  
  const newHealth = Math.min(100, plantState.health + 15)
  const newSize = plantState.size + (Math.random() * 2 + 1) // Grows 1-3 points
  
  return {
    ...plantState,
    size: newSize,
    health: newHealth,
    lastWatered: now,
    totalWatering: plantState.totalWatering + 1
  }
}

export const fertilizePlant = (plantState) => {
  const now = Date.now()
  
  // Can only fertilize every 24 hours
  if (plantState.lastFertilized && (now - plantState.lastFertilized) < (24 * 60 * 60 * 1000)) {
    throw new Error('Plant was fertilized recently. Wait 24 hours before fertilizing again!')
  }
  
  const newHealth = Math.min(100, plantState.health + 30)
  const newSize = plantState.size + (Math.random() * 5 + 3) // Grows 3-8 points (more than water)
  
  return {
    ...plantState,
    size: newSize,
    health: newHealth,
    lastFertilized: now,
    totalFertilizer: plantState.totalFertilizer + 1
  }
}

export const addDecoration = (plantState, decoration) => {
  // Check if decoration is already owned
  const alreadyOwned = plantState.decorations.some(d => d.id === decoration.id)
  if (alreadyOwned) {
    throw new Error('You already own this decoration!')
  }
  
  return {
    ...plantState,
    decorations: [...plantState.decorations, {
      id: decoration.id,
      name: decoration.name,
      emoji: decoration.emoji,
      purchasedAt: Date.now()
    }]
  }
}

export const getPlantState = () => {
  const stored = localStorage.getItem('plantCompanion')
  if (!stored) {
    const defaultState = getDefaultPlantState()
    savePlantState(defaultState)
    return defaultState
  }
  
  const plantState = JSON.parse(stored)
  // Update health based on time passed
  const updatedHealth = calculatePlantHealth(plantState)
  const updatedState = { ...plantState, health: updatedHealth }
  
  if (updatedHealth !== plantState.health) {
    savePlantState(updatedState)
  }
  
  return updatedState
}

export const savePlantState = (plantState) => {
  localStorage.setItem('plantCompanion', JSON.stringify(plantState))
  // Dispatch event for UI updates
  window.dispatchEvent(new CustomEvent('plantUpdated', { detail: plantState }))
}

export const getPlantStats = (plantState) => {
  const stage = getPlantStage(plantState.size)
  const mood = getPlantMood(plantState.health)
  const age = Math.floor((Date.now() - plantState.createdAt) / (1000 * 60 * 60 * 24))
  const nextStageSize = Object.values(PLANT_STAGES).find(s => s.minSize > plantState.size)?.minSize || 'Max'
  
  return {
    stage,
    mood,
    age,
    nextStageSize,
    progress: nextStageSize === 'Max' ? 100 : Math.round((plantState.size / nextStageSize) * 100)
  }
}