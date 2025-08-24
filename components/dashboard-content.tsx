"use client"

import { useState } from "react"
import { MemoryTimeline } from "@/components/memory-timeline"
import { AddMemoryForm } from "@/components/add-memory-form"
import { ChatInterface } from "@/components/chat-interface"
import { MemoryInsights } from "@/components/memory-insights"
import { AIAssistant } from "@/components/ai-assistant"
import { MoodAnalytics } from "@/components/mood-analytics"
import type { Memory } from "@prisma/client"
import { SearchInterface } from "./search-interface"
import { AnalyticsView } from "./analytics-view"
import { SidebarNav } from "./sidebar-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserButton } from "@clerk/nextjs"
import { Bell, Search as SearchIcon, Clock, Star, TrendingUp, BookOpen, MessageSquare, Heart, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MobileNav } from "./mobile-nav"

interface DashboardContentProps {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    emailAddress: string;
    imageUrl: string;
  };
  memories: Array<{
    id: string;
    title: string;
    content: string;
    tags: string[];
    sentiment: string;
    createdAt: string;
    updatedAt: string | null;
  }>;
  totalMemories: number;
  insights: {
    totalMemories: number;
    sentimentBreakdown: {
      positive: number;
      negative: number;
      neutral: number;
    };
    topTags: Array<{ tag: string; count: number }>;
    recentTrends: {
      thisWeek: number;
      lastWeek: number;
    };
  };
}

export function DashboardContent({ user, memories, totalMemories, insights }: DashboardContentProps) {
  const [activeSection, setActiveSection] = useState("dashboard")

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Welcome Header */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2">
                Welcome back, {user.firstName}
              </h1>
              <p className="text-gray-400 text-sm">
                Here's what's happening with your memories today
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Total Memories Card */}
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <BookOpen className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Total Memories</p>
                      <p className="text-2xl font-semibold text-foreground">{totalMemories.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-400">+12% from last month</span>
                  </div>
                </CardContent>
              </Card>

              {/* This Week Card */}
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">This Week</p>
                      <p className="text-2xl font-semibold text-foreground">{insights.recentTrends.thisWeek}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-400">+5% from last week</span>
                  </div>
                </CardContent>
              </Card>

              {/* Favorites Card */}
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Star className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Favorites</p>
                      <p className="text-2xl font-semibold text-foreground">{Math.floor(totalMemories * 0.3)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-400">+8% from last month</span>
                  </div>
                </CardContent>
              </Card>

              {/* Growth Card */}
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Growth</p>
                      <p className="text-2xl font-semibold text-foreground">15.2%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-400">+2.1% from last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Memories Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-white">Recent Memories</h2>
                <Button variant="link" className="text-cyan-400 text-sm p-0">
                  View all →
                </Button>
              </div>
              
              <div className="space-y-3">
                {memories.slice(0, 3).map((memory, index) => (
                  <div key={memory.id} className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-white mb-1">{memory.title}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2">{memory.content}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            memory.sentiment === 'positive' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            memory.sentiment === 'negative' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            'bg-gray-500/10 text-gray-400 border-gray-500/20'
                          }`}
                        >
                          {memory.sentiment || 'neutral'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {memory.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs text-gray-500">#{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(memory.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-3 w-3" />
                          <MessageSquare className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
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
      default:
        return <div className="glass-card rounded-xl p-6">Coming soon...</div>
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <SidebarNav activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-gray-900/90 border-b border-gray-700/50 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Mobile Nav + Search */}
            <div className="flex items-center gap-4 flex-1">
              {/* Mobile Navigation */}
              <MobileNav activeSection={activeSection} onSectionChange={setActiveSection} />
              
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search memories..." 
                    className="pl-10 bg-background/50 border-border/50" 
                  />
                </div>
              </div>
            </div>
            
            {/* Right Header Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
                <Bell className="h-4 w-4" />
                <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">1</Badge>
              </Button>
              <Button variant="outline" size="sm" className="sm:hidden">
                <Bell className="h-4 w-4" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-3 w-3 rounded-full p-0 text-xs flex items-center justify-center">1</Badge>
              </Button>
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user.emailAddress}</p>
                </div>
                <UserButton afterSignOutUrl="/" />
              </div>
              <div className="sm:hidden">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Center Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {renderContent()}
          </main>
          
          {/* Right Sidebar - AI Assistant & Analytics - hidden on mobile and tablet */}
          <aside className="hidden xl:block w-80 border-l border-border/40 bg-background/50 backdrop-blur-xl overflow-y-auto">
            <div className="p-6 space-y-6">
              <AIAssistant />
              <MoodAnalytics />
            </div>
          </aside>
        </div>
        
        {/* Mobile Bottom Sheet for AI Assistant & Analytics */}
        <div className="xl:hidden">
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AIAssistant />
              <MoodAnalytics />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}