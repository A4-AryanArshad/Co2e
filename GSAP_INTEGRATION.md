# GSAP Animation Integration

This document explains the GSAP (GreenSock Animation Platform) integration in the EFrontend application and how to use the various animation utilities.

## 🚀 Features

- **Smooth Animations**: Professional-grade animations using GSAP
- **Scroll-Triggered Animations**: Elements animate as they come into view
- **Performance Optimized**: Hardware-accelerated animations with proper cleanup
- **Accessibility Support**: Respects user's motion preferences
- **Mobile Responsive**: Optimized animations for all devices

## 📦 Installation

GSAP is already installed in the project:

```bash
npm install gsap
```

## 🎯 Available Animation Functions

### Basic Animations

```javascript
import { 
  fadeIn, 
  slideInLeft, 
  slideInRight, 
  slideInUp, 
  scaleIn, 
  bounceIn 
} from '../utils/gsapAnimations';

// Fade in animation
fadeIn(element, duration, delay);

// Slide animations
slideInLeft(element, duration, delay);
slideInRight(element, duration, delay);
slideInUp(element, duration, delay);

// Scale and bounce
scaleIn(element, duration, delay);
bounceIn(element, duration, delay);
```

### Advanced Animations

```javascript
import { 
  staggerAnimation, 
  parallaxEffect, 
  floatingAnimation, 
  pulseAnimation, 
  rotateAnimation 
} from '../utils/gsapAnimations';

// Stagger animation for multiple elements
staggerAnimation(elements, animation, stagger);

// Parallax effect
parallaxEffect(element, speed);

// Continuous animations
floatingAnimation(element, duration);
pulseAnimation(element, duration);
rotateAnimation(element, duration);
```

### Hero Section Animation

```javascript
import { heroAnimation } from '../utils/gsapAnimations';

// Complete hero animation sequence
heroAnimation(heroRef, titleRef, subtitleRef, ctaRef);
```

### Scroll-Triggered Animations

```javascript
import { scrollTriggerAnimation } from '../utils/gsapAnimations';

// Animate on scroll
scrollTriggerAnimation(element, animation, trigger);
```

## 🛠️ Usage Examples

### Basic Component Animation

```jsx
import React, { useEffect, useRef } from 'react';
import { fadeIn, slideInLeft } from '../utils/gsapAnimations';

const MyComponent = () => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current) {
      fadeIn(elementRef.current, 1, 0.5);
    }
  }, []);

  return (
    <div ref={elementRef}>
      <h1>Animated Content</h1>
    </div>
  );
};
```

### Stagger Animation for Lists

```jsx
import React, { useEffect, useRef } from 'react';
import { staggerAnimation } from '../utils/gsapAnimations';

const FeatureList = () => {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      const items = listRef.current.querySelectorAll('.feature-item');
      staggerAnimation(items, null, 0.2);
    }
  }, []);

  return (
    <ul ref={listRef}>
      <li className="feature-item">Feature 1</li>
      <li className="feature-item">Feature 2</li>
      <li className="feature-item">Feature 3</li>
    </ul>
  );
};
```

### Using the Custom Hook

```jsx
import React from 'react';
import { useGSAP } from '../hooks/useGSAP';
import { fadeIn, slideInLeft } from '../utils/gsapAnimations';

const AnimatedComponent = () => {
  const { ref, animate, animateChildren } = useGSAP();

  useEffect(() => {
    // Animate the main element
    animate(fadeIn, { duration: 1, delay: 0.5 });
    
    // Animate child elements with stagger
    animateChildren('.child-item', staggerAnimation, { stagger: 0.2 });
  }, []);

  return (
    <div ref={ref}>
      <h1>Main Content</h1>
      <div className="child-item">Child 1</div>
      <div className="child-item">Child 2</div>
      <div className="child-item">Child 3</div>
    </div>
  );
};
```

## 🎨 CSS Animation Classes

The following CSS classes are available for fallback animations:

```css
/* Basic animations */
.fade-in
.slide-in-left
.slide-in-right
.slide-in-up
.scale-in
.bounce-animation

/* Continuous animations */
.float-animation
.pulse-animation
.rotate-animation

/* Utility classes */
.animate-ready
.animate-container
.parallax-element
.stagger-item
```

## 🔧 Configuration

### GSAP Provider Setup

The `GSAPProvider` component is already set up in `App.js`:

```jsx
import GSAPProvider from './components/GSAPProvider';

function App() {
  return (
    <GSAPProvider>
      {/* Your app content */}
    </GSAPProvider>
  );
}
```

### Global Settings

GSAP is configured with the following defaults:

- **Easing**: `power2.out`
- **Duration**: `0.8s`
- **ScrollTrigger**: Optimized for mobile
- **Performance**: Hardware acceleration enabled

## 🎯 Best Practices

### 1. Performance Optimization

```jsx
// Use will-change for elements that will animate
<div style={{ willChange: 'transform, opacity' }}>
  Animated content
</div>

// Use transform instead of position properties
gsap.to(element, { x: 100 }); // ✅ Good
gsap.to(element, { left: 100 }); // ❌ Avoid
```

### 2. Cleanup Animations

```jsx
import { cleanupAnimations } from '../utils/gsapAnimations';

useEffect(() => {
  return () => {
    cleanupAnimations(); // Clean up on unmount
  };
}, []);
```

### 3. Accessibility

```jsx
// Respect user's motion preferences
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  // Run animations
  fadeIn(element);
}
```

### 4. Mobile Optimization

```jsx
// Use lighter animations on mobile
const isMobile = window.innerWidth < 768;

if (isMobile) {
  fadeIn(element, 0.5); // Shorter duration
} else {
  fadeIn(element, 1); // Full duration
}
```

## 🎨 Animation Showcase

The `AnimationDemo` component demonstrates various animation techniques:

- **Timeline Sequences**: Coordinated animation sequences
- **Stagger Effects**: Sequential element animations
- **Floating Elements**: Continuous gentle motion
- **Interactive Animations**: Hover and click effects

## 🔍 Debugging

### Enable GSAP DevTools

```javascript
// Add to your development environment
import { gsap } from 'gsap';
gsap.registerPlugin(ScrollTrigger);

// Enable dev tools (development only)
if (process.env.NODE_ENV === 'development') {
  gsap.config({ nullTargetWarn: false });
}
```

### Common Issues

1. **Animations not working**: Check if element refs are properly set
2. **Performance issues**: Ensure animations use transform properties
3. **ScrollTrigger not firing**: Verify trigger elements are in viewport

## 📚 Resources

- [GSAP Documentation](https://greensock.com/docs/)
- [ScrollTrigger Plugin](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [GSAP Performance Tips](https://greensock.com/docs/v3/Installation#performance)

## 🤝 Contributing

When adding new animations:

1. Add the animation function to `src/utils/gsapAnimations.js`
2. Include proper TypeScript types if applicable
3. Add CSS fallback animations
4. Test on mobile devices
5. Ensure accessibility compliance

## 📄 License

This GSAP integration is part of the EFrontend project and follows the same licensing terms. 