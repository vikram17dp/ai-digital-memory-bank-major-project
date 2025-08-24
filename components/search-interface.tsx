import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  Tag,
  MapPin,
  Users,
  Heart,
  Star,
  Clock,
  Sparkles,
  TrendingUp,
  X,
  ChevronDown,
  Zap,
  Eye,
  BookOpen,
  Image,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'

interface SearchInterfaceProps {
  user?: any
  userData?: any
  memories?: any[]
  insights?: any
  onSectionChange?: (section: string) => void
}

const mockMemories = [
  {
    id: 1,
    title: "Summer Vacation in Bali",
    content: "An amazing trip with family to Bali. We visited beautiful temples, enjoyed the beaches, and had incredible local food. The sunset at Tanah Lot was absolutely breathtaking.",
    mood: "happy",
    tags: ["travel", "family", "vacation", "beach"],
    date: "2024-07-15",
    location: "Bali, Indonesia",
    people: "Sarah, Mom, Dad",
    images: 8,
    isFavorite: true,
    createdAt: "2024-07-20"
  },
  {
    id: 2,
    title: "Graduation Day Achievement",
    content: "Finally graduated with my Computer Science degree! All those late nights studying and working on projects paid off. Mom and Dad were so proud.",
    mood: "excited",
    tags: ["achievement", "education", "milestone", "family"],
    date: "2024-05-22",
    location: "University Campus",
    people: "Parents, Friends, Classmates",
    images: 5,
    isFavorite: true,
    createdAt: "2024-05-22"
  },
  {
    id: 3,
    title: "First Day at New Job",
    content: "Started my new role as a Software Engineer today. The team seems really welcoming and I'm excited about the projects I'll be working on. Office has a great view of the city.",
    mood: "excited",
    tags: ["work", "career", "new-beginning"],
    date: "2024-08-01",
    location: "Downtown Office",
    people: "New colleagues, Manager",
    images: 2,
    isFavorite: false,
    createdAt: "2024-08-01"
  },
  {
    id: 4,
    title: "Weekend Hiking Adventure",
    content: "Hiked the mountain trail with Alex and Jake. The view from the top was incredible. We packed lunch and spent hours just enjoying nature and good conversation.",
    mood: "happy",
    tags: ["adventure", "nature", "friends", "outdoor"],
    date: "2024-06-10",
    location: "Mountain Trail",
    people: "Alex, Jake",
    images: 12,
    isFavorite: false,
    createdAt: "2024-06-10"
  },
  {
    id: 5,
    title: "Cooking Disaster with Friends",
    content: "Tried to make a fancy dinner for friends but completely burned the main course. We ended up ordering pizza and laughing about it all night. Sometimes the best memories come from failures.",
    mood: "neutral",
    tags: ["friends", "cooking", "funny", "food"],
    date: "2024-03-15",
    location: "My Kitchen",
    people: "Emma, Tom, Lisa",
    images: 3,
    isFavorite: false,
    createdAt: "2024-03-15"
  }
]

