import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Calendar, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import useUserCountGraph from './useUserCountGraph';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
const UserCountGraph = () => {
  const { periods, CHART_COLORS, period, chartData, loading, error, setPeriod } = useUserCountGraph();
  // Fetch user count data
  return (
    <div className="w-full h-full">
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            User Growth Analytics
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Monthly user registration trends
          </p>
        </div>

        <div className="flex items-center gap-4 mt-3 sm:mt-0">
          {/* Growth indicator */}
          {/* {chartData?.metadata && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${chartData.metadata.growthPercentage >= 0
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}>
              <TrendingUp className={`w-4 h-4 ${chartData.metadata.growthPercentage >= 0 ? '' : 'rotate-180'
                }`} />
              <span>{Math.abs(chartData.metadata.growthPercentage)}% growth</span>
            </div>
          )} */}

          {/* Period selector */}
          <div className="relative">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm cursor-pointer"
            >
              {periods.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </div>

      {/* Chart container */}
      <div className="relative h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="relative mb-4">
              <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
              <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading user data...
            </p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Failed to Load Data
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              Try Again
            </button>
          </div>
        ) : !chartData ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Data Available
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
              User data for the selected period will appear here
            </p>
          </div>
        ) : (
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  titleColor: '#f3f4f6',
                  bodyColor: '#f3f4f6',
                  borderColor: 'rgba(75, 85, 99, 0.5)',
                  borderWidth: 1,
                  padding: 12,
                  cornerRadius: 8,
                  displayColors: false,
                  callbacks: {
                    label: (context) => {
                      return `Users: ${context.parsed.y}`;
                    },
                    title: (context) => {
                      return context[0].label;
                    }
                  }
                }
              },
              scales: {
                x: {
                  grid: {
                    display: true,
                    color: 'rgba(75, 85, 99, 0.1)',
                    drawBorder: false
                  },
                  ticks: {
                    color: 'rgb(107, 114, 128)',
                    font: {
                      size: 11
                    },
                    maxRotation: 45
                  },
                  border: {
                    display: false
                  }
                },
                y: {
                  beginAtZero: true,
                  grid: {
                    display: true,
                    color: 'rgba(75, 85, 99, 0.1)',
                    drawBorder: false
                  },
                  ticks: {
                    color: 'rgb(107, 114, 128)',
                    font: {
                      size: 11
                    },
                    callback: function (value) {
                      if (value >= 1000) {
                        return (value / 1000).toFixed(1) + 'k';
                      }
                      return value;
                    }
                  },
                  border: {
                    display: false
                  },
                  grace: '5%'
                }
              },
              interaction: {
                intersect: false,
                mode: 'index'
              },
              elements: {
                point: {
                  hoverRadius: 8,
                  hoverBorderWidth: 3
                }
              }
            }}
          />
        )}
      </div>

      {/* Stats footer */}
      {chartData?.metadata && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Users in Selected Period
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {chartData.metadata.totalUsers.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                User Count
              </span>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              Period: {chartData.metadata.periodLabel}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCountGraph;