import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cleanupAnimations } from '../utils/gsapAnimations';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export const useGSAP = () => {
  const ref = useRef(null);

  const animate = (animation, options = {}) => {
    if (ref.current) {
      return animation(ref.current, options.duration, options.delay);
    }
  };

  const animateChildren = (selector, animation, options = {}) => {
    if (ref.current) {
      const elements = ref.current.querySelectorAll(selector);
      return animation(elements, null, options.stagger);
    }
  };

  const scrollTrigger = (animation, trigger = "top 80%") => {
    if (ref.current) {
      return gsap.fromTo(ref.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: trigger,
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  };

  const timeline = () => {
    return gsap.timeline();
  };

  useEffect(() => {
    return () => {
      // Cleanup animations when component unmounts
      if (ref.current) {
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.vars.trigger === ref.current) {
            trigger.kill();
          }
        });
      }
    };
  }, []);

  return {
    ref,
    animate,
    animateChildren,
    scrollTrigger,
    timeline
  };
};

export const useGSAPCleanup = () => {
  useEffect(() => {
    return () => {
      cleanupAnimations();
    };
  }, []);
}; 