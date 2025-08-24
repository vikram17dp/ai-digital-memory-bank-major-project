"use client"

import { MemoryCard } from "@/components/memory-card"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRight } from "lucide-react"
import type { Memory } from "@prisma/client"

interface MemoryTimelineProps {
  memories: Memory[]
}

export function MemoryTimeline({ memories }: MemoryTimelineProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-montserrat font-bold text-xl text-foreground">Recent Memories</h2>
        <Button variant="ghost" className="glass hover:glass-card text-primary">
          View all
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Memory Cards */}
      {memories.length === 0 ? (
        <div className="bg-slate-900/80 backdrop-blur-xl border border-green-500/20 rounded-2xl p-12 text-center shadow-2xl">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-full flex items-center justify-center shadow-lg">
            <Plus className="w-10 h-10 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No memories yet</h3>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-md mx-auto">
            Start building your digital memory bank by adding your first memory.
          </p>
          <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Memory
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {memories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))}
        </div>
      )}
    </div>
  )
}
