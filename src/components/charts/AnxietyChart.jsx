import { generatePath, getAnxietyScoreColor, getChartConfig } from '../../utils/chartUtils'

const AnxietyChart = ({ chartData }) => {
  const { 
    chartHeight, 
    chartPadding, 
    chartWidth, 
    dataHeight, 
    dataWidth, 
    scoreRange 
  } = getChartConfig(chartData)

  const linePath = generatePath(chartData, chartPadding, dataWidth, dataHeight, scoreRange)

  if (chartData.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
        <p className="text-gray-500">No anxiety score data available</p>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Anxiety Score Progress</h3>
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 overflow-x-auto">
        <svg 
          width={chartWidth} 
          height={chartHeight}
          className="min-w-full"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="80" height="25" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 25" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect 
            x={chartPadding.left} 
            y={chartPadding.top} 
            width={dataWidth} 
            height={dataHeight} 
            fill="url(#grid)"
          />
          
          {/* Y-axis labels for anxiety score (0.0 at top, 1.0 at bottom) */}
          {[0.0, 0.2, 0.4, 0.6, 0.8, 1.0].map((value) => {
            const y = chartPadding.top + (value / 1.0) * dataHeight
            return (
              <g key={value}>
                <line
                  x1={chartPadding.left - 5}
                  y1={y}
                  x2={chartPadding.left}
                  y2={y}
                  stroke="#6b7280"
                  strokeWidth="1"
                />
                <text
                  x={chartPadding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-600"
                >
                  {value.toFixed(1)}
                </text>
              </g>
            )
          })}
          
          {/* Main line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="url(#anxietyGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          
          {/* Gradient definition for anxiety score (green at top, red at bottom) */}
          <defs>
            <linearGradient id="anxietyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Data points */}
          {chartData.map((point, index) => {
            const x = chartPadding.left + (index / Math.max(1, chartData.length - 1)) * dataWidth
            const y = chartPadding.top + (point.anxietyScore / scoreRange) * dataHeight // Flipped Y-axis
            
            const pointColor = getAnxietyScoreColor(point.anxietyScore)
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill={pointColor}
                  stroke="white"
                  strokeWidth="3"
                  className="drop-shadow-lg hover:r-10 transition-all duration-200 cursor-pointer"
                  filter="url(#glow)"
                >
                  <title>{`${point.fullDate}: ${point.anxietyScore.toFixed(3)} anxiety score (${point.mood}) • Avg stress: ${point.avgStress.toFixed(1)}% • ${point.stressCount} assessments`}</title>
                </circle>
                
                {/* Date labels */}
                <text
                  x={x}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  className="text-xs fill-gray-600 font-medium"
                  transform={chartData.length > 8 ? `rotate(-45 ${x} ${chartHeight - 10})` : ''}
                >
                  {point.dateString}
                </text>
              </g>
            )
          })}
        </svg>
        
        {/* Legend for Anxiety Score */}
        <div className="flex flex-wrap justify-center mt-4 gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Low Anxiety (0.5-0.59)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-lime-500"></div>
            <span className="text-gray-600">Mild Anxiety (0.6-0.69)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-600">Moderate Anxiety (0.7-0.79)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-600">Moderate-High Anxiety (0.8-0.89)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">High Anxiety (0.9-1.0)</span>
          </div>
        </div>
        
        {/* Chart info */}
        <div className="text-center mt-4 text-sm text-gray-500">
          Daily anxiety scores (0.5-1.0) • Starts at 0.5 baseline • Higher scores indicate higher anxiety levels
        </div>
      </div>
    </div>
  )
}

export default AnxietyChart