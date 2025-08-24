"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { SidebarNav } from "@/components/sidebar-nav-new"
import { MemoryTimeline } from "@/components/memory-timeline"
import { AddMemoryForm } from "@/components/add-memory-form"
import { ChatInterface } from "@/components/chat-interface"
import { MemoryInsights } from "@/components/memory-insights"
import { AIAssistant } from "@/components/ai-assistant"
import { MoodAnalytics } from "@/components/mood-analytics"
import { SearchInterface } from "@/components/search-interface"
import { AnalyticsView } from "@/components/analytics-view"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Clock, 
  Star, 
  TrendingUp, 
  BookOpen, 
  MessageSquare, 
  Heart,
  Calendar,
  Target,
  Zap
} from "lucide-react"

interface DashboardLayoutProps {
  user: {
    id: string
    firstName: string | null
    lastName: string | null
    emailAddress: string
    imageUrl: string
  }
  memories: Array<{
    id: string
    title: string
    content: string
    tags: string[]
    sentiment: string
    createdAt: string
    updatedAt: string | null
  }>
  totalMemories: number
  insights: {
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
}

export function DashboardLayout({ user, memories, totalMemories, insights }: DashboardLayoutProps) {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const handleMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const handleSidebarClose = () => {
    setIsMobileSidebarOpen(false)
  }

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user.firstName}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your memories today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Memories Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Memories</p>
                <p className="text-3xl font-bold text-foreground">{totalMemories.toLocaleString()}</p>
                <div className="flex items-center text-sm">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">+12% from last month</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Week Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">This Week</p>
                <p className="text-3xl font-bold text-foreground">{insights.recentTrends.thisWeek}</p>
                <div className="flex items-center text-sm">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">+5% from last week</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Favorites Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Favorites</p>
                <p className="text-3xl font-bold text-foreground">{Math.floor(totalMemories * 0.3)}</p>
                <div className="flex items-center text-sm">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">+8% from last month</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Growth Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Growth</p>
                <p className="text-3xl font-bold text-foreground">15.2%</p>
                <div className="flex items-center text-sm">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">+2.1% from last month</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Memories Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Memories</CardTitle>
            <Button variant="link" className="text-primary">
              View all →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {memories.slice(0, 3).map((memory) => (
              <Card key={memory.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between space-x-4">
                    <div className="space-y-2 flex-1">
                      <h3 className="font-semibold text-foreground">{memory.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{memory.content}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {new Date(memory.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center space-x-1">
                          {memory.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 bg-muted rounded text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary" 
                        className={
                          memory.sentiment === 'positive' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          memory.sentiment === 'negative' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                          'bg-muted text-muted-foreground'
                        }
                      >
                        {memory.sentiment || 'neutral'}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboardContent()
      case "memories":
        return <MemoryTimeline memories={memories} />
      case "search":
        return <SearchInterface />
      case "add":
        return <AddMemoryForm />
      case "chat":
        return <ChatInterface />
      case "analytics":
        return <AnalyticsView insights={insights} />
      case "settings":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage your preferences and account settings</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Settings page is under development.</p>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Page coming soon...</p>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header onMenuToggle={handleMenuToggle} />
      
      <div className="flex">
        {/* Sidebar */}
        <SidebarNav
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isOpen={isMobileSidebarOpen}
          onClose={handleSidebarClose}
        />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {renderContent()}
          </main>
          
          {/* Right Sidebar - AI Assistant & Analytics */}
          <aside className="hidden xl:block w-80 border-l border-border/40 bg-card/30 overflow-y-auto">
            <div className="p-6 space-y-6">
              <AIAssistant />
              <MoodAnalytics />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
