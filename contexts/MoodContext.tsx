"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

export type MoodType = "calm" | "focused" | "positive" | "neutral" | "normal"

interface MoodColors {
  primary: string
  secondary: string
  glow: string
  accent: string
  gradient: string
  bgGradient: string
  cardGlow: string
  textAccent: string
  buttonGradient: string
}

interface MoodContextType {
  currentMood: MoodType
  setMood: (mood: MoodType) => void
  moodColors: MoodColors
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const getMoodEmoji = (mood: MoodType): string => {
  const emojis = {
    calm: "🌊",
    focused: "🎯",
    positive: "✨",
    neutral: "⚖️",
    normal: "💻"
  }
  return emojis[mood]
}

const getMoodLabel = (mood: MoodType): string => {
  const labels = {
    calm: "Calm",
    focused: "Focused",
    positive: "Positive",
    neutral: "Neutral",
    normal: "Normal"
  }
  return labels[mood]
}

const moodPalettes: Record<MoodType, MoodColors> = {
  calm: {
    primary: "#0EA5E9",
    secondary: "#2563EB",
    glow: "rgba(14, 165, 233, 0.3)",
    accent: "#06B6D4",
    gradient: "from-[#0EA5E9] to-[#2563EB]",
    bgGradient: "from-[#0B0E14] via-[#1E3A8A]/15 to-[#0B0E14]",
    cardGlow: "shadow-[0_0_25px_rgba(14,165,233,0.15)]",
    textAccent: "text-cyan-400",
    buttonGradient: "from-cyan-500 to-blue-600"
  },
  focused: {
    primary: "#7C3AED",
    secondary: "#3B82F6",
    glow: "rgba(124, 58, 237, 0.3)",
    accent: "#A78BFA",
    gradient: "from-[#7C3AED] to-[#3B82F6]",
    bgGradient: "from-[#0B0E14] via-[#5B21B6]/15 to-[#0B0E14]",
    cardGlow: "shadow-[0_0_25px_rgba(124,58,237,0.15)]",
    textAccent: "text-violet-400",
    buttonGradient: "from-violet-600 to-blue-500"
  },
  positive: {
    primary: "#10B981",
    secondary: "#14B8A6",
    glow: "rgba(16, 185, 129, 0.3)",
    accent: "#34D399",
    gradient: "from-[#10B981] to-[#14B8A6]",
    bgGradient: "from-[#0B0E14] via-[#065F46]/15 to-[#0B0E14]",
    cardGlow: "shadow-[0_0_25px_rgba(16,185,129,0.15)]",
    textAccent: "text-emerald-400",
    buttonGradient: "from-emerald-500 to-teal-500"
  },
  neutral: {
    primary: "#1E293B",
    secondary: "#334155",
    glow: "rgba(30, 41, 59, 0.3)",
    accent: "#64748B",
    gradient: "from-[#1E293B] to-[#334155]",
    bgGradient: "from-[#0B0E14] via-[#1F2937]/15 to-[#0B0E14]",
    cardGlow: "shadow-[0_0_25px_rgba(30,41,59,0.15)]",
    textAccent: "text-slate-400",
    buttonGradient: "from-slate-700 to-slate-600"
  },
  normal: {
    primary: "#3B82F6",
    secondary: "#1E40AF",
    glow: "rgba(59, 130, 246, 0.3)",
    accent: "#60A5FA",
    gradient: "from-[#3B82F6] to-[#1E40AF]",
    bgGradient: "from-[#0B0E14] via-[#111827]/15 to-[#0B0E14]",
    cardGlow: "shadow-[0_0_25px_rgba(59,130,246,0.15)]",
    textAccent: "text-blue-400",
    buttonGradient: "from-blue-600 to-blue-800"
  }
}

const MoodContext = createContext<MoodContextType | undefined>(undefined)

export function MoodProvider({ children }: { children: ReactNode }) {
  const [currentMood, setCurrentMood] = useState<MoodType>("normal")
  const [moodColors, setMoodColors] = useState<MoodColors>(moodPalettes.normal)
  const [isDarkMode, setIsDarkMode] = useState(true)

  const setMood = (mood: MoodType) => {
    const previousMood = currentMood
    setCurrentMood(mood)
    setMoodColors(moodPalettes[mood])
    
    // Store mood preference in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("userMood", mood)
      
      // Apply theme data attribute to document element
      document.documentElement.setAttribute('data-theme', mood)
    }

    // Show toast notification
    if (previousMood !== mood) {
      toast.success(`${getMoodEmoji(mood)} Switched to ${getMoodLabel(mood)} mode`, {
        duration: 2500,
        position: "bottom-right",
        style: {
          background: "rgba(11, 14, 20, 0.95)",
          border: `1px solid ${moodPalettes[mood].primary}40`,
          color: "#fff",
          backdropFilter: "blur(16px)",
          boxShadow: `0 0 25px ${moodPalettes[mood].glow}`
        }
      })
    }
  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", newMode.toString())
      
      // Apply theme data attribute
      if (currentMood === 'normal') {
        if (newMode) {
          document.documentElement.setAttribute('data-theme', 'normal')
          document.documentElement.removeAttribute('data-light')
        } else {
          document.documentElement.setAttribute('data-theme', 'light')
          document.documentElement.setAttribute('data-light', 'true')
        }
      }
      
      // Also apply dark class for compatibility
      if (newMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }

    // Show toast
    toast.success(`${newMode ? "🌙" : "☀️"} Switched to ${newMode ? "Dark" : "Light"} mode`, {
      duration: 2500,
      position: "bottom-right",
      style: {
        background: newMode ? "rgba(11, 14, 20, 0.95)" : "rgba(249, 250, 251, 0.95)",
        border: `1px solid ${newMode ? "#3B82F6" : "#60A5FA"}40`,
        color: newMode ? "#fff" : "#111827",
        backdropFilter: "blur(16px)"
      }
    })
  }

  // Load mood and dark mode from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMood = localStorage.getItem("userMood") as MoodType
      const savedDarkMode = localStorage.getItem("darkMode")
      
      if (savedMood && moodPalettes[savedMood]) {
        setCurrentMood(savedMood)
        setMoodColors(moodPalettes[savedMood])
        
        // Apply theme attribute
        document.documentElement.setAttribute('data-theme', savedMood)
      } else {
        // Default to normal
        document.documentElement.setAttribute('data-theme', 'normal')
      }

      if (savedDarkMode !== null) {
        const isDark = savedDarkMode === "true"
        setIsDarkMode(isDark)
        
        // Apply light theme if in normal mode and not dark
        if (savedMood === 'normal' && !isDark) {
          document.documentElement.setAttribute('data-theme', 'light')
          document.documentElement.setAttribute('data-light', 'true')
        } else if (savedMood === 'normal' && isDark) {
          document.documentElement.removeAttribute('data-light')
        }
        
        if (isDark) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }
    }
  }, [])

  return (
    <MoodContext.Provider value={{ currentMood, setMood, moodColors, isDarkMode, toggleDarkMode }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMood}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </MoodContext.Provider>
  )
}

export function useMood() {
  const context = useContext(MoodContext)
  if (context === undefined) {
    throw new Error("useMood must be used within a MoodProvider")
  }
  return context
}
