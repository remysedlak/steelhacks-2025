import { useState, useEffect } from 'react'

// Import utility functions
import { 
  getFilteredEntries, 
  getMoodStats, 
  getAverages, 
  getStressStats, 
  getMoodTrend,
  getAnxietyChartData 
} from '../utils/dataProcessing'

// Import components
import PageHeader from '../components/ui/PageHeader'
import TimeframeSelector from '../components/ui/TimeframeSelector'
import EmptyState from '../components/ui/EmptyState'
import StatisticsCards from '../components/cards/StatisticsCards'
import MoodDistributionChart from '../components/charts/MoodDistributionChart'
import MoodTrendAnalysis from '../components/analysis/MoodTrendAnalysis'
import StressLevelAnalysis from '../components/analysis/StressLevelAnalysis'
import InsightsCard from '../components/cards/InsightsCard'

const ProgressPage = () => {
  const [entries, setEntries] = useState([])
  const [timeframe, setTimeframe] = useState('week') // week, month, all

  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('mentalHealthEntries')
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  // Process data using utility functions
  const filteredEntries = getFilteredEntries(entries, timeframe)
  const moodStats = getMoodStats(filteredEntries)
  const averages = getAverages(filteredEntries)
  const stressStats = getStressStats(filteredEntries)
  const moodTrend = getMoodTrend(filteredEntries)
  const chartData = getAnxietyChartData(filteredEntries)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader />
      
      <TimeframeSelector timeframe={timeframe} setTimeframe={setTimeframe} />

      {filteredEntries.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <StatisticsCards moodStats={moodStats} averages={averages} />
          
          <MoodDistributionChart moodStats={moodStats} />
          
          <MoodTrendAnalysis moodTrend={moodTrend} />
          
          <StressLevelAnalysis stressStats={stressStats} chartData={chartData} />
          
          <InsightsCard averages={averages} filteredEntries={filteredEntries} />
        </>
      )}
    </div>
  )
}

export default ProgressPage