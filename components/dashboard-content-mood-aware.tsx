"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMood } from "@/contexts/MoodContext"
import { motion, useAnimation } from "framer-motion"
import { 
  Brain, BookOpen, Heart, TrendingUp, Calendar, Clock,
  Plus, Search, BarChart3, MessageSquare, Sparkles,
  PlusCircle, ChevronRight
} from 'lucide-react'

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
  createdAt: string
  updatedAt: string | null
}

interface DashboardContentMoodAwareProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
  user?: User
}

// Sample data (replace with actual API calls)
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

export function DashboardContentMoodAware({ 
  activeSection = 'dashboard', 
  onSectionChange = () => {}, 
  user 
}: DashboardContentMoodAwareProps) {
  const { currentMood, moodColors, isDarkMode } = useMood()
  const isLightMode = currentMood === 'normal' && !isDarkMode
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({
    totalMemories: 127,
    weekMemories: 12,
    positiveVibes: 75,
    growthRate: 15.2
  })
  
  const controls = useAnimation()

  useEffect(() => {
    setMounted(true)
    controls.start("visible")
  }, [controls])

  // Count-up animation hook
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
      className="min-h-[calc(100vh-4rem)] p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto"
      style={{
        transform: 'translateZ(0)',
        willChange: 'transform, opacity',
        scrollBehavior: 'smooth'
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants}>
          <Card 
            className="relative overflow-hidden border-0 backdrop-blur-xl transition-all duration-700"
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderColor: `${moodColors.primary}20`,
              boxShadow: `0 0 40px ${moodColors.glow}`,
              transform: 'translateZ(0)',
              willChange: 'transform'
            }}
          >
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: `linear-gradient(135deg, ${moodColors.primary}30 0%, transparent 50%, ${moodColors.secondary}30 100%)`
              }}
            />
            <div className="relative p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                    Welcome back, {user?.firstName || 'Vikram'}!
                  </h1>
                  <p className={isLightMode ? 'text-gray-600' : 'text-gray-400'}>
                    Here's what's happening with your memories today
                  </p>
                </div>
                <div className={`flex items-center gap-4 text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric'
                    })}
                  </div>
                  <Badge
                    className="text-xs"
                    style={{
                      background: `${moodColors.primary}30`,
                      color: moodColors.primary,
                      border: 'none'
                    }}
                  >
                    {currentMood} mode
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid - REFINED SIZE (85-90%) */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
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
                  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                }}
                className="group"
              >
                <Card 
                  className="relative overflow-hidden border backdrop-blur-xl hover:bg-white/[0.06] transition-all duration-500"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderColor: `${moodColors.primary}15`,
                    boxShadow: `0 0 15px ${moodColors.glow.replace('0.3', '0.15')}`
                  }}
                >
                  {/* Gradient blob - minimal and elegant */}
                  <div 
                    className="absolute -top-10 -right-10 w-16 h-16 opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500" 
                    style={{
                      background: `linear-gradient(135deg, ${moodColors.primary}, ${moodColors.secondary})`
                    }}
                  />
                  
                  {/* Reduced padding by 10%: p-3.5 instead of p-4 */}
                  <CardContent className="relative p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <div 
                        className="p-1.5 rounded-lg shadow-md transition-all duration-500"
                        style={{
                          background: `linear-gradient(135deg, ${moodColors.primary}, ${moodColors.secondary})`
                        }}
                      >
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <Badge 
                        className="bg-green-500/20 text-green-300 border-0 text-[9px] font-medium px-1.5 py-0.5"
                      >
                        {stat.change}
                      </Badge>
                    </div>
                    
                    <div className="space-y-0.5">
                      <div className={`text-xl md:text-2xl font-bold tracking-tight ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                        {mounted ? stat.value : 0}{stat.suffix}
                      </div>
                      <div className={`text-[11px] font-medium tracking-wide ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        {stat.label}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Main Content Grid - Improved alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Memories - Takes 2/3 width on desktop */}
          <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col">
            <Card 
              className="border backdrop-blur-xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderColor: `${moodColors.primary}15`
              }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Brain className="w-5 h-5" style={{ color: moodColors.primary }} />
                    Recent Memories
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="hover:bg-white/10"
                    onClick={() => onSectionChange('memories')}
                  >
                    View all
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {sampleMemories.map((memory, index) => (
                    <motion.div
                      key={memory.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      whileHover={{ x: 4, scale: 1.01 }}
                      className="group"
                    >
                      <div 
                        className="p-4 rounded-xl border backdrop-blur-sm hover:bg-white/[0.05] transition-all duration-300 cursor-pointer"
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          borderColor: `${moodColors.primary}10`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = `${moodColors.primary}30`
                          e.currentTarget.style.boxShadow = `0 0 20px ${moodColors.glow}`
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = `${moodColors.primary}10`
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm line-clamp-1">{memory.title}</h4>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs">
                            positive
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2 mb-2">{memory.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {new Date(memory.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex gap-1">
                            {memory.tags.slice(0, 2).map((tag) => (
                              <Badge 
                                key={tag} 
                                variant="secondary" 
                                className="text-xs px-2"
                                style={{
                                  backgroundColor: `${moodColors.primary}20`,
                                  color: moodColors.primary,
                                  border: 'none'
                                }}
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right Column - Analytics & Actions - Takes 1/3 width on desktop */}
          <motion.div variants={itemVariants} className="space-y-6 flex flex-col">
            {/* Analytics Snapshot */}
            <Card 
              className="border backdrop-blur-xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderColor: `${moodColors.primary}15`
              }}
            >
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" style={{ color: moodColors.primary }} />
                  Analytics
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Most Active Day</span>
                    <span className="text-sm font-medium">Tuesday</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Popular Tags</span>
                    <div className="flex gap-1">
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                        style={{
                          backgroundColor: `${moodColors.primary}20`,
                          color: moodColors.primary
                        }}
                      >
                        #personal
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                        style={{
                          backgroundColor: `${moodColors.primary}20`,
                          color: moodColors.primary
                        }}
                      >
                        #work
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Memory Streak</span>
                    <span className="text-sm font-medium">7 days 🔥</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card 
              className="border backdrop-blur-xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderColor: `${moodColors.primary}15`
              }}
            >
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" style={{ color: moodColors.primary }} />
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
                      className="p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2"
                      style={{
                        background: `rgba(255,255,255,0.02)`,
                        borderColor: `${moodColors.primary}20`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${moodColors.primary}10`
                        e.currentTarget.style.borderColor = `${moodColors.primary}40`
                        e.currentTarget.style.boxShadow = `0 0 20px ${moodColors.glow}`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                        e.currentTarget.style.borderColor = `${moodColors.primary}20`
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                      onClick={() => onSectionChange(action.action)}
                    >
                      <div 
                        className="p-2 rounded-lg"
                        style={{
                          background: `linear-gradient(135deg, ${moodColors.primary}, ${moodColors.secondary})`
                        }}
                      >
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-medium">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Pro Tip */}
            <Card 
              className="border backdrop-blur-xl"
              style={{
                background: `${moodColors.primary}10`,
                borderColor: `${moodColors.primary}30`,
                boxShadow: `0 0 30px ${moodColors.glow}`
              }}
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5" style={{ color: moodColors.primary }} />
                  <h3 className="text-lg font-bold">Pro Tip</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  You've logged memories 5 days straight — consistency builds happiness 💙
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
