import { TrendingUp, TrendingDown } from 'lucide-react'

export const StatCard = ({ title, value, unit, trend, percentage, chartData }) => {
  const isUp = trend === 'up'

  const renderChart = () => {
    if (!chartData) return null
    return (
      <div className="flex items-end gap-1 h-8">
        {chartData.map((height, i) => (
          <div
            key={i}
            className={`w-2 rounded-full ${isUp ? 'bg-emerald-400' : 'bg-rose-400'}`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-800">{value}</span>
            {unit && <span className="text-sm text-gray-500">{unit}</span>}
          </div>
          <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{percentage}%</span>
          </div>
        </div>
        <div className="ml-4">
          {renderChart()}
        </div>
      </div>
    </div>
  )
}
