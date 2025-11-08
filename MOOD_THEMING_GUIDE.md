# 🎨 Quick Mood Theming Guide

**How to apply global mood theming to any component in Memory Bank**

---

## 🚀 Quick Start (3 Steps)

### 1. Wrap Your Page with MoodProvider

```tsx
// app/your-page/page.tsx
import { MoodProvider } from "@/contexts/MoodContext"

export default function YourPage() {
  return (
    <MoodProvider>
      <YourContent />
    </MoodProvider>
  )
}
```

### 2. Use the useMood Hook

```tsx
// components/YourComponent.tsx
"use client"

import { useMood } from "@/contexts/MoodContext"

export function YourComponent() {
  const { currentMood, moodColors } = useMood()
  
  return (
    <div style={{ color: moodColors.primary }}>
      Currently feeling: {currentMood}
    </div>
  )
}
```

### 3. Apply Mood Colors

```tsx
// Inline styles
<div style={{ 
  background: `linear-gradient(135deg, ${moodColors.primary}, ${moodColors.secondary})`,
  boxShadow: `0 0 20px ${moodColors.glow}`
}}>
  Mood-aware content
</div>

// Tailwind classes + inline
<button 
  className="px-4 py-2 rounded-lg"
  style={{ 
    background: `linear-gradient(135deg, ${moodColors.primary}, ${moodColors.secondary})`
  }}
>
  Click me
</button>
```

---

## 🎨 Available Color Properties

```typescript
const { moodColors } = useMood()

moodColors.primary       // "#0EA5E9" (main color)
moodColors.secondary     // "#3B82F6" (gradient end)
moodColors.glow          // "rgba(14,165,233,0.25)" (shadows)
moodColors.accent        // "#06B6D4" (highlights)
moodColors.gradient      // "from-[#0EA5E9] to-[#3B82F6]" (Tailwind)
moodColors.bgGradient    // "from-[#0B0E14] via-[#1E3A8A]/20..." (background)
moodColors.cardGlow      // "shadow-[0_0_25px_rgba(...)]" (card shadows)
moodColors.textAccent    // "text-cyan-400" (text color class)
moodColors.buttonGradient // "from-cyan-500 to-blue-500" (button gradients)
```

---

## 📝 Common Patterns

### Pattern 1: Mood-Aware Card

```tsx
<Card 
  className={`border backdrop-blur-xl ${moodColors.cardGlow}`}
  style={{ 
    borderColor: `${moodColors.primary}30`,
    background: 'rgba(255,255,255,0.03)'
  }}
>
  <div className="p-6">
    <h3 style={{ color: moodColors.primary }}>Card Title</h3>
    <p className="text-gray-400">Content here</p>
  </div>
</Card>
```

### Pattern 2: Gradient Button

```tsx
<button
  className="px-6 py-3 rounded-xl font-semibold text-white transition-all"
  style={{
    background: `linear-gradient(135deg, ${moodColors.primary}, ${moodColors.secondary})`,
    boxShadow: `0 4px 20px ${moodColors.glow}`
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = `0 6px 30px ${moodColors.glow}`
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = `0 4px 20px ${moodColors.glow}`
  }}
>
  Action Button
</button>
```

### Pattern 3: Icon with Mood Color

```tsx
import { Sparkles } from "lucide-react"

<Sparkles 
  className="w-6 h-6"
  style={{ color: moodColors.primary }}
/>
```

### Pattern 4: Animated Background Particle

```tsx
import { motion } from "framer-motion"

<motion.div
  className="absolute w-96 h-96 rounded-full blur-[100px]"
  style={{ backgroundColor: `${moodColors.primary}15` }}
  animate={{
    scale: [1, 1.2, 1],
    opacity: [0.3, 0.5, 0.3]
  }}
  transition={{
    duration: 8,
    repeat: Infinity,
    ease: "easeInOut"
  }}
/>
```

### Pattern 5: Badge/Tag

```tsx
<Badge
  className="border-0 text-xs"
  style={{
    backgroundColor: `${moodColors.primary}20`,
    color: moodColors.primary
  }}
>
  #tag
</Badge>
```

### Pattern 6: Progress Bar

```tsx
<div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
  <div
    className="h-full transition-all duration-500"
    style={{
      width: '75%',
      background: `linear-gradient(90deg, ${moodColors.primary}, ${moodColors.secondary})`
    }}
  />
</div>
```

---

## 🎭 Changing Mood

### From UI (Button/Dropdown)

```tsx
import { useMood } from "@/contexts/MoodContext"

function MoodSelector() {
  const { currentMood, setMood } = useMood()
  
  return (
    <div className="flex gap-2">
      {["calm", "focused", "positive", "neutral"].map(mood => (
        <button
          key={mood}
          onClick={() => setMood(mood as any)}
          className={currentMood === mood ? "active" : ""}
        >
          {mood}
        </button>
      ))}
    </div>
  )
}
```

