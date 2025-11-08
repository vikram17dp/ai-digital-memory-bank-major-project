"use client"

import { DashboardFuturistic } from "@/components/dashboard-futuristic"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function DashboardFuturisticPage() {
  const [mood, setMood] = useState<"calm" | "focused" | "positive" | "neutral">("positive")

  return (
    <div className="relative">
      {/* Mood Switcher - For Demo Purposes */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-black/50 backdrop-blur-xl p-3 rounded-2xl border border-white/10">
        <Button 
          size="sm" 
          onClick={() => setMood("calm")}
          className={mood === "calm" ? "bg-blue-600" : "bg-white/10"}
        >
          Calm
        </Button>
        <Button 
          size="sm" 
          onClick={() => setMood("focused")}
          className={mood === "focused" ? "bg-violet-600" : "bg-white/10"}
        >
          Focused
        </Button>
        <Button 
          size="sm" 
          onClick={() => setMood("positive")}
          className={mood === "positive" ? "bg-green-600" : "bg-white/10"}
        >
          Positive
        </Button>
        <Button 
          size="sm" 
          onClick={() => setMood("neutral")}
          className={mood === "neutral" ? "bg-gray-600" : "bg-white/10"}
        >
          Neutral
        </Button>
      </div>

      <DashboardFuturistic 
        userName="Vikram" 
        currentMood={mood}
      />
    </div>
  )
}
