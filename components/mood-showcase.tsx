"use client"

import { useMood } from "@/contexts/MoodContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Heart, Zap, TrendingUp, Brain } from "lucide-react"
import { motion } from "framer-motion"

/**
 * MoodShowcase - Visual demonstration of all mood theming patterns
 * 
 * Use this component as a reference for implementing mood-aware UI elements
 * across your application.
 */
export function MoodShowcase() {
  const { currentMood, moodColors, setMood } = useMood()

  const moods = [
    { id: "calm", label: "Calm", emoji: "🌊" },
    { id: "focused", label: "Focused", emoji: "🎯" },
    { id: "positive", label: "Positive", emoji: "🌈" },
    { id: "neutral", label: "Neutral", emoji: "⚖️" },
  ] as const

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-[#0B0E14] to-[#1a1a2e]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Mood Theming Showcase
          </h1>
          <p className="text-gray-400 text-lg">
            All UI patterns adapt dynamically to your emotional state
          </p>
        </motion.div>

        {/* Mood Selector */}
        <Card 
          className="p-6 border backdrop-blur-xl"
          style={{
            borderColor: `${moodColors.primary}30`,
            background: 'rgba(255,255,255,0.03)',
            boxShadow: `0 0 40px ${moodColors.glow}`
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles 
                className="w-8 h-8"
                style={{ color: moodColors.primary }}
              />
              <div>
                <h2 className="text-2xl font-bold">Current Mood: {currentMood}</h2>
                <p className="text-gray-400 text-sm">Click to switch moods instantly</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {moods.map((mood) => (
              <motion.button
                key={mood.id}
                onClick={() => setMood(mood.id)}
                className={`p-4 rounded-xl font-semibold transition-all ${
                  currentMood === mood.id ? 'scale-105' : 'scale-100 opacity-70'
                }`}
                style={{
                  background: currentMood === mood.id
                    ? `linear-gradient(135deg, ${moodColors.primary}, ${moodColors.secondary})`
                    : 'rgba(255,255,255,0.05)',
                  color: 'white',
                  boxShadow: currentMood === mood.id ? `0 8px 30px ${moodColors.glow}` : 'none'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-3xl mb-2">{mood.emoji}</div>
                <div className="text-sm">{mood.label}</div>
              </motion.button>
            ))}
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pattern 1: Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card 
              className="p-6 border backdrop-blur-xl"
              style={{
                borderColor: `${moodColors.primary}20`,
                background: 'rgba(255,255,255,0.03)',
                boxShadow: `0 0 25px ${moodColors.glow}`
              }}
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5" style={{ color: moodColors.primary }} />
                Stats Card Pattern
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className="p-4 rounded-lg backdrop-blur-sm"
                  style={{
                    background: `linear-gradient(135deg, ${moodColors.primary}15, ${moodColors.secondary}10)`,
                    border: `1px solid ${moodColors.primary}20`
                  }}
                >
                  <div className="text-3xl font-bold">127</div>
                  <div className="text-sm text-gray-400">Total Memories</div>
                </div>
                <div 
                  className="p-4 rounded-lg backdrop-blur-sm"
                  style={{
                    background: `linear-gradient(135deg, ${moodColors.primary}15, ${moodColors.secondary}10)`,
                    border: `1px solid ${moodColors.primary}20`
                  }}
                >
                  <div className="text-3xl font-bold">12</div>
                  <div className="text-sm text-gray-400">This Week</div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Pattern 2: Button Variants */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card 
              className="p-6 border backdrop-blur-xl"
              style={{
                borderColor: `${moodColors.primary}20`,
                background: 'rgba(255,255,255,0.03)'
              }}
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" style={{ color: moodColors.primary }} />
                Button Variants
              </h3>
              
              <div className="space-y-3">
                <button
                  className="w-full px-6 py-3 rounded-xl font-semibold text-white transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${moodColors.primary}, ${moodColors.secondary})`,
                    boxShadow: `0 4px 20px ${moodColors.glow}`
                  }}
                >
                  Primary Gradient
                </button>
                
                <button
                  className="w-full px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{
                    background: `${moodColors.primary}20`,
                    color: moodColors.primary,
                    border: `1px solid ${moodColors.primary}40`
                  }}
                >
                  Outlined
                </button>
              </div>
            </Card>
          </motion.div>

          {/* Pattern 3: Progress & Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card 
              className="p-6 border backdrop-blur-xl"
              style={{
                borderColor: `${moodColors.primary}20`,
                background: 'rgba(255,255,255,0.03)'
              }}
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" style={{ color: moodColors.primary }} />
                Progress Indicators
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Weekly Goal</span>
                    <span style={{ color: moodColors.primary }}>75%</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full"
                      style={{
                        background: `linear-gradient(90deg, ${moodColors.primary}, ${moodColors.secondary})`
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>

                <div className="flex items-end justify-between h-24 gap-2">
                  {[65, 72, 85, 90, 82].map((value, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-t-lg"
                      style={{
                        height: `${value}%`,
                        background: `linear-gradient(to top, ${moodColors.primary}, ${moodColors.secondary})`
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${value}%` }}
                      transition={{ delay: i * 0.1 + 0.6, duration: 0.5 }}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Pattern 4: Tags & Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card 
              className="p-6 border backdrop-blur-xl"
              style={{
                borderColor: `${moodColors.primary}20`,
                background: 'rgba(255,255,255,0.03)'
              }}
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" style={{ color: moodColors.primary }} />
                Tags & Badges
              </h3>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {['#growth', '#mindfulness', '#work', '#happiness', '#reflection'].map((tag, i) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 + 0.7 }}
                    >
                      <Badge
                        className="px-3 py-1.5 text-xs border-0 cursor-pointer"
                        style={{
                          background: `linear-gradient(135deg, ${moodColors.primary}30, ${moodColors.secondary}20)`,
                          color: moodColors.primary,
                          boxShadow: `0 0 15px ${moodColors.glow}`
                        }}
                      >
                        {tag}
                      </Badge>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <div 
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      background: `${moodColors.primary}20`,
                      color: moodColors.primary
                    }}
                  >
                    Status: Active
                  </div>
                  <div 
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      color: 'white'
                    }}
                  >
                    7 day streak 🔥
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Pattern 5: Animated Particle Background Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card 
            className="relative overflow-hidden p-12 border backdrop-blur-xl"
            style={{
              borderColor: `${moodColors.primary}20`,
              background: 'rgba(255,255,255,0.03)',
              minHeight: '300px'
            }}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute w-64 h-64 rounded-full blur-[80px]"
                style={{ 
                  backgroundColor: `${moodColors.primary}15`,
                  top: '20%',
                  left: '10%'
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute w-64 h-64 rounded-full blur-[80px]"
                style={{ 
                  backgroundColor: `${moodColors.secondary}15`,
                  bottom: '20%',
                  right: '10%'
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </div>

            <div className="relative z-10 text-center">
              <h3 className="text-3xl font-bold mb-4">Animated Background</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                The ambient particles in the background adapt to your mood, creating a subtle
                atmospheric effect that reinforces your emotional state.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Color Reference */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 border border-white/10 bg-white/[0.02] backdrop-blur-xl">
            <h3 className="text-lg font-bold mb-4">Current Color Palette</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <div 
                  className="h-20 rounded-lg mb-2"
                  style={{ backgroundColor: moodColors.primary }}
                />
                <div className="text-xs text-gray-400">Primary</div>
                <div className="text-xs font-mono">{moodColors.primary}</div>
              </div>
              
              <div>
                <div 
                  className="h-20 rounded-lg mb-2"
                  style={{ backgroundColor: moodColors.secondary }}
                />
                <div className="text-xs text-gray-400">Secondary</div>
                <div className="text-xs font-mono">{moodColors.secondary}</div>
              </div>
              
              <div>
                <div 
                  className="h-20 rounded-lg mb-2"
                  style={{ backgroundColor: moodColors.accent }}
                />
                <div className="text-xs text-gray-400">Accent</div>
                <div className="text-xs font-mono">{moodColors.accent}</div>
              </div>
              
              <div>
                <div 
                  className="h-20 rounded-lg mb-2"
                  style={{ 
                    background: `linear-gradient(135deg, ${moodColors.primary}, ${moodColors.secondary})`
                  }}
                />
                <div className="text-xs text-gray-400">Gradient</div>
                <div className="text-xs font-mono">Primary → Secondary</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm py-8">
          <p>🎨 All patterns automatically adapt to your current mood</p>
          <p className="mt-2">Switch between moods to see the instant transformation</p>
        </div>
      </div>
    </div>
  )
}
