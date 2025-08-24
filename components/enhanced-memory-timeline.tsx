import React, { useState, useEffect } from 'react'
import {
  Clock,
  Calendar,
  Heart,
  Star,
  MapPin,
  Users,
  Tag,
  Image,
  MessageSquare,
  Share,
  MoreHorizontal,
  Eye,
  Smile,
  Meh,
  Frown,
  ChevronDown,
  ChevronUp,
  Filter,
  Grid,
  List,
  Sparkles,
  TrendingUp,
  BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'

interface Memory {
  id: string
  title: string
  content: string
  tags: string[]
  sentiment: string
  createdAt: string
  updatedAt: string | null
  mood?: string
  location?: string
  people?: string
  images?: number
  isFavorite?: boolean
}

interface EnhancedMemoryTimelineProps {
  memories?: Memory[]
}

const mockMemories: Memory[] = [
  {
    id: '1',
    title: 'Summer Vacation in Bali',
    content: 'An incredible family trip to Bali! We explored ancient temples, relaxed on pristine beaches, and enjoyed the most amazing sunsets. The Balinese culture was so welcoming and the food was absolutely delicious. This trip really brought our family closer together.',
    tags: ['travel', 'family', 'vacation', 'beach', 'culture'],
    sentiment: 'positive',
    mood: 'happy',
    location: 'Bali, Indonesia',
    people: 'Sarah, Mom, Dad',
    images: 24,
    isFavorite: true,
    createdAt: '2024-08-15T10:30:00Z',
    updatedAt: null
  },
  {
    id: '2',
    title: 'Graduation Day Achievement',
    content: 'Finally graduated with my Computer Science degree! Four years of hard work, countless late nights coding, and amazing friendships formed along the way. Seeing the pride in my parents\' eyes made it all worth it.',
    tags: ['achievement', 'education', 'milestone', 'family', 'success'],
    sentiment: 'positive',
    mood: 'excited',
    location: 'University Campus',
    people: 'Parents, Classmates, Professor Johnson',
    images: 12,
    isFavorite: true,
    createdAt: '2024-06-22T14:00:00Z',
    updatedAt: null
  },
  {
    id: '3',
    title: 'First Day at New Job',
    content: 'Started my dream job as a Software Engineer today! The team is incredibly welcoming, the office culture is amazing, and I\'m excited about the projects ahead. New chapter in life begins now.',
    tags: ['work', 'career', 'new-beginning', 'excitement'],
    sentiment: 'positive',
    mood: 'excited',
    location: 'Downtown Tech Office',
    people: 'New team members, Manager Sarah',
    images: 5,
    isFavorite: false,
    createdAt: '2024-08-01T09:00:00Z',
    updatedAt: null
  },
  {
    id: '4',
    title: 'Mountain Hiking Adventure',
    content: 'Conquered the challenging mountain trail with Alex and Jake today! The 8-hour hike was exhausting but the breathtaking views from the summit made every step worth it. Great bonding time with friends.',
    tags: ['adventure', 'hiking', 'friends', 'nature', 'challenge'],
    sentiment: 'positive',
    mood: 'accomplished',
    location: 'Rocky Mountain Trail',
    people: 'Alex, Jake',
    images: 18,
    isFavorite: false,
    createdAt: '2024-07-10T16:45:00Z',
    updatedAt: null
  },
  {
    id: '5',
    title: 'Grandma\'s 85th Birthday Celebration',
    content: 'Beautiful family gathering to celebrate Grandma\'s 85th birthday. Three generations came together, shared stories, laughed, and created new memories. Her wisdom and love continue to inspire us all.',
    tags: ['family', 'celebration', 'birthday', 'love', 'memories'],
    sentiment: 'positive',
    mood: 'loved',
    location: 'Family Home',
    people: 'Extended family, Grandma, Cousins',
    images: 15,
    isFavorite: true,
    createdAt: '2024-05-18T19:30:00Z',
    updatedAt: null
  },
  {
    id: '6',
    title: 'Learning to Cook Italian Cuisine',
    content: 'Finally mastered making authentic pasta from scratch! After several failed attempts and a very messy kitchen, I can now make delicious homemade fettuccine. Practice makes perfect!',
    tags: ['cooking', 'learning', 'skill', 'italian', 'accomplishment'],
    sentiment: 'positive',
    mood: 'accomplished',
    location: 'Home Kitchen',
    people: 'Solo project',
    images: 8,
    isFavorite: false,
    createdAt: '2024-04-25T20:15:00Z',
    updatedAt: null
  }
]

const getMoodIcon = (mood: string) => {
  switch (mood) {
    case 'happy': return Smile
    case 'excited': return Star
    case 'accomplished': return TrendingUp
    case 'loved': return Heart
    default: return Meh
  }
}

const getMoodColor = (mood: string) => {
  switch (mood) {
    case 'happy': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'excited': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    case 'accomplished': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'loved': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'Yesterday'
  if (diffDays <= 7) return `${diffDays} days ago`
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`
  if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} months ago`
  return `${Math.ceil(diffDays / 365)} years ago`
}

const groupMemoriesByDate = (memories: Memory[]) => {
  const grouped: { [key: string]: Memory[] } = {}
  
  memories.forEach(memory => {
    const date = new Date(memory.createdAt)
    const key = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    })
    
    if (!grouped[key]) {
      grouped[key] = []
    }
    grouped[key].push(memory)
  })
  
  return grouped
}

