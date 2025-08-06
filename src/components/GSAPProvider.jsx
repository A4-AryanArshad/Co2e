import React, { useEffect, createContext, useContext } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, DrawSVGPlugin, MorphSVGPlugin);

// Create GSAP context
const GSAPContext = createContext();

export const useGSAPContext = () => {
  const context = useContext(GSAPContext);
  if (!context) {
    throw new Error('useGSAPContext must be used within a GSAPProvider');
  }
  return context;
};

export const GSAPProvider = ({ children }) => {
  useEffect(() => {
    // Global GSAP configuration
    gsap.defaults({
      ease: "power2.out",
      duration: 0.8
    });

    // Configure ScrollTrigger defaults
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
    });

    // Performance optimizations
    gsap.set(".animate-container", {
      willChange: "transform, opacity",
      backfaceVisibility: "hidden"
    });

    // Cleanup function
    return () => {
      // Kill all ScrollTriggers on unmount
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const value = {
    gsap,
    ScrollTrigger,
    TextPlugin,
    DrawSVGPlugin,
    MorphSVGPlugin
  };

  return (
    <GSAPContext.Provider value={value}>
      {children}
    </GSAPContext.Provider>
  );
};

export default GSAPProvider; 