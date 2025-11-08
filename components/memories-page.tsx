"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import {
  Star,
  MoreVertical,
  Edit3,
  Trash2,
  MapPin,
  Users,
  Calendar,
  X,
  Save,
  Filter,
  Plus,
  RefreshCw,
  Eye,
  Heart,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Clock,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface Memory {
  id: string
  title: string
  content: string
  imageUrl: string | null
  images: string[]
  date: Date
  mood: "positive" | "neutral" | "negative"
  location: string | null
  people: string | null
  tags: string[]
  isFavorite: boolean
  createdAt: Date
}

interface MemoriesPageProps {
  onSectionChange?: (section: string) => void
}

export function MemoriesPage({ onSectionChange }: MemoriesPageProps = {}) {
  const { user } = useUser()
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "favorites">("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    location: "",
    people: "",
    tags: [] as string[],
    mood: "neutral" as "positive" | "neutral" | "negative",
    isPrivate: false,
    date: new Date().toISOString().split('T')[0],
  })
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [viewingMemory, setViewingMemory] = useState<Memory | null>(null)
  const [cardImageIndices, setCardImageIndices] = useState<Record<string, number>>({})
  const [modalImageIndex, setModalImageIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Reset modal image index when viewing a different memory
  useEffect(() => {
    setModalImageIndex(0)
  }, [viewingMemory?.id])
  const memoriesPerPage = 9 // 3x3 grid on desktop

  useEffect(() => {
    if (user?.id) {
      fetchMemories()
    }
  }, [user?.id])

  // Auto-refresh every 5 minutes when on the page
  useEffect(() => {
    if (!user?.id) return
    
    const interval = setInterval(() => {
      fetchMemories()
    }, 300000) // 5 minutes (300 seconds)
    
    return () => clearInterval(interval)
  }, [user?.id])

  const fetchMemories = async (showToast = false) => {
    try {
      if (showToast) {
        toast.loading("Loading latest memories...", { id: "refresh-memories" })
      }
      setLoading(true)
      const response = await fetch("/api/memories/list", {
        headers: {
          "x-user-id": user?.id || "",
        },
      })
      const data = await response.json()
      if (data.success) {
        setMemories(data.memories)
        if (showToast) {
          toast.success(`Loaded ${data.memories.length} memories`, { id: "refresh-memories", duration: 2000 })
        }
      }
    } catch (error) {
      console.error("Failed to fetch memories:", error)
      toast.error("Failed to load memories", { duration: 2500 })
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (memoryId: string, currentState: boolean) => {
    try {
      const response = await fetch(`/api/memory/${memoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "",
        },
        body: JSON.stringify({
          isFavorite: !currentState,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setMemories((prev) =>
          prev.map((m) =>
            m.id === memoryId ? { ...m, isFavorite: !currentState } : m
          )
        )
        toast.success(
          !currentState ? "⭐ Added to favorites!" : "✨ Removed from favorites",
          { duration: 2000 }
        )
      }
    } catch (error) {
      toast.error("Failed to update favorite", { duration: 2500 })
    }
  }

  const startEdit = (memory: Memory) => {
    setEditingId(memory.id)
    setEditForm({
      title: memory.title,
      content: memory.content,
      location: memory.location || "",
      people: memory.people || "",
      tags: memory.tags,
      mood: memory.mood,
      isPrivate: memory.isPrivate || false,
      date: new Date(memory.date).toISOString().split('T')[0],
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ 
      title: "", 
      content: "", 
      location: "", 
      people: "",
      tags: [], 
      mood: "neutral",
      isPrivate: false,
      date: new Date().toISOString().split('T')[0],
    })
  }

  const saveEdit = async (memoryId: string) => {
    try {
      const response = await fetch(`/api/memory/${memoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "",
        },
        body: JSON.stringify(editForm),
      })

      const data = await response.json()
      if (data.success) {
        setMemories((prev) =>
          prev.map((m) => (m.id === memoryId ? { ...m, ...editForm } : m))
        )
        setEditingId(null)
        toast.success("✅ Memory updated successfully", { duration: 2000 })
      }
    } catch (error) {
      toast.error("Failed to update memory", { duration: 2500 })
    }
  }

  const deleteMemory = async (memoryId: string) => {
    if (!confirm("Are you sure you want to delete this memory?")) return

    try {
      const response = await fetch(`/api/memory/${memoryId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": user?.id || "",
        },
      })

      const data = await response.json()
      if (data.success) {
        setMemories((prev) => prev.filter((m) => m.id !== memoryId))
        toast.success("🗑️ Memory deleted successfully", { duration: 2000 })
      }
    } catch (error) {
      toast.error("Failed to delete memory", { duration: 2500 })
    }
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - new Date(date).getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
    if (diffInDays < 7) return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`
    return new Date(date).toLocaleDateString()
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "positive":
        return "text-green-500"
      case "negative":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const filteredMemories = memories
    .filter((m) => filter === "all" || m.isFavorite)
    .sort((a, b) => {
      // Favorites first
      if (a.isFavorite && !b.isFavorite) return -1
      if (!a.isFavorite && b.isFavorite) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  
  // Pagination
  const totalPages = Math.ceil(filteredMemories.length / memoriesPerPage)
  const startIndex = (currentPage - 1) * memoriesPerPage
  const endIndex = startIndex + memoriesPerPage
  const paginatedMemories = filteredMemories.slice(startIndex, endIndex)
  
  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading memories...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">All Memories</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Browse and manage your memory collection</p>
          </div>
          <Button 
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 w-full sm:w-auto"
            onClick={() => onSectionChange?.("add")}
          >
            <Plus className="h-4 w-4" />
            <span>Add Memory</span>
          </Button>
        </div>
        
        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchMemories(true)}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            Show All
          </Button>
          <Button
            variant={filter === "favorites" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("favorites")}
            className="flex items-center gap-2"
          >
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Favorites</span>
          </Button>
        </div>
      </div>

      {/* Memories Grid */}
      {filteredMemories.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="text-5xl">📝</div>
            <h3 className="text-xl font-semibold">No memories yet</h3>
            <p className="text-muted-foreground">Start capturing your moments!</p>
          </div>
        </Card>
      ) : (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {paginatedMemories.map((memory) => (
            <Card
              key={memory.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
              onMouseEnter={() => setHoveredId(memory.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image Section - Clickable to open View Details */}
              <div 
                className="relative h-56 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex-shrink-0 group cursor-pointer"
                onClick={() => setViewingMemory(memory)}
              >
                {(() => {
                  const hasImages = memory.images && memory.images.length > 0
                  const displayImages = hasImages ? memory.images : (memory.imageUrl ? [memory.imageUrl] : [])
                  const currentIndex = cardImageIndices[memory.id] || 0
                  
                  if (displayImages.length > 0) {
                    return (
                      <>
                        <img
                          src={displayImages[currentIndex]}
                          alt={memory.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Navigation Arrows - Only show if multiple images */}
                        {displayImages.length > 1 && (
                          <>
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                              }}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setCardImageIndices(prev => ({
                                  ...prev,
                                  [memory.id]: (currentIndex - 1 + displayImages.length) % displayImages.length
                                }))
                              }}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-8 h-8 rounded-full transition-all z-20 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                              aria-label="Previous image"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                              }}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setCardImageIndices(prev => ({
                                  ...prev,
                                  [memory.id]: (currentIndex + 1) % displayImages.length
                                }))
                              }}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-8 h-8 rounded-full transition-all z-20 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                              aria-label="Next image"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {/* Image Counter */}
                            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-2.5 py-1.5 rounded-full text-xs text-white flex items-center gap-1.5">
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span className="font-medium">{currentIndex + 1}/{displayImages.length}</span>
                            </div>
                          </>
                        )}
                      </>
                    )
                  } else {
                    return (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        📸
                      </div>
                    )
                  }
                })()}

                {/* Removed hover View Details button */}

                {/* Favorite Star - Top Right */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(memory.id, memory.isFavorite)
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all z-10"
                >
                  <Star
                    className={cn(
                      "h-5 w-5 transition-all",
                      memory.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-white"
                    )}
                  />
                </button>

                {/* Three Dot Menu - Top Right (below star) */}
                <div className="absolute top-14 right-3 z-10" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
                      >
                        <MoreVertical className="h-4 w-4 text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setViewingMemory(memory)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => startEdit(memory)}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Memory
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleFavorite(memory.id, memory.isFavorite)}>
                        <Heart className="h-4 w-4 mr-2" />
                        {memory.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteMemory(memory.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Content Section */}
              <CardContent className="p-4 flex-grow flex flex-col">
                {editingId === memory.id ? (
                  /* Edit Mode */
                  <div className="space-y-3 flex-grow flex flex-col max-h-96 overflow-y-auto">
                    <Input
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      placeholder="Title"
                      className="font-semibold"
                    />
                    <Textarea
                      value={editForm.content}
                      onChange={(e) =>
                        setEditForm({ ...editForm, content: e.target.value })
                      }
                      placeholder="Content"
                      rows={3}
                      className="resize-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={editForm.location}
                        onChange={(e) =>
                          setEditForm({ ...editForm, location: e.target.value })
                        }
                        placeholder="Location"
                      />
                      <Input
                        value={editForm.people}
                        onChange={(e) =>
                          setEditForm({ ...editForm, people: e.target.value })
                        }
                        placeholder="People"
                      />
                    </div>
                    <Select
                      value={editForm.mood}
                      onValueChange={(value: "positive" | "neutral" | "negative") =>
                        setEditForm({ ...editForm, mood: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select mood" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="positive">Positive</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="negative">Negative</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="date"
                      value={editForm.date}
                      onChange={(e) =>
                        setEditForm({ ...editForm, date: e.target.value })
                      }
                    />
                    <div className="flex gap-2 mt-auto">
                      <Button
                        size="sm"
                        onClick={() => saveEdit(memory.id)}
                        className="flex-1"
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                        className="flex-1"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="space-y-3 flex-grow flex flex-col">
                    {/* Date & Mood */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{getTimeAgo(memory.createdAt)}</span>
                      <Badge
                        variant="outline"
                        className={cn("capitalize", getMoodColor(memory.mood))}
                      >
                        {memory.mood}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold line-clamp-2 break-words">
                      {memory.title}
                    </h3>

                    {/* Content */}
                    <p className="text-sm text-muted-foreground line-clamp-3 break-words flex-grow">
                      {memory.content}
                    </p>

                    {/* Location & People */}
                    <div className="space-y-1 text-xs text-muted-foreground">
                      {memory.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{memory.location}</span>
                        </div>
                      )}
                      {memory.people && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span className="truncate">{memory.people}</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {memory.tags && memory.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-auto pt-2">
                        {memory.tags.slice(0, 4).map((tag, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs bg-green-500/10 text-green-600 dark:text-green-400"
                          >
                            #{tag}
                          </Badge>
                        ))}
                        {memory.tags.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{memory.tags.length - 4}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredMemories.length)} of {filteredMemories.length} memories
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Previous</span>
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-1 text-muted-foreground">...</span>
                  }
                  return null
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <span className="hidden sm:inline mr-1">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        </>
      )}

      {/* View Details Modal */}
      <Dialog open={!!viewingMemory} onOpenChange={() => setViewingMemory(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold text-white mb-2">
                  {viewingMemory?.title || 'Untitled Memory'}
                </DialogTitle>
                <div className="flex items-center gap-3 flex-wrap text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{viewingMemory && new Date(viewingMemory.date).toLocaleDateString()}</span>
                  </div>
                  {viewingMemory?.mood && (
                    <Badge variant="outline" className={cn("capitalize", getMoodColor(viewingMemory.mood))}>
                      {viewingMemory.mood}
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => viewingMemory && toggleFavorite(viewingMemory.id, viewingMemory.isFavorite)}
                className="hover:bg-gray-700/50"
              >
                <Star className={cn(
                  "w-5 h-5",
                  viewingMemory?.isFavorite ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
                )} />
              </Button>
            </div>
          </DialogHeader>

          <Separator className="my-4 bg-gray-700" />

          {viewingMemory && (
            <>
              {/* Images Gallery */}
              {viewingMemory.images && viewingMemory.images.length > 0 && (
                <div className="mb-6">
                  <div className="relative rounded-lg overflow-hidden bg-black">
                    <img
                      src={viewingMemory.images[modalImageIndex]}
                      alt={`Memory image ${modalImageIndex + 1}`}
                      className="w-full h-96 object-contain"
                    />
                    {viewingMemory.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setModalImageIndex((prev) => (prev - 1 + viewingMemory.images!.length) % viewingMemory.images!.length)
                          }}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-12 h-12 rounded-full transition-all z-10 flex items-center justify-center shadow-lg"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setModalImageIndex((prev) => (prev + 1) % viewingMemory.images!.length)
                          }}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-12 h-12 rounded-full transition-all z-10 flex items-center justify-center shadow-lg"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
                          {modalImageIndex + 1} / {viewingMemory.images.length}
                        </div>
                      </>
                    )}
                  </div>
                  {/* Image Thumbnails */}
                  {viewingMemory.images.length > 1 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                      {viewingMemory.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation()
                            setModalImageIndex(idx)
                          }}
                          className={cn(
                            "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                            idx === modalImageIndex ? "border-primary" : "border-gray-700 hover:border-gray-500"
                          )}
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
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{viewingMemory.content}</p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {viewingMemory.location && (
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-gray-400">Location</span>
                    </div>
                    <p className="text-white">{viewingMemory.location}</p>
                  </div>
                )}
                {viewingMemory.people && (
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-gray-400">People</span>
                    </div>
                    <p className="text-white">{viewingMemory.people}</p>
                  </div>
                )}
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-gray-400">Created</span>
                  </div>
                  <p className="text-white">{getTimeAgo(viewingMemory.createdAt)}</p>
                  <p className="text-sm text-gray-400 mt-1">{new Date(viewingMemory.date).toLocaleDateString()}</p>
                </div>
                {viewingMemory.mood && (
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-gray-400">Mood</span>
                    </div>
                    <p className="text-white capitalize">{viewingMemory.mood}</p>
                  </div>
                )}
              </div>

              {/* Tags */}
              {viewingMemory.tags && viewingMemory.tags.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingMemory.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => toggleFavorite(viewingMemory.id, viewingMemory.isFavorite)}
                >
                  <Star className={cn(
                    "w-4 h-4 mr-2",
                    viewingMemory.isFavorite ? "fill-yellow-500 text-yellow-500" : ""
                  )} />
                  {viewingMemory.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </Button>
                <Button 
                  variant="outline"
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  onClick={() => {
                    startEdit(viewingMemory)
                    setViewingMemory(null)
                  }}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => {
                    deleteMemory(viewingMemory.id)
                    setViewingMemory(null)
                  }}
                >
                  <Trash2 className="w-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
