"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { X, Save, Upload, Smile, Heart, Star, Meh, Frown, Angry } from 'lucide-react'
import type { Memory } from '@prisma/client'
import { useRouter } from 'next/navigation'

interface EditMemoryDialogProps {
  memory: Memory | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const moodOptions = [
  { icon: Smile, label: 'Happy', value: 'positive', color: 'from-yellow-400 to-orange-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
  { icon: Heart, label: 'Loved', value: 'positive', color: 'from-pink-400 to-red-400', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
  { icon: Star, label: 'Excited', value: 'positive', color: 'from-purple-400 to-blue-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  { icon: Meh, label: 'Neutral', value: 'neutral', color: 'from-gray-400 to-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-800/30' },
  { icon: Frown, label: 'Sad', value: 'negative', color: 'from-blue-400 to-indigo-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  { icon: Angry, label: 'Frustrated', value: 'negative', color: 'from-red-400 to-orange-400', bgColor: 'bg-red-100 dark:bg-red-900/30' },
]

export function EditMemoryDialog({ memory, open, onOpenChange, onSuccess }: EditMemoryDialogProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'neutral' as 'positive' | 'neutral' | 'negative',
    location: '',
    people: '',
    tags: [] as string[],
    isFavorite: false,
    isPrivate: false,
  })
  const [newTag, setNewTag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newImages, setNewImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])

  useEffect(() => {
    if (memory) {
      setFormData({
        title: memory.title || '',
        content: memory.content,
        mood: memory.mood,
        location: memory.location || '',
        people: memory.people || '',
        tags: memory.tags || [],
        isFavorite: memory.isFavorite,
        isPrivate: memory.isPrivate,
      })
    }
  }, [memory])

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(
      file => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    )

    if (validFiles.length > 0) {
      setNewImages(prev => [...prev, ...validFiles])
      const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file))
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls])
      toast.success(`${validFiles.length} image(s) added`, { duration: 2000 })
    }
  }

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviewUrls(prev => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, trimmedTag] }))
      setNewTag('')
      toast.success(`Tag "${trimmedTag}" added`, { duration: 2000 })
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async () => {
    if (!memory) return

    setIsSubmitting(true)
    toast.loading('Updating memory...', { id: 'update-memory' })

    try {
      // Upload new images to S3 if any
      let newImageUrls: string[] = []
      if (newImages.length > 0) {
        const uploadFormData = new FormData()
        newImages.forEach(image => {
          uploadFormData.append('files', image)
        })

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload new images')
        }

        const uploadResult = await uploadResponse.json()
        newImageUrls = uploadResult.urls
      }

      // Combine existing and new image URLs
      const existingImages = memory.images || []
      const allImages = [...existingImages, ...newImageUrls]

      // Update memory
      const response = await fetch(`/api/memory/${memory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: allImages,
          imageUrl: allImages.length > 0 ? allImages[0] : null,
          sentiment: memory.sentiment, // Keep existing sentiment
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update memory')
      }

      toast.success('Memory updated successfully!', { id: 'update-memory', duration: 2500 })
      
      // Reset form and close
      setNewImages([])
      setImagePreviewUrls([])
      onOpenChange(false)
      
      // Call success callback or refresh
      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }

    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update memory', { id: 'update-memory', duration: 2500 })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!memory) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Memory</DialogTitle>
          <DialogDescription>
            Update your memory details below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Give your memory a title..."
            />
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Describe your memory..."
              rows={5}
            />
          </div>

          {/* Mood Selection */}
          <div>
            <Label>Mood</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {moodOptions.map((mood) => (
                <Button
                  key={mood.label}
                  type="button"
                  variant={formData.mood === mood.value ? "default" : "outline"}
                  onClick={() => setFormData(prev => ({ ...prev, mood: mood.value }))}
                  className={`h-auto py-3 ${formData.mood === mood.value ? mood.bgColor : ''}`}
                >
                  <mood.icon className="w-4 h-4 mr-2" />
                  {mood.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Where did this happen?"
            />
          </div>

          {/* People */}
          <div>
            <Label htmlFor="people">People</Label>
            <Input
              id="people"
              value={formData.people}
              onChange={(e) => setFormData(prev => ({ ...prev, people: e.target.value }))}
              placeholder="Who was involved?"
            />
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newTag))}
                placeholder="Add a tag..."
              />
              <Button type="button" onClick={() => addTag(newTag)} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer">
                  #{tag}
                  <X
                    className="w-3 h-3 ml-1"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Add New Images */}
          <div>
            <Label>Add More Images</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(e.target.files)}
              className="mt-2"
            />
            {imagePreviewUrls.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img src={url} alt={`Preview ${index + 1}`} className="w-full h-20 object-cover rounded" />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removeNewImage(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFavorite}
                onChange={(e) => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
              />
              <span>Mark as Favorite</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPrivate}
                onChange={(e) => setFormData(prev => ({ ...prev, isPrivate: e.target.checked }))}
              />
              <span>Make Private</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
