"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  UserIcon,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Bell,
  Heart,
  BookOpen,
  TrendingUp,
  Award,
  Settings,
  Eye,
  EyeOff,
  Link,
  Copy,
  Check,
  Loader2,
} from "lucide-react"

// Simple Avatar implementation
const Avatar: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`relative inline-flex shrink-0 overflow-hidden rounded-full ${className}`}>{children}</div>
)

const AvatarImage: React.FC<{ src?: string; alt?: string }> = ({ src, alt }) =>
  src ? <img className="aspect-square h-full w-full object-cover" src={src || "/placeholder.svg"} alt={alt} /> : null

const AvatarFallback: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full ${className}`}>{children}</div>
)

export function ProfileContent() {
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<"profile" | "background" | null>(null)
  const [hoveredBg, setHoveredBg] = useState(false)
  const profileInputRef = useRef<HTMLInputElement>(null)
  const backgroundInputRef = useRef<HTMLInputElement>(null)

  const [profileData, setProfileData] = useState<any>(null)
  const [statistics, setStatistics] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [joinDate, setJoinDate] = useState<Date | null>(null)

  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    website: "",
    phone: "",
    timezone: "",
  })

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/user/profile", {
          headers: {
            'x-user-id': user?.id || '',
            'x-user-email': user?.emailAddresses?.[0]?.emailAddress || '',
          },
        })
        const data = await response.json()

        if (data.success) {
          setProfileData(data.profile)
          setStatistics(data.statistics)
          setActivities(data.activities || [])
          setJoinDate(new Date(data.joinDate))

          // Set form data with fetched profile
          setFormData({
            bio: data.profile?.bio || "",
            location: data.profile?.location || "",
            website: data.profile?.website || "",
            phone: data.profile?.phone || "",
            timezone: data.profile?.timezone || "",
          })
        } else {
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Profile fetch error:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded && user) {
      fetchProfileData()
    }
  }, [isLoaded, user, toast])

  // Show loading state while Clerk is loading or fetching data
  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-muted-foreground">Loading profile...</span>
        </div>
      </div>
    )
  }

  // If user is not available
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Unable to load profile</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`
    } else if (user?.firstName) {
      return user.firstName[0]
    } else if (user?.emailAddress) {
      return user.emailAddress[0].toUpperCase()
    }
    return "U"
  }

  const handleImageUpload = async (file: File, type: "profile" | "background") => {
    setUploading(type)
    const uploadToast = toast({
      title: "Uploading",
      description: `Uploading ${type} image...`,
    })

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)
      formData.append("userId", user?.id || "")

      const response = await fetch("/api/user/upload-image", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        if (type === "profile") {
          setProfileData((prev) => ({ ...prev, profileImage: data.imageUrl }))
        } else {
          setProfileData((prev) => ({ ...prev, backgroundImage: data.imageUrl }))
        }
        toast({
          title: "Success",
          description: data.message,
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to upload image",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploading(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "background") => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      toast({
        title: "Error",
        description: "Only JPEG, PNG, WebP, and GIF images are allowed",
        variant: "destructive",
      })
      return
    }

    handleImageUpload(file, type)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          'x-user-id': user?.id || '',
          'x-user-email': user?.emailAddresses?.[0]?.emailAddress || '',
        },
        body: JSON.stringify({
          email: user.emailAddresses?.[0]?.emailAddress,
          ...formData,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setProfileData(data.profile)
        setIsEditing(false)
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Save error:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast({
      title: "Copied!",
      description: "Copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCancel = () => {
    setFormData({
      bio: profileData?.bio || "",
      location: profileData?.location || "",
      website: profileData?.website || "",
      phone: profileData?.phone || "",
      timezone: profileData?.timezone || "",
    })
    setIsEditing(false)
  }

  const handleFileSelect = (type: "profile" | "background") => {
    const input = type === "profile" ? profileInputRef.current : backgroundInputRef.current
    input?.click()
  }

  // Dynamic statistics data
  const stats = [
    {
      label: "Total Memories",
      value: statistics?.totalMemories?.toString() || "0",
      icon: BookOpen,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "Days Active",
      value: statistics?.daysActive?.toString() || "0",
      icon: Calendar,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      label: "Positive Memories",
      value: statistics?.positivePercentage || "0%",
      icon: Heart,
      gradient: "from-pink-500 to-rose-500",
    },
    {
      label: "Streak",
      value: statistics?.streak?.toString() || "0",
      icon: Award,
      gradient: "from-purple-500 to-indigo-500",
    },
  ]

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const then = new Date(timestamp)
    const diffInMs = now.getTime() - then.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
    } else if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`
    } else {
      return then.toLocaleDateString()
    }
  }

  return (
    <div className="p-6 space-y-8 max-w-4xl">
      {/* Hidden file inputs */}
      <input
        ref={profileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, "profile")}
      />
      <input
        ref={backgroundInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, "background")}
      />

      {/* Profile Header */}
      <Card className="border-border/50 overflow-hidden">
        <div
          className="h-32 relative cursor-pointer group"
          style={{
            backgroundImage: profileData?.backgroundImage
              ? `url(${profileData.backgroundImage})`
              : "linear-gradient(to right, rgb(59, 130, 246), rgb(168, 85, 247), rgb(6, 182, 212))",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onMouseEnter={() => setHoveredBg(true)}
          onMouseLeave={() => setHoveredBg(false)}
          onClick={() => handleFileSelect("background")}
        >
          <div className="absolute inset-0 bg-black/20" />
          {(hoveredBg || uploading === "background") && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all">
              {uploading === "background" ? (
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              ) : (
                <div className="flex items-center gap-2 text-white">
                  <Camera className="h-6 w-6" />
                  <span className="font-medium">Change Background</span>
                </div>
              )}
            </div>
          )}
        </div>
        <CardContent className="p-6 -mt-16 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-6">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl">
                <AvatarImage 
                  src={profileData?.profileImage || user?.imageUrl || "/placeholder.svg"} 
                  alt={user?.firstName || "User"} 
                />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-2xl">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-primary hover:bg-primary/90"
                onClick={(e) => {
                  e.stopPropagation()
                  handleFileSelect("profile")
                }}
                disabled={uploading === "profile"}
              >
                {uploading === "profile" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-muted-foreground flex items-center gap-2 flex-wrap">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{showEmail ? user.emailAddress : "•••••@••••••.com"}</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowEmail(!showEmail)}>
                      {showEmail ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2 whitespace-nowrap">
                      <Edit3 className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit Profile</span>
                      <span className="sm:hidden">Edit</span>
                    </Button>
                  ) : (
                    <div className="flex gap-2 flex-wrap">
                      <Button onClick={handleSave} size="sm" className="flex items-center gap-2 whitespace-nowrap" disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {saving ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2 bg-transparent whitespace-nowrap"
                        disabled={saving}
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {joinDate?.toLocaleDateString("en-US", { month: "long", year: "numeric" }) || "Recently"}
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                >
                  Active User
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Manage your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      placeholder="UTC-5 (EST)"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <p className="text-muted-foreground leading-relaxed">{formData.bio || "No bio added yet"}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{formData.location || "Not set"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link className="h-4 w-4 text-muted-foreground" />
                          {formData.website ? (
                            <a
                              href={formData.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {formData.website}
                            </a>
                          ) : (
                            <span>Not set</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{formData.phone || "Not set"}</span>
                          {formData.phone && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(formData.phone)}
                            >
                              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span>{formData.timezone || "Not set"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Settings
              </CardTitle>
              <CardDescription>Manage your account preferences and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Enabled
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates about your memories</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  On
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Profile Visibility</p>
                    <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-purple-600 border-purple-600">
                  Private
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Statistics */}
        <div className="space-y-6">
          {/* Statistics */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Your Statistics
              </CardTitle>
              <CardDescription>Overview of your memory journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-lg bg-gradient-to-r ${stat.gradient} flex items-center justify-center`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold text-primary">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activities.length > 0 ? (
                activities.map((activity, index) => {
                  const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500"]
                  return (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <div className={`w-2 h-2 ${colors[index % colors.length]} rounded-full mt-2 flex-shrink-0`} />
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-muted-foreground">{getTimeAgo(activity.timestamp)}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-4 text-muted-foreground">No recent activity</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
