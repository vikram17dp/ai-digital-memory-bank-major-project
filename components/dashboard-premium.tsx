"use client"

import { motion } from "framer-motion"
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
  Zap
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DashboardPremiumProps {
  userName?: string
}

export function DashboardPremium({ userName = "Vikram" }: DashboardPremiumProps) {
  // Mock data - replace with actual data from props/API
  const stats = [
    { 
      label: "Total Memories", 
      value: "127", 
      change: "+12", 
      trend: "up",
      icon: Brain,
      color: "from-cyan-500 to-blue-500"
    },
    { 
      label: "This Week", 
      value: "18", 
      change: "+6", 
      trend: "up",
      icon: Calendar,
      color: "from-violet-500 to-purple-500"
    },
    { 
      label: "Positive Vibes", 
      value: "82%", 
      change: "+5%", 
      trend: "up",
      icon: Heart,
      color: "from-green-400 to-emerald-500"
    },
    { 
      label: "Growth Rate", 
      value: "24%", 
      change: "+8%", 
      trend: "up",
      icon: TrendingUp,
      color: "from-pink-500 to-rose-500"
    },
  ]

  const recentMemories = [
    {
      id: 1,
      title: "Morning meditation breakthrough",
      date: "Today, 7:30 AM",
      mood: "Peaceful",
      moodColor: "bg-green-400",
      tags: ["mindfulness", "growth"],
      excerpt: "Realized the importance of being present in the moment..."
    },
    {
      id: 2,
      title: "Coffee chat with an old friend",
      date: "Yesterday, 3:15 PM",
      mood: "Joyful",
      moodColor: "bg-yellow-400",
      tags: ["friendship", "nostalgia"],
      excerpt: "Reconnected after years and felt the warmth of true friendship..."
    },
    {
      id: 3,
      title: "Project milestone achieved",
      date: "2 days ago",
      mood: "Accomplished",
      moodColor: "bg-blue-400",
      tags: ["work", "achievement"],
      excerpt: "Finally shipped the feature I've been working on..."
    },
  ]

  const analytics = [
    { label: "Most Common Mood", value: "Peaceful", icon: "🧘" },
    { label: "Top Tag", value: "#growth", icon: "🌱" },
    { label: "Most Active Day", value: "Tuesday", icon: "📅" },
  ]

  const quickActions = [
    { 
      label: "Add Memory", 
      icon: Plus, 
      gradient: "from-cyan-500 to-blue-500",
      pulse: false 
    },
    { 
      label: "Search", 
      icon: Search, 
      gradient: "from-violet-500 to-purple-500",
      pulse: false 
    },
    { 
      label: "Analytics", 
      icon: BarChart3, 
      gradient: "from-pink-500 to-rose-500",
      pulse: true 
    },
    { 
      label: "AI Chat", 
      icon: MessageSquare, 
      gradient: "from-green-400 to-emerald-500",
      pulse: false 
    },
  ]

  // Dynamic greeting based on time and positivity
  const positivityScore = 82 // Replace with actual calculation
  const getGreeting = () => {
    const hour = new Date().getHours()
    let timeGreeting = "Hello"
    
    if (hour < 12) timeGreeting = "Good morning"
    else if (hour < 18) timeGreeting = "Good afternoon"
    else timeGreeting = "Good evening"

    let moodMessage = "Your mind is a garden of positive thoughts"
    if (positivityScore >= 80) moodMessage = "Your energy is radiating positivity today"
    else if (positivityScore >= 60) moodMessage = "You're doing great, keep growing"
    else if (positivityScore >= 40) moodMessage = "Every moment is a new beginning"
    
    return { timeGreeting, moodMessage }
  }

  const { timeGreeting, moodMessage } = getGreeting()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0C10] via-[#111827] to-[#0A0C10] text-[#F9FAFB] p-6 md:p-8 lg:p-12">
      {/* Subtle background animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto relative z-10 space-y-8"
      >
        {/* Welcome Card */}
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-cyan-500/10 via-violet-500/10 to-pink-500/10 backdrop-blur-xl shadow-2xl shadow-cyan-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            <div className="relative p-8 md:p-10">
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-7 h-7 text-cyan-400" />
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                  {timeGreeting}, {userName}
                </h1>
              </div>
              <p className="text-[#94A3B8] text-lg md:text-xl font-light">
                {moodMessage}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <Card className="relative overflow-hidden border-0 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 blur-2xl`} />
                  <div className="relative p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-0 text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                    <div className="text-[#94A3B8] text-sm font-medium">{stat.label}</div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Recent Memories Feed */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Brain className="w-6 h-6 text-cyan-400" />
                Recent Memories
              </h2>
              <Button 
                variant="ghost" 
                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
              >
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {recentMemories.map((memory, index) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ x: 8, transition: { duration: 0.2 } }}
                >
                  <Card className="border-0 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            {memory.title}
                            <span className={`w-2 h-2 ${memory.moodColor} rounded-full shadow-lg`} />
                          </h3>
                          <p className="text-[#94A3B8] text-sm leading-relaxed">
                            {memory.excerpt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {memory.tags.map(tag => (
                            <Badge 
                              key={tag} 
                              className="bg-violet-500/20 text-violet-300 border-0 text-xs"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-[#94A3B8] text-xs">{memory.date}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Analytics Preview + Pro Tip */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Analytics Summary */}
            <Card className="border-0 bg-gradient-to-br from-violet-500/10 to-pink-500/10 backdrop-blur-xl shadow-lg">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-violet-400" />
                  Quick Insights
                </h3>
                <div className="space-y-4">
                  {analytics.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div>
                        <div className="text-xs text-[#94A3B8] mb-1">{item.label}</div>
                        <div className="font-semibold">{item.value}</div>
                      </div>
                      <span className="text-2xl">{item.icon}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Pro Tip Card */}
            <Card className="border-0 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-cyan-500/10 backdrop-blur-xl shadow-lg">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-bold">Daily Reflection</h3>
                </div>
                <p className="text-[#94A3B8] leading-relaxed text-sm mb-4">
                  Your memories show a pattern of growth on Tuesdays. Consider scheduling important reflections on this day to maximize clarity.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg shadow-green-500/20"
                >
                  Learn More
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
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
                  transition={{ delay: index * 0.1 + 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className={`
                      relative w-full h-24 rounded-2xl border-0 overflow-hidden
                      bg-gradient-to-br ${action.gradient}
                      shadow-lg hover:shadow-2xl
                      transition-all duration-300
                      ${action.pulse ? 'animate-pulse' : ''}
                    `}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                    <div className="relative flex flex-col items-center gap-2">
                      <Icon className="w-6 h-6 text-white" />
                      <span className="text-sm font-semibold text-white">{action.label}</span>
                    </div>
                  </Button>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
