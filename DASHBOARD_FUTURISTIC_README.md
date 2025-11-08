# 🌈 Futuristic Dashboard V2 — Global Mood Theming

**Memory Bank** — AI-powered journaling with emotional intelligence

---

## 🎯 Overview

This is a **production-ready, Awwwards-level futuristic dark-mode dashboard** with **global mood theming** that dynamically changes the entire app's visual identity based on the user's emotional state.

### Key Features

✅ **Global Mood Context** — Mood changes apply app-wide (not just one component)  
✅ **Refined Stat Cards** — 85-90% size with perfect spacing and subtle glows  
✅ **Dynamic Color System** — All gradients, glows, and accents adapt to active mood  
✅ **Smooth Transitions** — Framer Motion cross-fade animations on mood switch  
✅ **Glassmorphism + Soft Gradients** — Modern futuristic aesthetic  
✅ **Responsive & Accessible** — Works perfectly on all screen sizes  

---

## 🎨 Mood System

### Available Moods

| Mood | Primary | Secondary | Vibe | Use Case |
|------|---------|-----------|------|----------|
| **Calm** | `#0EA5E9` (Cyan) | `#3B82F6` (Blue) | 🌊 Peaceful, reflective | Morning journaling, meditation |
| **Focused** | `#8B5CF6` (Violet) | `#6366F1` (Indigo) | 🎯 Concentrated, productive | Work sessions, deep thinking |
| **Positive** | `#22C55E` (Green) | `#84CC16` (Lime) | 🌈 Energetic, optimistic | Gratitude logging, wins |
| **Neutral** | `#334155` (Slate) | `#1E293B` (Dark) | ⚖️ Balanced, grounded | Default, general use |

### What Changes with Mood?

**Globally Affected Elements:**
- Background gradient
- Animated particle colors
- All card glows and borders
- Button gradients
- Icon accent colors
- Hover effects
- Chart colors
- Tag highlights
- Avatar borders

---

## 🏗️ Architecture

### File Structure

```
ai-memory-bank/
├── contexts/
│   └── MoodContext.tsx              # Global mood state + provider
├── components/
│   └── dashboard-futuristic-v2.tsx  # Main dashboard component
└── app/
    └── dashboard-futuristic/
        └── page.tsx                 # Page wrapper with MoodProvider
```

### How It Works

1. **MoodContext** provides global mood state via React Context
2. **MoodProvider** wraps the entire dashboard page
3. **useMood()** hook is used by any component to access mood colors
4. **Mood Switcher** (top-right) changes mood globally with smooth transitions
5. All components reactively update their colors via `moodColors` object

---

## 🧩 Components

### 1. MoodContext (`contexts/MoodContext.tsx`)

Global state management for mood theming.

**Key Functions:**
- `setMood(mood)` — Changes active mood
- `currentMood` — Current mood string
- `moodColors` — Dynamic color palette object

**Color Palette Structure:**
```typescript
{
  primary: string        // Main color
  secondary: string      // Gradient end color
  glow: string          // Shadow/glow rgba
  accent: string        // Highlight color
  gradient: string      // Tailwind gradient class
  bgGradient: string    // Background gradient
  cardGlow: string      // Card shadow class
  textAccent: string    // Text color class
  buttonGradient: string // Button gradient class
}
```

### 2. DashboardFuturisticV2 (`components/dashboard-futuristic-v2.tsx`)

Main dashboard component with mood-aware theming.

**Sections:**
1. **Hero Greeting** — Dynamic welcome with Memo's reflection
2. **Stat Cards** — 4 smaller cards (Total Memories, This Week, Positive Vibes, Growth Rate)
3. **Recent Memories** — Feed of latest entries with sentiment indicators
4. **Analytics Snapshot** — Mini chart + popular tags + most active day
5. **Pro Tip Card** — Motivational card with streak info
6. **Quick Actions** — 4 glowing action buttons

**Props:**
```typescript
{
  userName?: string
  userAvatar?: string
  userId?: string
}
```

### 3. Page Wrapper (`app/dashboard-futuristic/page.tsx`)

Route handler with MoodProvider and MoodSwitcher.

---

## 🎛️ Stat Cards Design

### Size Reduction (85-90%)

**Before:**
- Padding: `p-5` (20px)
- Text: `text-4xl`
- Glow: Heavy

**After:**
- Padding: `p-4` (16px) — **20% smaller**
- Text: `text-3xl` — **Tighter**
- Glow: `0 0 20px` — **Subtler**
- Spacing: `gap-3` between cards

### Card Features

✅ Hover: Lift + glow amplification  
✅ Count-up animation on load  
✅ Mood-aware gradient blob  
✅ "+X" growth badge  
✅ Icon with mood-based gradient  

---

## 🎭 Animation System

### Framer Motion Animations

1. **Mood Switch** — 500ms cross-fade between color palettes
2. **Entry Animation** — Staggered card reveals (0.08s delay)
3. **Stat Count-Up** — 2-2.4s duration per stat
4. **Hover Effects** — 0.3s smooth scale + lift
5. **Background Particles** — Infinite pulse loops (8-20s)

### Animation Config

```typescript
containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
}
```

---

## 🎨 Design System

### Typography

- **Font:** Inter / Satoshi / Poppins (system fallback)
- **Heading:** 2xl-4xl, bold, tight tracking
- **Body:** sm-base, medium weight
- **Labels:** xs, uppercase, wide tracking

### Spacing Scale

