"use server"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { AccountSettings } from "./components/account-settings"
import { PrivacySettings } from "./components/privacy-settings"
import { NotificationSettings } from "./components/notification-settings"
import { DataSettings } from "./components/data-settings"

export default async function SettingsPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
        <div className="glass-card p-6 rounded-xl mb-8 fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold font-display mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and privacy settings</p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="slide-up">
            <AccountSettings user={user} />
          </div>

          <div className="slide-up" style={{ animationDelay: "0.1s" }}>
            <PrivacySettings />
          </div>

          <div className="slide-up" style={{ animationDelay: "0.2s" }}>
            <NotificationSettings />
          </div>

          <div className="slide-up" style={{ animationDelay: "0.3s" }}>
            <DataSettings />
          </div>
        </div>
      </div>
    </div>
  )
}
