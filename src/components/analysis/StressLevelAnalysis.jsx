import AnxietyChart from '../charts/AnxietyChart'
import { getStressCategoryColor } from '../../utils/chartUtils'

const StressLevelAnalysis = ({ stressStats, chartData }) => {
  if (!stressStats) return null

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
        <span className="text-3xl mr-3">🧠</span>
        AI Stress Assessment
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <h3 className="font-semibold text-purple-800 mb-2">Average Anxiety Score</h3>
          <div className="text-3xl font-bold text-purple-600">{stressStats.avgScore}%</div>
          <p className="text-sm text-purple-600 mt-1">
            {stressStats.totalAssessments} assessments
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Trend</h3>
          <div className="flex items-center">
            {stressStats.trend === 'improving' && (
              <>
                <span className="text-green-500 text-2xl mr-2">↗</span>
                <span className="text-green-600 font-semibold">Improving</span>
              </>
            )}
            {stressStats.trend === 'declining' && (
              <>
                <span className="text-red-500 text-2xl mr-2">↘</span>
                <span className="text-red-600 font-semibold">Needs Attention</span>
              </>
            )}
            {stressStats.trend === 'stable' && (
              <>
                <span className="text-blue-500 text-2xl mr-2">→</span>
                <span className="text-blue-600 font-semibold">Stable</span>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">Most Common State</h3>
          {Object.keys(stressStats.categories).length > 0 && (
            <div>
              <div className="text-lg font-bold text-green-600">
                {Object.entries(stressStats.categories).reduce((a, b) => a[1] > b[1] ? a : b)[0]}
              </div>
              <p className="text-sm text-green-600 mt-1">
                {Object.entries(stressStats.categories).reduce((a, b) => a[1] > b[1] ? a : b)[1]} times
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Daily Anxiety Score Time Series Chart */}
      <AnxietyChart chartData={chartData} />

      {/* Category Breakdown */}
      {Object.keys(stressStats.categories).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Wellness Distribution</h3>
          <div className="space-y-4">
            {Object.entries(stressStats.categories).map(([category, count]) => {
              const percentage = ((count / stressStats.totalAssessments) * 100).toFixed(0)
              const colorClass = getStressCategoryColor(category)
              
              return (
                <div key={category} className="flex items-center">
                  <div className="w-28 text-sm font-medium text-gray-700">{category}</div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`bg-gradient-to-r ${colorClass} h-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-sm text-gray-600">{count} ({percentage}%)</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default StressLevelAnalysis