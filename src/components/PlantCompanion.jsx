import React, { useState, useEffect } from 'react'
import { getPlantState, getPlantStats, savePlantState } from '../utils/plantSystem'

const PlantCompanion = ({ onPlantUpdate }) => {
  const [plantState, setPlantState] = useState(null)
  const [plantStats, setPlantStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPlantData()
    
    // Listen for plant updates from other components
    const handlePlantUpdate = (event) => {
      const newPlantState = event.detail
      setPlantState(newPlantState)
      setPlantStats(getPlantStats(newPlantState))
      if (onPlantUpdate) {
        onPlantUpdate(newPlantState)
      }
    }
    
    window.addEventListener('plantUpdated', handlePlantUpdate)
    return () => window.removeEventListener('plantUpdated', handlePlantUpdate)
  }, [onPlantUpdate])

  const loadPlantData = () => {
    const plant = getPlantState()
    const stats = getPlantStats(plant)
    setPlantState(plant)
    setPlantStats(stats)
    setIsLoading(false)
  }

  const getTimeSinceWatered = () => {
    if (!plantState) return ''
    const hours = Math.floor((Date.now() - plantState.lastWatered) / (1000 * 60 * 60))
    if (hours < 1) return 'Just watered'
    if (hours === 1) return '1 hour ago'
    if (hours < 24) return `${hours} hours ago`
    const days = Math.floor(hours / 24)
    return days === 1 ? '1 day ago' : `${days} days ago`
  }

  const getHealthColor = (health) => {
    if (health >= 80) return 'text-green-600'
    if (health >= 60) return 'text-yellow-600'
    if (health >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getHealthBarColor = (health) => {
    if (health >= 80) return 'from-green-400 to-green-600'
    if (health >= 60) return 'from-yellow-400 to-yellow-600'
    if (health >= 40) return 'from-orange-400 to-orange-600'
    return 'from-red-400 to-red-600'
  }

  if (isLoading || !plantState || !plantStats) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <div className="animate-pulse">
          <div className="h-4 bg-green-200 rounded mb-4"></div>
          <div className="h-20 bg-green-200 rounded mb-4"></div>
          <div className="h-4 bg-green-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-2 right-2 text-2xl opacity-20">🌿</div>
      <div className="absolute bottom-2 left-2 text-lg opacity-15">🌱</div>
      
      <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center">
        🪴 Your Plant Companion
      </h3>

      {/* Plant Display Area */}
      <div className="bg-white rounded-lg p-6 mb-6 text-center relative">
        {/* Plant with decorations */}
        <div className="relative inline-block">
          {/* Main plant */}
          <div className="text-8xl mb-2">
            {plantStats.stage.emoji}
          </div>
          
          {/* Decorations around the plant */}
          <div className="absolute inset-0 flex items-center justify-center">
            {plantState.decorations.map((decoration, index) => (
              <div 
                key={decoration.id}
                className={`absolute text-2xl animate-pulse`}
                style={{
                  transform: `rotate(${index * 60}deg) translateY(-60px) rotate(-${index * 60}deg)`,
                  animationDelay: `${index * 0.5}s`
                }}
              >
                {decoration.emoji}
              </div>
            ))}
          </div>
          
          {/* Mood indicator */}
          <div className="absolute -top-2 -right-2 text-2xl">
            {plantStats.mood.emoji}
          </div>
        </div>

        {/* Plant name and stage */}
        <h4 className="text-lg font-bold text-gray-800 mb-1">
          {plantStats.stage.name}
        </h4>
        <p className="text-sm text-gray-600 mb-2">
          Feeling {plantStats.mood.name}
        </p>
        
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700">Age</div>
            <div className="text-green-600">{plantStats.age} days</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Size</div>
            <div className="text-blue-600">{Math.round(plantState.size)}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Decorations</div>
            <div className="text-purple-600">{plantState.decorations.length}</div>
          </div>
        </div>
      </div>

      {/* Health Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Health</span>
          <span className={`text-sm font-bold ${getHealthColor(plantState.health)}`}>
            {Math.round(plantState.health)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`bg-gradient-to-r ${getHealthBarColor(plantState.health)} h-full transition-all duration-1000 ease-out rounded-full`}
            style={{ width: `${plantState.health}%` }}
          />
        </div>
      </div>

      {/* Growth Progress */}
      {plantStats.nextStageSize !== 'Max' && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Growth Progress</span>
            <span className="text-sm text-gray-600">
              {Math.round(plantState.size)}/{plantStats.nextStageSize}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all duration-1000 ease-out rounded-full"
              style={{ width: `${plantStats.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Care Information */}
      <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
        <div>
          <span className="font-medium">Last watered:</span>
          <br />
          {getTimeSinceWatered()}
        </div>
        <div>
          <span className="font-medium">Total care:</span>
          <br />
          💧 {plantState.totalWatering} | 🌰 {plantState.totalFertilizer}
        </div>
      </div>

      {/* Care reminders */}
      {plantState.health < 50 && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
          <div className="flex items-center text-yellow-800 text-sm">
            <span className="text-lg mr-2">⚠️</span>
            Your plant needs attention! Consider watering or fertilizing.
          </div>
        </div>
      )}

      {(Date.now() - plantState.lastWatered) > (24 * 60 * 60 * 1000) && (
        <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
          <div className="flex items-center text-blue-800 text-sm">
            <span className="text-lg mr-2">💧</span>
            Your plant is thirsty! It's been over 24 hours since last watering.
          </div>
        </div>
      )}
    </div>
  )
}

export default PlantCompanion