"use client"

import { useState } from "react"
import { User, Mail, Calendar, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

interface AccountSettingsProps {
  user: {
    firstName?: string | null
    lastName?: string | null
    emailAddresses: { emailAddress: string }[]
    createdAt?: number
  }
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.emailAddresses[0]?.emailAddress || "",
  })

  const handleSave = () => {
    // In a real app, this would update the user profile
    console.log("Saving user data:", formData)
    setEditing(false)
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently"

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-6">
        <User className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Account Information</h2>
      </div>

      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            {editing ? (
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="glass-input"
                placeholder="Enter first name"
              />
            ) : (
              <div className="glass-card p-3 rounded-lg bg-muted/20">
                <p className="text-sm">{formData.firstName || "Not set"}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            {editing ? (
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="glass-input"
                placeholder="Enter last name"
              />
            ) : (
              <div className="glass-card p-3 rounded-lg bg-muted/20">
                <p className="text-sm">{formData.lastName || "Not set"}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <div className="glass-card p-3 rounded-lg bg-muted/20 flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm">{formData.email}</p>
            <Shield className="w-4 h-4 text-green-400 ml-auto" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Email is managed by your authentication provider</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Member Since</label>
          <div className="glass-card p-3 rounded-lg bg-muted/20 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm">{memberSince}</p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          {editing ? (
            <>
              <Button onClick={handleSave} className="glass-button">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)} className="glass-card bg-transparent">
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)} className="glass-button">
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
