"use client"

import { useState } from "react"
import { Bell, Mail, Smartphone, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    memoryReminders: true,
    analyticsReports: false,
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = () => {
    console.log("Saving notification settings:", settings)
  }

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Notifications</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 glass-card rounded-lg bg-muted/10">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle("emailNotifications")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.emailNotifications ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.emailNotifications ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 glass-card rounded-lg bg-muted/10">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-muted-foreground" />
            <div>
              <h3 className="font-medium">Push Notifications</h3>
              <p className="text-sm text-muted-foreground">Get notified on your device</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle("pushNotifications")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.pushNotifications ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.pushNotifications ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 glass-card rounded-lg bg-muted/10">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <h3 className="font-medium">Weekly Digest</h3>
              <p className="text-sm text-muted-foreground">Summary of your week's memories</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle("weeklyDigest")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.weeklyDigest ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.weeklyDigest ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 glass-card rounded-lg bg-muted/10">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <div>
              <h3 className="font-medium">Memory Reminders</h3>
              <p className="text-sm text-muted-foreground">Gentle nudges to capture memories</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle("memoryReminders")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.memoryReminders ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.memoryReminders ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="pt-4">
          <Button onClick={handleSave} className="glass-button">
            Save Notification Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