const filterOptions = {
  mood: [
    { value: 'happy', label: 'Happy', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
    { value: 'excited', label: 'Excited', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
    { value: 'loved', label: 'Loved', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' },
    { value: 'neutral', label: 'Neutral', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300' },
    { value: 'sad', label: 'Sad', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' }
  ],
  timeRange: [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' }
  ],
  sortBy: [
    { value: 'date-desc', label: 'Newest First', icon: SortDesc },
    { value: 'date-asc', label: 'Oldest First', icon: SortAsc },
    { value: 'favorites', label: 'Favorites First', icon: Heart },
    { value: 'title', label: 'Alphabetical', icon: BookOpen }
  ]
}

const recentSearches = [
  "vacation photos",
  "work achievements",
  "family moments",
  "travel memories",
  "birthday celebrations"
]

export const SearchInterface: React.FC<SearchInterfaceProps> = ({
  user,
  userData,
  memories,
  insights,
  onSectionChange
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    mood: '',
    timeRange: 'all',
    tags: [] as string[],
    location: '',
    people: '',
    hasImages: false,
    favoritesOnly: false
  })
  const [sortBy, setSortBy] = useState('date-desc')
  const [searchResults, setSearchResults] = useState(mockMemories)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState(recentSearches)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Simulate search with debouncing
  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsSearching(true)
      
      // Generate suggestions
      const allTags = Array.from(new Set(mockMemories.flatMap(m => m.tags)))
      const querySuggestions = allTags
        .filter(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5)
      
      setSuggestions(querySuggestions)
      setShowSuggestions(true)
      
      // Simulate search delay
      const searchTimer = setTimeout(() => {
        const filtered = mockMemories.filter(memory => {
          const searchTerm = searchQuery.toLowerCase()
          const matchesQuery = 
            memory.title.toLowerCase().includes(searchTerm) ||
            memory.content.toLowerCase().includes(searchTerm) ||
            memory.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            memory.location.toLowerCase().includes(searchTerm) ||
            memory.people.toLowerCase().includes(searchTerm)
          
          const matchesMood = !filters.mood || memory.mood === filters.mood
          const matchesTags = filters.tags.length === 0 || filters.tags.every(tag => memory.tags.includes(tag))
          const matchesLocation = !filters.location || memory.location.toLowerCase().includes(filters.location.toLowerCase())
          const matchesPeople = !filters.people || memory.people.toLowerCase().includes(filters.people.toLowerCase())
          const matchesImages = !filters.hasImages || memory.images > 0
          const matchesFavorites = !filters.favoritesOnly || memory.isFavorite
          
          return matchesQuery && matchesMood && matchesTags && matchesLocation && matchesPeople && matchesImages && matchesFavorites
        })
        
        // Sort results
        const sorted = [...filtered].sort((a, b) => {
          switch (sortBy) {
            case 'date-desc':
              return new Date(b.date).getTime() - new Date(a.date).getTime()
            case 'date-asc':
              return new Date(a.date).getTime() - new Date(b.date).getTime()
            case 'favorites':
              return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)
            case 'title':
              return a.title.localeCompare(b.title)
            default:
              return 0
          }
        })
        
        setSearchResults(sorted)
        setIsSearching(false)
      }, 300)
      
      return () => clearTimeout(searchTimer)
    } else {
      setSearchResults(mockMemories)
      setSuggestions([])
      setShowSuggestions(false)
      setIsSearching(false)
    }
  }, [searchQuery, filters, sortBy])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setShowSuggestions(false)
    
    // Add to search history if not already there
    if (query.trim() && !searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 4)])
    }
  }

  const addTagFilter = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      setFilters(prev => ({ ...prev, tags: [...prev.tags, tag] }))
    }
  }

  const removeTagFilter = (tag: string) => {
    setFilters(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  const clearAllFilters = () => {
    setFilters({
      mood: '',
      timeRange: 'all',
      tags: [],
      location: '',
      people: '',
      hasImages: false,
      favoritesOnly: false
    })
  }

  const activeFiltersCount = Object.values(filters).filter(value => 
    Array.isArray(value) ? value.length > 0 : Boolean(value) && value !== 'all'
  ).length

  const getMoodColor = (mood: string) => {
    const moodOption = filterOptions.mood.find(m => m.value === mood)
    return moodOption?.color || 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300'
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

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="max-w-6xl mx-auto">
          {/* Search Section */}
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-6">
              {/* Main Search Bar */}
              <div className="relative mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className={`h-5 w-5 transition-colors duration-200 ${
                        isSearching ? 'text-blue-500 animate-pulse' : 'text-gray-400'
                      }`} />
                    </div>
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search memories, tags, locations, people..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                      className="pl-12 pr-4 h-14 text-lg bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60 transition-all duration-300 shadow-sm"
                    />
                    
                    {/* Search Suggestions */}
                    {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                        {searchQuery.length > 0 && suggestions.length > 0 && (
                          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                              <Zap className="h-4 w-4" />
                              Suggestions
                            </div>
                            <div className="space-y-2">
                              {suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    handleSearch(suggestion)
                                    setShowSuggestions(false)
                                  }}
                                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300"
                                >
                                  #{suggestion}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {searchQuery.length === 0 && searchHistory.length > 0 && (
                          <div className="p-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                              <Clock className="h-4 w-4" />
                              Recent Searches
                            </div>
                            <div className="space-y-2">
                              {searchHistory.map((search, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    handleSearch(search)
                                    setShowSuggestions(false)
                                  }}
                                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                >
                                  {search}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Filter Toggle */}
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`h-14 px-6 rounded-2xl bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 relative ${
                      showFilters ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' : ''
                    }`}
                  >
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 h-5 w-5 p-0 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                  
                  {/* Sort Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-14 px-6 rounded-2xl bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                        {React.createElement(filterOptions.sortBy.find(s => s.value === sortBy)?.icon || SortDesc, {
                          className: "h-5 w-5 mr-2"
                        })}
                        Sort
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {filterOptions.sortBy.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                          className={sortBy === option.value ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                        >
                          <option.icon className="h-4 w-4 mr-2" />
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Active Filters Display */}
                {activeFiltersCount > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Active filters:</span>
                    
                    {filters.mood && (
                      <Badge variant="secondary" className={`px-3 py-1 ${getMoodColor(filters.mood)} cursor-pointer group`}
                        onClick={() => setFilters(prev => ({ ...prev, mood: '' }))}
                      >
                        Mood: {filterOptions.mood.find(m => m.value === filters.mood)?.label}
                        <X className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Badge>
                    )}
                    
                    {filters.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 cursor-pointer group"
                        onClick={() => removeTagFilter(tag)}
                      >
                        #{tag}
                        <X className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Badge>
                    ))}
                    
                    {filters.favoritesOnly && (
                      <Badge variant="secondary" className="px-3 py-1 bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 cursor-pointer group"
                        onClick={() => setFilters(prev => ({ ...prev, favoritesOnly: false }))}
                      >
                        <Heart className="h-3 w-3 mr-1" />
                        Favorites
                        <X className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Badge>
                    )}
                    
                    {filters.hasImages && (
                      <Badge variant="secondary" className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 cursor-pointer group"
                        onClick={() => setFilters(prev => ({ ...prev, hasImages: false }))}
                      >
                        <Image className="h-3 w-3 mr-1" />
                        With Images
                        <X className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Badge>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-6 mt-6 space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Mood Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Mood
                      </Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between bg-white/80 dark:bg-gray-800/80">
                            {filters.mood ? filterOptions.mood.find(m => m.value === filters.mood)?.label : 'Any mood'}
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, mood: '' }))}>
                            Any mood
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {filterOptions.mood.map((mood) => (
                            <DropdownMenuItem
                              key={mood.value}
                              onClick={() => setFilters(prev => ({ ...prev, mood: mood.value }))}
                            >
                              {mood.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {/* Time Range Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Time Period
                      </Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between bg-white/80 dark:bg-gray-800/80">
                            {filterOptions.timeRange.find(t => t.value === filters.timeRange)?.label}
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          {filterOptions.timeRange.map((time) => (
                            <DropdownMenuItem
                              key={time.value}
                              onClick={() => setFilters(prev => ({ ...prev, timeRange: time.value }))}
                            >
                              {time.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {/* Location Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </Label>
                      <Input
                        placeholder="Filter by location..."
                        value={filters.location}
                        onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                        className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60"
                      />
                    </div>
                    
                    {/* People Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        People
                      </Label>
                      <Input
                        placeholder="Filter by people..."
                        value={filters.people}
                        onChange={(e) => setFilters(prev => ({ ...prev, people: e.target.value }))}
                        className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60"
                      />
                    </div>
                  </div>
                  
                  {/* Quick Filter Toggles */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant={filters.favoritesOnly ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilters(prev => ({ ...prev, favoritesOnly: !prev.favoritesOnly }))}
                      className="rounded-full"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Favorites Only
                    </Button>
                    
                    <Button
                      variant={filters.hasImages ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilters(prev => ({ ...prev, hasImages: !prev.hasImages }))}
                      className="rounded-full"
                    >
                      <Image className="h-4 w-4 mr-2" />
                      With Images
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Results Section */}
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {isSearching ? 'Searching...' : `Found ${searchResults.length} memories`}
                </h2>
                {searchQuery && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Results for "<span className="font-semibold text-blue-600 dark:text-blue-400">{searchQuery}</span>"
                  </p>
                )}
              </div>
              
              {searchResults.length > 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Sorted by {filterOptions.sortBy.find(s => s.value === sortBy)?.label}
                </div>
              )}
            </div>
            
            {/* Loading State */}
            {isSearching && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-2xl mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Search Results */}
            {!isSearching && searchResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((memory, index) => (
                  <Card 
                    key={memory.id} 
                    className="group bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-700/90 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden animate-fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {memory.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          {memory.isFavorite && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Heart className="h-4 w-4 text-red-500 fill-current" />
                              </TooltipTrigger>
                              <TooltipContent>Favorite memory</TooltipContent>
                            </Tooltip>
                          )}
                          {memory.images > 0 && (
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                  <Image className="h-3 w-3" />
                                  {memory.images}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>{memory.images} images</TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(memory.date)}
                        </span>
                        {memory.location && (
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="h-3 w-3" />
                            {memory.location}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                        {memory.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          <Badge className={`text-xs px-2 py-1 ${getMoodColor(memory.mood)}`}>
                            {memory.mood}
                          </Badge>
                          {memory.tags.slice(0, 2).map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="secondary" 
                              className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation()
                                addTagFilter(tag)
                              }}
                            >
                              #{tag}
                            </Badge>
                          ))}
                          {memory.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs px-2 py-1">
                              +{memory.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                      
                      {memory.people && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Users className="h-3 w-3" />
                          <span className="truncate">{memory.people}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {/* No Results */}
            {!isSearching && searchResults.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  No memories found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button 
                  variant="outline" 
                  onClick={clearAllFilters}
                  className="rounded-xl"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </TooltipProvider>
  )
}

export default SearchInterface
