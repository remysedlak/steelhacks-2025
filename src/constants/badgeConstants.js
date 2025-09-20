// Badge configuration and data for ProfilePage

import { getPlantState } from '../utils/plantSystem'

export const getBadges = (achievements, entries) => {
  const plantState = getPlantState()
  
  return [
    // Exercise Badges
    {
      id: 'exercise-starter',
      name: 'Exercise Starter',
      description: 'Log your first workout',
      icon: '🏃‍♀️',
      condition: achievements.exerciseTotal >= 1,
      earned: achievements.exerciseTotal >= 1,
      color: 'from-green-400 to-green-600'
    },
    {
      id: 'exercise-warrior',
      name: 'Exercise Warrior',
      description: '7-day exercise streak',
      icon: '💪',
      condition: achievements.exerciseStreak >= 7,
      earned: achievements.exerciseStreak >= 7,
      color: 'from-orange-400 to-orange-600'
    },
    {
      id: 'fitness-champion',
      name: 'Fitness Champion',
      description: '30 days of exercise logged',
      icon: '🏆',
      condition: achievements.exerciseTotal >= 30,
      earned: achievements.exerciseTotal >= 30,
      color: 'from-yellow-400 to-yellow-600'
    },
    
    // Sleep Badges
    {
      id: 'sleep-conscious',
      name: 'Sleep Conscious',
      description: 'Track your first good night\'s sleep',
      icon: '😴',
      condition: achievements.goodSleepCount >= 1,
      earned: achievements.goodSleepCount >= 1,
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'sleep-master',
      name: 'Sleep Master',
      description: '7 consecutive nights of healthy sleep',
      icon: '🌙',
      condition: achievements.sleepStreak >= 7,
      earned: achievements.sleepStreak >= 7,
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      id: 'dream-keeper',
      name: 'Dream Keeper',
      description: '30 nights of quality sleep',
      icon: '✨',
      condition: achievements.goodSleepCount >= 30,
      earned: achievements.goodSleepCount >= 30,
      color: 'from-purple-400 to-purple-600'
    },
    
    // Stress & Anxiety Badges
    {
      id: 'stress-aware',
      name: 'Stress Aware',
      description: 'Complete your first AI stress assessment',
      icon: '🧠',
      condition: entries.some(e => e.stressData?.result),
      earned: entries.some(e => e.stressData?.result),
      color: 'from-teal-400 to-teal-600'
    },
    {
      id: 'anxiety-reducer',
      name: 'Anxiety Reducer',
      description: 'Improve stress levels by 10%',
      icon: '🌱',
      condition: achievements.stressImprovement >= 10,
      earned: achievements.stressImprovement >= 10,
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      id: 'zen-master',
      name: 'Zen Master',
      description: 'Achieve 80%+ average wellness score',
      icon: '🧘‍♀️',
      condition: achievements.wellnessScore >= 80,
      earned: achievements.wellnessScore >= 80,
      color: 'from-cyan-400 to-cyan-600'
    },
    
    // Journal & Reflection Badges
    {
      id: 'journal-rookie',
      name: 'Journal Rookie',
      description: 'Write your first journal entry',
      icon: '📝',
      condition: achievements.totalEntries >= 1,
      earned: achievements.totalEntries >= 1,
      color: 'from-pink-400 to-pink-600'
    },
    {
      id: 'reflection-enthusiast',
      name: 'Reflection Enthusiast',
      description: 'Complete 10 reflection sessions',
      icon: '💭',
      condition: achievements.reflectionCount >= 10,
      earned: achievements.reflectionCount >= 10,
      color: 'from-rose-400 to-rose-600'
    },
    {
      id: 'consistent-chronicler',
      name: 'Consistent Chronicler',
      description: '14-day journaling streak',
      icon: '📚',
      condition: achievements.journalStreak >= 14,
      earned: achievements.journalStreak >= 14,
      color: 'from-amber-400 to-amber-600'
    },
    
    // Mood & Positivity Badges
    {
      id: 'positivity-spark',
      name: 'Positivity Spark',
      description: 'Log 3 consecutive positive moods',
      icon: '😊',
      condition: achievements.positivityStreak >= 3,
      earned: achievements.positivityStreak >= 3,
      color: 'from-lime-400 to-lime-600'
    },
    {
      id: 'mood-booster',
      name: 'Mood Booster',
      description: 'Improve mood trend by 1 point',
      icon: '📈',
      condition: achievements.moodImprovement >= 1,
      earned: achievements.moodImprovement >= 1,
      color: 'from-sky-400 to-sky-600'
    },
    {
      id: 'consistency-king',
      name: 'Consistency King',
      description: 'Maintain 80% journal consistency',
      icon: '👑',
      condition: achievements.consistencyScore >= 80,
      earned: achievements.consistencyScore >= 80,
      color: 'from-violet-400 to-violet-600'
    },

    // Plant Companion Badges
    {
      id: 'plant-parent',
      name: 'Plant Parent',
      description: 'Adopt your first plant companion',
      icon: '🪴',
      condition: plantState.size >= 1,
      earned: plantState.size >= 1,
      color: 'from-green-400 to-emerald-600'
    },
    {
      id: 'green-thumb',
      name: 'Green Thumb',
      description: 'Water your plant 10 times',
      icon: '💧',
      condition: plantState.totalWatering >= 10,
      earned: plantState.totalWatering >= 10,
      color: 'from-blue-400 to-cyan-600'
    },
    {
      id: 'dedicated-gardener',
      name: 'Dedicated Gardener',
      description: 'Fertilize your plant 5 times',
      icon: '🌰',
      condition: plantState.totalFertilizer >= 5,
      earned: plantState.totalFertilizer >= 5,
      color: 'from-amber-400 to-yellow-600'
    },
    {
      id: 'decorator',
      name: 'Plant Decorator',
      description: 'Buy 3 decorations for your plant',
      icon: '🎨',
      condition: plantState.decorations.length >= 3,
      earned: plantState.decorations.length >= 3,
      color: 'from-pink-400 to-rose-600'
    },
    {
      id: 'tree-hugger',
      name: 'Tree Hugger',
      description: 'Grow your plant to tree stage',
      icon: '🌳',
      condition: plantState.size >= 26,
      earned: plantState.size >= 26,
      color: 'from-green-500 to-emerald-700'
    },
    {
      id: 'plant-whisperer',
      name: 'Plant Whisperer',
      description: 'Keep your plant healthy for 7 days',
      icon: '🌿',
      condition: plantState.health >= 80 && ((Date.now() - plantState.createdAt) >= (7 * 24 * 60 * 60 * 1000)),
      earned: plantState.health >= 80 && ((Date.now() - plantState.createdAt) >= (7 * 24 * 60 * 60 * 1000)),
      color: 'from-emerald-400 to-green-600'
    },
    {
      id: 'ancient-keeper',
      name: 'Ancient Keeper',
      description: 'Raise your plant to ancient tree status',
      icon: '🎄',
      condition: plantState.size >= 101,
      earned: plantState.size >= 101,
      color: 'from-purple-500 to-indigo-700'
    }
  ]
}