- Cards: `gap-3` to `gap-4`
- Sections: `mb-6` to `mb-8`
- Padding: `p-4` to `p-6`
- Container: `max-w-7xl`

### Border Radius

- Cards: `rounded-2xl` (16px)
- Buttons: `rounded-xl` (12px)
- Quick Actions: `rounded-[24px]` (24px)
- Pills: `rounded-full`

### Glass Effect

```css
backdrop-filter: blur(16px);
background: rgba(255,255,255,0.03);
border: 1px solid rgba(255,255,255,0.08);
```

---

## 🔧 Usage

### Basic Setup

```tsx
import { MoodProvider } from "@/contexts/MoodContext"
import { DashboardFuturisticV2 } from "@/components/dashboard-futuristic-v2"

export default function Page() {
  return (
    <MoodProvider>
      <DashboardFuturisticV2 
        userName="Vikram"
        userId={userId}
      />
    </MoodProvider>
  )
}
```

### Using Mood in Other Components

```tsx
import { useMood } from "@/contexts/MoodContext"

export function MyComponent() {
  const { currentMood, moodColors } = useMood()
  
  return (
    <div 
      className="card"
      style={{ 
        borderColor: moodColors.primary,
        boxShadow: `0 0 20px ${moodColors.glow}`
      }}
    >
      <h2 style={{ color: moodColors.primary }}>
        Feeling {currentMood}
      </h2>
    </div>
  )
}
```

### Changing Mood Programmatically

```tsx
const { setMood } = useMood()

// On user action
setMood("focused") // Options: "calm" | "focused" | "positive" | "neutral"
```

---

## 🚀 Performance

### Optimizations

✅ **Debounced animations** — Smooth 60fps transitions  
✅ **Lazy image loading** — Avatar/media defer loading  
✅ **Memo-ized components** — Prevents unnecessary re-renders  
✅ **CSS-based animations** — Hardware-accelerated transforms  
✅ **Context-based state** — Efficient global mood sync  

### Bundle Impact

- **MoodContext:** ~2KB
- **Dashboard Component:** ~18KB
- **Framer Motion:** Already included

---

## 📱 Responsive Behavior

### Breakpoints

- **Mobile:** `< 768px` — 2 stat cards per row, stacked sections
- **Tablet:** `768px - 1024px` — 2-column grid
- **Desktop:** `> 1024px` — 4 stat cards, 3-column analytics

### Mobile Optimizations

- Reduced padding on small screens
- Touch-friendly buttons (min 44px)
- Simplified animations
- Single-column layout

---

## 🎯 Next Steps

### Suggested Enhancements

1. **Mood Persistence** — Already saves to localStorage ✅
2. **Auto-Mood Detection** — Use AI to suggest mood based on recent memories
3. **Mood Analytics** — Track mood changes over time
4. **Custom Moods** — Let users create custom color palettes
5. **Ambient Sounds** — Play different ambient audio per mood
6. **Accessibility** — High-contrast mode for low vision users

### Integration Ideas

- **Settings Page** — Let users set default mood
- **Onboarding** — Ask user's current mood on first login
- **Memory Creation** — Auto-suggest mood based on content
- **Notifications** — Mood-based notification colors

---

## 🐛 Troubleshooting

### Common Issues

**Problem:** Colors not changing on mood switch  
**Solution:** Ensure component is wrapped in `<MoodProvider>`

**Problem:** Animations stuttering  
**Solution:** Check `will-change` CSS properties, reduce particle count

**Problem:** White flash on mood change  
**Solution:** Ensure `AnimatePresence` with `mode="wait"` is used

**Problem:** LocalStorage error in SSR  
**Solution:** Use `typeof window !== "undefined"` checks (already implemented)

---

## 📦 Dependencies

Required packages (already installed):
- `framer-motion` — Animations
- `next` — Framework
- `react` — UI library
- `tailwindcss` — Styling
- `lucide-react` — Icons

---

## 🎨 Color Reference

### Calm (Cyan/Blue)
```
Primary: #0EA5E9
Secondary: #3B82F6
Accent: #06B6D4
Glow: rgba(14, 165, 233, 0.25)
```

### Focused (Violet/Indigo)
```
Primary: #8B5CF6
Secondary: #6366F1
Accent: #A78BFA
Glow: rgba(139, 92, 246, 0.25)
```

### Positive (Green/Lime)
```
Primary: #22C55E
Secondary: #84CC16
Accent: #10B981
Glow: rgba(34, 197, 94, 0.25)
```

### Neutral (Gray/Slate)
```
Primary: #334155
Secondary: #1E293B
Accent: #64748B
Glow: rgba(51, 65, 85, 0.25)
```

---

## 📄 License

Part of the **Memory Bank** project.

---

## 👨‍💻 Credits

**Designed for:** Vikram  
**Style:** Awwwards-level futuristic minimalism  
**Inspiration:** Vercel, Reflectly, Linear  
**Built with:** Next.js 15, Framer Motion, Tailwind CSS  

---

## 🌟 Features Checklist

✅ Global mood context provider  
✅ 85-90% smaller stat cards  
✅ Mood-aware gradients & glows  
✅ Smooth cross-fade transitions  
✅ Glassmorphism design  
✅ Count-up animations  
✅ Responsive layout  
✅ Hover interactions  
✅ Particle background  
✅ LocalStorage persistence  
✅ Production-ready code  

---

**Ready to deploy! 🚀**

Visit `/dashboard-futuristic` to see it in action.
