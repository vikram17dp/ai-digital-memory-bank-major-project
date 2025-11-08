"use client"

import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Brain, 
  TrendingUp, 
  Sparkles, 
  Heart, 
  Calendar, 
  Search, 
  MessageSquare,
  BarChart3,
  Plus,
  Zap,
  ArrowRight,
  Clock,
  Smile
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mood-based gradient configurations
const moodGradients = {
  calm: "from-[#0B0E14] via-[#1E3A8A]/20 to-[#0B0E14]",
  focused: "from-[#0B0E14] via-[#6B21A8]/20 to-[#0B0E14]",
  positive: "from-[#0B0E14] via-[#065F46]/20 to-[#0B0E14]",
  neutral: "from-[#0B0E14] via-[#1F2937]/20 to-[#0B0E14]"
}

interface DashboardFuturisticProps {
  userName?: string
  userAvatar?: string
  userId?: string
  currentMood?: "calm" | "focused" | "positive" | "neutral"
}

export function DashboardFuturistic({ 
  userName = "Vikram",
  userAvatar = "",
  userId,
  currentMood = "positive"
}: DashboardFuturisticProps) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalMemories: 0,
    weekMemories: 0,
    positiveVibes: 0,
    growthRate: 0
  })
  const [recentMemories, setRecentMemories] = useState<any[]>([])
  const controls = useAnimation()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    controls.start("visible")
  }, [controls])

  // Fetch user stats
  useEffect(() => {
    async function fetchUserData() {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        // Fetch memories
        const memoriesRes = await fetch('/api/memories/list')
        const memoriesData = await memoriesRes.json()
        
        if (memoriesData.success && memoriesData.memories) {
          const memories = memoriesData.memories
          setRecentMemories(memories.slice(0, 3))
          
          // Calculate stats
          const total = memories.length
          const now = new Date()
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          const thisWeek = memories.filter((m: any) => 
            new Date(m.createdAt) > weekAgo
          ).length
          
          // Calculate positive vibes (assuming sentiment in memories)
          const positiveMoods = ['happy', 'joyful', 'peaceful', 'accomplished', 'excited', 'grateful']
          const positiveCount = memories.filter((m: any) => 
            positiveMoods.some(mood => m.mood?.toLowerCase().includes(mood))
          ).length
          const positivePercentage = total > 0 ? Math.round((positiveCount / total) * 100) : 0
          
          // Calculate growth rate (compare with previous week)
          const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
          const previousWeek = memories.filter((m: any) => {
            const date = new Date(m.createdAt)
            return date > twoWeeksAgo && date <= weekAgo
          }).length
          const growth = previousWeek > 0 ? Math.round(((thisWeek - previousWeek) / previousWeek) * 100) : 0
          
          setStats({
            totalMemories: total,
            weekMemories: thisWeek,
            positiveVibes: positivePercentage,
            growthRate: growth > 0 ? growth : 0
          })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  // Count-up animation hook
  const useCountUp = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0)
    
    useEffect(() => {
      if (!mounted || loading) return
      
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
    }, [end, duration, mounted, loading])
    
    return count
  }

  // Stats with count-up
  const totalMemoriesCount = useCountUp(stats.totalMemories, 2000)
  const weekMemoriesCount = useCountUp(stats.weekMemories, 1800)
  const positiveVibesCount = useCountUp(stats.positiveVibes, 2200)
  const growthRateCount = useCountUp(stats.growthRate, 2400)

  const statsDisplay = [
    { 
      label: "Total Memories", 
      value: totalMemoriesCount, 
      suffix: "",
      change: stats.totalMemories > 0 ? `+${stats.totalMemories}` : "0", 
      icon: Brain,
      gradient: "from-[#00C6FF] to-[#0072FF]",
      glow: "shadow-[0_0_30px_rgba(0,198,255,0.2)]"
    },
    { 
      label: "This Week", 
      value: weekMemoriesCount, 
      suffix: "",
      change: stats.weekMemories > 0 ? `+${stats.weekMemories}` : "0", 
      icon: Calendar,
      gradient: "from-[#8B5CF6] to-[#EC4899]",
      glow: "shadow-[0_0_30px_rgba(139,92,246,0.2)]"
    },
    { 
      label: "Positive Vibes", 
      value: positiveVibesCount, 
      suffix: "%",
      change: stats.positiveVibes > 0 ? `+${stats.positiveVibes}%` : "0%", 
      icon: Heart,
      gradient: "from-[#22C55E] to-[#10B981]",
      glow: "shadow-[0_0_30px_rgba(34,197,94,0.2)]"
    },
    { 
      label: "Growth Rate", 
      value: growthRateCount, 
      suffix: "%",
      change: stats.growthRate > 0 ? `+${stats.growthRate}%` : "0%", 
      icon: TrendingUp,
      gradient: "from-[#EC4899] to-[#F43F5E]",
      glow: "shadow-[0_0_30px_rgba(236,72,153,0.2)]"
    },
  ]

  // Format memory data
  const formattedMemories = recentMemories.map((memory: any) => {
    const moodColors: Record<string, { bg: string, glow: string }> = {
      happy: { bg: "bg-yellow-400", glow: "shadow-[0_0_10px_rgba(250,204,21,0.5)]" },
      joyful: { bg: "bg-yellow-400", glow: "shadow-[0_0_10px_rgba(250,204,21,0.5)]" },
      peaceful: { bg: "bg-green-500", glow: "shadow-[0_0_10px_rgba(34,197,94,0.5)]" },
      calm: { bg: "bg-blue-400", glow: "shadow-[0_0_10px_rgba(59,130,246,0.5)]" },
      accomplished: { bg: "bg-blue-500", glow: "shadow-[0_0_10px_rgba(59,130,246,0.5)]" },
      excited: { bg: "bg-orange-400", glow: "shadow-[0_0_10px_rgba(251,146,60,0.5)]" },
      grateful: { bg: "bg-pink-400", glow: "shadow-[0_0_10px_rgba(244,114,182,0.5)]" },
    }
    
    const moodKey = memory.mood?.toLowerCase() || 'calm'
    const colors = moodColors[moodKey] || moodColors.calm
    
    // Calculate read time based on content length
    const wordCount = memory.content?.split(' ').length || 0
    const readTime = Math.max(1, Math.ceil(wordCount / 200)) // 200 words per minute
    
    // Format date
    const date = new Date(memory.createdAt)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    let formattedDate = ''
    if (diffMins < 60) formattedDate = `${diffMins} min ago`
    else if (diffHours < 24) formattedDate = `${diffHours} hours ago`
    else if (diffDays === 0) formattedDate = 'Today'
    else if (diffDays === 1) formattedDate = 'Yesterday'
    else if (diffDays < 7) formattedDate = `${diffDays} days ago`
    else formattedDate = date.toLocaleDateString()
    
    return {
      id: memory._id,
      title: memory.title || 'Untitled Memory',
      date: formattedDate,
      mood: memory.mood || 'Calm',
      moodColor: colors.bg,
      moodGlow: colors.glow,
      tags: memory.tags || [],
      excerpt: memory.content?.substring(0, 150) + '...' || '',
      readTime: `${readTime} min`
    }
  })

  const weeklyTrend = [
    { day: "Mon", value: 65 },
    { day: "Tue", value: 72 },
    { day: "Wed", value: 68 },
    { day: "Thu", value: 85 },
    { day: "Fri", value: 82 },
    { day: "Sat", value: 90 },
    { day: "Sun", value: 88 },
  ]

  const popularTags = ["#growth", "#mindfulness", "#work", "#friendship", "#reflection"]
  const mostActiveDay = "Tuesday"

  const quickActions = [
    { 
      label: "Add Memory", 
      icon: Plus, 
      gradient: "from-[#00C6FF] to-[#0072FF]",
      description: "Capture this moment",
      path: "/dashboard?addMemory=true"
    },
    { 
      label: "Search", 
      icon: Search, 
      gradient: "from-[#8B5CF6] to-[#EC4899]",
      description: "Find past memories",
      path: "/dashboard?search=true"
    },
    { 
      label: "Analytics", 
      icon: BarChart3, 
      gradient: "from-[#EC4899] to-[#F43F5E]",
      description: "View your growth",
      pulse: true,
      path: "/analytics"
    },
    { 
      label: "AI Chat", 
      icon: MessageSquare, 
      gradient: "from-[#22C55E] to-[#10B981]",
      description: "Talk to Memo",
      path: "/dashboard?ai=true"
    },
  ]

  const aiQuotes = [
    "The mind is a garden. Today, you're planting seeds of positivity.",
    "Your reflections are building a map of your inner world.",
    "Five days of consistency — you're cultivating lasting happiness.",
    "Every memory captured is a gift to your future self."
  ]

  const [currentQuote] = useState(aiQuotes[2])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    else if (hour < 18) return "Good afternoon"
    else return "Good evening"
  }

  // Animation variants
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  const heroVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${moodGradients[currentMood]} text-[#F9FAFB] relative overflow-hidden`}>
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Motion grid background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-8 lg:p-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div variants={heroVariants} className="mb-8">
            <Card className="relative overflow-hidden border-0 bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-cyan-500/5">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.1),transparent_50%)]" />
              
              <div className="relative p-8 md:p-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(0,198,255,0.3)]">
                      <AvatarImage src={userAvatar} />
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xl font-bold">
                        {userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                          {getGreeting()}, {userName}
                        </h1>
                        <motion.span
                          animate={{ rotate: [0, 14, -8, 14, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          className="text-3xl"
                        >
                          🌞
                        </motion.span>
                      </div>
                      <p className="text-[#9CA3AF] text-base flex items-center gap-2">
                        <Smile className="w-4 h-4" />
                        Feeling {currentMood} today
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Assistant Quote */}
                <motion.div 
                  className="relative p-5 rounded-2xl bg-white/[0.05] border border-cyan-500/20"
                  whileHover={{ scale: 1.01, borderColor: "rgba(0,198,255,0.4)" }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="flex-shrink-0"
                    >
                      <Sparkles className="w-6 h-6 text-cyan-400" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-cyan-400 mb-1 tracking-wide">
                        Daily Reflection from Memo
                      </p>
                      <p className="text-[#E5E7EB] leading-relaxed">
                        {currentQuote}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Stats Row - Glass Cards with Glow */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8"
          >
            {statsDisplay.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.15,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -8,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  className="group"
                >
                  <Card className={`relative overflow-hidden border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-500 ${stat.glow} hover:shadow-[0_0_40px_rgba(0,198,255,0.25)]`}>
                    {/* Gradient blob */}
                    <div className={`absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br ${stat.gradient} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500`} />
                    
                    <div className="relative p-4 md:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <Badge className="bg-green-500/20 text-green-300 border-0 text-[10px] font-medium px-2 py-0.5">
                          {stat.change}
                        </Badge>
                      </div>
                      
                      <div className="space-y-0.5">
                        <div className="text-3xl md:text-4xl font-bold tracking-tight">
                          {mounted && !loading ? stat.value : 0}{stat.suffix}
                        </div>
                        <div className="text-[#9CA3AF] text-xs font-medium tracking-wide">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8 mb-8">
            {/* Recent Memories Feed */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2 tracking-tight">
                  <Brain className="w-6 h-6 text-cyan-400" />
                  Recent Memories
                </h2>
                <Button 
                  variant="ghost" 
                  className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 transition-colors"
                >
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-[#9CA3AF]">
                    Loading your memories...
                  </div>
                ) : formattedMemories.length === 0 ? (
                  <Card className="border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
                    <div className="p-8 text-center">
                      <Brain className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
                      <p className="text-[#9CA3AF] mb-4">No memories yet. Start capturing your moments!</p>
                      <Button 
                        onClick={() => router.push('/dashboard?addMemory=true')}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Memory
                      </Button>
                    </div>
                  </Card>
                ) : formattedMemories.map((memory, index) => (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 + 0.4, duration: 0.6 }}
                    whileHover={{ 
                      x: 8,
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Card className="group border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.06] hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(0,198,255,0.15)] transition-all duration-500 cursor-pointer">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold group-hover:text-cyan-300 transition-colors">
                                {memory.title}
                              </h3>
                              <span className={`w-2.5 h-2.5 ${memory.moodColor} ${memory.moodGlow} rounded-full`} />
                            </div>
                            <p className="text-[#9CA3AF] text-sm leading-relaxed mb-3 line-clamp-2 group-hover:line-clamp-none transition-all">
                              {memory.excerpt}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2 flex-wrap">
                            {memory.tags.map(tag => (
                              <Badge 
                                key={tag} 
                                className="bg-violet-500/20 text-violet-300 border-0 text-xs hover:bg-violet-500/30 transition-colors"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-[#9CA3AF]">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {memory.readTime}
                            </span>
                            <span>{memory.date}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Analytics Snapshot */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Weekly Trend */}
              <Card className="border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl shadow-lg">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-violet-400" />
                    Analytics Snapshot
                  </h3>
                  
                  {/* Mini line chart */}
                  <div className="mb-6">
                    <p className="text-xs text-[#9CA3AF] mb-3 uppercase tracking-wider">
                      Weekly Mood Trend
                    </p>
                    <div className="flex items-end justify-between h-24 gap-2">
                      {weeklyTrend.map((day, i) => (
                        <motion.div
                          key={day.day}
                          className="flex flex-col items-center flex-1"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          transition={{ delay: i * 0.1 + 0.8 }}
                        >
                          <motion.div 
                            className="w-full bg-gradient-to-t from-cyan-500 to-violet-500 rounded-t-lg relative group cursor-pointer"
                            style={{ height: `${day.value}%` }}
                            whileHover={{ scale: 1.1, opacity: 1 }}
                          >
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                              {day.value}%
                            </span>
                          </motion.div>
                          <span className="text-[10px] text-[#9CA3AF] mt-2">
                            {day.day}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Most Active Day */}
                  <div className="mb-6 p-4 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                    <div className="text-xs text-[#9CA3AF] mb-2 uppercase tracking-wider">
                      Most Active Day
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold">{mostActiveDay}</div>
                      <span className="text-2xl">📅</span>
                    </div>
                  </div>

                  {/* Popular Tags */}
                  <div className="mb-4">
                    <div className="text-xs text-[#9CA3AF] mb-3 uppercase tracking-wider">
                      Popular Tags
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag, i) => (
                        <motion.div
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 + 1 }}
                        >
                          <Badge className="bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-300 border-0 px-3 py-1.5 text-xs font-medium shadow-[0_0_15px_rgba(0,198,255,0.15)] hover:shadow-[0_0_25px_rgba(0,198,255,0.25)] transition-shadow cursor-pointer">
                            {tag}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* View Full Analytics Button */}
                  <motion.div
                    animate={{ 
                      boxShadow: [
                        "0 0 0px rgba(236,72,153,0)",
                        "0 0 20px rgba(236,72,153,0.4)",
                        "0 0 0px rgba(236,72,153,0)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Button 
                      onClick={() => router.push('/analytics')}
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 shadow-lg group"
                    >
                      View Full Analytics
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </div>
              </Card>

              {/* Pro Tip / Motivation Card */}
              <Card className="border border-green-500/20 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-cyan-500/10 backdrop-blur-xl shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <Sparkles className="w-5 h-5 text-green-400" />
                    </motion.div>
                    <h3 className="text-lg font-bold">Pro Tip</h3>
                  </div>
                  <p className="text-[#9CA3AF] leading-relaxed text-sm mb-5">
                    You've logged memories 5 days straight — consistency builds happiness 💙
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500/80 to-emerald-500/80 hover:from-green-500 hover:to-emerald-500 text-white border-0 shadow-lg shadow-green-500/20"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions Grid */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 tracking-tight">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 1.2 }}
                    whileHover={{ scale: 1.08, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    {action.pulse && (
                      <motion.div
                        className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-pink-500 to-rose-500 blur-xl"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                    <Button
                      onClick={() => router.push(action.path)}
                      className={`
                        relative w-full h-32 rounded-[24px] border-0 overflow-hidden
                        bg-gradient-to-br ${action.gradient}
                        shadow-[0_0_30px_rgba(0,198,255,0.2)]
                        hover:shadow-[0_0_40px_rgba(0,198,255,0.35)]
                        transition-all duration-300
                      `}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_70%)]" />
                      <div className="relative flex flex-col items-center gap-3 z-10">
                        <Icon className="w-7 h-7 text-white drop-shadow-lg" />
                        <div className="text-center">
                          <div className="text-base font-bold text-white tracking-wide mb-1">
                            {action.label}
                          </div>
                          <div className="text-[10px] text-white/80 tracking-wide">
                            {action.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
