// Mood configuration and constants

export const moodInfo = {
  great: { 
    emoji: '😊', 
    label: 'Great', 
    color: 'bg-green-50 border-green-200 text-green-800', 
    barColor: 'bg-green-500' 
  },
  good: { 
    emoji: '🙂', 
    label: 'Good', 
    color: 'bg-lime-50 border-lime-200 text-lime-800', 
    barColor: 'bg-lime-500' 
  },
  okay: { 
    emoji: '😐', 
    label: 'Okay', 
    color: 'bg-yellow-50 border-yellow-200 text-yellow-800', 
    barColor: 'bg-yellow-500' 
  },
  low: { 
    emoji: '😔', 
    label: 'Low', 
    color: 'bg-orange-50 border-orange-200 text-orange-800', 
    barColor: 'bg-orange-500' 
  },
  struggling: { 
    emoji: '😞', 
    label: 'Struggling', 
    color: 'bg-red-50 border-red-200 text-red-800', 
    barColor: 'bg-red-500' 
  }
}

export const timeframeOptions = [
  { value: 'week', label: 'Last 7 days' },
  { value: 'month', label: 'Last 30 days' },
  { value: 'all', label: 'All time' }
]