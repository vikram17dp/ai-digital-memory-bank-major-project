"use client"

import { DashboardFuturisticV2 } from "@/components/dashboard-futuristic-v2"
import { MoodProvider, useMood } from "@/contexts/MoodContext"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

function MoodSwitcher() {
  const { currentMood, setMood } = useMood()

  const moods = [
    { id: "calm", label: "Calm", color: "bg-cyan-600" },
    { id: "focused", label: "Focused", color: "bg-violet-600" },
    { id: "positive", label: "Positive", color: "bg-green-600" },
    { id: "neutral", label: "Neutral", color: "bg-gray-600" },
  ] as const

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed top-4 right-4 z-50 flex gap-2 bg-black/50 backdrop-blur-xl p-3 rounded-2xl border border-white/10 shadow-2xl"
    >
      {moods.map((mood) => (
        <Button
          key={mood.id}
          size="sm"
          onClick={() => setMood(mood.id)}
          className={`transition-all duration-300 ${
            currentMood === mood.id
              ? `${mood.color} shadow-lg scale-105`
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          {mood.label}
        </Button>
      ))}
    </motion.div>
  )
}

export default function DashboardFuturisticPage() {
  return (
    <MoodProvider>
      <div className="relative">
        <MoodSwitcher />
        <DashboardFuturisticV2 userName="Vikram" />
      </div>
    </MoodProvider>
  )
}
