"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ChatInterface from "./chat-interface"
import { AddMemoryForm } from "./add-memory-form"
import SearchInterface from "./search-interface"
import { ProfileContent } from "./profile-content"
import { MemoryCard } from "./memory-card"
// Simple Avatar implementation
const Avatar: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => (
  <div className={`relative inline-flex shrink-0 overflow-hidden ${className}`}>
    {children}
  </div>
)

const AvatarImage: React.FC<{src?: string, alt?: string}> = ({ src, alt }) => (
  src ? <img className="aspect-square h-full w-full object-cover" src={src} alt={alt} /> : null
)

const AvatarFallback: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full ${className}`}>
    {children}
  </div>
)
import { 
  Brain, BookOpen, Heart, TrendingUp, Calendar, Target, Clock, 
  Plus, Search, Filter, ChevronRight, MessageSquare, BarChart3,
  PlusCircle, Settings, Upload, Sparkles, User, ChevronLeft
} from 'lucide-react'
import AnalyticsPage from './analytics-page'
import SettingsPage from './settings-client'
import { MemoriesPage } from './memories-page'

interface User {
  id: string
  firstName: string | null
  lastName: string | null
  emailAddress: string
  imageUrl: string
}

interface Memory {
  id: string
  title: string | null
  content: string
  tags: string[]
  sentiment: string | null
  mood?: string | null
  location?: string | null
  people?: string | null
  imageUrl?: string | null
  images?: string[]
  isFavorite?: boolean
  isPrivate?: boolean
  createdAt: string
  updatedAt: string | null
  date?: string
  userId?: string
}

interface Insights {
  totalMemories: number
  sentimentBreakdown: {
    positive: number
    negative: number
    neutral: number
  }
  topTags: {
    tag: string
    count: number
  }[]
  recentTrends: {
    thisWeek: number
    lastWeek: number
  }
}

interface DashboardContentProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
  user?: User
  memories?: Memory[]
  insights?: Insights
}

// Sample data for demo
const sampleMemories: Memory[] = [
  {
    id: '1',
    title: 'Morning Coffee Reflection',
    content: 'Had an amazing cup of coffee today while reading about new React patterns. The combination of caffeine and learning really energized me for the day ahead.',
    tags: ['personal', 'learning', 'morning'],
    sentiment: 'positive',
    createdAt: new Date().toISOString(),
    updatedAt: null,
  },
  {
    id: '2',
    title: 'Team Meeting Success',
    content: 'Great productive team meeting today. We aligned on the project roadmap and everyone was engaged. Really feeling good about our direction.',
    tags: ['work', 'team', 'productivity'],
    sentiment: 'positive',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: null,
  },
  {
    id: '3',
    title: 'Weekend Planning',
    content: 'Planning a hiking trip for this weekend. Looking forward to disconnecting from technology and enjoying nature with friends.',
    tags: ['personal', 'nature', 'friends'],
    sentiment: 'positive',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: null,
  },
  {
    id: '4',
    title: 'Learning Progress',
    content: 'Completed another chapter in my TypeScript course. The advanced types section was challenging but rewarding. Building better, type-safe applications.',
    tags: ['learning', 'typescript', 'development'],
    sentiment: 'positive',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: null,
  }
]

const sampleInsights: Insights = {
  totalMemories: 24,
  sentimentBreakdown: { positive: 18, negative: 2, neutral: 4 },
  topTags: [
    { tag: 'personal', count: 8 },
    { tag: 'work', count: 6 },
    { tag: 'learning', count: 5 }
  ],
  recentTrends: { thisWeek: 4, lastWeek: 3 }
}

// Stats Card Component
const StatsCard: React.FC<{
  title: string
  value: string | number
  change?: string
  icon: React.ElementType
  gradient: string
  description?: string
}> = ({ title, value, change, icon: Icon, gradient, description }) => {
  return (
    <Card className="relative overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-5`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`h-8 w-8 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center text-xs text-green-600 dark:text-green-400">
            <TrendingUp className="mr-1 h-3 w-3" />
            {change}
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardContent({ activeSection = 'dashboard', onSectionChange = () => {}, user, memories = sampleMemories, insights = sampleInsights }: DashboardContentProps) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const memoriesPerPage = 9
  
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`
    } else if (user?.firstName) {
      return user.firstName[0]
    } else if (user?.emailAddress) {
      return user.emailAddress[0].toUpperCase()
    }
    return 'U'
  }
  
  // Pagination calculations
  const totalPages = Math.ceil(memories.length / memoriesPerPage)
  const startIndex = (currentPage - 1) * memoriesPerPage
  const endIndex = startIndex + memoriesPerPage
  const currentMemories = memories.slice(startIndex, endIndex)

  const renderDashboard = () => (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col p-4 space-y-4">
      {/* Welcome Header - Compact */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border border-border/50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10" />
        <div className="relative p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                <AvatarImage src={user?.imageUrl} alt={user?.firstName || 'User'} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Welcome back, {user?.firstName || 'Vikram'}!
                </h1>
                <p className="text-sm text-muted-foreground">
                  Here's what's happening with your memories today
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                {insights.recentTrends.thisWeek} memories this week
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Compact */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-border/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-5" />
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Memories</p>
                <p className="text-2xl font-bold">{insights.totalMemories}</p>
                <p className="text-xs text-green-600">+12% from last month</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-border/50">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-5" />
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">{insights.recentTrends.thisWeek}</p>
                <p className="text-xs text-green-600">+33% from last week</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-border/50">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 opacity-5" />
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Positive Vibes</p>
                <p className="text-2xl font-bold">75%</p>
                <p className="text-xs text-green-600">+8% improvement</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-border/50">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-5" />
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
                <p className="text-2xl font-bold">15.2%</p>
                <p className="text-xs text-green-600">+2.1% from last month</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area - Flexible */}
      <div className="flex-1 grid grid-cols-2 gap-4 min-h-[400px]">
        {/* Recent Memories */}
        <Card className="border-border/50 flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4" />
                Recent Memories
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onSectionChange('memories')}>
                View all
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <CardDescription className="text-xs">Your latest captured moments</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-3">
              {memories.slice(0, 4).map((memory) => (
                <div key={memory.id} className="border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm line-clamp-1">{memory.title}</h4>
                    <Badge className={`text-xs ${memory.sentiment === 'positive' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-800'}`}>
                      positive
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{memory.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(memory.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-1">
                      {memory.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs px-1">
                          #{tag}
                        </Badge>
                      ))}
                      {memory.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs px-1">
                          +1
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Analytics & Actions */}
        <div className="flex flex-col gap-4">
          {/* Analytics Summary */}
          <Card className="border-border/50 flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </CardTitle>
              <CardDescription className="text-xs">Memory insights and trends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Most Active Day</span>
                  <span className="text-sm font-medium">Tuesday</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Popular Tags</span>
                  <div className="flex gap-1">
                    <Badge variant="secondary" className="text-xs">#personal</Badge>
                    <Badge variant="secondary" className="text-xs">#work</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Memory Streak</span>
                  <span className="text-sm font-medium">7 days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Add Memory', icon: PlusCircle, gradient: 'from-green-500 to-emerald-500', action: 'add' },
                  { label: 'Search', icon: Search, gradient: 'from-blue-500 to-cyan-500', action: 'search' },
                  { label: 'Analytics', icon: BarChart3, gradient: 'from-purple-500 to-pink-500', action: 'analytics' },
                  { label: 'AI Chat', icon: MessageSquare, gradient: 'from-orange-500 to-red-500', action: 'chat' }
                ].map((action) => (
                  <Button
                    key={action.action}
                    variant="outline"
                    size="sm"
                    className="h-16 flex flex-col gap-1 hover:shadow-md transition-all duration-300"
                    onClick={() => onSectionChange(action.action)}
                  >
                    <div className={`h-6 w-6 rounded bg-gradient-to-r ${action.gradient} flex items-center justify-center`}>
                      <action.icon className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard()
      
      case 'memories':
        return (
          <div className="h-full overflow-y-auto">
            <MemoriesPage onSectionChange={onSectionChange} />
          </div>
        )
      
      case 'chat':
      case 'ai-chat':
        return (
          <div className="h-full overflow-hidden">
            <ChatInterface
              user={user}
              userData={{}}
              memories={memories}
              insights={insights}
              onSectionChange={onSectionChange}
            />
          </div>
        )
      
      case 'add':
      case 'add-memory':
        return (
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Add New Memory</h1>
              <p className="text-muted-foreground">Capture and preserve your precious moments</p>
            </div>
            <AddMemoryForm user={user} onSectionChange={onSectionChange} />
          </div>
        )
      
      case 'search':
        return (
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Search Memories</h1>
              <p className="text-muted-foreground">Find and explore your memories with advanced filtering</p>
            </div>
            <SearchInterface user={user} onSectionChange={onSectionChange} />
          </div>
        )
      
      case 'profile':
        return (
          <div className="h-full overflow-y-auto">
            <ProfileContent />
          </div>
        )
        case 'profile':
        return (
          <div className="h-full overflow-y-auto">
            <ProfileContent />
          </div>
        )

        case 'analytics':
        return (
          <div className="h-full overflow-y-auto">
            <AnalyticsPage />
          </div>
        )

       case 'settings':
      return (
        <div className="h-full overflow-y-auto">
          <SettingsPage />
        </div>
        );
      
      
      default:
        return (
          <div className="p-6 flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🚧</span>
                </div>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>
                  The {activeSection} section is under development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => onSectionChange('dashboard')}>
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return renderSection()
}
