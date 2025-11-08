# Memory Bank — Design Tokens & Visual Reference

## 🎨 Complete Design System

---

## Color Tokens

### Base Colors (Dark Mode)

```typescript
export const colors = {
  // Background
  bg: {
    primary: '#0B0E14',
    secondary: '#101827',
    glass: 'rgba(255,255,255,0.03)',
    glassHover: 'rgba(255,255,255,0.06)',
    glassActive: 'rgba(255,255,255,0.08)',
  },
  
  // Borders
  border: {
    subtle: 'rgba(255,255,255,0.08)',
    medium: 'rgba(255,255,255,0.15)',
    strong: 'rgba(255,255,255,0.25)',
  },
  
  // Text
  text: {
    primary: '#F9FAFB',
    secondary: '#E5E7EB',
    muted: '#9CA3AF',
    disabled: '#6B7280',
  },
  
  // Brand Gradients
  gradient: {
    cyanBlue: 'linear-gradient(90deg, #00C6FF 0%, #0072FF 100%)',
    violetPink: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    greenEmerald: 'linear-gradient(90deg, #22C55E 0%, #10B981 100%)',
    pinkRose: 'linear-gradient(90deg, #EC4899 0%, #F43F5E 100%)',
  },
  
  // Mood Colors
  mood: {
    calm: {
      primary: '#1E3A8A',
      gradient: 'from-[#0B0E14] via-[#1E3A8A]/20 to-[#0B0E14]',
    },
    focused: {
      primary: '#6B21A8',
      gradient: 'from-[#0B0E14] via-[#6B21A8]/20 to-[#0B0E14]',
    },
    positive: {
      primary: '#065F46',
      gradient: 'from-[#0B0E14] via-[#065F46]/20 to-[#0B0E14]',
    },
    neutral: {
      primary: '#1F2937',
      gradient: 'from-[#0B0E14] via-[#1F2937]/20 to-[#0B0E14]',
    },
  },
  
  // Semantic Colors
  semantic: {
    success: '#22C55E',
    warning: '#FACC15',
    error: '#EF4444',
    info: '#3B82F6',
  },
}
```

---

## Shadow Tokens

### Glow Effects

```typescript
export const shadows = {
  // Card Glows
  glow: {
    cyan: '0 0 30px rgba(0,198,255,0.2)',
    cyanHover: '0 0 40px rgba(0,198,255,0.35)',
    violet: '0 0 30px rgba(139,92,246,0.2)',
    violetHover: '0 0 40px rgba(139,92,246,0.35)',
    green: '0 0 30px rgba(34,197,94,0.2)',
    greenHover: '0 0 40px rgba(34,197,94,0.35)',
    pink: '0 0 30px rgba(236,72,153,0.2)',
    pinkHover: '0 0 40px rgba(236,72,153,0.35)',
  },
  
  // Element Shadows
  card: '0 10px 25px rgba(0,0,0,0.35)',
  cardHover: '0 20px 40px rgba(0,0,0,0.45)',
  button: '0 4px 12px rgba(0,0,0,0.3)',
  avatar: '0 0 20px rgba(0,198,255,0.3)',
  
  // Mood Indicators
  moodDot: {
    green: '0 0 10px rgba(34,197,94,0.5)',
    yellow: '0 0 10px rgba(250,204,21,0.5)',
    blue: '0 0 10px rgba(59,130,246,0.5)',
  },
}
```

---

## Typography Tokens

### Font Scale

```typescript
export const typography = {
  // Font Families
  fontFamily: {
    base: 'system-ui, -apple-system, sans-serif',
    display: 'Satoshi, Inter, system-ui, sans-serif',
    mono: 'Fira Code, Monaco, monospace',
  },
  
  // Font Sizes
  fontSize: {
    xs: '0.625rem',    // 10px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  
  // Font Weights
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Letter Spacing
  letterSpacing: {
    tight: '-0.01em',
    normal: '0',
    wide: '0.01em',
    wider: '0.05em',
  },
}
```

---

## Spacing Tokens

