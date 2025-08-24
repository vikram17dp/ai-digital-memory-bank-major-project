"use client"
import { Brain, Home, Search, Plus, MessageCircle, Upload, BarChart3, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarNavProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function SidebarNav({ activeSection, onSectionChange }: SidebarNavProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "memories", label: "Memories", icon: Brain },
    { id: "search", label: "Search", icon: Search },
    { id: "add", label: "Add Memory", icon: Plus },
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "upload", label: "Upload", icon: Upload },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ]

  const bottomItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900/90 backdrop-blur-xl border-r border-slate-700/50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-700/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <span className="font-bold text-xl text-white">Memory Bank</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-4">
        {navItems.map((item) => {
          const isActive = activeSection === item.id
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full justify-start gap-3 h-12 px-4 rounded-xl font-medium transition-all duration-300 cursor-pointer",
                isActive
                  ? "bg-green-600/20 text-white border border-green-500/40 shadow-lg shadow-green-500/10"
                  : "text-gray-400 hover:text-white hover:bg-slate-800/60 hover:border hover:border-green-500/30"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-green-400" : "text-gray-500"
              )} />
              {item.label}
            </Button>
          )
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="space-y-2 px-4 py-4 border-t border-slate-700/50">
        {bottomItems.map((item) => {
          const isActive = activeSection === item.id
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full justify-start gap-3 h-12 px-4 rounded-xl font-medium transition-all duration-300 cursor-pointer",
                isActive
                  ? "bg-green-600/20 text-white border border-green-500/40 shadow-lg shadow-green-500/10"
                  : "text-gray-400 hover:text-white hover:bg-slate-800/60 hover:border hover:border-green-500/30"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-green-400" : "text-gray-500"
              )} />
              {item.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
