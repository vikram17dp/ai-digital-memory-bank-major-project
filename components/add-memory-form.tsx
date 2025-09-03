import React, { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { 
  PlusCircle, 
  Image, 
  Calendar, 
  Tag, 
  Smile, 
  MapPin, 
  Users, 
  Save, 
  Upload, 
  X, 
  Star,
  Heart,
  Meh,
  Frown,
  Angry,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Camera,
  FileText,
  Clock,
  Palette,
  Wand2,
  Edit3,
  Zap,
  Eye,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  RotateCcw,
  Brain,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface AddMemoryFormProps {
  user?: any
  userData?: any
  memories?: any[]
  insights?: any
  onSectionChange?: (section: string) => void
}

const moodOptions = [
  { icon: Smile, label: 'Happy', value: 'happy', color: 'from-yellow-400 to-orange-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
  { icon: Heart, label: 'Loved', value: 'loved', color: 'from-pink-400 to-red-400', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
  { icon: Star, label: 'Excited', value: 'excited', color: 'from-purple-400 to-blue-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  { icon: Meh, label: 'Neutral', value: 'neutral', color: 'from-gray-400 to-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-800/30' },
  { icon: Frown, label: 'Sad', value: 'sad', color: 'from-blue-400 to-indigo-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  { icon: Angry, label: 'Frustrated', value: 'frustrated', color: 'from-red-400 to-orange-400', bgColor: 'bg-red-100 dark:bg-red-900/30' },
]

const suggestedTags = [
  'work', 'family', 'travel', 'achievement', 'learning', 'friendship', 'food', 'music', 
  'nature', 'celebration', 'milestone', 'inspiration', 'creativity', 'health', 'hobby'
]

export const AddMemoryForm: React.FC<AddMemoryFormProps> = ({
  user,
  userData,
  memories,
  insights,
  onSectionChange
}) => {
  const [inputMode, setInputMode] = useState<'manual' | 'ai'>('manual')
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    people: '',
    tags: [] as string[],
    images: [] as File[],
    isPrivate: false,
    isFavorite: false
  })
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiResults, setAiResults] = useState<any>(null)
  const [showAiResults, setShowAiResults] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newTag, setNewTag] = useState('')

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    
    // Validate files
    const invalidFiles = fileArray.filter(file => !file.type.startsWith('image/'))
    const oversizedFiles = fileArray.filter(file => file.size > 5 * 1024 * 1024)
    const validFiles = fileArray.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    )

    // Show validation errors
    if (invalidFiles.length > 0) {
      toast.error('❌ Invalid file type', {
        description: 'Please upload only image files (JPG, PNG, GIF, WebP)'
      })
    }
    
    if (oversizedFiles.length > 0) {
      toast.error('📦 File too large', {
        description: 'Please upload images smaller than 5MB'
      })
    }

    if (validFiles.length > 0) {
      // For AI mode, only allow one image
      const filesToProcess = inputMode === 'ai' ? [validFiles[0]] : validFiles
      
      setFormData(prev => ({ 
        ...prev, 
        images: inputMode === 'ai' ? filesToProcess : [...prev.images, ...filesToProcess]
      }))
      
      // Create preview URLs
      const newPreviewUrls = filesToProcess.map(file => URL.createObjectURL(file))
      setImagePreviewUrls(prev => inputMode === 'ai' ? newPreviewUrls : [...prev, ...newPreviewUrls])
      
      // Show upload success
      toast.success('📸 Image uploaded!', {
        description: `${filesToProcess.length} image${filesToProcess.length > 1 ? 's' : ''} ready for processing`
      })
      
      // If AI mode, automatically trigger AI analysis
      if (inputMode === 'ai') {
        await handleAIAnalysis(filesToProcess[0])
      }
    }
  }
  
  const handleAIAnalysis = async (imageFile: File) => {
    setIsProcessing(true)
    toast.loading('🧠 AI is analyzing your image...', {
      id: 'ai-analysis',
      description: 'This may take a few moments'
    })
    
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      
      const response = await fetch('/api/memory/extract', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze image')
      }
      
      if (result.success && result.data) {
        setAiResults(result.data)
        setShowAiResults(true)
        
        toast.success('✨ Memory details extracted!', {
          id: 'ai-analysis',
          description: result.message || `Found details with ${Math.round(result.data.confidence * 100)}% confidence`
        })
        
        // Auto-fill the form with AI results
        setFormData(prev => ({
          ...prev,
          title: result.data.title,
          content: result.data.content,
          mood: result.data.mood,
          tags: result.data.tags,
          location: result.data.location,
          people: result.data.people,
          date: result.data.date
        }))
        
        // Show success toast for auto-fill
        toast.success('🎯 Form auto-filled!', {
          description: 'You can review and edit the details before saving',
          action: {
            label: 'Next Step',
            onClick: () => setCurrentStep(2)
          }
        })
        
      } else {
        throw new Error('No data returned from AI analysis')
      }
      
    } catch (error) {
      console.error('AI analysis failed:', error)
      
      toast.error('❌ AI analysis failed', {
        id: 'ai-analysis',
        description: error instanceof Error ? error.message : 'Please try again or use manual entry'
      })
      
      // Fallback to manual mode on error
      setInputMode('manual')
      
    } finally {
      setIsProcessing(false)
    }
  }
  
  const applyAIResults = () => {
    if (aiResults) {
      setFormData(prev => ({
        ...prev,
        title: aiResults.title,
        content: aiResults.content,
        mood: aiResults.mood,
        tags: aiResults.tags,
        location: aiResults.location,
        people: aiResults.people,
        date: aiResults.date
      }))
      
      setShowAiResults(false)
      
      toast.success('✅ AI results applied!', {
        description: 'Proceeding to mood selection step',
        action: {
          label: 'Continue',
          onClick: () => setCurrentStep(2)
        }
      })
      
      setCurrentStep(2) // Move to next step
    }
  }
  
  const retryAIAnalysis = async () => {
    if (formData.images.length > 0) {
      toast.info('🔄 Retrying AI analysis...', {
        description: 'Analyzing your image again'
      })
      setAiResults(null)
      setShowAiResults(false)
      await handleAIAnalysis(formData.images[0])
    } else {
      toast.error('⚠️ No image to analyze', {
        description: 'Please upload an image first'
      })
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      images: prev.images.filter((_, i) => i !== index) 
    }))
    setImagePreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]) // Clean up memory
      return prev.filter((_, i) => i !== index)
    })
  }

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, trimmedTag] }))
      setNewTag('')
      toast.success(`🏷️ Tag "${trimmedTag}" added!`)
    } else if (formData.tags.includes(trimmedTag)) {
      toast.warning('⚠️ Tag already exists')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
    toast.info(`🗑️ Tag "${tagToRemove}" removed`)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    toast.loading('💾 Saving your memory...', {
      id: 'save-memory',
      description: 'Processing and storing your precious moment'
    })
    
    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Please add a title for your memory')
      }
      
      if (!formData.content.trim()) {
        throw new Error('Please add some content to your memory')
      }
      
      if (!formData.mood) {
        throw new Error('Please select a mood for your memory')
      }
      
      // Prepare form data for processing
      const submitFormData = new FormData()
      
      // Determine processing mode based on form data
      let mode = inputMode // Use the current input mode
      
      submitFormData.append('mode', mode)
      submitFormData.append('title', formData.title)
      submitFormData.append('content', formData.content)
      submitFormData.append('mood', formData.mood)
      submitFormData.append('date', formData.date)
      submitFormData.append('location', formData.location)
      submitFormData.append('people', formData.people)
      submitFormData.append('tags', JSON.stringify(formData.tags))
      submitFormData.append('isPrivate', formData.isPrivate.toString())
      submitFormData.append('isFavorite', formData.isFavorite.toString())
      
      // Add images
      formData.images.forEach((image, index) => {
        submitFormData.append(`image_${index}`, image)
      })
      
      // Process memory with backend
      const response = await fetch('/api/memory/process', {
        method: 'POST',
        body: submitFormData
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save memory')
      }
      
      const processedMemory = await response.json()
      
      toast.success('🎉 Memory saved successfully!', {
        id: 'save-memory',
        description: 'Your precious moment has been preserved',
        action: {
          label: 'View Memory',
          onClick: () => {
            // Navigate to memory view or memories list
            if (onSectionChange) {
              onSectionChange('memories')
            }
          }
        }
      })
      
      // Reset form for next memory
      setFormData({
        title: '',
        content: '',
        mood: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
        people: '',
        tags: [],
        images: [],
        isPrivate: false,
        isFavorite: false
      })
      
      setImagePreviewUrls([])
      setCurrentStep(1)
      setAiResults(null)
      setShowAiResults(false)
      setInputMode('manual')
      
      console.log('Memory saved:', processedMemory)
      
    } catch (error) {
      console.error('Error saving memory:', error)
      
      toast.error('❌ Failed to save memory', {
        id: 'save-memory',
        description: error instanceof Error ? error.message : 'Please try again'
      })
      
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const getMoodFromLabel = (label: string) => {
    const moodMap: { [key: string]: string } = {
      'Positive': 'happy',
      'Negative': 'sad', 
      'Neutral': 'neutral'
    }
    return moodMap[label] || ''
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        if (inputMode === 'ai') {
          // For AI mode, need image AND title/content to be filled
          return formData.images.length > 0 && formData.title.trim() && formData.content.trim()
        }
        return formData.title.trim() && formData.content.trim()
      case 2:
        return formData.mood
      case 3:
        return true
      default:
        return false
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Mode Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/80 dark:bg-gray-800/80 p-1 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex">
                  <button
                    onClick={() => setInputMode('manual')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      inputMode === 'manual' 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    <Edit3 className="h-4 w-4" />
                    Manual Entry
                  </button>
                  <button
                    onClick={() => setInputMode('ai')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      inputMode === 'ai' 
                        ? 'bg-purple-500 text-white shadow-md' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    <Wand2 className="h-4 w-4" />
                    AI Upload
                  </button>
                </div>
              </div>
            </div>
            
            {inputMode === 'manual' ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <FileText className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                    Tell Your Story
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">What happened? Share the details of this memory</p>
                </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Memory Title *
                </Label>
                <Input
                  id="title"
                  placeholder="Give your memory a meaningful title..."
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="h-12 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60 transition-all duration-300"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 text-right">{formData.title.length}/100</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Memory Content *
                </Label>
                <Textarea
                  id="content"
                  placeholder="Describe what happened, how you felt, who was there, what made it special..."
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="min-h-[120px] resize-none bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60 transition-all duration-300"
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 text-right">{formData.content.length}/1000</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Calendar className="inline h-4 w-4 mr-2" />
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="h-12 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <MapPin className="inline h-4 w-4 mr-2" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="Where did this happen?"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="h-12 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="people" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Users className="inline h-4 w-4 mr-2" />
                  People Involved
                </Label>
                <Input
                  id="people"
                  placeholder="Who was with you? (separate names with commas)"
                  value={formData.people}
                  onChange={(e) => handleInputChange('people', e.target.value)}
                  className="h-12 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60 transition-all duration-300"
                />
              </div>
            </div>
              </>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 flex items-center justify-center shadow-lg">
                    <Wand2 className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    AI-Powered Memory Details
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">Upload a photo and let AI extract the memory details</p>
                </div>

                {/* AI Upload Area */}
                <div className="space-y-6">
                  <div 
                    className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 hover:border-purple-400 dark:hover:border-purple-500 ${
                      dragActive 
                        ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20' 
                        : 'border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/30'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                      className="hidden"
                    />
                    
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                        <Camera className="h-8 w-8 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          Drag & drop a memory image or click to select
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Supports: JPG, PNG, WebP (max 5MB)
                        </p>
                      </div>
                      
                      <Button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                        disabled={isProcessing}
                      >
        {isProcessing ? (
                          <>
                            <Brain className="w-4 h-4 mr-2 animate-pulse" />
                            AI Analyzing...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Image
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Image Preview */}
                  {imagePreviewUrls.length > 0 && (
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-md">
                          <img 
                            src={imagePreviewUrls[0]} 
                            alt="Memory preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, images: [] }))
                            setImagePreviewUrls([])
                            setAiResults(null)
                            setShowAiResults(false)
                          }}
                          className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0 shadow-md"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {isProcessing && (
                        <div className="flex items-center justify-center space-y-2 py-4">
                          <div className="flex items-center gap-3">
                            <Brain className="w-6 h-6 text-purple-500 animate-pulse" />
                            <div className="text-center">
                              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                🧠 AI is analyzing your memory...
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Extracting emotions, context, and details
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* AI Results */}
                  {showAiResults && aiResults && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-purple-500" />
                          AI Extracted Details
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {Math.round(aiResults.confidence * 100)}% confidence
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={retryAIAnalysis}
                            className="text-xs"
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Retry
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Title</Label>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{aiResults.title}</p>
                          </div>
                          <div>
                            <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Location</Label>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{aiResults.location}</p>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Content</Label>
                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{aiResults.content}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Tags:</Label>
                          {aiResults.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-center gap-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowAiResults(false)
                            toast.info('✏️ Switched to manual editing', {
                              description: 'You can now edit all fields manually'
                            })
                          }}
                          className="bg-white/80 dark:bg-gray-800/80"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Manually
                        </Button>
                        <Button
                          onClick={applyAIResults}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Use AI Results
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Additional Details Section for AI Mode */}
                  {(aiResults || formData.images.length > 0) && (
                    <div className="space-y-6 mt-6">
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-4 flex items-center gap-2">
                          <Edit3 className="h-5 w-5" />
                          Additional Details
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Review and update the details below. AI has {aiResults ? 'pre-filled' : 'will pre-fill'} some information, but you can modify anything.
                        </p>
                        
                        <div className="space-y-6">
                          {/* Title and Content Fields */}
                          <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="ai-title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Memory Title *
                              </Label>
                              <Input
                                id="ai-title"
                                placeholder="Give your memory a meaningful title..."
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="h-12 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/60 transition-all duration-300"
                                maxLength={100}
                              />
                              <p className="text-xs text-gray-500 text-right">{formData.title.length}/100</p>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="ai-content" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Memory Content *
                              </Label>
                              <Textarea
                                id="ai-content"
                                placeholder="Describe what happened, how you felt, who was there, what made it special..."
                                value={formData.content}
                                onChange={(e) => handleInputChange('content', e.target.value)}
                                className="min-h-[120px] resize-none bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/60 transition-all duration-300"
                                maxLength={1000}
                              />
                              <p className="text-xs text-gray-500 text-right">{formData.content.length}/1000</p>
                            </div>
                          </div>
                          
                          {/* Date, Location, People Fields */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="ai-date" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                <Calendar className="inline h-4 w-4 mr-2" />
                                Date
                              </Label>
                              <Input
                                id="ai-date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                                className="h-12 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/60 transition-all duration-300"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="ai-location" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                <MapPin className="inline h-4 w-4 mr-2" />
                                Location
                              </Label>
                              <Input
                                id="ai-location"
                                placeholder="Where did this happen?"
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                className="h-12 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/60 transition-all duration-300"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="ai-people" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              <Users className="inline h-4 w-4 mr-2" />
                              People Involved
                            </Label>
                            <Input
                              id="ai-people"
                              placeholder="Who was with you? (separate names with commas)"
                              value={formData.people}
                              onChange={(e) => handleInputChange('people', e.target.value)}
                              className="h-12 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/60 transition-all duration-300"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* How it works */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      How it works
                    </h3>
                    <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-2 list-decimal list-inside">
                      <li>Upload a clear image of your memory</li>
                      <li>AI analyzes and extracts memory details automatically</li>
                      <li>Review and edit the extracted information below</li>
                      <li>Proceed to mood selection and finalize your memory</li>
                    </ol>
                    
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/50 rounded-lg p-4 mt-4">
                      <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-2 flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Tips for best results
                      </h4>
                      <ul className="text-xs text-orange-700 dark:text-orange-300 space-y-1 list-disc list-inside">
                        <li>Use clear, well-lit images</li>
                        <li>Try to capture the whole scene or moment</li>
                        <li>Images with people, places, or activities work best</li>
                        <li>Review and edit AI suggestions to add personal touches</li>
                        <li>Always verify dates, locations, and people names</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
                <Palette className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Capture the Emotion
              </h2>
              <p className="text-gray-600 dark:text-gray-300">How did this memory make you feel?</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Select Your Mood *
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {moodOptions.map((mood) => (
                    <Tooltip key={mood.value}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => handleInputChange('mood', mood.value)}
                          className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                            formData.mood === mood.value
                              ? `${mood.bgColor} border-current shadow-lg shadow-current/20`
                              : 'bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-r ${mood.color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
                            <mood.icon className="h-6 w-6 text-white" />
                          </div>
                          <p className={`text-sm font-semibold transition-colors duration-300 ${
                            formData.mood === mood.value
                              ? 'text-gray-800 dark:text-gray-200'
                              : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'
                          }`}>
                            {mood.label}
                          </p>
                          
                          {formData.mood === mood.value && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select {mood.label} mood</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>

              {/* Date, Location, People Fields */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="step2-date" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Date
                    </Label>
                    <Input
                      id="step2-date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="h-12 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500/60 transition-all duration-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="step2-location" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <MapPin className="inline h-4 w-4 mr-2" />
                      Location
                    </Label>
                    <Input
                      id="step2-location"
                      placeholder="Where did this happen?"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="h-12 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500/60 transition-all duration-300"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="step2-people" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Users className="inline h-4 w-4 mr-2" />
                    People Involved
                  </Label>
                  <Input
                    id="step2-people"
                    placeholder="Who was with you? (separate names with commas)"
                    value={formData.people}
                    onChange={(e) => handleInputChange('people', e.target.value)}
                    className="h-12 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500/60 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Tag className="inline h-4 w-4 mr-2" />
                  Tags (Optional)
                </Label>
                
                <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-3 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl">
                  {formData.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors cursor-pointer group"
                      onClick={() => removeTag(tag)}
                    >
                      #{tag}
                      <X className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Badge>
                  ))}
                  
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag(newTag)
                      }
                    }}
                    className="flex-1 min-w-[120px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Suggested tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.filter(tag => !formData.tags.includes(tag)).slice(0, 8).map((tag) => (
                      <Button
                        key={tag}
                        variant="outline"
                        size="sm"
                        onClick={() => addTag(tag)}
                        className="h-7 px-3 text-xs bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 rounded-full"
                      >
                        #{tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Camera className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Add Visual Memories
              </h2>
              <p className="text-gray-600 dark:text-gray-300">Upload images to make your memory more vivid (Optional)</p>
            </div>

            <div className="space-y-6">
              {/* Image Upload Area */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Image className="inline h-4 w-4 mr-2" />
                  Photos ({formData.images.length}/5)
                </Label>
                
                <div 
                  className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500 ${
                    dragActive 
                      ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/30'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    className="hidden"
                  />
                  
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        Drop images here or click to browse
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Support: JPG, PNG, GIF up to 5MB each
                      </p>
                    </div>
                    
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white/80 dark:bg-gray-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                </div>
                
                {/* Image Previews */}
                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                          <img 
                            src={url} 
                            alt={`Preview ${index + 1}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Memory Preview */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Sparkles className="inline h-4 w-4 mr-2" />
                  Memory Preview
                </Label>
                
                <Card className="bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-700/90 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {formData.title || 'Untitled Memory'}
                      </CardTitle>
                      {formData.mood && (
                        <div className={`p-2 rounded-lg ${moodOptions.find(m => m.value === formData.mood)?.bgColor}`}>
                          {React.createElement(moodOptions.find(m => m.value === formData.mood)?.icon || Smile, {
                            className: "h-5 w-5"
                          })}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(formData.date).toLocaleDateString()}
                      </span>
                      {formData.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {formData.location}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {formData.content && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {formData.content}
                      </p>
                    )}
                    
                    {formData.people && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{formData.people}</span>
                      </div>
                    )}
                    
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Smooth scrolling to top when step changes
  const scrollToTop = () => {
    const element = document.querySelector('[data-memory-form]')
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
    } else {
      // Fallback to window scroll
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      })
    }
  }

  // Handle step changes with smooth scrolling
  const handleStepChange = (newStep: number) => {
    setCurrentStep(newStep)
    // Small delay to ensure content is rendered before scrolling
    setTimeout(() => {
      scrollToTop()
    }, 50)
  }

  return (
    <TooltipProvider>
      <div 
        className="space-y-6 relative scroll-smooth"
        data-memory-form
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch', // iOS smooth scrolling
        }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl blur-3xl animate-pulse"></div>
          {/* <div className="relative">
            <h1 className="text-4xl font-black bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Add New Memory
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Share your story and preserve what matters most ✨</p>
          </div> */}
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-xl border-0 shadow-2xl shadow-blue-500/10 overflow-hidden">
            {/* Progress Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50/80 via-purple-50/80 to-green-50/80 dark:from-gray-800/80 dark:via-gray-700/80 dark:to-gray-800/80 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-2xl flex items-center justify-center shadow-md">
                    <PlusCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800 dark:text-gray-200">Step {currentStep} of {totalSteps}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {currentStep === 1 && "Basic Information"}
                      {currentStep === 2 && "Mood & Tags"}
                      {currentStep === 3 && "Images & Preview"}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    {Math.round(progress)}% Complete
                  </div>
                  <Progress value={progress} className="w-32 h-2" />
                </div>
              </div>
            </div>

            <CardContent 
              className="p-8 overflow-hidden"
              style={{
                scrollBehavior: 'smooth',
                overflowX: 'hidden',
                overflowY: 'auto'
              }}
            >
              <div className="transition-all duration-500 ease-in-out">
                {renderStepContent()}
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <Button 
                  variant="outline"
                  onClick={() => handleStepChange(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white/80 dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-3">
                  {Array.from({ length: totalSteps }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handleStepChange(i + 1)}
                      disabled={i + 1 > currentStep && !canProceedToNext()}
                      className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed ${
                        i + 1 <= currentStep 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-md cursor-pointer' 
                          : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 cursor-pointer'
                      }`}
                      title={`Go to step ${i + 1}`}
                    />
                  ))}
                </div>
                
                {currentStep < totalSteps ? (
                  <Button 
                    onClick={() => handleStepChange(Math.min(totalSteps, currentStep + 1))}
                    disabled={!canProceedToNext()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    disabled={!canProceedToNext() || isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group min-w-[120px]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                        Save Memory
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
