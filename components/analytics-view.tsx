"use client"

import { Brain, Heart, Calendar, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AnalyticsViewProps {
  insights: {
    totalMemories: number
    sentimentBreakdown: {
      positive: number
      negative: number
      neutral: number
    }
    topTags: Array<{ tag: string; count: number }>
    recentTrends: {
      thisWeek: number
      lastWeek: number
    }
  }
}

export function AnalyticsView({ insights }: AnalyticsViewProps) {
  const moodTrendData = [
    { label: "Positive", value: "+15%", color: "text-green-400" },
    { label: "Work Focus", value: "60%", color: "text-blue-400" },
    { label: "Active Days", value: "5/7", color: "text-cyan-400" },
  ]

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="glass-card rounded-xl p-6">
        <h1 className="font-montserrat font-black text-2xl text-foreground mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Deep insights into your memory patterns and emotional trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {moodTrendData.map((metric, index) => (
          <div key={index} className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-montserrat font-semibold text-foreground">{metric.label}</h3>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                {index === 0 && <Heart className="w-4 h-4 text-green-400" />}
                {index === 1 && <Target className="w-4 h-4 text-blue-400" />}
                {index === 2 && <Calendar className="w-4 h-4 text-cyan-400" />}
              </div>
            </div>
            <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {index === 0 && "Your memories show increasingly positive sentiment this week"}
              {index === 1 && "Most memories are work-related, consider adding more personal moments"}
              {index === 2 && "You've been consistently capturing memories +2 days"}
            </p>
          </div>
        ))}
      </div>

      {/* Sentiment Analysis */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-montserrat font-semibold text-lg mb-6 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Emotional Patterns
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-green-500/20 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">{insights.sentimentBreakdown.positive}</p>
            <p className="text-sm text-muted-foreground">Positive</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-gray-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">😐</span>
            </div>
            <p className="text-2xl font-bold text-gray-400">{insights.sentimentBreakdown.neutral}</p>
            <p className="text-sm text-muted-foreground">Neutral</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">😔</span>
            </div>
            <p className="text-2xl font-bold text-red-400">{insights.sentimentBreakdown.negative}</p>
            <p className="text-sm text-muted-foreground">Negative</p>
          </div>
        </div>
      </div>

      {/* Top Tags */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-montserrat font-semibold text-lg mb-6">Most Used Tags</h3>
        <div className="space-y-4">
          {insights.topTags.slice(0, 5).map((tagData, index) => (
            <div key={index} className="flex items-center justify-between">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {tagData.tag}
              </Badge>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(tagData.count / Math.max(...insights.topTags.map((t) => t.count))) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8 text-right">{tagData.count} memories</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
