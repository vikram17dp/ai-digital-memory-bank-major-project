"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Tag } from "lucide-react"
import type { Memory } from "@/lib/types"

interface TopicData {
  topic: string
  count: number
  percentage: number
}

export function TopicDistribution() {
  const [topicData, setTopicData] = useState<TopicData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await fetch("/api/memories")
        if (response.ok) {
          const memories: Memory[] = await response.json()

          // Aggregate topics from memories
          const topicCounts: Record<string, number> = {}
          let totalTopics = 0

          memories.forEach((memory) => {
            // Count tags
            memory.tags.forEach((tag) => {
              topicCounts[tag] = (topicCounts[tag] || 0) + 1
              totalTopics++
            })

            // Count AI-detected topics
            if (memory.aiAnalysis?.topics) {
              memory.aiAnalysis.topics.forEach((topic) => {
                topicCounts[topic] = (topicCounts[topic] || 0) + 1
                totalTopics++
              })
            }
          })

          // Convert to array and sort by count
          const topics = Object.entries(topicCounts)
            .map(([topic, count]) => ({
              topic,
              count,
              percentage: Math.round((count / totalTopics) * 100),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10) // Top 10 topics

          setTopicData(topics)
        }
      } catch (error) {
        console.error("Failed to fetch topics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
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
        <Tag className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Top Topics & Tags</h3>
      </div>

      {topicData.length > 0 ? (
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.269 0 0)" />
              <XAxis
                dataKey="topic"
                stroke="oklch(0.708 0 0)"
                fontSize={12}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="oklch(0.708 0 0)" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.145 0 0 / 0.9)",
                  border: "1px solid oklch(1 0 0 / 0.1)",
                  borderRadius: "8px",
                  backdropFilter: "blur(12px)",
                }}
                formatter={(value: number, name: string) => [
                  `${value} memories (${topicData.find((t) => t.count === value)?.percentage}%)`,
                  "Count",
                ]}
              />
              <Bar dataKey="count" fill="oklch(0.646 0.222 142)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-12">
          <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No topics yet</h3>
          <p className="text-muted-foreground">Start adding tags to your memories to see topic distribution.</p>
        </div>
      )}
    </div>
  )
}
