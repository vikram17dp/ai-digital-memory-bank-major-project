import { Brain, TrendingUp, Heart, Meh, Frown, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MemoryInsightsProps {
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

export function MemoryInsights({ totalMemories, sentimentBreakdown, topTags, recentTrends }: MemoryInsightsProps) {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Heart className="w-4 h-4 text-green-500" />
      case "negative":
        return <Frown className="w-4 h-4 text-red-500" />
      default:
        return <Meh className="w-4 h-4 text-gray-500" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const growthPercentage =
    recentTrends.lastWeek > 0
      ? Math.round(((recentTrends.thisWeek - recentTrends.lastWeek) / recentTrends.lastWeek) * 100)
      : 0

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
        <Brain className="w-6 h-6 text-green-400" />
        AI Insights
      </h2>

      <div className="space-y-6">
        {/* Sentiment Analysis */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-300">Emotional Patterns</h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(sentimentBreakdown).map(([sentiment, count]) => (
              <div key={sentiment} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 text-center hover:border-green-500/30 transition-all duration-200">
                <div className="flex items-center justify-center mb-2">{getSentimentIcon(sentiment)}</div>
                <div className={`font-bold text-xl ${getSentimentColor(sentiment)}`}>{count}</div>
                <div className="text-xs text-gray-400 capitalize mt-1">{sentiment}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Tags */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-300 flex items-center gap-2">
            <Tag className="w-4 h-4 text-green-400" />
            Popular Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {topTags.slice(0, 6).map((tagData, index) => (
              <Badge key={index} className="bg-slate-800/50 text-gray-300 border border-slate-700/50 hover:border-green-500/30 transition-all cursor-pointer">
                {tagData.tag} ({tagData.count})
              </Badge>
            ))}
          </div>
        </div>

        {/* Growth Trend */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-300 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            Activity Trend
          </h3>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">This week</span>
              <span className="font-bold text-white">{recentTrends.thisWeek}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Growth</span>
              <span
                className={`font-bold text-sm ${
                  growthPercentage > 0 ? "text-green-400" : growthPercentage < 0 ? "text-red-400" : "text-gray-400"
                }`}
              >
                {growthPercentage > 0 ? "+" : ""}
                {growthPercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
