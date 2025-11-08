"use client"

import React, { useState } from 'react'
import { motion } from "framer-motion"
import { useMood } from "@/contexts/MoodContext"
import { MoodAwareHeader } from "./mood-aware-header"
import { SidebarNav } from "./sidebar-nav-new"

interface User {
  id: string
  firstName: string | null
  lastName: string | null
  emailAddress: string
  imageUrl: string
}

interface DashboardMainLayoutProps {
  children: React.ReactNode
  user: User
}

export function DashboardMainLayout({ children, user }: DashboardMainLayoutProps) {
  const { moodColors, currentMood, isDarkMode } = useMood()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Compute background based on mode
  const getBackgroundClass = () => {
    if (currentMood === 'normal') {
      return isDarkMode 
        ? 'bg-gradient-to-br from-[#0B0E14] via-[#111827]/90 to-[#0B0E14]'
        : 'bg-gradient-to-br from-[#F9FAFB] via-[#FFFFFF] to-[#E5E7EB]'
    }
    return `bg-gradient-to-br ${moodColors.bgGradient}`
  }

  const getTextColor = () => {
    if (currentMood === 'normal' && !isDarkMode) {
      return 'text-gray-900'
    }
    return 'text-white'
  }

  const handleMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const handleSidebarClose = () => {
    setIsMobileSidebarOpen(false)
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden gpu-accelerated"
      style={{
        background: 'var(--bg-main)',
        color: 'var(--text-primary)',
        transform: 'translateZ(0)',
        willChange: 'background-color'
      }}
    >
      {/* Animated background particles - mood-aware */}
      {currentMood !== 'normal' && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[100px]"
            style={{ 
              backgroundColor: `${moodColors.primary}15`,
              transform: 'translateZ(0)',
              willChange: 'transform, opacity'
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-[100px]"
            style={{ 
              backgroundColor: `${moodColors.secondary}15`,
              transform: 'translateZ(0)',
              willChange: 'transform, opacity'
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>
      )}

      {/* Motion grid background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Header */}
      <div className="relative z-20">
        <MoodAwareHeader onMenuToggle={handleMenuToggle} />
      </div>
      
      <div className="relative z-10 flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <SidebarNav
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isOpen={isMobileSidebarOpen}
          onClose={handleSidebarClose}
        />
        
        {/* Main Content Area */}
        <main 
          className="flex-1 overflow-y-auto scroll-smooth"
          style={{
            transform: 'translateZ(0)',
            willChange: 'transform',
            paddingTop: 'env(safe-area-inset-top)'
          }}
        >
          <div className="relative flex flex-col min-h-full">
            {React.cloneElement(children as React.ReactElement, {
              activeSection,
              onSectionChange: setActiveSection,
              user
            })}
          </div>
        </main>
      </div>
    </div>
  )
}
