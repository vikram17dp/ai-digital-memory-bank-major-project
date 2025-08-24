"use client"

import React, { useState } from 'react'
import { Header } from "./header"
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
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const handleMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const handleSidebarClose = () => {
    setIsMobileSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header onMenuToggle={handleMenuToggle} />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <SidebarNav
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isOpen={isMobileSidebarOpen}
          onClose={handleSidebarClose}
        />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {React.cloneElement(children as React.ReactElement, {
            activeSection,
            onSectionChange: setActiveSection,
            user
          })}
        </main>
      </div>
    </div>
  )
}
