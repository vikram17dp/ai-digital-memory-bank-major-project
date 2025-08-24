"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Heart, Brain, Target, Calendar } from "lucide-react"

interface MoodAnalyticsProps {
  className?: string
}

export function MoodAnalytics({ className }: MoodAnalyticsProps) {
  const moodData = {
    current: "Positive",
    trend: "+16%",
    score: 85,
    weeklyData: [
      { day: "Mon", mood: "Positive", score: 78 },
      { day: "Tue", mood: "Neutral", score: 65 },
      { day: "Wed", mood: "Positive", score: 82 },
      { day: "Thu", mood: "Positive", score: 88 },
      { day: "Fri", mood: "Positive", score: 92 },
      { day: "Sat", mood: "Neutral", score: 70 },
      { day: "Sun", mood: "Positive", score: 85 },
    ]
  }

  const insights = [
    {
      title: "Emotional Patterns",
      icon: Heart,
      value: "Stable",
      description: "Your emotions show consistent patterns",
      color: "text-pink-500"
    },
    {
      title: "Memory Focus",
      icon: Brain,
      value: "86%",
      description: "Work-related memories dominate",
      color: "text-blue-500"
    },
    {
      title: "Active Days",
      icon: Target,
      value: "5/7",
      description: "Strong engagement this week",
      color: "text-green-500"
    }
  ]

  const getMoodColor = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'positive': return 'text-green-500 bg-green-500/10'
      case 'negative': return 'text-red-500 bg-red-500/10'
      case 'neutral': return 'text-blue-500 bg-blue-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Mood Analytics Section */}
      <Card className="bg-gray-900/40 border-gray-800/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <CardTitle className="text-base font-medium text-white">Mood Trend</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800/40 rounded-lg p-4 text-center border border-gray-700/30">
              <div className="w-6 h-6 bg-green-500/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-400 mb-1">Positive</p>
              <p className="text-lg font-bold text-white mb-1">+16%</p>
              <p className="text-xs text-green-400 leading-tight">Your memories are increasingly positive sentiment this week</p>
            </div>
            
            <div className="bg-gray-800/40 rounded-lg p-4 text-center border border-gray-700/30">
              <div className="w-6 h-6 bg-blue-500/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-400 mb-1">Memory Patterns</p>
              <p className="text-lg font-bold text-white mb-1">60%</p>
              <p className="text-xs text-blue-400 leading-tight">Most memories are work related. Consider adding more personal moments</p>
            </div>
            
            <div className="bg-gray-800/40 rounded-lg p-4 text-center border border-gray-700/30">
              <div className="w-6 h-6 bg-teal-500/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-400 mb-1">Active Days</p>
              <p className="text-lg font-bold text-white mb-1">5/7</p>
              <p className="text-xs text-teal-400 mb-1">+2 days</p>
              <p className="text-xs text-gray-500 leading-tight">You've been consistently capturing memories</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Most Used Tags Section */}
      <Card className="bg-gray-900/40 border-gray-800/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gray-400" />
            <CardTitle className="text-base font-medium text-white">Most Used Tags</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { tag: "work", count: 23, percentage: 100, color: "bg-blue-500" },
              { tag: "inspiration", count: 15, percentage: 65, color: "bg-purple-500" },
              { tag: "personal", count: 12, percentage: 52, color: "bg-green-500" },
              { tag: "travel", count: 8, percentage: 35, color: "bg-orange-500" },
              { tag: "books", count: 6, percentage: 26, color: "bg-pink-500" },
            ].map((item) => (
              <div key={item.tag} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-200">{item.tag}</span>
                  <span className="text-xs text-gray-400">{item.count} memories</span>
                </div>
                <div className="w-full bg-gray-700/40 rounded-full h-2">
                  <div 
                    className={`${item.color} h-2 rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
