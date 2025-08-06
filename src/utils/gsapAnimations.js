import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Fade in animation
export const fadeIn = (element, duration = 1, delay = 0) => {
  return gsap.fromTo(element, 
    { opacity: 0, y: 50 },
    { 
      opacity: 1, 
      y: 0, 
      duration, 
      delay,
      ease: "power2.out"
    }
  );
};

// Slide in from left
export const slideInLeft = (element, duration = 1, delay = 0) => {
  return gsap.fromTo(element,
    { x: -100, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration,
      delay,
      ease: "power2.out"
    }
  );
};

// Slide in from right
export const slideInRight = (element, duration = 1, delay = 0) => {
  return gsap.fromTo(element,
    { x: 100, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration,
      delay,
      ease: "power2.out"
    }
  );
};

// Slide in from bottom
export const slideInUp = (element, duration = 1, delay = 0) => {
  return gsap.fromTo(element,
    { y: 100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      delay,
      ease: "power2.out"
    }
  );
};

// Scale in animation
export const scaleIn = (element, duration = 0.8, delay = 0) => {
  return gsap.fromTo(element,
    { scale: 0, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration,
      delay,
      ease: "back.out(1.7)"
    }
  );
};

// Stagger animation for multiple elements
export const staggerAnimation = (elements, animation = fadeIn, stagger = 0.2) => {
  return gsap.fromTo(elements,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger,
      ease: "power2.out"
    }
  );
};

// Text reveal animation
export const textReveal = (element, duration = 1.5, delay = 0) => {
  return gsap.fromTo(element,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: "power2.out"
    }
  );
};

// Parallax effect
export const parallaxEffect = (element, speed = 0.5) => {
  return gsap.to(element, {
    yPercent: -50 * speed,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
};

// Floating animation
export const floatingAnimation = (element, duration = 2) => {
  return gsap.to(element, {
    y: -20,
    duration,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1
  });
};

// Pulse animation
export const pulseAnimation = (element, duration = 1) => {
  return gsap.to(element, {
    scale: 1.1,
    duration,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1
  });
};

// Rotate animation
export const rotateAnimation = (element, duration = 3) => {
  return gsap.to(element, {
    rotation: 360,
    duration,
    ease: "none",
    repeat: -1
  });
};

// Bounce in animation
export const bounceIn = (element, duration = 1, delay = 0) => {
  return gsap.fromTo(element,
    { scale: 0, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration,
      delay,
      ease: "bounce.out"
    }
  );
};

// Hero section animation sequence
export const heroAnimation = (heroRef, titleRef, subtitleRef, ctaRef) => {
  const tl = gsap.timeline();
  
  tl.fromTo(heroRef, 
    { opacity: 0, scale: 1.1 },
    { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }
  )
  .fromTo(titleRef,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
    "-=0.5"
  )
  .fromTo(subtitleRef,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
    "-=0.3"
  )
  .fromTo(ctaRef,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
    "-=0.2"
  );
  
  return tl;
};

// Scroll-triggered animations
export const scrollTriggerAnimation = (element, animation = fadeIn, trigger = "top 80%") => {
  return gsap.fromTo(element,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: trigger,
        toggleActions: "play none none reverse"
      }
    }
  );
};

// Enhanced scroll-triggered card animation
export const scrollTriggerCardAnimation = (element, index = 0, trigger = "top 85%") => {
  return gsap.fromTo(element,
    { 
      opacity: 0, 
      y: 100, 
      scale: 0.8,
      rotation: 5
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      rotation: 0,
      duration: 1.2,
      delay: index * 0.2,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: element,
        start: trigger,
        toggleActions: "play none none reverse"
      }
    }
  );
};

// Scroll-triggered icon animation
export const scrollTriggerIconAnimation = (element, index = 0, trigger = "top 90%") => {
  return gsap.fromTo(element,
    { 
      opacity: 0, 
      scale: 0,
      rotation: -180
    },
    {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.8,
      delay: index * 0.3,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: element,
        start: trigger,
        toggleActions: "play none none reverse"
      }
    }
  );
};

// Card interaction animations
export const cardHoverAnimation = (element) => {
  return gsap.to(element, {
    y: -15,
    scale: 1.02,
    duration: 0.4,
    ease: "power2.out"
  });
};

export const cardLeaveAnimation = (element) => {
  return gsap.to(element, {
    y: 0,
    scale: 1,
    duration: 0.4,
    ease: "power2.out"
  });
};

export const iconHoverAnimation = (element) => {
  return gsap.to(element, {
    scale: 1.1,
    rotation: 5,
    duration: 0.3,
    ease: "back.out(1.7)"
  });
};

export const iconLeaveAnimation = (element) => {
  return gsap.to(element, {
    scale: 1,
    rotation: 0,
    duration: 0.3,
    ease: "power2.out"
  });
};

// Continuous card movement animations
export const continuousCardFloat = (element, delay = 0) => {
  return gsap.to(element, {
    y: -3,
    duration: 4,
    delay: delay,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1
  });
};

export const continuousCardSway = (element, delay = 0) => {
  return gsap.to(element, {
    x: 2,
    rotation: 0.5,
    duration: 6,
    delay: delay,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1
  });
};

export const continuousCardPulse = (element, delay = 0) => {
  return gsap.to(element, {
    scale: 1.005,
    duration: 3,
    delay: delay,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1
  });
};

export const continuousIconRotate = (element, delay = 0) => {
  return gsap.to(element, {
    rotation: 360,
    duration: 8,
    delay: delay,
    ease: "none",
    repeat: -1
  });
};

export const continuousIconFloat = (element, delay = 0) => {
  return gsap.to(element, {
    y: -8,
    duration: 2.5,
    delay: delay,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1
  });
};

export const continuousTextGlow = (element, delay = 0) => {
  return gsap.to(element, {
    opacity: 0.8,
    duration: 2,
    delay: delay,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1
  });
};

// Button movement animations
export const continuousButtonFloat = (element, delay = 0) => {
  return gsap.to(element, {
    y: -5,
    duration: 2.5,
    delay: delay,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1
  });
};

export const continuousButtonPulse = (element, delay = 0) => {
  return gsap.to(element, {
    scale: 1.05,
    duration: 1.8,
    delay: delay,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1
  });
};

export const continuousButtonGlow = (element, delay = 0) => {
  return gsap.to(element, {
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    duration: 2,
    delay: delay,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1
  });
};

// Cleanup function
export const cleanupAnimations = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
}; 