```typescript
export const spacing = {
  // Card Padding
  card: {
    sm: '1rem',      // 16px
    md: '1.5rem',    // 24px
    lg: '2rem',      // 32px
  },
  
  // Section Spacing
  section: {
    xs: '1rem',      // 16px
    sm: '1.5rem',    // 24px
    md: '2rem',      // 32px
    lg: '3rem',      // 48px
    xl: '4rem',      // 64px
  },
  
  // Component Gaps
  gap: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
  },
}
```

---

## Border Radius Tokens

```typescript
export const borderRadius = {
  // Component Radii
  sm: '0.5rem',      // 8px
  md: '0.75rem',     // 12px
  lg: '1rem',        // 16px
  xl: '1.25rem',     // 20px
  '2xl': '1.5rem',   // 24px
  full: '9999px',    // Fully rounded
  
  // Specific Use Cases
  card: '1.25rem',      // 20px
  button: '1.5rem',     // 24px
  badge: '9999px',      // Full
  avatar: '9999px',     // Full
  input: '0.75rem',     // 12px
}
```

---

## Animation Tokens

### Duration

```typescript
export const animation = {
  // Duration
  duration: {
    instant: '50ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '800ms',
    countUp: '2000ms',
  },
  
  // Easing Curves
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    custom: 'cubic-bezier(0.22, 1, 0.36, 1)', // Smooth, organic
  },
  
  // Delays
  delay: {
    none: '0ms',
    short: '100ms',
    medium: '200ms',
    long: '500ms',
  },
}
```

### Framer Motion Variants

```typescript
export const motionVariants = {
  // Container (staggered children)
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  },
  
  // Fade + Slide Up
  fadeSlideUp: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  },
  
  // Scale In
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  },
  
  // Slide In (left)
  slideInLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  },
}
```

---

## Component Tokens

### Buttons

```typescript
export const button = {
  // Sizes
  size: {
    sm: {
      height: '2rem',    // 32px
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
    },
    md: {
      height: '2.5rem',  // 40px
      padding: '0.625rem 1.5rem',
      fontSize: '1rem',
    },
    lg: {
      height: '3rem',    // 48px
      padding: '0.75rem 2rem',
      fontSize: '1.125rem',
    },
    xl: {
      height: '8rem',    // 128px (Quick Actions)
      padding: '1.5rem',
      fontSize: '1rem',
    },
  },
  
  // Variants
  variant: {
    primary: {
      bg: 'linear-gradient(90deg, #00C6FF 0%, #0072FF 100%)',
      shadow: '0 0 30px rgba(0,198,255,0.2)',
    },
    secondary: {
      bg: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
    },
    ghost: {
      bg: 'transparent',
      hover: 'rgba(255,255,255,0.05)',
    },
  },
}
```

### Cards

```typescript
export const card = {
  // Base Card
  base: {
    bg: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '1.25rem',
    backdropBlur: 'blur(12px)',
    shadow: '0 10px 25px rgba(0,0,0,0.35)',
  },
  
  // Hover State
  hover: {
    bg: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)',
    shadow: '0 20px 40px rgba(0,0,0,0.45)',
    transform: 'translateY(-2px)',
  },
  
  // Variants
  variant: {
    glass: {
      bg: 'rgba(255,255,255,0.03)',
      backdropBlur: 'blur(12px)',
    },
    solid: {
      bg: '#1F2937',
      backdropBlur: 'none',
    },
    gradient: {
      bg: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.1))',
    },
  },
}
```

### Badges

```typescript
export const badge = {
  // Sizes
  size: {
    sm: {
      padding: '0.125rem 0.5rem',
      fontSize: '0.625rem',
    },
    md: {
      padding: '0.25rem 0.75rem',
      fontSize: '0.75rem',
    },
    lg: {
      padding: '0.375rem 1rem',
      fontSize: '0.875rem',
    },
  },
  
  // Variants
  variant: {
    mood: {
      bg: 'rgba(139,92,246,0.2)',
      color: '#C4B5FD',
      border: 'none',
    },
    tag: {
      bg: 'linear-gradient(90deg, rgba(0,198,255,0.2), rgba(139,92,246,0.2))',
      color: '#67E8F9',
      shadow: '0 0 15px rgba(0,198,255,0.15)',
    },
    status: {
      bg: 'rgba(34,197,94,0.2)',
      color: '#86EFAC',
      border: 'none',
    },
  },
}
```

---

## Icon Tokens

