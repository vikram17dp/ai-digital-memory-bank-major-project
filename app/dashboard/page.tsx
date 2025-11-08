"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { DashboardMainLayout } from "@/components/dashboard-main-layout"
import { DashboardContent } from "@/components/dashboard-content-new"

export default function DashboardPage() {
  const router = useRouter()
  const { isLoaded, isSignedIn, user } = useUser()
  const [syncing, setSyncing] = useState(true)

  // Sync user to database on load
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      syncUserToDatabase()
    }
  }, [isLoaded, isSignedIn, user])

  const syncUserToDatabase = async () => {
    if (!user) return
    
    try {
      console.log('[Dashboard] Syncing user to database:', user.id)
      const response = await fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
        }),
      })
      
      const data = await response.json()
      if (data.success) {
        console.log('[Dashboard] User synced successfully:', data.profile)
      }
    } catch (error) {
      console.error('[Dashboard] Failed to sync user:', error)
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/")
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded || syncing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">
          {syncing ? 'Syncing your account...' : 'Loading...'}
        </div>
      </div>
    )
  }

  if (!isSignedIn || !user) return null

  const serializableUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.primaryEmailAddress?.emailAddress || "",
    imageUrl: user.imageUrl,
  }

  return (
    <DashboardMainLayout user={serializableUser}>
      <DashboardContent />
    </DashboardMainLayout>
  )
}
