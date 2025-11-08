"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMood } from "@/contexts/MoodContext"
import { useUser } from "@clerk/nextjs"
import { motion, useAnimation } from "framer-motion"
import { 
  Brain, BookOpen, Heart, TrendingUp, Calendar, Clock,
  Search, BarChart3, MessageSquare, Sparkles,
  PlusCircle, ChevronRight, Loader2
} from 'lucide-react'
import { DashboardMemoryCard } from './dashboard-memory-card'

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
  images?: string[]
  imageUrl?: string | null
  createdAt: string
  updatedAt: string | null
  isFavorite?: boolean
}

interface DashboardContentRefinedProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
  user?: User
}

const sampleMemories: Memory[] = [
  {
    id: '1',
    title: 'Morning Coffee Reflection',
    content: 'Had an amazing cup of coffee today while reading about new React patterns.',
    tags: ['personal', 'learning', 'morning'],
    sentiment: 'positive',
    createdAt: new Date().toISOString(),
    updatedAt: null,
  },
  {
    id: '2',
    title: 'Team Meeting Success',
    content: 'Great productive team meeting today. We aligned on the project roadmap.',
    tags: ['work', 'team', 'productivity'],
    sentiment: 'positive',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: null,
  },
  {
    id: '3',
    title: 'Weekend Planning',
    content: 'Planning a hiking trip for this weekend. Looking forward to nature.',
    tags: ['personal', 'nature', 'friends'],
    sentiment: 'positive',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: null,
  },
]

