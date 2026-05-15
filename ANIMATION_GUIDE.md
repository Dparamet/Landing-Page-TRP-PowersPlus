# Animation Enhancement Guide

## Overview
The website has been enhanced with smooth, modern animations and transitions while maintaining the existing design, colors, and theme. All animations are performance-optimized and respect user preferences for reduced motion.

## Features Implemented

### 1. **Smooth Scrolling**
- Smooth scroll behavior across the entire site
- Custom scrollbar styling with hover effects
- Smooth scroll padding adjustment for sticky navbar

**Files affected:**
- `src/app/globals.css` - Added smooth scroll properties and scrollbar styling

### 2. **Page & Section Transitions**
- Subtle fade-in and scale animations when sections come into view
- Staggered animations for multiple elements within sections
- Scroll direction detection (fade from top when scrolling up, fade from bottom when scrolling down)

**Features:**
- `.section-reveal` class applies fade-in, scale, and saturation animations
- `.reveal-item` class for individual items within sections
- Staggered delay timing for smooth cascading effects

### 3. **Navbar Enhancements**
- Smooth shadow enhancement on scroll
- Animated logo hover effect with scale transformation
- Smooth gradient underline animations for nav links
- Enhanced hamburger menu with smooth transitions
- Mobile menu slides in with fade animation

**Key animations:**
- Navbar shadow grows on scroll (320ms transition)
- Logo scales up on hover
- Nav links have animated underline that expands on hover
- Mobile menu items stagger in with delay

### 4. **Component-Specific Animations**

#### **Hero Section** (`HeroContent.tsx`)
- Buttons lift and scale on hover
- Trust badges scale and lift with staggered delays
- Smooth color transitions on all interactive elements

#### **Services Section** (`Services.tsx`)
- Service cards lift (-2px translate) and enhance shadow on hover
- Card borders smooth color transition (orange → darker orange)
- Number badges scale up on parent hover
- List items slide right on parent hover
- Buttons lift and shadow enhances on hover

#### **Process Section** (`Process.tsx`)
- Step items lift and change background/border on hover
- Number badges scale up with shadow enhancement
- Staggered animation delays by index
- CTA container shadow enhances on hover

#### **ServiceSelector Component** (`ServiceSelector.tsx`)
- Tab buttons smoothly transition with conditional delays
- Selected tab lifts with shadow on transition
- Panel content slides in from right with fade animation
- Info columns get hover shadow and border color transition
- List items slide right on hover

#### **SolarCalculator Component** (`SolarCalculator.tsx`)
- Result cards lift on hover with shadow enhancement
- System type and roof profile buttons transition smoothly
- Tab content updates with smooth color transitions

#### **Portfolio Section** (`Portfolio.tsx`)
- Filter buttons transition smoothly with staggered delays
- Portfolio cards scale image on hover (1.05x scale)
- Category badges scale on hover
- Card shadows and borders enhance smoothly

#### **Contact Section** (`Contact.tsx`)
- Contact items slide right on hover
- Icon boxes lift and change background color
- Button groups transition smoothly
- Copy/open buttons have smooth hover effects

#### **FAQ Section** (`FAQ.tsx`)
- Accordion items lift on hover
- Plus icons rotate and scale when open
- Answer content slides down with fade animation
- Staggered item animations by index

### 5. **Global Hover Effects**
- All buttons, links, and clickable elements have smooth transitions (240-320ms)
- Hover effects include:
  - Y-axis translation (-1px to -2px)
  - Optional scale transformation (1.01-1.03)
  - Shadow enhancements
  - Color transitions
  - Border color transitions
- Active/pressed states with pressed-down visual feedback

### 6. **Micro-Interactions**
- Smooth transitions for all form inputs
- Focus states with outline and shadow
- Color transitions for text elements
- Smooth transforms for icons and decorative elements
- Badge scaling and transitions

## Animation Timing & Easing

### **Easing Functions Used**
1. **Smooth Easing** `cubic-bezier(0.22, 1, 0.36, 1)` - Main animations
2. **Snappy Easing** `cubic-bezier(0.16, 1, 0.3, 1)` - Hover and micro interactions
3. **Ease Out** - Default for most transitions
4. **Linear** - For opacity and simple color changes

### **Duration Standards**
- **Fast** (200-240ms) - Button hovers, color transitions
- **Normal** (280-320ms) - Link animations, navbar
- **Standard** (300ms) - Card hovers, section animations
- **Slow** (500-760ms) - Scroll reveal animations

