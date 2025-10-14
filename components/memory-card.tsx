"use client"

import { Badge } from "@/components/ui/badge"
import { Calendar, Heart, Meh, Frown, MessageCircle, MoreHorizontal, MapPin, Users, Image as ImageIcon, X, Star, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { Memory } from "@prisma/client"
import { useState, useEffect } from "react"

interface MemoryCardProps {
  memory: Memory
}

export function MemoryCard({ memory }: MemoryCardProps) {
  const [formattedDate, setFormattedDate] = useState<string>("")
  const [timeAgo, setTimeAgo] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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

  const hasImages = memory.images && memory.images.length > 0
  const displayImages = hasImages ? memory.images : (memory.imageUrl ? [memory.imageUrl] : [])

  return (
    <>
    <div 
      className="glass-card rounded-xl overflow-hidden hover:bg-white/5 dark:hover:bg-white/5 transition-all duration-300 group hover:shadow-xl hover:scale-[1.02]"
    >
      {/* Image Preview - Full Width */}
      {displayImages.length > 0 && (
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          <img
            src={displayImages[0]}
            alt={memory.title || 'Memory'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {displayImages.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-2.5 py-1.5 rounded-full text-xs text-white flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="font-medium">{displayImages.length}</span>
            </div>
          )}
          {memory.isFavorite && (
            <div className="absolute top-3 right-3 bg-yellow-500/90 backdrop-blur-sm p-2 rounded-full">
              <Star className="w-4 h-4 text-white fill-white" />
            </div>
          )}
          {/* View Button Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="opacity-100 transform scale-100 transition-all duration-300 bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2 rounded-lg shadow-lg"
            >
              View Details
            </Button>
          </div>
        </div>
      )}

      <div className="p-5">
      {/* Header with title and actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-400">{timeAgo}</span>
            {memory.sentiment && (
              <Badge variant="outline" className={`text-xs ${getSentimentBadge(memory.sentiment)}`}>
                {getSentimentIcon(memory.sentiment)}
                <span className="ml-1 capitalize">{memory.sentiment}</span>
              </Badge>
            )}
          </div>
          <h3 className="font-montserrat font-semibold text-lg text-white mb-1 line-clamp-2">{memory.title || 'Untitled Memory'}</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="opacity-100 hover:bg-gray-700/50 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            // Add more actions menu here
          }}
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <p className="font-open-sans text-gray-300 mb-4 line-clamp-3 leading-relaxed text-sm">{memory.content}</p>

      {/* Location and People Info */}
      {(memory.location || memory.people) && (
        <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-400">
          {memory.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{memory.location}</span>
            </div>
          )}
          {memory.people && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{memory.people}</span>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {memory.tags.slice(0, 4).map((tag, index) => (
          <Badge key={index} variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20 px-2 py-0.5">
            #{tag}
          </Badge>
        ))}
        {memory.tags.length > 4 && (
          <Badge variant="outline" className="text-xs bg-gray-500/20 text-gray-400 border-gray-500/30 px-2 py-0.5">
            +{memory.tags.length - 4}
          </Badge>
        )}
      </div>

      {/* Action Button - Always Visible */}
      {!displayImages.length && (
        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-all duration-300"
          variant="outline"
        >
          View Details
        </Button>
      )}
      </div>
    </div>

    {/* Detailed Modal */}
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-white mb-2">
                {memory.title || 'Untitled Memory'}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{formattedDate}</span>
                </div>
                {memory.sentiment && (
                  <Badge className={`${getSentimentBadge(memory.sentiment)}`}>
                    {getSentimentIcon(memory.sentiment)}
                    <span className="ml-1 capitalize">{memory.sentiment}</span>
                  </Badge>
                )}
                {memory.mood && (
                  <Badge variant="outline" className="capitalize">
                    {memory.mood}
                  </Badge>
                )}
              </DialogDescription>
            </div>
            {memory.isFavorite && (
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            )}
          </div>
        </DialogHeader>

        <Separator className="my-4 bg-gray-700" />

        {/* Images Gallery */}
        {displayImages.length > 0 && (
          <div className="mb-6">
            <div className="relative rounded-lg overflow-hidden bg-black">
              <img
                src={displayImages[currentImageIndex]}
                alt={`Memory image ${currentImageIndex + 1}`}
                className="w-full h-96 object-contain"
              />
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    →
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
                    {currentImageIndex + 1} / {displayImages.length}
                  </div>
                </>
              )}
            </div>
            {/* Image Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentImageIndex(idx)
                    }}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex ? 'border-primary' : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{memory.content}</p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {memory.location && (
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-gray-400">Location</span>
              </div>
              <p className="text-white">{memory.location}</p>
            </div>
          )}
          {memory.people && (
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-gray-400">People</span>
              </div>
              <p className="text-white">{memory.people}</p>
            </div>
          )}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-gray-400">Created</span>
            </div>
            <p className="text-white">{timeAgo}</p>
            <p className="text-sm text-gray-400 mt-1">{formattedDate}</p>
          </div>
          {memory.mood && (
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-gray-400">Mood</span>
              </div>
              <p className="text-white capitalize">{memory.mood}</p>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {memory.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-primary/10 text-primary border-primary/20">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-700">
          <Button variant="outline" className="flex-1">
            <Heart className="w-4 h-4 mr-2" />
            {memory.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
          <Button variant="outline">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