### Programmatically (Based on Logic)

```tsx
import { useMood } from "@/contexts/MoodContext"

function SmartMoodDetector() {
  const { setMood } = useMood()
  
  useEffect(() => {
    // Auto-detect mood from user activity
    const hour = new Date().getHours()
    
    if (hour < 12) setMood("calm")      // Morning
    else if (hour < 18) setMood("focused") // Afternoon
    else setMood("positive")            // Evening
  }, [])
  
  return null
}
```

---

## 🎨 CSS Custom Properties Alternative

If you prefer CSS variables, update MoodContext to inject them:

```tsx
// In MoodContext.tsx, add to MoodProvider:
useEffect(() => {
  const root = document.documentElement
  root.style.setProperty('--mood-primary', moodColors.primary)
  root.style.setProperty('--mood-secondary', moodColors.secondary)
  root.style.setProperty('--mood-glow', moodColors.glow)
}, [moodColors])
```

Then use in CSS:

```css
.my-element {
  color: var(--mood-primary);
  box-shadow: 0 0 20px var(--mood-glow);
}
```

---

## 🧪 Testing Different Moods

```tsx
// Add to your dev page for quick testing
export function MoodTester() {
  const { setMood } = useMood()
  
  useEffect(() => {
    const interval = setInterval(() => {
      const moods = ["calm", "focused", "positive", "neutral"]
      const random = moods[Math.floor(Math.random() * moods.length)]
      setMood(random as any)
    }, 3000) // Change every 3 seconds
    
    return () => clearInterval(interval)
  }, [])
  
  return null
}
```

---

## 🔍 Mood Reference Table

| Mood | When to Use | Color Palette | Emotion |
|------|-------------|---------------|---------|
| **Calm** | Morning, meditation, reflection | Cyan/Blue | 🌊 Peaceful |
| **Focused** | Work, deep thinking, productivity | Violet/Indigo | 🎯 Concentrated |
| **Positive** | Gratitude, wins, celebration | Green/Lime | 🌈 Energetic |
| **Neutral** | Default, balanced state | Gray/Slate | ⚖️ Grounded |

---

## ⚡ Performance Tips

1. **Use inline styles for colors** — Avoid creating dynamic Tailwind classes
2. **Memoize components** — Use `React.memo()` for expensive renders
3. **Batch state updates** — Change mood once, not multiple times
4. **Use CSS transitions** — Let CSS handle color changes when possible

```tsx
// ✅ Good - Smooth CSS transition
<div 
  className="transition-all duration-500"
  style={{ borderColor: moodColors.primary }}
/>

// ❌ Avoid - Abrupt change
<div 
  style={{ borderColor: moodColors.primary }}
/>
```

---

## 🐛 Common Mistakes

### ❌ Using useMood Outside Provider

```tsx
// This will crash!
export default function Page() {
  const { currentMood } = useMood() // Error!
  return <div>{currentMood}</div>
}
```

### ✅ Correct Way

```tsx
export default function Page() {
  return (
    <MoodProvider>
      <Content />
    </MoodProvider>
  )
}

function Content() {
  const { currentMood } = useMood() // ✅ Works!
  return <div>{currentMood}</div>
}
```

---

## 📦 Example: Full Component

```tsx
"use client"

import { useMood } from "@/contexts/MoodContext"
import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function MoodCard() {
  const { currentMood, moodColors, setMood } = useMood()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        className="p-6 border backdrop-blur-xl"
        style={{
          borderColor: `${moodColors.primary}30`,
          background: 'rgba(255,255,255,0.03)',
          boxShadow: `0 0 30px ${moodColors.glow}`
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles 
            className="w-6 h-6"
            style={{ color: moodColors.primary }}
          />
          <h3 className="text-xl font-bold">
            Current Mood: {currentMood}
          </h3>
        </div>
        
        <div className="flex gap-2">
          {["calm", "focused", "positive", "neutral"].map(mood => (
            <button
              key={mood}
              onClick={() => setMood(mood as any)}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentMood === mood ? 'scale-105' : 'opacity-60'
              }`}
              style={{
                background: currentMood === mood 
                  ? `linear-gradient(135deg, ${moodColors.primary}, ${moodColors.secondary})`
                  : 'rgba(255,255,255,0.1)',
                color: currentMood === mood ? 'white' : moodColors.primary
              }}
            >
              {mood}
            </button>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
```

---

## 🎯 Integration Checklist

When adding mood theming to a new page:

- [ ] Wrap page with `<MoodProvider>`
- [ ] Import `useMood` hook in components
- [ ] Replace hardcoded colors with `moodColors.*`
- [ ] Add smooth transitions (`transition-all duration-500`)
- [ ] Test all 4 moods (Calm, Focused, Positive, Neutral)
- [ ] Ensure responsive design still works
- [ ] Check accessibility (contrast ratios)

---

**Questions? Check the full docs in `DASHBOARD_FUTURISTIC_README.md`**