export function DashboardContentRefined({ 
  activeSection = 'dashboard', 
  onSectionChange = () => {}, 
  user 
}: DashboardContentRefinedProps) {
  const { currentMood } = useMood()
  const { user: clerkUser } = useUser()
  const [mounted, setMounted] = useState(false)
  const [recentMemories, setRecentMemories] = useState<Memory[]>([])
  const [loadingMemories, setLoadingMemories] = useState(true)
  const [stats, setStats] = useState({
    totalMemories: 0,
    weekMemories: 0,
    positiveVibes: 75,
    growthRate: 15.2
  })
  
  const controls = useAnimation()

  // Fetch recent memories
  useEffect(() => {
    async function fetchRecentMemories() {
      if (!clerkUser?.id) return
      
      try {
        setLoadingMemories(true)
        const response = await fetch('/api/memories/list?limit=3', {
          headers: {
            'x-user-id': clerkUser.id
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.memories) {
            setRecentMemories(data.memories)
            setStats(prev => ({
              ...prev,
              totalMemories: data.total || 0
            }))
          }
        }
      } catch (error) {
        // Silently fail - show empty state
      } finally {
        setLoadingMemories(false)
      }
    }

    fetchRecentMemories()
  }, [clerkUser?.id])

  useEffect(() => {
    setMounted(true)
    controls.start("visible")
  }, [controls])

  const useCountUp = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0)
    
    useEffect(() => {
      if (!mounted) return
      
      let startTime: number | null = null
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) {
          window.requestAnimationFrame(step)
        }
      }
      window.requestAnimationFrame(step)
    }, [end, duration, mounted])
    
    return count
  }

  const totalMemoriesCount = useCountUp(stats.totalMemories, 2000)
  const weekMemoriesCount = useCountUp(stats.weekMemories, 1800)
  const positiveVibesCount = useCountUp(stats.positiveVibes, 2200)
  const growthRateCount = useCountUp(stats.growthRate, 2400)

  const statsDisplay = [
    { 
      label: "Total Memories", 
      value: totalMemoriesCount, 
      suffix: "",
      change: "+12%", 
      icon: Brain
    },
    { 
      label: "This Week", 
      value: weekMemoriesCount, 
      suffix: "",
      change: "+33%", 
      icon: Calendar
    },
    { 
      label: "Positive Vibes", 
      value: positiveVibesCount, 
      suffix: "%",
      change: "+8%", 
      icon: Heart
    },
    { 
      label: "Growth Rate", 
      value: growthRateCount, 
      suffix: "%",
      change: "+2.1%", 
      icon: TrendingUp
    },
  ]

  const quickActions = [
    { label: 'Add Memory', icon: PlusCircle, action: 'add' },
    { label: 'Search', icon: Search, action: 'search' },
    { label: 'Analytics', icon: BarChart3, action: 'analytics' },
    { label: 'AI Chat', icon: MessageSquare, action: 'chat' }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <div 
      className="relative w-full min-h-full"
      style={{
        background: 'var(--bg-main)',
        color: 'var(--text-primary)'
      }}
    >
      <div className="relative flex flex-col gap-6 md:gap-8 px-4 md:px-8 lg:px-12 pt-8 md:pt-10 lg:pt-12 pb-10 max-w-[1920px] mx-auto gpu-accelerated">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants}>
          <Card 
            className="relative overflow-hidden border-0 backdrop-blur-xl shadow-lg"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border)'
            }}
          >
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                background: `linear-gradient(135deg, var(--accent) 0%, transparent 50%, var(--accent-secondary) 100%)`
              }}
            />
            <div className="relative p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
                <div>
                  <h1 
                    className="text-xl md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Welcome back, {user?.firstName || 'Vikram'}!
                  </h1>
                  <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
                    Here's what's happening with your memories today
                  </p>
                </div>
                <div 
                  className="flex items-center gap-2 md:gap-4 text-xs md:text-sm flex-wrap"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    <span className="whitespace-nowrap">
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <Badge
                    className="text-[10px] md:text-xs border-0 whitespace-nowrap"
                    style={{
                      background: 'var(--accent)',
                      color: '#fff'
                    }}
                  >
                    {currentMood} mode
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 md:mt-8"
        >
          {statsDisplay.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ 
                  scale: 1.02,
                  y: -6,
                  transition: { duration: 0.3 }
                }}
                className="group gpu-accelerated"
              >
                <Card 
                  className="relative overflow-hidden border backdrop-blur-xl transition-all duration-300"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <div 
                    className="absolute -top-10 -right-10 w-16 h-16 opacity-5 blur-2xl group-hover:opacity-10 transition-opacity duration-500" 
                    style={{
                      background: 'var(--accent)'
                    }}
                  />
                  
                  <CardContent className="relative p-3 md:p-4">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <div 
                        className="p-1.5 md:p-2 rounded-lg shadow-md"
                        style={{
                          background: 'var(--accent)'
                        }}
                      >
                        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                      </div>
                      <Badge 
                        className="bg-green-500/20 text-green-300 border-0 text-[9px] md:text-[10px] font-medium px-1.5 md:px-2 py-0.5"
                      >
                        {stat.change}
                      </Badge>
                    </div>
                    
                    <div className="space-y-0.5 md:space-y-1">
                      <div 
                        className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {mounted ? stat.value : 0}{stat.suffix}
                      </div>
                      <div 
                        className="text-[10px] md:text-xs font-medium tracking-wide"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Main Content Grid - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 md:mt-8">
          {/* Recent Memories - Takes 2/3 width on desktop */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card 
              className="border backdrop-blur-xl"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2 
                    className="text-lg md:text-xl font-bold flex items-center gap-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <Brain className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--accent)' }} />
                    Recent Memories
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="hover:bg-[var(--bg-hover)] text-[var(--accent)] text-xs md:text-sm"
                    onClick={() => onSectionChange('memories')}
                  >
                    View all
                    <ChevronRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>

                {/* Loading State */}
                {loadingMemories && (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent)' }} />
                  </div>
                )}

                {/* Empty State */}
                {!loadingMemories && recentMemories.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" style={{ color: 'var(--accent)' }} />
                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-4">
                      No memories yet. Start capturing your moments!
                    </p>
                    <Button
                      onClick={() => onSectionChange('add')}
                      className="bg-gradient-to-r"
                      style={{
                        background: 'var(--accent)',
                        color: '#fff'
                      }}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Your First Memory
                    </Button>
                  </div>
                )}

                {/* Memory List */}
                {!loadingMemories && recentMemories.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {recentMemories.map((memory, index) => (
                      <DashboardMemoryCard
                        key={memory.id}
                        memory={memory}
                        onClick={() => onSectionChange('memories')}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Right Column - Analytics & Actions */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Analytics Snapshot */}
            <Card 
              className="border backdrop-blur-xl"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="p-4 md:p-6">
                <h3 
                  className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <BarChart3 className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--accent)' }} />
                  Analytics
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Most Active Day
                    </span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Tuesday
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Popular Tags
                    </span>
                    <div className="flex gap-1">
                      <Badge 
                        variant="secondary" 
                        className="text-xs border-0"
                        style={{
                          backgroundColor: 'var(--bg-hover)',
                          color: 'var(--accent)'
                        }}
                      >
                        #personal
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className="text-xs border-0"
                        style={{
                          backgroundColor: 'var(--bg-hover)',
                          color: 'var(--accent)'
                        }}
                      >
                        #work
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Memory Streak
                    </span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      7 days 🔥
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card 
              className="border backdrop-blur-xl"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="p-4 md:p-6">
                <h3 
                  className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--accent)' }} />
                  Quick Actions
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, i) => (
                    <motion.button
                      key={action.action}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 + 1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 gpu-accelerated"
                      style={{
                        background: 'var(--bg-card)',
                        borderColor: 'var(--border)'
                      }}
                      onClick={() => onSectionChange(action.action)}
                    >
                      <div 
                        className="p-2 rounded-lg"
                        style={{
                          background: 'var(--accent)'
                        }}
                      >
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <span 
                        className="text-xs font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {action.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Pro Tip */}
            <Card 
              className="border backdrop-blur-xl"
              style={{
                background: 'var(--bg-hover)',
                borderColor: 'var(--accent)',
                boxShadow: `0 0 30px var(--glow)`
              }}
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  <h3 
                    className="text-lg font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Pro Tip
                  </h3>
                </div>
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  You've logged memories 5 days straight — consistency builds happiness 💙
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
      </div>
    </div>
  )
}
