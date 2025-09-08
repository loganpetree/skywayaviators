"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { TrendingUp } from "lucide-react"
import { collection, getDocs, query, orderBy, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { PageView } from "@/types/analytics"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Helper function to format time in Central Time Zone
const formatCentralTime = (date: Date, format: 'hour' | 'full' = 'hour'): string => {
  // Create a date formatter for Central Time Zone
  const centralTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    hour: 'numeric',
    hour12: true,
    ...(format === 'full' && {
      month: 'short',
      day: 'numeric',
    })
  })

  const formatted = centralTime.format(date)
  console.log('⏱️ [TrafficChart] Formatting time:', {
    input: date.toString(),
    inputISO: date.toISOString(),
    timezone: 'America/Chicago',
    format: format,
    formatted: formatted
  })

  return formatted
}

// LiveIndicator component
const LiveIndicator = React.memo(({ size = "sm" }: { size?: "sm" | "md" }) => {
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium ${
      size === "sm" ? "px-2 py-0.5 text-xs" : "px-2 py-1 text-sm"
    }`}>
      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
      <span>Live</span>
    </div>
  )
})

LiveIndicator.displayName = "LiveIndicator"

interface ChartData {
  date: string;
  views: number;
  requests: number;
}

// Function to fetch page view data from Firebase
const fetchPageViewData = async (): Promise<{ chartData: ChartData[], pageViews: PageView[] }> => {
  try {
    // Get all page views from the last 90 days
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    console.log('🔍 [TrafficChart] Fetching page views...')
    console.log('📅 [TrafficChart] Current time:', new Date().toString())
    console.log('🌍 [TrafficChart] Browser local time:', new Date().toLocaleString())
    console.log('⏰ [TrafficChart] UTC timestamp:', Date.now())
    console.log('📆 [TrafficChart] Ninety days ago cutoff:', ninetyDaysAgo.toISOString())

    const pageViewsQuery = query(
      collection(db, 'pageViews'),
      where('timestamp', '>=', ninetyDaysAgo),
      orderBy('timestamp', 'asc')
    )

    const querySnapshot = await getDocs(pageViewsQuery)
    const pageViews: PageView[] = []

    console.log('📊 [TrafficChart] Found', querySnapshot.size, 'page view documents')

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      const pageView = {
        pagePath: data.pagePath,
        timestamp: data.timestamp instanceof Date ? data.timestamp : new Date(data.timestamp),
        date: data.date,
        viewerType: data.viewerType,
        userAgent: data.userAgent,
        referrer: data.referrer,
        ip: data.ip,
        ...data
      }
      pageViews.push(pageView)

      console.log('📄 [TrafficChart] Page view:', {
        id: doc.id,
        pagePath: pageView.pagePath,
        timestamp: pageView.timestamp.toString(),
        date: pageView.date,
        viewerType: pageView.viewerType
      })
    })

    // Group by date for daily views (for non-1d ranges)
    const dateMap = new Map<string, number>()

    pageViews.forEach((view) => {
      const date = view.date
      dateMap.set(date, (dateMap.get(date) || 0) + 1)
    })

    // Convert to chart data format
    const chartData: ChartData[] = []
    const sortedDates = Array.from(dateMap.keys()).sort()

    sortedDates.forEach((date) => {
      const views = dateMap.get(date) || 0
      chartData.push({
        date,
        views,
        requests: 0 // For now, we'll set requests to 0 since we don't have request data
      })
    })

    const result = chartData.length > 0 ? chartData : [
      { date: "2024-01-01", views: 0, requests: 0 }
    ]

    return { chartData: result, pageViews }
  } catch (error) {
    console.error('Error fetching page view data:', error)
    return {
      chartData: [{ date: "2024-01-01", views: 0, requests: 0 }],
      pageViews: []
    }
  }
}

// Function to get hourly data for 1d view with realistic traffic patterns
const getHourlyData = (allPageViews: PageView[]): ChartData[] => {
  const today = new Date()
  const todayString = today.toISOString().split('T')[0]

  console.log('📊 [TrafficChart] Generating hourly data for 1d view')
  console.log('📅 [TrafficChart] Today date:', today.toString())
  console.log('📅 [TrafficChart] Today ISO string:', today.toISOString())
  console.log('📅 [TrafficChart] Today date string (YYYY-MM-DD):', todayString)
  console.log('📊 [TrafficChart] All page views for processing:', allPageViews.length, 'records')

  // Filter page views for today only
  const todayPageViews = allPageViews.filter(view => {
    try {
      // Handle timestamp - should be Date object according to PageView interface
      let timestamp: Date
      if (view.timestamp instanceof Date) {
        timestamp = view.timestamp
      } else {
        // Fallback for other timestamp formats
        timestamp = new Date(view.timestamp)
      }

      const viewDate = timestamp.toISOString().split('T')[0]
      return viewDate === todayString
    } catch (error) {
      console.warn('⚠️ [TrafficChart] Invalid timestamp for view:', view, error)
      return false
    }
  })

  console.log('🎯 [TrafficChart] Today page views found:', todayPageViews.length)

  // Group views by hour
  const hourlyViews = new Map<number, number>()

  // Initialize all hours to 0
  for (let hour = 0; hour < 24; hour++) {
    hourlyViews.set(hour, 0)
  }

  // Count actual views per hour
  todayPageViews.forEach(view => {
    try {
      // Handle timestamp - should be Date object according to PageView interface
      let timestamp: Date
      if (view.timestamp instanceof Date) {
        timestamp = view.timestamp
      } else {
        // Fallback for other timestamp formats
        timestamp = new Date(view.timestamp)
      }

      const hour = timestamp.getHours()
      const currentCount = hourlyViews.get(hour) || 0
      hourlyViews.set(hour, currentCount + 1)

      console.log(`📄 [TrafficChart] View at ${timestamp.toLocaleString()} -> Hour ${hour}`)
    } catch (error) {
      console.warn('⚠️ [TrafficChart] Error processing view timestamp:', view, error)
    }
  })

  // Create hourly data array
  const hourlyData: ChartData[] = []

  for (let hour = 0; hour < 24; hour++) {
    const hourDate = new Date(today)
    hourDate.setHours(hour, 0, 0, 0)

    const hourViews = hourlyViews.get(hour) || 0

    hourlyData.push({
      date: hourDate.toISOString(),
      views: hourViews,
      requests: 0
    })

    console.log(`🕐 [TrafficChart] Hour ${hour} (${hourDate.toLocaleString()}): ${hourViews} views`)
  }

  console.log('✅ [TrafficChart] Final hourly data:', hourlyData)
  return hourlyData
}

// Mock data function for fallback
const getMockData = (): ChartData[] => {
  return [
    { date: "2024-01-01", views: 100, requests: 10 },
    { date: "2024-01-02", views: 120, requests: 15 },
    { date: "2024-01-03", views: 90, requests: 8 },
  ]
}

const chartConfig = {
  views: {
    label: "Site Views",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function TrafficChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("views")
  const [selectedDateRange, setSelectedDateRange] = React.useState("30d")
  const [chartData, setChartData] = React.useState<ChartData[]>([])
  const [allPageViews, setAllPageViews] = React.useState<PageView[]>([])

  React.useEffect(() => {
    const loadData = async () => {
      console.log('🚀 [TrafficChart] Component mounted, loading data...')
      try {
        const { chartData: data, pageViews } = await fetchPageViewData()
        console.log('✅ [TrafficChart] Data loaded successfully:', data.length, 'data points')
        console.log('✅ [TrafficChart] Page views loaded:', pageViews.length, 'records')
        setChartData(data)
        setAllPageViews(pageViews)
      } catch (error) {
        console.error('❌ [TrafficChart] Error loading chart data:', error)
        // Fallback to mock data if Firebase fails
        const mockData = getMockData()
        console.log('🔄 [TrafficChart] Using fallback mock data:', mockData)
        setChartData(mockData)
        setAllPageViews([])
      }
    }

    loadData()
  }, [])

  // Track date range changes
  React.useEffect(() => {
    console.log('🔄 [TrafficChart] Date range changed to:', selectedDateRange)
  }, [selectedDateRange])

  // Filter data based on selected date range with granular data points
  const getFilteredData = () => {
    const now = new Date()
    const ranges = {
      '1d': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '6m': 180,
      '1y': 365
    }

    console.log('🔄 [TrafficChart] Filtering data for range:', selectedDateRange)
    console.log('📅 [TrafficChart] Current time (now):', now.toString())
    console.log('📊 [TrafficChart] Chart data available:', chartData.length, 'items')
    console.log('📊 [TrafficChart] All page views available:', allPageViews.length, 'records')

    if (selectedDateRange === '1d') {
      console.log('📊 [TrafficChart] Using 1d view - calling getHourlyData with page views')
      // For 1d, show hourly breakdown of today's data using actual page view timestamps
      const hourlyData = getHourlyData(allPageViews)
      console.log('📊 [TrafficChart] 1d view result:', hourlyData.length, 'hours of data')
      return hourlyData
    }

    if (selectedDateRange === '7d') {
      // Generate all 7 days for the past week
      const weekData: ChartData[] = []

      for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
        const dayDate = new Date(now)
        dayDate.setDate(now.getDate() - dayOffset)
        dayDate.setHours(0, 0, 0, 0)

        // Use YYYY-MM-DD format to match processed data
        const dayKey = dayDate.toISOString().split('T')[0]

        // Find existing data for this day - direct string match
        const existingData = chartData.find(item => item.date === dayKey)

        weekData.push({
          date: dayDate.toISOString(), // Keep full ISO for chart display
          views: existingData?.views || 0,
          requests: existingData?.requests || 0
        })
      }

      return weekData
    }

    if (selectedDateRange === '30d') {
      // Generate all 30 days for the past month
      const monthData: ChartData[] = []

      for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
        const dayDate = new Date(now)
        dayDate.setDate(now.getDate() - dayOffset)
        dayDate.setHours(0, 0, 0, 0)

        // Use YYYY-MM-DD format to match processed data
        const dayKey = dayDate.toISOString().split('T')[0]

        // Find existing data for this day - direct string match
        const existingData = chartData.find(item => item.date === dayKey)

        monthData.push({
          date: dayDate.toISOString(), // Keep full ISO for chart display
          views: existingData?.views || 0,
          requests: existingData?.requests || 0
        })
      }

      return monthData
    }

    if (selectedDateRange === '90d') {
      // Generate all 90 days for the past 3 months
      const quarterData: ChartData[] = []

      for (let dayOffset = 89; dayOffset >= 0; dayOffset--) {
        const dayDate = new Date(now)
        dayDate.setDate(now.getDate() - dayOffset)
        dayDate.setHours(0, 0, 0, 0)

        // Use YYYY-MM-DD format to match processed data
        const dayKey = dayDate.toISOString().split('T')[0]

        // Find existing data for this day - direct string match
        const existingData = chartData.find(item => item.date === dayKey)

        quarterData.push({
          date: dayDate.toISOString(), // Keep full ISO for chart display
          views: existingData?.views || 0,
          requests: existingData?.requests || 0
        })
      }

      return quarterData
    }

    if (selectedDateRange === '6m') {
      // Generate all 6 months for the past 6 months
      const sixMonthData: ChartData[] = []

      for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
        const monthDate = new Date(now)
        monthDate.setMonth(now.getMonth() - monthOffset)
        monthDate.setDate(1) // First day of the month
        monthDate.setHours(0, 0, 0, 0)

        // Aggregate existing data for this month
        const monthlyViews = chartData.filter(item => {
          const itemDate = new Date(item.date)
          return itemDate.getMonth() === monthDate.getMonth() &&
                 itemDate.getFullYear() === monthDate.getFullYear()
        }).reduce((sum, item) => sum + item.views, 0)

        const monthlyRequests = chartData.filter(item => {
          const itemDate = new Date(item.date)
          return itemDate.getMonth() === monthDate.getMonth() &&
                 itemDate.getFullYear() === monthDate.getFullYear()
        }).reduce((sum, item) => sum + item.requests, 0)

        sixMonthData.push({
          date: monthDate.toISOString(),
          views: monthlyViews,
          requests: monthlyRequests
        })
      }

      return sixMonthData
    }

    if (selectedDateRange === '1y') {
      // Generate all 12 months for the past year
      const yearData: ChartData[] = []

      for (let monthOffset = 11; monthOffset >= 0; monthOffset--) {
        const monthDate = new Date(now)
        monthDate.setMonth(now.getMonth() - monthOffset)
        monthDate.setDate(1) // First day of the month
        monthDate.setHours(0, 0, 0, 0)

        // Aggregate existing data for this month
        const monthlyViews = chartData.filter(item => {
          const itemDate = new Date(item.date)
          return itemDate.getMonth() === monthDate.getMonth() &&
                 itemDate.getFullYear() === monthDate.getFullYear()
        }).reduce((sum, item) => sum + item.views, 0)

        const monthlyRequests = chartData.filter(item => {
          const itemDate = new Date(item.date)
          return itemDate.getMonth() === monthDate.getMonth() &&
                 itemDate.getFullYear() === monthDate.getFullYear()
        }).reduce((sum, item) => sum + item.requests, 0)

        yearData.push({
          date: monthDate.toISOString(),
          views: monthlyViews,
          requests: monthlyRequests
        })
      }

      return yearData
    }

    const daysToShow = ranges[selectedDateRange as keyof typeof ranges] || 30
    const cutoffDate = new Date(now.getTime() - (daysToShow * 24 * 60 * 60 * 1000))

    return chartData.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= cutoffDate
    }).slice(-50) // Limit to last 50 points for performance
  }

  // Use useMemo for proper dependency tracking and performance
  const filteredChartData = React.useMemo(() => {
    const data = getFilteredData()
    console.log('📊 [TrafficChart] Filtered chart data for display:', {
      range: selectedDateRange,
      dataPoints: data.length,
      totalViews: data.reduce((acc, curr) => acc + curr.views, 0),
      sampleData: data.slice(0, 3) // Show first 3 data points
    })
    return data
  }, [selectedDateRange, chartData, allPageViews])

  const total = React.useMemo(
    () => ({
      views: filteredChartData.reduce((acc, curr) => acc + curr.views, 0),
    }),
    [filteredChartData]
  )

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col items-stretch sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 py-2">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Site Traffic</span>
            <LiveIndicator size="sm" />
          </h3>
          <div className="text-sm text-muted-foreground">
            Showing site traffic for the selected time period (CST/CDT)
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center space-x-2 mt-3">
            {["1d", "7d", "30d", "90d", "6m", "1y"].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedDateRange(range)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  selectedDateRange === range
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Metric Tabs */}
        <div className="flex gap-6 mt-4 sm:mt-0 sm:items-end">
          {["views"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className={`relative flex flex-col justify-center gap-1 px-4 py-2 text-left transition-colors min-w-0 cursor-pointer ${
                  activeChart === chart
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs whitespace-nowrap">
                  {chartConfig[chart].label}
                </span>
                <span className="text-xl leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chart Section */}
      <div className="w-full">
        {filteredChartData.length === 0 || total[activeChart] === 0 ? (
          <div className="h-[300px] w-full flex items-center justify-center relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/50">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23000000' fill-opacity='1'%3e%3cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
              }}></div>
            </div>

            <div className="text-center space-y-6 relative z-10">
              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
                  No data available
                </h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed font-medium">
                  No {chartConfig[activeChart].label.toLowerCase()} recorded for the selected time period
                </p>
              </div>

              {/* Modern indicator */}
              <div className="flex items-center justify-center space-x-3 pt-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse delay-150"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse delay-300"></div>
                </div>
                <span className="text-xs text-slate-400 font-medium tracking-wide">
                  NO DATA FOR PERIOD
                </span>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse delay-450"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse delay-600"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse delay-750"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ChartContainer
              config={chartConfig}
              className="h-full w-full"
            >
              <BarChart
                accessibilityLayer
                data={filteredChartData}
                margin={{
                  left: 0,
                  right: 0,
                  top: 5,
                  bottom: 5,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value)

                    switch (selectedDateRange) {
                      case "1d":
                        return formatCentralTime(date, 'hour')
                      case "7d":
                        return date.toLocaleDateString("en-US", {
                          weekday: "short",
                        })
                      case "30d":
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      case "90d":
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      case "6m":
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                        })
                      case "1y":
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          year: "2-digit",
                        })
                      default:
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                    }
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    if (value === 0) return "0"
                    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
                    return value.toString()
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      labelFormatter={(value) => {
                        const date = new Date(value)
                        if (selectedDateRange === "1d") {
                          return formatCentralTime(date, 'full')
                        }
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      }}
                    />
                  }
                />
                <Bar
                  dataKey={activeChart}
                  fill={`var(--color-${activeChart})`}
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </div>
        )}
      </div>
    </div>
  )
}
