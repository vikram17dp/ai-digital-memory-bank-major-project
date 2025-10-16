"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Heart, Calendar, TrendingUp } from 'lucide-react'

interface DashboardSimpleProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
  user?: {
    id: string
    firstName: string | null
    lastName: string | null
    emailAddress: string
    imageUrl: string
  }
  memories?: any[]
  insights?: {
    totalMemories: number
    sentimentBreakdown: {
      positive: number
      negative: number
      neutral: number
    }
    topTags: Array<{ tag: string; count: number }>
    recentTrends: {
      thisWeek: number
      lastWeek: number
    }
  }
}

export function DashboardSimple({ user, insights }: DashboardSimpleProps) {
  const totalMemories = insights?.totalMemories || 0
  const thisWeek = insights?.recentTrends?.thisWeek || 0

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.firstName || 'User'}!</h1>
        <p className="text-muted-foreground mt-2">Here's your memory dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Memories</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMemories}</div>
            <p className="text-xs text-muted-foreground">All your stored memories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisWeek}</div>
            <p className="text-xs text-muted-foreground">Memories added this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights?.sentimentBreakdown?.positive || 0}</div>
            <p className="text-xs text-muted-foreground">Positive memories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15%</div>
            <p className="text-xs text-muted-foreground">From last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Your memory dashboard is ready!</p>
        </CardContent>
      </Card>
    </div>
  )
}
