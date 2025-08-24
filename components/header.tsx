"use client"

import { UserButton } from "@clerk/nextjs"
import { ThemeToggle } from "./theme-toggle"
import { Brain, Search, Bell, Menu, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface HeaderProps {
  onMenuToggle?: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-gray-900 via-black to-gray-900 backdrop-blur-2xl">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-teal-500/10 animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent" />
      
      <div className="relative flex h-16 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
        {/* Left Section - Logo & Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="md:hidden hover:bg-white/10 text-white transition-all duration-200 rounded-xl"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-teal-500 shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-all duration-300 group-hover:scale-105">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="hidden sm:inline-block text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-white transition-all duration-300">
              Memory Bank
            </span>
          </Link>
        </div>

        {/* Center Section - Search Bar */}
        <div className="hidden md:flex flex-1 justify-center px-8">
          <div className="relative w-full max-w-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-30" />
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-gray-400 z-10" />
              <Input
                placeholder="Search your memories..."
                className="w-full pl-12 pr-4 h-12 bg-gray-900/70 border border-gray-700/50 rounded-2xl text-white placeholder:text-gray-400 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/20 focus:bg-gray-900/90 transition-all duration-300 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-3">
          {/* Mobile Search Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-200 rounded-xl"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Actions Container */}
          <div className="flex items-center bg-gray-900/50 backdrop-blur-md border border-gray-700/30 rounded-2xl px-3 py-1.5 space-x-2 shadow-lg shadow-black/20 h-12">
            {/* Theme Toggle */}
            <div className="p-1 hover:bg-white/10 rounded-xl transition-all duration-200">
              <ThemeToggle />
            </div>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative hover:bg-white/10 text-gray-300 hover:text-white h-9 w-9 rounded-xl p-0 transition-all duration-200"
            >
              <Bell className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 border border-gray-900 shadow-lg"
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
                    avatarBox: "h-9 w-9 ring-2 ring-cyan-400/40 hover:ring-cyan-400/70 transition-all duration-300 hover:scale-105",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
