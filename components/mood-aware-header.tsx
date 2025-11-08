"use client"

import { UserButton } from "@clerk/nextjs"
import { Brain, Search, Bell, Menu, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMood } from "@/contexts/MoodContext"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"

interface MoodAwareHeaderProps {
  onMenuToggle?: () => void
}

export function MoodAwareHeader({ onMenuToggle }: MoodAwareHeaderProps) {
  const { currentMood, setMood, moodColors, isDarkMode, toggleDarkMode } = useMood()
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Compute header background based on mode
  const getHeaderBg = () => {
    if (currentMood === 'normal' && !isDarkMode) {
      return 'rgba(255, 255, 255, 0.95)'
    }
    return 'rgba(11, 14, 20, 0.95)'
  }

  const getTextColor = () => {
    if (currentMood === 'normal' && !isDarkMode) {
      return 'text-gray-900'
    }
    return 'text-white'
  }

  const moods = [
    { id: "calm", label: "🌊 Calm", emoji: "🌊" },
    { id: "focused", label: "🎯 Focused", emoji: "🎯" },
    { id: "positive", label: "✨ Positive", emoji: "✨" },
    { id: "neutral", label: "⚖️ Neutral", emoji: "⚖️" },
    { id: "normal", label: "💻 Normal", emoji: "💻" },
  ] as const

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b backdrop-blur-2xl transition-colors duration-500"
      style={{ 
        borderColor: `${moodColors.primary}20`,
        backgroundColor: getHeaderBg()
      }}
    >
      {/* Stable gradient background - no animation to prevent flicker */}
      <div 
        className="absolute inset-0 opacity-10 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${moodColors.primary}, ${moodColors.secondary})`
        }}
      />
      
      <div className="relative flex h-16 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
        {/* Left Section - Logo & Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="md:hidden hover:bg-white/10 transition-all duration-200 rounded-xl"
            style={{ color: 'var(--text-primary)' }}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div 
              className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${moodColors.primary}, ${moodColors.secondary})`,
                boxShadow: `0 0 20px ${moodColors.glow}`
              }}
            >
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className={`hidden sm:inline-block text-xl font-bold ${getTextColor()} group-hover:opacity-80 transition-all duration-300`}>
              Memory Bank
            </span>
          </Link>
        </div>

        {/* Center Section - Mood Switcher */}
        <div className="hidden md:flex items-center gap-2 bg-white/[0.03] backdrop-blur-xl p-2 rounded-2xl border"
          style={{ borderColor: `${moodColors.primary}20` }}
        >
          {moods.map((mood) => (
            <motion.button
              key={mood.id}
              onClick={() => setMood(mood.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                currentMood === mood.id ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
              style={{
                background: currentMood === mood.id 
                  ? `linear-gradient(135deg, ${moodColors.primary}, ${moodColors.secondary})`
                  : 'transparent',
                boxShadow: currentMood === mood.id ? `0 4px 20px ${moodColors.glow}` : 'none',
                transform: 'translateZ(0)',
                willChange: 'transform'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mood.label}
            </motion.button>
          ))}
          
          {/* Dark/Light Toggle - Only in Normal Mode */}
          {currentMood === "normal" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={toggleDarkMode}
              className="ml-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300"
              style={{
                background: 'var(--bg-hover)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                transform: 'translateZ(0)',
                willChange: 'transform'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <div className="flex items-center gap-1.5">
                {isDarkMode ? (
                  <>
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light</span>
                  </>
                )}
              </div>
            </motion.button>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-3">
          {/* Expandable Search */}
          <motion.div
            className="relative"
            initial={false}
            animate={{ width: searchExpanded ? 240 : 40 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {!searchExpanded ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchExpanded(true)}
                className="hover:bg-white/10 transition-all duration-200 rounded-xl w-10 h-10 p-0"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Search className="h-5 w-5" />
              </Button>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => {
                    if (!searchQuery) setTimeout(() => setSearchExpanded(false), 150)
                  }}
                  autoFocus
                  placeholder="Search memories..."
                  className="w-full h-10 pl-10 pr-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    transform: 'translateZ(0)',
                    willChange: 'transform'
                  }}
                />
              </motion.div>
            )}
          </motion.div>

          {/* Actions Container */}
          <div className="flex items-center bg-white/[0.03] backdrop-blur-md border rounded-2xl px-3 py-1.5 space-x-2 shadow-lg h-12"
            style={{ 
              borderColor: `${moodColors.primary}15`,
              boxShadow: `0 0 20px ${moodColors.glow}`
            }}
          >

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative hover:bg-white/10 h-9 w-9 rounded-xl p-0 transition-all duration-200"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Bell className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center border border-gray-900 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${moodColors.primary}, ${moodColors.secondary})`
                }}
              >
                1
              </Badge>
            </Button>

            {/* Separator */}
            <div className="w-px h-6 bg-gray-700/50" />

            {/* User Menu */}
            <div className="flex items-center">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9 ring-2 hover:scale-105 transition-all duration-300",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Mood Switcher */}
      <div className="md:hidden px-4 pb-3">
        <div className="flex items-center gap-2 bg-white/[0.03] backdrop-blur-xl p-2 rounded-xl border overflow-x-auto"
          style={{ borderColor: `${moodColors.primary}20` }}
        >
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => setMood(mood.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                currentMood === mood.id ? 'text-white' : 'text-gray-400'
              }`}
              style={{
                background: currentMood === mood.id 
                  ? `linear-gradient(135deg, ${moodColors.primary}, ${moodColors.secondary})`
                  : 'transparent'
              }}
            >
              {mood.emoji}
            </button>
          ))}
          
          {/* Mobile Dark/Light Toggle - Only in Normal Mode */}
          {currentMood === "normal" && (
            <button
              onClick={toggleDarkMode}
              className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 bg-white/5 text-gray-400 hover:text-white border border-white/10 flex items-center gap-1.5"
            >
              {isDarkMode ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
              {isDarkMode ? "Dark" : "Light"}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
