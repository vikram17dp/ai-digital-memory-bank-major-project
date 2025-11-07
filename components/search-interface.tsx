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
import { MemoryCard } from './memory-card'

interface SearchInterfaceProps {
  user?: any
  userData?: any
  memories?: any[]
  insights?: any
  onSectionChange?: (section: string) => void
}

// Mock memories removed - using real data from API

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

// Recent searches will be generated dynamically from user's actual searches

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
  const [apiMemories, setApiMemories] = useState<any[]>([])
  const [isLoadingMemories, setIsLoadingMemories] = useState(false)
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
  const actualMemories = memories || apiMemories
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Fetch memories from API if not provided via props
  useEffect(() => {
    const fetchMemories = async () => {
      if (memories) {
        // Use memories from props if provided
        setApiMemories(memories)
        setSearchResults(memories)
      } else if (user?.id) {
        // Fetch from API if not provided
        setIsLoadingMemories(true)
        try {
          const response = await fetch('/api/memories/list', {
            headers: {
              'x-user-id': user.id,
            },
          })
          const data = await response.json()
          if (data.success && data.memories) {
            console.log('[Search] Loaded memories from API:', data.memories.length)
            setApiMemories(data.memories)
            setSearchResults(data.memories)
            
            // Generate search history from user's actual data
            const userSearchTerms: string[] = []
            data.memories.forEach((mem: any) => {
              // Add unique locations
              if (mem.location && !userSearchTerms.includes(mem.location)) {
                userSearchTerms.push(mem.location)
              }
              // Add unique tags (first few)
              if (mem.tags && Array.isArray(mem.tags)) {
                mem.tags.slice(0, 2).forEach((tag: string) => {
                  if (!userSearchTerms.includes(tag)) {
                    userSearchTerms.push(tag)
                  }
                })
              }
            })
            // Keep only first 5 unique terms
            setSearchHistory(userSearchTerms.slice(0, 5))
          }
        } catch (error) {
          console.error('[Search] Failed to fetch memories:', error)
        } finally {
          setIsLoadingMemories(false)
        }
      }
    }
    fetchMemories()
  }, [memories, user?.id])

  // Check if date is within time range
  const isWithinTimeRange = (memoryDate: string, timeRange: string) => {
    const now = new Date()
    const memoryDateTime = new Date(memoryDate)
    
    switch (timeRange) {
      case 'today':
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        return memoryDateTime >= today && memoryDateTime < tomorrow
      
      case 'week':
        const weekAgo = new Date(now)
        weekAgo.setDate(weekAgo.getDate() - 7)
        return memoryDateTime >= weekAgo
      
      case 'month':
        const monthAgo = new Date(now)
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        return memoryDateTime >= monthAgo
      
      case 'year':
        const yearAgo = new Date(now)
        yearAgo.setFullYear(yearAgo.getFullYear() - 1)
        return memoryDateTime >= yearAgo
      
      case 'all':
      default:
        return true
    }
  }

  // Generate dynamic suggestions based on search query
  const generateSuggestions = (query: string) => {
    if (!query || query.length < 2) return []
    
    const searchTerm = query.toLowerCase()
    const suggestions = []
    
    // Add matching tags
    const allTags = Array.from(new Set(actualMemories.flatMap(m => m.tags)))
    const matchingTags = allTags
      .filter(tag => tag.toLowerCase().includes(searchTerm))
      .slice(0, 3)
    
    suggestions.push(...matchingTags)
    
    // Add matching locations (if available)
    const allLocations = Array.from(new Set(actualMemories.filter(m => m.location).map(m => m.location!)))
    const matchingLocations = allLocations
      .filter(location => location.toLowerCase().includes(searchTerm))
      .slice(0, 2)
    
    suggestions.push(...matchingLocations)
    
    // Add matching people (if available)
    const allPeople = Array.from(new Set(actualMemories.filter(m => m.people).flatMap(m => 
      m.people!.split(',').map(p => p.trim())
    )))
    const matchingPeople = allPeople
      .filter(person => person.toLowerCase().includes(searchTerm))
      .slice(0, 2)
    
    suggestions.push(...matchingPeople)
    
    // Remove duplicates and limit to 5
    return Array.from(new Set(suggestions)).slice(0, 5)
  }

  // Enhanced search with debouncing and improved filtering
  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsSearching(true)
      
      // Generate dynamic suggestions
      const dynamicSuggestions = generateSuggestions(searchQuery)
      setSuggestions(dynamicSuggestions)
      setShowSuggestions(true)
      
      // Simulate search delay with debouncing
      const searchTimer = setTimeout(() => {
        const filtered = actualMemories.filter(memory => {
          // Search query matching
          const searchTerm = searchQuery.toLowerCase()
          const matchesQuery = 
            (memory.title || '').toLowerCase().includes(searchTerm) ||
            memory.content.toLowerCase().includes(searchTerm) ||
            memory.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            (memory.location || '').toLowerCase().includes(searchTerm) ||
            (memory.people || '').toLowerCase().includes(searchTerm)
          
          // Filter matching
          const matchesMood = !filters.mood || memory.mood === filters.mood
          const matchesTags = filters.tags.length === 0 || filters.tags.every(tag => memory.tags.includes(tag))
          const matchesLocation = !filters.location || (memory.location || '').toLowerCase().includes(filters.location.toLowerCase())
          const matchesPeople = !filters.people || (memory.people || '').toLowerCase().includes(filters.people.toLowerCase())
          const matchesImages = !filters.hasImages || (memory.images && memory.images.length > 0) || memory.imageUrl
          const matchesFavorites = !filters.favoritesOnly || memory.isFavorite
          const matchesTimeRange = isWithinTimeRange(memory.date || memory.createdAt, filters.timeRange)
          
          return matchesQuery && matchesMood && matchesTags && matchesLocation && matchesPeople && matchesImages && matchesFavorites && matchesTimeRange
        })
        
        // Enhanced sorting
        const sorted = [...filtered].sort((a, b) => {
          switch (sortBy) {
            case 'date-desc':
              return new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime()
            case 'date-asc':
              return new Date(a.date || a.createdAt).getTime() - new Date(b.date || b.createdAt).getTime()
            case 'favorites':
              if (a.isFavorite && !b.isFavorite) return -1
              if (!a.isFavorite && b.isFavorite) return 1
              return new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime()
            case 'title':
              return (a.title || '').localeCompare(b.title || '')
            default:
              return 0
          }
        })
        
        setSearchResults(sorted)
        setIsSearching(false)
      }, 300)
      
      return () => clearTimeout(searchTimer)
    } else {
      // Apply filters even when no search query
      console.log('[Search] Filtering with:', { filters, totalMemories: actualMemories.length })
      
      const filtered = actualMemories.filter(memory => {
        const matchesMood = !filters.mood || memory.mood === filters.mood
        const matchesTags = filters.tags.length === 0 || filters.tags.every(tag => memory.tags.includes(tag))
        const matchesLocation = !filters.location || (memory.location || '').toLowerCase().includes(filters.location.toLowerCase())
        const matchesPeople = !filters.people || (memory.people || '').toLowerCase().includes(filters.people.toLowerCase())
        const matchesImages = !filters.hasImages || (memory.images && memory.images.length > 0) || memory.imageUrl
        const matchesFavorites = !filters.favoritesOnly || memory.isFavorite
        const matchesTimeRange = isWithinTimeRange(memory.date || memory.createdAt, filters.timeRange)
        
        // Debug individual memory
        if (filters.location && memory.location) {
          console.log('[Search] Checking:', {
            memoryTitle: memory.title,
            memoryLocation: memory.location,
            filterLocation: filters.location,
            matchesLocation,
            memoryPeople: memory.people,
            filterPeople: filters.people,
            matchesPeople
          })
        }
        
        return matchesMood && matchesTags && matchesLocation && matchesPeople && matchesImages && matchesFavorites && matchesTimeRange
      })
      
      console.log('[Search] Filtered results:', filtered.length)
      
      // Sort filtered results
      const sorted = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'date-desc':
            return new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime()
          case 'date-asc':
            return new Date(a.date || a.createdAt).getTime() - new Date(b.date || b.createdAt).getTime()
          case 'favorites':
            if (a.isFavorite && !b.isFavorite) return -1
            if (!a.isFavorite && b.isFavorite) return 1
            return new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime()
          case 'title':
            return (a.title || '').localeCompare(b.title || '')
          default:
            return 0
        }
      })
      
      setSearchResults(sorted)
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
    
    // Focus out of search input to close suggestions
    if (searchInputRef.current) {
      searchInputRef.current.blur()
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
        <div className="max-w-6xl mx-auto px-4 lg:px-0">
          {/* Search Section */}
          <Card className="bg-card border-border mb-4 lg:mb-6">
            <CardContent className="p-4 lg:p-6">
              {/* Main Search Bar */}
              <div className="relative mb-4 lg:mb-6">
                {/* Mobile Search Bar */}
                <div className="block lg:hidden mb-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className={`h-4 w-4 transition-all duration-200 ${
                        isSearching ? 'text-blue-500 animate-pulse scale-110' : 'text-gray-400'
                      }`} />
                    </div>
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search memories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => {
                        setTimeout(() => setShowSuggestions(false), 200)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchQuery.trim()) {
                          handleSearch(searchQuery)
                        }
                        if (e.key === 'Escape') {
                          setShowSuggestions(false)
                          searchInputRef.current?.blur()
                        }
                      }}
                      className="pl-10 pr-4 h-12 text-base bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60 transition-all duration-300 shadow-sm w-full"
                    />
                  </div>
                  
                  {/* Mobile Filter and Sort Row */}
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex-1 h-10 px-4 rounded-xl bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ${
                        showFilters ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' : ''
                      }`}
                    >
                      <Filter className={`h-4 w-4 mr-1 transition-transform duration-200 ${
                        showFilters ? 'rotate-180' : ''
                      }`} />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge className="ml-1 h-4 w-4 p-0 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                          {React.createElement(filterOptions.sortBy.find(s => s.value === sortBy)?.icon || SortDesc, {
                            className: "h-4 w-4 mr-1"
                          })}
                          Sort
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 animate-fadeIn">
                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {filterOptions.sortBy.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => setSortBy(option.value)}
                            className={`transition-all duration-200 ${sortBy === option.value ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                          >
                            <option.icon className="h-4 w-4 mr-2" />
                            {option.label}
                            {sortBy === option.value && (
                              <Badge className="ml-auto bg-blue-500">Active</Badge>
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Desktop Search Bar */}
                <div className="hidden lg:flex items-center gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className={`h-5 w-5 transition-all duration-200 ${
                        isSearching ? 'text-blue-500 animate-pulse scale-110' : 'text-gray-400'
                      }`} />
                    </div>
                    <Input
                      type="text"
                      placeholder="Search memories, tags, locations, people..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => {
                        setTimeout(() => setShowSuggestions(false), 200)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchQuery.trim()) {
                          handleSearch(searchQuery)
                        }
                        if (e.key === 'Escape') {
                          setShowSuggestions(false)
                          searchInputRef.current?.blur()
                        }
                      }}
                      className="pl-12 pr-4 h-14 text-lg bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.01] focus:scale-[1.01]"
                    />
                    
                  {/* Search Suggestions */}
                  {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl lg:rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn backdrop-blur-md">
                      {searchQuery.length > 0 && suggestions.length > 0 && (
                        <div className="p-3 lg:p-4 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 lg:mb-3">
                            <Zap className="h-4 w-4 text-blue-500" />
                            Smart Suggestions
                          </div>
                          <div className="space-y-1">
                            {suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onMouseDown={(e) => {
                                  e.preventDefault()
                                  handleSearch(suggestion)
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300"
                              >
                                <span className="font-medium">#{suggestion}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {searchQuery.length === 0 && searchHistory.length > 0 && (
                        <div className="p-3 lg:p-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 lg:mb-3">
                            <Clock className="h-4 w-4 text-green-500" />
                            Recent Searches
                          </div>
                          <div className="space-y-1">
                            {searchHistory.map((search, index) => (
                              <button
                                key={index}
                                onMouseDown={(e) => {
                                  e.preventDefault()
                                  handleSearch(search)
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                              >
                                <Search className="h-3 w-3 inline mr-2 text-gray-400" />
                                {search}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                  
                  {/* Desktop Filter Toggle */}
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`h-14 px-6 rounded-2xl bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 relative transform hover:scale-105 hover:shadow-md ${
                      showFilters ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 scale-105 shadow-md' : ''
                    }`}
                  >
                    <Filter className={`h-5 w-5 mr-2 transition-transform duration-200 ${
                      showFilters ? 'rotate-180' : ''
                    }`} />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 h-5 w-5 p-0 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center animate-pulse">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                  
                  {/* Desktop Sort Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-14 px-6 rounded-2xl bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-md">
                        {React.createElement(filterOptions.sortBy.find(s => s.value === sortBy)?.icon || SortDesc, {
                          className: "h-5 w-5 mr-2"
                        })}
                        Sort
                        <ChevronDown className="h-4 w-4 ml-2 transition-transform duration-200 group-hover:rotate-180" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 animate-fadeIn">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {filterOptions.sortBy.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                          className={`transition-all duration-200 ${sortBy === option.value ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                          <option.icon className="h-4 w-4 mr-2" />
                          {option.label}
                          {sortBy === option.value && (
                            <Badge className="ml-auto bg-blue-500">Active</Badge>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Active Filters Display */}
                {activeFiltersCount > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-3 lg:mt-4 animate-fadeIn">
                    <span className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400">Active filters:</span>
                    
                    {filters.mood && (
                      <Badge variant="secondary" className={`px-2 lg:px-3 py-1 text-xs ${getMoodColor(filters.mood)} cursor-pointer group transition-all duration-200 hover:scale-105`}
                        onClick={() => setFilters(prev => ({ ...prev, mood: '' }))}
                      >
                        <span className="hidden sm:inline">Mood: </span>{filterOptions.mood.find(m => m.value === filters.mood)?.label}
                        <X className="ml-1 lg:ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Badge>
                    )}
                    
                    {filters.timeRange !== 'all' && (
                      <Badge variant="secondary" className="px-2 lg:px-3 py-1 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 cursor-pointer group transition-all duration-200 hover:scale-105"
                        onClick={() => setFilters(prev => ({ ...prev, timeRange: 'all' }))}
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">{filterOptions.timeRange.find(t => t.value === filters.timeRange)?.label}</span>
                        <span className="sm:hidden">{filterOptions.timeRange.find(t => t.value === filters.timeRange)?.label.split(' ')[0]}</span>
                        <X className="ml-1 lg:ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Badge>
                    )}
                    
                    {filters.location && (
                      <Badge variant="secondary" className="px-2 lg:px-3 py-1 text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 cursor-pointer group transition-all duration-200 hover:scale-105"
                        onClick={() => setFilters(prev => ({ ...prev, location: '' }))}
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="max-w-[80px] truncate">{filters.location}</span>
                        <X className="ml-1 lg:ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Badge>
                    )}
                    
                    {filters.people && (
                      <Badge variant="secondary" className="px-2 lg:px-3 py-1 text-xs bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 cursor-pointer group transition-all duration-200 hover:scale-105"
                        onClick={() => setFilters(prev => ({ ...prev, people: '' }))}
                      >
                        <Users className="h-3 w-3 mr-1" />
                        <span className="max-w-[80px] truncate">{filters.people}</span>
                        <X className="ml-1 lg:ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Badge>
                    )}
                    
                    {filters.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="px-2 lg:px-3 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 cursor-pointer group transition-all duration-200 hover:scale-105"
                        onClick={() => removeTagFilter(tag)}
                      >
                        #{tag}
                        <X className="ml-1 lg:ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Badge>
                    ))}
                    
                    {filters.favoritesOnly && (
                      <Badge variant="secondary" className="px-2 lg:px-3 py-1 text-xs bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 cursor-pointer group transition-all duration-200 hover:scale-105"
                        onClick={() => setFilters(prev => ({ ...prev, favoritesOnly: false }))}
                      >
                        <Heart className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Favorites</span>
                        <span className="sm:hidden">Fav</span>
                        <X className="ml-1 lg:ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Badge>
                    )}
                    
                    {filters.hasImages && (
                      <Badge variant="secondary" className="px-2 lg:px-3 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 cursor-pointer group transition-all duration-200 hover:scale-105"
                        onClick={() => setFilters(prev => ({ ...prev, hasImages: false }))}
                      >
                        <Image className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">With Images</span>
                        <span className="sm:hidden">Images</span>
                        <X className="ml-1 lg:ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Badge>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200 hover:scale-105"
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4 lg:pt-6 mt-4 lg:mt-6 space-y-4 lg:space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {/* Mood Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-500" />
                        Mood
                      </Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between bg-white/80 dark:bg-gray-800/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-sm h-10 lg:h-auto">
                            <span className={`text-sm truncate ${filters.mood ? 'font-semibold' : ''}`}>
                              {filters.mood ? filterOptions.mood.find(m => m.value === filters.mood)?.label : 'Any mood'}
                            </span>
                            <ChevronDown className="h-4 w-4 transition-transform duration-200 flex-shrink-0" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full animate-fadeIn">
                          <DropdownMenuItem 
                            onClick={() => setFilters(prev => ({ ...prev, mood: '' }))}
                            className={!filters.mood ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold' : ''}
                          >
                            Any mood
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {filterOptions.mood.map((mood) => (
                            <DropdownMenuItem
                              key={mood.value}
                              onClick={() => setFilters(prev => ({ ...prev, mood: mood.value }))}
                              className={`transition-all duration-200 ${filters.mood === mood.value ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                            >
                              <div className={`w-3 h-3 rounded-full mr-2 ${mood.color.split(' ')[0]}`}></div>
                              {mood.label}
                              {filters.mood === mood.value && (
                                <Badge className="ml-auto bg-blue-500">Active</Badge>
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {/* Time Range Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        Time Period
                      </Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between bg-white/80 dark:bg-gray-800/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-sm h-10 lg:h-auto">
                            <span className={`text-sm truncate ${filters.timeRange !== 'all' ? 'font-semibold' : ''}`}>
                              {filterOptions.timeRange.find(t => t.value === filters.timeRange)?.label}
                            </span>
                            <ChevronDown className="h-4 w-4 transition-transform duration-200 flex-shrink-0" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full animate-fadeIn">
                          {filterOptions.timeRange.map((time) => (
                            <DropdownMenuItem
                              key={time.value}
                              onClick={() => setFilters(prev => ({ ...prev, timeRange: time.value }))}
                              className={`transition-all duration-200 ${filters.timeRange === time.value ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              {time.label}
                              {filters.timeRange === time.value && (
                                <Badge className="ml-auto bg-blue-500">Active</Badge>
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {/* Location Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-500" />
                        Location
                      </Label>
                      <Input
                        placeholder="Filter by location..."
                        value={filters.location}
                        onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                        className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60 transition-all duration-200 hover:shadow-sm focus:shadow-md h-10 lg:h-auto text-sm"
                      />
                    </div>
                    
                    {/* People Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Users className="h-4 w-4 text-violet-500" />
                        People
                      </Label>
                      <Input
                        placeholder="Filter by people..."
                        value={filters.people}
                        onChange={(e) => setFilters(prev => ({ ...prev, people: e.target.value }))}
                        className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60 transition-all duration-200 hover:shadow-sm focus:shadow-md h-10 lg:h-auto text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Quick Filter Toggles */}
                  <div className="flex flex-wrap gap-2 lg:gap-3">
                    <Button
                      variant={filters.favoritesOnly ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilters(prev => ({ ...prev, favoritesOnly: !prev.favoritesOnly }))}
                      className={`rounded-full transition-all duration-300 transform hover:scale-105 text-sm h-8 lg:h-auto px-3 lg:px-4 ${
                        filters.favoritesOnly 
                          ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-500/25' 
                          : 'hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-700 dark:hover:text-pink-300'
                      }`}
                    >
                      <Heart className={`h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 ${filters.favoritesOnly ? 'fill-current' : ''}`} />
                      <span className="hidden sm:inline">Favorites Only</span>
                      <span className="sm:hidden">Favs</span>
                      {filters.favoritesOnly && (
                        <Badge className="ml-1 lg:ml-2 bg-white/20 text-white text-xs">ON</Badge>
                      )}
                    </Button>
                    
                    <Button
                      variant={filters.hasImages ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilters(prev => ({ ...prev, hasImages: !prev.hasImages }))}
                      className={`rounded-full transition-all duration-300 transform hover:scale-105 text-sm h-8 lg:h-auto px-3 lg:px-4 ${
                        filters.hasImages 
                          ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25' 
                          : 'hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300'
                      }`}
                    >
                      <Image className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                      <span className="hidden sm:inline">With Images</span>
                      <span className="sm:hidden">Images</span>
                      {filters.hasImages && (
                        <Badge className="ml-1 lg:ml-2 bg-white/20 text-white text-xs">ON</Badge>
                      )}
                    </Button>
                    
                    {/* Quick Clear Button */}
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 transition-all duration-300 transform hover:scale-105 text-sm h-8 lg:h-auto px-3 lg:px-4"
                      >
                        <X className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                        <span className="hidden sm:inline">Clear All</span>
                        <span className="sm:hidden">Clear</span>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Results Section */}
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {isSearching ? 'Searching...' : `Found ${searchResults.length} memories`}
                </h2>
                {searchQuery && (
                  <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">
                    Results for "<span className="font-semibold text-blue-600 dark:text-blue-400">{searchQuery}</span>"
                  </p>
                )}
              </div>
              
              {searchResults.length > 0 && (
                <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 self-start sm:self-auto">
                  Sorted by {filterOptions.sortBy.find(s => s.value === sortBy)?.label}
                </div>
              )}
            </div>
            
            {/* Loading State */}
            {isSearching && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
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
            
            {/* Loading State */}
            {isLoadingMemories && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center animate-pulse">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Loading your memories...
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we fetch your memories
                </p>
              </div>
            )}
            
            {/* Search Results */}
            {!isSearching && !isLoadingMemories && searchResults.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {searchResults.map((memory, index) => (
                  <div
                    key={memory.id}
                    className="animate-fadeIn"
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <MemoryCard memory={memory} />
                  </div>
                ))}
              </div>
            )}
            
            {/* No Results */}
            {!isSearching && !isLoadingMemories && searchResults.length === 0 && (
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
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
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
        
        /* Smooth scrolling */
        * {
          scroll-behavior: smooth;
        }
        
        /* Enhanced card hover effects */
        .group:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </TooltipProvider>
  )
}

export default SearchInterface
