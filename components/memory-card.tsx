"use client"

import { Badge } from "@/components/ui/badge"
import { Calendar, Heart, Meh, Frown, MessageCircle, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Memory } from "@prisma/client"
import { useState, useEffect } from "react"

interface MemoryCardProps {
  memory: Memory
}

export function MemoryCard({ memory }: MemoryCardProps) {
  const [formattedDate, setFormattedDate] = useState<string>("")
  const [timeAgo, setTimeAgo] = useState<string>("")

  useEffect(() => {
    const date = new Date(memory.createdAt)
    setFormattedDate(date.toLocaleDateString())

    // Calculate time ago
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      setTimeAgo("Just now")
    } else if (diffInHours < 24) {
      setTimeAgo(`${diffInHours} hours ago`)
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      setTimeAgo(`${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`)
    }
  }, [memory.createdAt])

  const getSentimentIcon = (sentiment: string | null) => {
    switch (sentiment) {
      case "positive":
        return <Heart className="w-3 h-3 text-green-400" />
      case "negative":
        return <Frown className="w-3 h-3 text-red-400" />
      default:
        return <Meh className="w-3 h-3 text-gray-400" />
    }
  }

  const getSentimentBadge = (sentiment: string | null) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "negative":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="glass-card rounded-xl p-6 hover:bg-white/5 dark:hover:bg-white/5 transition-all duration-300 group cursor-pointer">
      {/* Header with title and actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">{timeAgo}</span>
            {memory.sentiment && (
              <Badge variant="outline" className={`text-xs ${getSentimentBadge(memory.sentiment)}`}>
                {getSentimentIcon(memory.sentiment)}
                <span className="ml-1 capitalize">{memory.sentiment}</span>
              </Badge>
            )}
          </div>
          <h3 className="font-montserrat font-semibold text-xl text-white mb-2 line-clamp-2">{memory.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {memory.pineconeId && (
            <Badge variant="outline" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
              image
            </Badge>
          )}
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <p className="font-open-sans text-gray-300 mb-4 line-clamp-3 leading-relaxed">{memory.content}</p>

      {/* Image if present */}
      {memory.imageUrl && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={memory.imageUrl || "/placeholder.svg?height=200&width=400&query=memory image"}
            alt={memory.title}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {memory.tags.slice(0, 3).map((tag, index) => (
          <Badge key={index} variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
            {tag}
          </Badge>
        ))}
        {memory.tags.length > 3 && (
          <Badge variant="outline" className="text-xs bg-gray-500/20 text-gray-400 border-gray-500/30">
            +{memory.tags.length - 3} more
          </Badge>
        )}
      </div>

      {/* Footer with engagement */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
            <Heart className="w-4 h-4" />
            <span>{Math.floor(Math.random() * 10) + 1}</span>
          </button>
          <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">
            <MessageCircle className="w-4 h-4" />
            <span>{Math.floor(Math.random() * 5)}</span>
          </button>
        </div>
        <div className="text-xs text-gray-400">{formattedDate || "Loading..."}</div>
      </div>
    </div>
  )
}
