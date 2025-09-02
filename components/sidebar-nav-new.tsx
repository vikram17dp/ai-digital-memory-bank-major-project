"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
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
   <div className={cn(
  "hidden md:flex w-64 flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 backdrop-blur-xl h-[calc(100vh-4rem)] overflow-hidden",
  className
)}>

        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-700/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 ring-2 ring-cyan-500/30">
              <AvatarImage src={user?.imageUrl} alt={user?.firstName || 'User'} />
              <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold text-xs">
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
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg hover:shadow-xl` 
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  )}
                  onClick={() => onSectionChange(item.id)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300",
                      isActive 
                        ? "bg-white/20 text-white shadow-md" 
                        : `bg-gradient-to-br ${item.gradient} text-white opacity-80 group-hover:opacity-100`
                    )}>
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
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-lg p-2">
            <div className="flex items-center gap-1 mb-1">
              <Sparkles className="h-3 w-3 text-purple-400" />
              <span className="text-purple-300 font-medium text-xs">Pro Tip</span>
            </div>
            <p className="text-gray-300 text-xs leading-tight">
              Use tags when creating memories to make them easier to find and analyze later!
            </p>
          </div>
        </div>
        
        {/* Compact Bottom Section */}
        <div className="border-t border-gray-700/30 p-2 space-y-1 flex-shrink-0">
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
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <div className="relative flex h-full w-64 flex-col border-r border-gray-700/30 bg-gray-900/95 backdrop-blur-xl">
            {/* Close Button */}
            <div className="flex items-center justify-end p-4">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <ScrollArea className="flex-1 px-3">
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.id
                  
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start h-12 text-left font-normal",
                        isActive && "bg-primary/10 text-primary border-primary/20 border",
                        !isActive && "hover:bg-muted/50 hover:text-foreground text-muted-foreground"
                      )}
                      onClick={() => {
                        onSectionChange(item.id)
                        onClose?.()
                      }}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg",
                          isActive 
                            ? "bg-primary/20 text-primary" 
                            : "bg-muted/50 text-muted-foreground"
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col items-start flex-1">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm font-medium">{item.label}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs h-5">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{item.description}</span>
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </ScrollArea>
            
            {/* Bottom Section */}
            <div className="border-t border-border/40 p-3">
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-left font-normal hover:bg-muted/50"
                onClick={() => {
                  onSectionChange("settings")
                  onClose?.()
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
                    <Settings className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">Settings</span>
                    <span className="text-xs text-muted-foreground">Preferences</span>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
