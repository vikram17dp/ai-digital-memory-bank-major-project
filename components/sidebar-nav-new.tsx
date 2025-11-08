"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useMood } from "@/contexts/MoodContext"
import { motion, AnimatePresence } from "framer-motion"
// Simple Avatar implementation  
const Avatar: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => (
  <div className={`relative inline-flex shrink-0 overflow-hidden rounded-full ${className}`}>
    {children}
  </div>
)

const AvatarImage: React.FC<{src?: string, alt?: string}> = ({ src, alt }) => (
  src ? <img className="aspect-square h-full w-full object-cover" src={src} alt={alt} /> : null
)

const AvatarFallback: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full ${className}`}>
    {children}
  </div>
)
import { useUser } from "@clerk/nextjs"
import {
  LayoutDashboard,
  BookOpen,
  Search,
  Plus,
  MessageSquare,
  BarChart3,
  Settings,
  Upload,
  Heart,
  X,
  Sparkles,
  User
} from "lucide-react"

interface SidebarNavProps {
  activeSection: string
  onSectionChange: (section: string) => void
  isOpen?: boolean
  onClose?: () => void
  className?: string
}

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & insights",
    badge: null,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: "memories",
    label: "Memories",
    icon: BookOpen,
    description: "All your memories",
    badge: null,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: "search",
    label: "Search",
    icon: Search,
    description: "Find memories",
    badge: null,
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: "add",
    label: "Add Memory",
    icon: Plus,
    description: "Create new memory",
    badge: null,
    gradient: "from-orange-500 to-red-500"
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    description: "Memory insights",
    badge: null,
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    id: "chat",
    label: "AI Chat",
    icon: MessageSquare,
    description: "Talk with AI",
    badge: null,
    gradient: "from-teal-500 to-cyan-500"
  }
]

export function SidebarNav({ activeSection, onSectionChange, isOpen, onClose, className }: SidebarNavProps) {
  const { user } = useUser()
  const { moodColors } = useMood()
  
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`
    } else if (user?.firstName) {
      return user.firstName[0]
    } else if (user?.emailAddress) {
      return user.emailAddress[0].toUpperCase()
    }
    return 'U'
  }
  
  return (
    <>
      {/* Desktop Sidebar */}
   <div 
        className={cn(
          "hidden md:flex w-64 flex-col backdrop-blur-xl h-[calc(100vh-4rem)] overflow-hidden border-r",
          className
        )}
        style={{
          backgroundColor: 'rgba(11,14,20,0.6)',
          borderColor: `${moodColors.primary}20`,
          boxShadow: `0 0 25px ${moodColors.glow}`
        }}
      >

        {/* User Profile Section */}
        <div 
          className="p-4 border-b flex-shrink-0"
          style={{ borderColor: `${moodColors.primary}20` }}
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 ring-2"
              style={{ borderColor: `${moodColors.primary}40` }}
            >
              <AvatarImage src={user?.imageUrl} alt={user?.firstName || 'User'} />
              <AvatarFallback 
                className="text-white font-semibold text-xs"
                style={{
                  background: `linear-gradient(135deg, ${moodColors.primary}, ${moodColors.secondary})`
                }}
              >
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-300 truncate">
                Welcome back,
              </p>
              <p className="text-xs text-white font-medium truncate">
                {user?.firstName || 'Vikram'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation Items - No ScrollArea, direct flex */}
        <div className="flex-1 px-3 py-3 overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-10 text-left font-normal transition-all duration-300 mb-1 rounded-xl",
                    isActive 
                      ? "text-white"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  )}
                  style={{
                    background: isActive 
                      ? `linear-gradient(135deg, ${moodColors.primary}40, ${moodColors.secondary}40)`
                      : 'transparent',
                    boxShadow: isActive ? `0 6px 24px ${moodColors.glow}` : 'none',
                    border: `1px solid ${moodColors.primary}25`
                  }}
                  onClick={() => onSectionChange(item.id)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div 
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300",
                        isActive ? "text-white" : "text-white"
                      )}
                      style={{
                        background: `linear-gradient(135deg, ${moodColors.primary}, ${moodColors.secondary})`,
                        boxShadow: isActive ? `0 0 16px ${moodColors.glow}` : 'none'
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <span className="text-xs font-semibold truncate">{item.label}</span>
                      {item.badge && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs mt-1">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    {isActive && (
                      <div className="w-1 h-4 bg-white/60 rounded-full flex-shrink-0" />
                    )}
                  </div>
                </Button>
              )
            })}
          </div>
        </div>
        
        {/* Compact Pro Tip Section */}
        <div className="px-3 py-2 flex-shrink-0">
          <div 
            className="rounded-lg p-2 border"
            style={{
              background: `${moodColors.primary}10`,
              borderColor: `${moodColors.primary}25`
            }}
          >
            <div className="flex items-center gap-1 mb-1">
              <Sparkles className="h-3 w-3" style={{ color: moodColors.primary }} />
              <span className="font-medium text-xs" style={{ color: moodColors.primary }}>Pro Tip</span>
            </div>
            <p className="text-gray-300 text-xs leading-tight">
              Use tags when creating memories to make them easier to find and analyze later!
            </p>
          </div>
        </div>
        
        {/* Compact Bottom Section */}
        <div className="border-t p-2 space-y-1 flex-shrink-0" style={{ borderColor: `${moodColors.primary}20` }}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-9 text-left font-normal transition-all duration-300 rounded-lg",
              activeSection === "profile"
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            )}
            onClick={() => onSectionChange("profile")}
          >
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-300",
                activeSection === "profile"
                  ? "bg-white/20 text-white shadow-md"
                  : "bg-gradient-to-br from-blue-500 to-purple-500 text-white opacity-80"
              )}>
                <User className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold">Profile</span>
              {activeSection === "profile" && (
                <div className="w-1 h-4 bg-white/60 rounded-full flex-shrink-0 ml-auto" />
              )}
            </div>
          </Button>
          
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-9 text-left font-normal transition-all duration-300 rounded-lg",
              activeSection === "settings"
                ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            )}
            onClick={() => onSectionChange("settings")}
          >
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-300",
                activeSection === "settings"
                  ? "bg-white/20 text-white shadow-md"
                  : "bg-gradient-to-br from-gray-600 to-gray-700 text-white opacity-80"
              )}>
                <Settings className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold">Settings</span>
              {activeSection === "settings" && (
                <div className="w-1 h-4 bg-white/60 rounded-full flex-shrink-0 ml-auto" />
              )}
            </div>
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div 
            className="relative flex h-full w-64 flex-col border-r backdrop-blur-xl shadow-2xl"
            style={{
              backgroundColor: 'rgba(11,14,20,0.95)',
              borderColor: `${moodColors.primary}20`
            }}
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header with Close Button and User Info */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: `${moodColors.primary}20` }}>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2"
                  style={{ borderColor: `${moodColors.primary}40` }}
                >
                  <AvatarImage src={user?.imageUrl} alt={user?.firstName || 'User'} />
                  <AvatarFallback 
                    className="text-white font-semibold text-sm"
                    style={{
                      background: `linear-gradient(135deg, ${moodColors.primary}, ${moodColors.secondary})`
                    }}
                  >
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-300 truncate">
                    Welcome back,
                  </p>
                  <p className="text-sm text-white font-medium truncate">
                    {user?.firstName || 'Vikram'}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <ScrollArea className="flex-1 px-3 py-4">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.id
                  
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-14 text-left font-normal transition-all duration-300 rounded-xl",
                        isActive 
                          ? "text-white"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      )}
                      style={{
                        background: isActive 
                          ? `linear-gradient(135deg, ${moodColors.primary}40, ${moodColors.secondary}40)`
                          : 'transparent',
                        boxShadow: isActive ? `0 6px 24px ${moodColors.glow}` : 'none',
                        border: `1px solid ${moodColors.primary}25`
                      }}
                      onClick={() => {
                        onSectionChange(item.id)
                        onClose?.()
                      }}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div 
                          className="flex h-9 w-9 items-center justify-center rounded-lg"
                          style={{
                            background: `linear-gradient(135deg, ${moodColors.primary}, ${moodColors.secondary})`,
                            boxShadow: isActive ? `0 0 16px ${moodColors.glow}` : 'none'
                          }}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex flex-col items-start flex-1">
                          <span className="text-sm font-semibold">{item.label}</span>
                          <span className="text-xs opacity-60">{item.description}</span>
                        </div>
                        {isActive && (
                          <div className="w-1 h-6 bg-white/60 rounded-full flex-shrink-0" />
                        )}
                      </div>
                    </Button>
                  )
                })}
              </div>
            </ScrollArea>
            
            {/* Bottom Section */}
            <div className="border-t p-3 space-y-2 flex-shrink-0" style={{ borderColor: `${moodColors.primary}20` }}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-12 text-left font-normal transition-all duration-300 rounded-xl",
                  activeSection === "profile"
                    ? "text-white"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                )}
                style={{
                  background: activeSection === "profile"
                    ? `linear-gradient(135deg, ${moodColors.primary}40, ${moodColors.secondary}40)`
                    : 'transparent',
                  boxShadow: activeSection === "profile" ? `0 6px 24px ${moodColors.glow}` : 'none',
                  border: `1px solid ${moodColors.primary}25`
                }}
                onClick={() => {
                  onSectionChange("profile")
                  onClose?.()
                }}
              >
                <div className="flex items-center gap-3 w-full">
                  <div 
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${moodColors.primary}, ${moodColors.secondary})`,
                      boxShadow: activeSection === "profile" ? `0 0 16px ${moodColors.glow}` : 'none'
                    }}
                  >
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col items-start flex-1">
                    <span className="text-sm font-semibold">Profile</span>
                    <span className="text-xs opacity-60">Your account</span>
                  </div>
                  {activeSection === "profile" && (
                    <div className="w-1 h-6 bg-white/60 rounded-full flex-shrink-0" />
                  )}
                </div>
              </Button>
              
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-12 text-left font-normal transition-all duration-300 rounded-xl",
                  activeSection === "settings"
                    ? "text-white"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                )}
                style={{
                  background: activeSection === "settings"
                    ? `linear-gradient(135deg, ${moodColors.primary}40, ${moodColors.secondary}40)`
                    : 'transparent',
                  boxShadow: activeSection === "settings" ? `0 6px 24px ${moodColors.glow}` : 'none',
                  border: `1px solid ${moodColors.primary}25`
                }}
                onClick={() => {
                  onSectionChange("settings")
                  onClose?.()
                }}
              >
                <div className="flex items-center gap-3 w-full">
                  <div 
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${moodColors.primary}, ${moodColors.secondary})`,
                      boxShadow: activeSection === "settings" ? `0 0 16px ${moodColors.glow}` : 'none'
                    }}
                  >
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col items-start flex-1">
                    <span className="text-sm font-semibold">Settings</span>
                    <span className="text-xs opacity-60">Preferences</span>
                  </div>
                  {activeSection === "settings" && (
                    <div className="w-1 h-6 bg-white/60 rounded-full flex-shrink-0" />
                  )}
                </div>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  )
}
