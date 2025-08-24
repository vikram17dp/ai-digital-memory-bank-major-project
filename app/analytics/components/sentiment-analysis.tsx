"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Heart, Meh, Frown } from "lucide-react"
import type { MemoryStats } from "@/lib/types"

export function SentimentAnalysis() {
  const [stats, setStats] = useState<MemoryStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/memories/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-xl">
        <div className="h-4 bg-muted/30 rounded mb-4 loading-shimmer"></div>
        <div className="h-64 bg-muted/30 rounded loading-shimmer"></div>
      </div>
    )
  }

  if (!stats) return null

  const sentimentData = [
    {
      name: "Positive",
      value: stats.positiveMemories,
      color: "oklch(0.6 0.15 145)",
      icon: Heart,
    },
    {
      name: "Neutral",
      value: stats.neutralMemories,
      color: "oklch(0.7 0.15 85)",
      icon: Meh,
    },
    {
      name: "Negative",
      value: stats.negativeMemories,
      color: "oklch(0.577 0.245 27.325)",
      icon: Frown,
    },
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="glass-card p-3 rounded-lg border border-white/20">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-xs text-muted-foreground">
            {data.value} memories ({Math.round((data.value / stats.totalMemories) * 100)}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Sentiment Distribution</h3>
      </div>

      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sentimentData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {sentimentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {sentimentData.map((item) => (
          <div key={item.name} className="text-center">
            <div className="flex items-center justify-center mb-2">
              <item.icon className="w-4 h-4" style={{ color: item.color }} />
            </div>
            <p className="text-sm font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">
              {item.value} ({Math.round((item.value / stats.totalMemories) * 100)}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
