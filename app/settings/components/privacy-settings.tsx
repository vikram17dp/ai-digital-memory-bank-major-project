
"use client"

import { useState } from "react"
import { Shield, Eye, Lock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PrivacySettings() {
  const [settings, setSettings] = useState({
    publicProfile: false,
    shareAnalytics: true,
    allowAITraining: false,
    dataRetention: "1year",
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = () => {
    console.log("Saving privacy settings:", settings)
  }

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Privacy & Security</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 glass-card rounded-lg bg-muted/10">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Public Profile</h3>
                <p className="text-sm text-muted-foreground">Allow others to discover your profile</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle("publicProfile")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.publicProfile ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.publicProfile ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 glass-card rounded-lg bg-muted/10">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Share Analytics</h3>
                <p className="text-sm text-muted-foreground">Help improve the service with usage data</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle("shareAnalytics")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.shareAnalytics ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.shareAnalytics ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 glass-card rounded-lg bg-muted/10">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">AI Training</h3>
                <p className="text-sm text-muted-foreground">Allow your data to improve AI models</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle("allowAITraining")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.allowAITraining ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.allowAITraining ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Data Retention</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: "6months", label: "6 Months" },
              { value: "1year", label: "1 Year" },
              { value: "forever", label: "Forever" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSettings((prev) => ({ ...prev, dataRetention: option.value }))}
                className={`p-3 rounded-lg text-sm font-medium transition-all ${
                  settings.dataRetention === option.value
                    ? "glass-card bg-primary/20 border-primary/30 text-primary"
                    : "glass-card bg-muted/10 hover:bg-muted/20"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={handleSave} className="glass-button">
            Save Privacy Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