export const EnhancedMemoryTimeline: React.FC<EnhancedMemoryTimelineProps> = ({ memories = mockMemories }) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline')
  const [expandedMemories, setExpandedMemories] = useState<Set<string>>(new Set())
  const [filterMood, setFilterMood] = useState<string>('')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'mood'>('date')
  
  const sortedMemories = [...memories].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'title':
        return a.title.localeCompare(b.title)
      case 'mood':
        return (a.mood || '').localeCompare(b.mood || '')
      default:
        return 0
    }
  })
  
  const filteredMemories = filterMood 
    ? sortedMemories.filter(memory => memory.mood === filterMood)
    : sortedMemories
  
  const groupedMemories = groupMemoriesByDate(filteredMemories)
  
  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedMemories)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedMemories(newExpanded)
  }
  
  const renderMemoryCard = (memory: Memory, index: number) => {
    const isExpanded = expandedMemories.has(memory.id)
    const MoodIcon = getMoodIcon(memory.mood || '')
    
    return (
      <Card 
        key={memory.id} 
        className={`group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] cursor-pointer animate-slideInUp card-hover ${
          memory.isFavorite ? 'ring-2 ring-yellow-400/20' : ''
        }`}
        style={{ animationDelay: `${index * 0.1}s` }}
        onClick={() => toggleExpanded(memory.id)}
      >
        {memory.isFavorite && (
          <div className="absolute top-4 right-4 z-10">
            <Star className="h-5 w-5 text-yellow-400 fill-current animate-pulse" />
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-xl ${getMoodColor(memory.mood || '')} transition-all duration-300 group-hover:scale-110`}>
                  <MoodIcon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {memory.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(memory.createdAt)}
                    </span>
                    {memory.location && (
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3" />
                        {memory.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              {memory.images && memory.images > 0 && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                      <Image className="h-3 w-3" />
                      {memory.images}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{memory.images} images</TooltipContent>
                </Tooltip>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle expand/collapse
                }}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className={`text-gray-700 dark:text-gray-300 leading-relaxed transition-all duration-500 ${
            isExpanded ? 'opacity-100' : 'line-clamp-2 opacity-90'
          }`}>
            {memory.content}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {memory.tags.slice(0, isExpanded ? memory.tags.length : 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
              >
                #{tag}
              </Badge>
            ))}
            {!isExpanded && memory.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-1">
                +{memory.tags.length - 3} more
              </Badge>
            )}
          </div>
          
          {memory.people && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span>{memory.people}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500 hover:text-red-500 transition-colors">
                    <Heart className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Like this memory</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500 hover:text-blue-500 transition-colors">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add comment</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500 hover:text-green-500 transition-colors">
                    <Share className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share memory</TooltipContent>
              </Tooltip>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(memory.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  const renderTimelineView = () => {
    return (
      <div className="space-y-8">
        {Object.entries(groupedMemories).map(([period, periodMemories], periodIndex) => (
          <div key={period} className="relative animate-slideInLeft" style={{ animationDelay: `${periodIndex * 0.2}s` }}>
            {/* Timeline Line */}
            <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-cyan-500 opacity-30"></div>
            
            {/* Period Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg relative">
                <Calendar className="h-8 w-8 text-white" />
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-20 animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  {period}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {periodMemories.length} {periodMemories.length === 1 ? 'memory' : 'memories'}
                </p>
              </div>
            </div>
            
            {/* Memories for this period */}
            <div className="ml-24 space-y-6">
              {periodMemories.map((memory, index) => renderMemoryCard(memory, index))}
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  const renderGridView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMemories.map((memory, index) => renderMemoryCard(memory, index))}
      </div>
    )
  }
  
  return (
    <TooltipProvider>
      <div className="space-y-6 relative">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl blur-3xl animate-pulse"></div>
          <div className="relative">
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Memory Timeline
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Your journey through time and memories ✨</p>
          </div>
        </div>
        
        {/* Controls */}
        <Card className="bg-gradient-to-r from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-xl border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <Button
                  variant={viewMode === 'timeline' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('timeline')}
                  className="rounded-lg transition-all duration-200"
                >
                  <List className="h-4 w-4 mr-2" />
                  Timeline
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-lg transition-all duration-200"
                >
                  <Grid className="h-4 w-4 mr-2" />
                  Grid
                </Button>
              </div>
              
              {/* Filters and Sort */}
              <div className="flex items-center gap-3">
                {/* Mood Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      {filterMood ? `Mood: ${filterMood}` : 'Filter Mood'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterMood('')}>
                      All Moods
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFilterMood('happy')}>Happy</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterMood('excited')}>Excited</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterMood('accomplished')}>Accomplished</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterMood('loved')}>Loved</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Sort Options */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <BookOpen className="h-4 w-4" />
                      Sort: {sortBy}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortBy('date')}>Date</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('title')}>Title</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('mood')}>Mood</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span>{filteredMemories.length} memories</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{filteredMemories.filter(m => m.isFavorite).length} favorites</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Image className="h-4 w-4 text-green-500" />
                <span>{filteredMemories.reduce((acc, m) => acc + (m.images || 0), 0)} photos</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {filteredMemories.length === 0 ? (
            <Card className="bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-700/90 backdrop-blur-xl border-0 shadow-xl">
              <CardContent className="p-16 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                  <Clock className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  No memories found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  {filterMood ? `No memories found with mood "${filterMood}". Try different filters or create some memories!` : 'Start creating your first memory to see your timeline!'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="animate-slideInUp">
              {viewMode === 'timeline' ? renderTimelineView() : renderGridView()}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