## Responsive Behavior

All animations are:
- **Desktop Optimized** - Full smooth animations and transitions
- **Mobile Responsive** - Animations adapt to smaller screens
- **Accessibility Aware** - Respect `prefers-reduced-motion` media query
- **Performance Optimized** - Use CSS transforms and will-change for GPU acceleration

### **Mobile Considerations**
- Touch targets maintain hover effects on tap
- Swipe gestures remain smooth
- Animations work well on slower mobile devices
- No excessive transforms or complex animations on mobile

## Reduced Motion Support

The site respects user preferences:
```css
@media (prefers-reduced-motion: reduce) {
  /* All animations are disabled */
  /* Smooth scrolling is preserved for accessibility */
}
```

## CSS Classes for Animations

### **Scroll-Based Animations**
- `.section-reveal` - Section fade-in on scroll
- `.reveal-item` - Individual item fade-in
- `.reveal-from-top` - Item enters from top
- `.reveal-from-bottom` - Item enters from bottom
- `.is-visible` - Applied when element is visible
- `.reveal-delay-1`, `.reveal-delay-2`, `.reveal-delay-3` - Stagger delays

### **Motion Library (Unused for Now)**
- Animation utilities are prepared in `src/hooks/useAnimations.ts`
- Can be used for more complex Motion component animations in future
- Includes variants for page transitions, fades, slides, hovers, modals

## Files Modified

### **CSS Changes**
- `src/app/globals.css` - Added comprehensive animation keyframes and transitions

### **Component Updates**
- `src/components/Navbar.tsx` - Scroll animations and smooth transitions
- `src/components/HeroContent.tsx` - Hero animations and micro-interactions
- `src/components/Services.tsx` - Card hover effects and animations
- `src/components/Process.tsx` - Step animations and staggering
- `src/components/ServiceSelector.tsx` - Tab transitions and content animations
- `src/components/SolarCalculator.tsx` - Button and result card animations
- `src/components/Portfolio.tsx` - Filter and card animations
- `src/components/Contact.tsx` - Contact item animations
- `src/components/FAQ.tsx` - Accordion animations

### **New Files Created**
- `src/hooks/useAnimations.ts` - Reusable animation variants and utilities
- `src/components/AnimationWrappers.tsx` - Motion-based animation components
- `ANIMATION_GUIDE.md` - This documentation

## Browser Support

Animations work smoothly on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## Performance Considerations

All animations use:
- CSS transforms (translate, scale, rotate) for smooth 60fps
- GPU acceleration with `will-change` properties
- Staggered delays to avoid simultaneous heavy animations
- Optimized transition durations (not too fast, not too slow)
- No layout-triggering properties (left, top, width, height)

## Testing the Animations

### **Desktop Testing**
1. Hover over buttons, links, and cards
2. Click and expand accordion items
3. Switch between tabs in ServiceSelector
4. Scroll through the page to see section reveal animations
5. Resize the browser window to test responsive animations

### **Mobile Testing**
1. Test on mobile device or use browser dev tools
2. Tap on interactive elements
3. Scroll smoothly through sections
4. Check that animations feel responsive
5. Test in landscape and portrait modes

### **Accessibility Testing**
1. Enable "Reduce motion" in OS settings
2. Verify animations are disabled
3. Check that functionality remains intact
4. Test keyboard navigation (Tab, Enter, Escape)
5. Verify focus states are visible

## Future Enhancements

Potential improvements for future phases:
1. Add Framer Motion animations for more complex interactions
2. Implement page transition animations between routes
3. Add scroll-triggered parallax effects
4. Create loading state animations
5. Add micro-interactions for form validation
6. Implement gesture-based animations for mobile
7. Add page-specific entrance animations

## Notes

- All animations maintain the professional, premium feeling of the brand
- No neon effects, glowing elements, or color palette changes
- Animations are subtle and enhance user experience without being distracting
- The existing layout and design structure remains completely unchanged
- All animations are CSS-first for maximum performance
- Motion library is available for future enhancement needs

## References

- Tailwind CSS animation classes: https://tailwindcss.com/docs/animation
- CSS transforms and transitions: https://developer.mozilla.org/en-US/docs/Web/CSS/transform
- Motion library documentation: https://www.framer.com/motion/
- Accessibility: prefers-reduced-motion - https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
