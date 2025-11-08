# Memory Bank Dashboard - Feature Guide

## 🎨 Unified Mood & Theme System

### Global Mood Modes
The dashboard supports **5 mood modes** that transform the entire UI experience:

1. **🌊 Calm** - Serene blue gradient theme for peaceful reflection
2. **🎯 Focused** - Deep purple gradient for intense concentration
3. **✨ Positive** - Vibrant emerald-teal gradient for uplifting energy
4. **⚖️ Neutral** - Balanced slate gradient for steady productivity
5. **💻 Normal** - Traditional developer mode with Dark/Light toggle

### Normal Mode (Developer Mode)
When you select **Normal mode**, you get access to a traditional dark/light theme switcher:
- **Dark Mode**: Deep navy gradient (`#0B0E14 → #111827`)
- **Light Mode**: Clean white gradient (`#F9FAFB → #E5E7EB`)

The dark/light toggle button appears automatically when Normal mode is active:
- **Desktop**: Next to mood selector in the header
- **Mobile**: Below mood selector in dropdown

## 🔔 Toast Notifications
Beautiful, contextual toast notifications appear when you:
- Switch between mood modes (displays mood emoji + name)
- Toggle between Dark and Light modes in Normal mode
- Notifications auto-dismiss after 2.5 seconds
- Positioned at bottom-right with translucent backdrop

**Toast Features:**
- Mood-aware border colors and glow effects
- Smooth slide-in animations
- Close button for manual dismiss
- Rich colors for better visual feedback

## 🔍 Expandable Search Bar
Interactive search functionality in the header:
- **Collapsed**: Shows magnifying glass icon
- **Expanded**: Full search input with placeholder "Search memories..."
- **Interaction**: 
  - Click icon to expand
  - Auto-focus on expansion
  - Collapses when empty and blurred
  - 300ms smooth width transition

## 📱 Responsive Design
Optimized for all screen sizes:

### Desktop (≥768px)
- Full horizontal mood selector
- Expandable search (240px when active)
- Side-by-side layout with persistent sidebar

### Mobile (<768px)
- Compact emoji-only mood selector
- Hamburger menu for sidebar navigation
- Full-width content area
- Touch-optimized controls

## ⚡ Performance Optimizations
Built for smooth, lag-free experience:

### GPU Acceleration
```css
transform: translateZ(0);
will-change: transform, opacity;
```

### Smooth Scrolling
- `scroll-behavior: smooth` on main container
- `overflow-y-auto` for content areas
- Debounced scroll effects

### Optimized Shadows & Glows
- Reduced blur radius: `0 0 25px` (down from 40-50px)
- Lower opacity: `0.15` for glows
- Minimal box-shadow complexity

### Motion Optimization
- 600ms transition duration (balanced speed/smoothness)
- `ease-in-out` easing for natural feel
- Conditional particle animations (disabled in Normal mode)

## 📐 Layout & Spacing

### Consistent Top Margins
All main sections use responsive top spacing:
```tsx
mt-6 md:mt-8 lg:mt-10
```

### Grid Layout
Dashboard content uses a clean 3-column grid:
```tsx
grid grid-cols-1 lg:grid-cols-3 gap-6
```
- **Recent Memories**: 2/3 width (8 columns)
- **Analytics Snapshot**: 1/3 width (4 columns)
- Collapses to single column on mobile

### Stat Cards
Refined sizing for better visual balance:
- Height reduced by 10% from baseline
- Padding: `p-3.5`
- Font size: `text-xl md:text-2xl`
- Growth badges positioned top-right

## 🎯 Visual Style Guide

### Design Language
- **Futuristic Minimalism** with soft emotional undertones
- **Typography**: Inter / Satoshi / Urbanist fonts
- **Corner Radius**: 1.25rem (rounded-2xl)
- **Glow Style**: Soft ambient under-light, not harsh neon

### Color Palettes

#### Calm Mode
- Primary: `#0EA5E9` (Sky Blue)
- Secondary: `#2563EB` (Blue)
- Gradient: Sky to Deep Blue

#### Focused Mode
- Primary: `#7C3AED` (Violet)
- Secondary: `#3B82F6` (Blue)
- Gradient: Purple to Blue

#### Positive Mode
- Primary: `#10B981` (Emerald)
- Secondary: `#14B8A6` (Teal)
- Gradient: Emerald to Teal

#### Neutral Mode
- Primary: `#1E293B` (Slate)
- Secondary: `#334155` (Slate)
- Gradient: Dark Slate to Slate

#### Normal Mode
- **Dark**: `#0B0E14 → #111827` with blue accents
- **Light**: `#F9FAFB → #E5E7EB` with gray tones

### Animation Guidelines
- Hover effects: `scale: 1.05` with 300ms duration
- Tap effects: `scale: 0.95`
- Mood transitions: 600ms fade with backdrop blur
- Subtle hover pulses, not heavy motion

## 🔧 Technical Stack
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS with custom mood variables
- **Animations**: Framer Motion for smooth transitions
- **State Management**: React Context (MoodContext)
- **Notifications**: Sonner (react-hot-toast alternative)
- **Icons**: Lucide React

## 💾 Persistence
All preferences are saved to browser localStorage:
- **Current mood**: `localStorage.getItem('userMood')`
- **Dark mode preference**: `localStorage.getItem('darkMode')`
- Settings persist across page refreshes and sessions

## 🎨 Customization
The mood system is built on a flexible context API. To customize:

1. **Add new mood**: Extend `MoodType` in `MoodContext.tsx`
2. **Modify colors**: Update `moodPalettes` object
3. **Adjust animations**: Configure Framer Motion variants
4. **Change transitions**: Update `duration` props (recommend 500-700ms)

## 📝 Usage Tips
1. **Start with Normal mode** for familiar dark/light theming
2. **Try different moods** based on your current task or feeling
3. **Use search** to quickly find specific memories
4. **Watch for toast notifications** when switching modes
5. **Check mobile view** - it adapts beautifully!

## 🚀 Future Enhancements
Potential additions:
- Custom mood presets (user-defined colors)
- Scheduled mood switching (auto-change by time of day)
- Mood-based memory filtering
- Advanced search with filters
- Keyboard shortcuts for mode switching

---

Built with ❤️ for Vikram's Memory Bank
