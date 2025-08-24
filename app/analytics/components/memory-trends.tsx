"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Calendar } from "lucide-react"

interface TrendData {
  date: string
  memories: number
  positive: number
  negative: number
}

export function MemoryTrends() {
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock trend data - in real app, this would come from API
    const mockData: TrendData[] = []
    const today = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      mockData.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        memories: Math.floor(Math.random() * 8) + 1,
        positive: Math.floor(Math.random() * 5) + 1,
        negative: Math.floor(Math.random() * 2),
      })
    }

    setTrendData(mockData)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-xl">
        <div className="h-4 bg-muted/30 rounded mb-4 loading-shimmer"></div>
        <div className="h-64 bg-muted/30 rounded loading-shimmer"></div>
      </div>
    )
  }

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Memory Trends (30 Days)</h3>
      </div>

      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.269 0 0)" />
            <XAxis dataKey="date" stroke="oklch(0.708 0 0)" fontSize={12} tickLine={false} />
            <YAxis stroke="oklch(0.708 0 0)" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.145 0 0 / 0.9)",
                border: "1px solid oklch(1 0 0 / 0.1)",
                borderRadius: "8px",
                backdropFilter: "blur(12px)",
              }}
            />
            <Line
              type="monotone"
              dataKey="memories"
              stroke="oklch(0.646 0.222 142)"
              strokeWidth={2}
              dot={{ fill: "oklch(0.646 0.222 142)", strokeWidth: 2, r: 4 }}
              name="Total Memories"
            />
            <Line
              type="monotone"
              dataKey="positive"
              stroke="oklch(0.6 0.15 145)"
              strokeWidth={2}
              dot={{ fill: "oklch(0.6 0.15 145)", strokeWidth: 2, r: 3 }}
              name="Positive"
            />
            <Line
              type="monotone"
              dataKey="negative"
              stroke="oklch(0.577 0.245 27.325)"
              strokeWidth={2}
              dot={{ fill: "oklch(0.577 0.245 27.325)", strokeWidth: 2, r: 3 }}
              name="Negative"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
