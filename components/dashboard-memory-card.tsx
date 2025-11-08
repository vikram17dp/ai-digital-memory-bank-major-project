"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Heart, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Memory {
  id: string
  title: string | null
  content: string
  tags: string[]
  sentiment: string | null
  mood?: string | null
  images?: string[]
  imageUrl?: string | null
  createdAt: string
  isFavorite?: boolean
}

interface DashboardMemoryCardProps {
  memory: Memory
  onClick?: () => void
}

export function DashboardMemoryCard({ memory, onClick }: DashboardMemoryCardProps) {
  const displayImage = memory.images?.[0] || memory.imageUrl
  const displayTitle = memory.title || 'Untitled Memory'
  const displaySentiment = memory.sentiment || memory.mood || 'neutral'
  
  const getSentimentStyle = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return {
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          color: '#6EE7B7',
          border: 'none'
        }
      case 'negative':
        return {
          backgroundColor: 'rgba(244, 63, 94, 0.2)',
          color: '#FDA4AF',
          border: 'none'
        }
      case 'neutral':
      default:
        // Use theme accent color for neutral
        return {
          backgroundColor: 'var(--accent)',
          color: '#ffffff',
          border: 'none'
        }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div 
        className="relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 flex flex-col h-full"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Image Section */}
        {displayImage && (
          <div className="relative w-full h-44 overflow-hidden">
            <img
              src={displayImage}
              alt={displayTitle}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Favorite Icon */}
            {memory.isFavorite && (
              <div className="absolute top-3 right-3">
                <div className="p-2 rounded-full bg-black/40 backdrop-blur-sm">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <h3 
              className="text-lg font-semibold line-clamp-1 flex-1"
              style={{ color: 'var(--text-primary)' }}
            >
              {displayTitle}
            </h3>
            <Badge 
              className="text-xs ml-2"
              style={getSentimentStyle(displaySentiment)}
            >
              {displaySentiment}
            </Badge>
          </div>

          {/* Description */}
          <p 
            className="text-sm line-clamp-2 mb-4 flex-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {memory.content}
          </p>

          {/* Tags */}
          {memory.tags && memory.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {memory.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs px-2 py-0.5 border-0"
                  style={{
                    backgroundColor: 'var(--bg-hover)',
                    color: 'var(--accent)'
                  }}
                >
                  #{tag}
                </Badge>
              ))}
              {memory.tags.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  +{memory.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div 
            className="flex items-center justify-between pt-3 border-t text-xs"
            style={{ 
              borderColor: 'var(--border)',
              color: 'var(--text-muted)' 
            }}
          >
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>
                {new Date(memory.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>

            {/* Optional: Comments/reactions count */}
            {/* <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                <span>0</span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
          style={{
            boxShadow: `0 0 30px var(--glow)`
          }}
        />
      </div>
    </motion.div>
  )
}