```typescript
export const icons = {
  // Sizes
  size: {
    xs: '0.75rem',   // 12px
    sm: '1rem',      // 16px
    md: '1.25rem',   // 20px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
  },
  
  // Colors (matches gradients)
  color: {
    cyan: '#00C6FF',
    violet: '#8B5CF6',
    green: '#22C55E',
    pink: '#EC4899',
    white: '#F9FAFB',
    muted: '#9CA3AF',
  },
}
```

---

## Layout Tokens

### Container

```typescript
export const layout = {
  // Max Widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    dashboard: '1440px',
  },
  
  // Breakpoints
  breakpoint: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Grid
  grid: {
    cols: {
      mobile: 2,
      tablet: 2,
      desktop: 4,
    },
    gap: {
      mobile: '1rem',
      tablet: '1.5rem',
      desktop: '2rem',
    },
  },
}
```

---

## Z-Index Scale

```typescript
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  tooltip: 50,
  toast: 60,
}
```

---

## Usage Examples

### Example 1: Hero Card

```tsx
<Card className={cn(
  "relative overflow-hidden",
  "border-0",
  "bg-white/[0.03]",
  "backdrop-blur-xl",
  "shadow-2xl shadow-cyan-500/5",
  "rounded-[20px]"
)}>
  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10" />
  
  {/* Content */}
  <div className="relative p-10">
    {/* ... */}
  </div>
</Card>
```

### Example 2: Stat Card with Glow

```tsx
<motion.div
  whileHover={{ 
    scale: 1.05,
    y: -8,
  }}
>
  <Card className={cn(
    "relative overflow-hidden",
    "border border-white/[0.08]",
    "bg-white/[0.03]",
    "backdrop-blur-xl",
    "hover:bg-white/[0.06]",
    "hover:border-white/[0.15]",
    "transition-all duration-500",
    "shadow-[0_0_30px_rgba(0,198,255,0.2)]",
    "hover:shadow-[0_0_40px_rgba(0,198,255,0.25)]"
  )}>
    {/* Gradient blob */}
    <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-20 blur-2xl" />
    
    {/* Content */}
  </Card>
</motion.div>
```

### Example 3: Quick Action Button

```tsx
<Button className={cn(
  "relative w-full h-32",
  "rounded-[24px]",
  "border-0 overflow-hidden",
  "bg-gradient-to-br from-cyan-500 to-blue-500",
  "shadow-[0_0_30px_rgba(0,198,255,0.2)]",
  "hover:shadow-[0_0_40px_rgba(0,198,255,0.35)]",
  "transition-all duration-300"
)}>
  {/* White overlay for depth */}
  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
  
  {/* Radial gradient */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_70%)]" />
  
  {/* Content */}
  <div className="relative z-10">
    {/* Icon + Text */}
  </div>
</Button>
```

---

## CSS Custom Properties

For easier customization, consider adding these to your globals.css:

```css
:root {
  /* Colors */
  --color-bg-primary: #0B0E14;
  --color-bg-secondary: #101827;
  --color-glass: rgba(255,255,255,0.03);
  --color-text-primary: #F9FAFB;
  --color-text-muted: #9CA3AF;
  
  /* Gradients */
  --gradient-cyan-blue: linear-gradient(90deg, #00C6FF 0%, #0072FF 100%);
  --gradient-violet-pink: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
  
  /* Shadows */
  --shadow-glow-cyan: 0 0 30px rgba(0,198,255,0.2);
  --shadow-card: 0 10px 25px rgba(0,0,0,0.35);
  
  /* Animation */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --easing-custom: cubic-bezier(0.22, 1, 0.36, 1);
}
```

---

## Tailwind Config Extension

Add these to your `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        glass: 'rgba(255,255,255,0.03)',
        'glass-hover': 'rgba(255,255,255,0.06)',
      },
      boxShadow: {
        'glow-cyan': '0 0 30px rgba(0,198,255,0.2)',
        'glow-violet': '0 0 30px rgba(139,92,246,0.2)',
        'glow-green': '0 0 30px rgba(34,197,94,0.2)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '12px',
        lg: '24px',
      },
    },
  },
}
```

---

This design token system ensures **consistency, maintainability, and scalability** across the entire Memory Bank dashboard. 🚀
