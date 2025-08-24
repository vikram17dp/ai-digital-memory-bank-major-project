"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Calendar, Brain, Target, Clock, Zap } from "lucide-react"
import type { MemoryStats } from "@/lib/types"

interface AnalyticsData extends MemoryStats {
  averageWordsPerMemory: number
  mostActiveDay: string
  longestStreak: number
  memoryGrowthRate: number
}

export function AnalyticsOverview() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch("/api/memories/stats")
        if (response.ok) {
          const stats = await response.json()
          // Mock additional analytics data
          const analyticsData: AnalyticsData = {
            ...stats,
            averageWordsPerMemory: Math.floor(Math.random() * 100) + 50,
            mostActiveDay: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][
              Math.floor(Math.random() * 7)
            ],
            longestStreak: Math.floor(Math.random() * 30) + 5,
            memoryGrowthRate: Math.floor(Math.random() * 50) + 10,
          }
          setAnalytics(analyticsData)
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card p-4 sm:p-6 rounded-xl animate-pulse">
            <div className="h-4 bg-muted/30 rounded mb-2 loading-shimmer"></div>
            <div className="h-8 bg-muted/30 rounded loading-shimmer"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!analytics) return null

  const overviewCards = [
    {
      title: "Total Memories",
      value: analytics.totalMemories,
      icon: Brain,
      color: "text-primary",
      bgColor: "bg-primary/10",
      trend: `+${analytics.memoryGrowthRate}%`,
    },
    {
      title: "This Week",
      value: analytics.recentMemories,
      icon: Calendar,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      trend: "+12%",
    },
    {
      title: "Avg Words",
      value: analytics.averageWordsPerMemory,
      icon: Target,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      trend: "+8%",
    },
    {
      title: "Most Active",
      value: analytics.mostActiveDay,
      icon: TrendingUp,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      trend: "Day",
    },
    {
      title: "Longest Streak",
      value: `${analytics.longestStreak}d`,
      icon: Zap,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      trend: "Days",
    },
    {
      title: "Positive Rate",
      value: `${Math.round((analytics.positiveMemories / analytics.totalMemories) * 100)}%`,
      icon: Clock,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      trend: "+5%",
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {overviewCards.map((card, index) => (
          <div key={card.title} className="stat-card bounce-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 sm:p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.color}`} />
              </div>
              <span className="text-xs text-muted-foreground">{card.trend}</span>
            </div>
            <div className="space-y-1">
              <p className="text-lg sm:text-xl font-bold">{card.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">{card.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
