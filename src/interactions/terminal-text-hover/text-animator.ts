/**
 * TextAnimator - Character scramble animation utility
 * 
 * Splits text into characters and creates a terminal-style scramble effect
 * where characters briefly become random symbols before settling.
 * 
 * Uses SplitType for text splitting and GSAP for animation.
 */

import SplitType from 'split-type'
import gsap from 'gsap'

// Character set for the scramble effect - terminal/hacker aesthetic
const CHARS = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '=',
  ';', ':', '<', '>', ',', '/', '\\', '|', '~', '`'
]

// Color palette for the color variation effect
const SCRAMBLE_COLORS = [
  '#22a3a9', // Cyan
  '#4ca922', // Green  
  '#a99222', // Gold
  '#ff6b6b', // Red
  '#6366f1', // Indigo
  '#ec4899', // Pink
]

export type AnimationVariant = 'cursor' | 'background' | 'color' | 'blur' | 'glitch'

interface AnimatorOptions {
  variant?: AnimationVariant
  scrambleSpeed?: number      // Duration of each scramble cycle (default: 0.03)
  scrambleCount?: number      // How many random chars before settling (default: 3)
  staggerDelay?: number       // Delay between each character (default: 0.07)
  repeatDelay?: number        // Delay between scramble repeats (default: 0.04)
}

export class TextAnimator {
  private element: HTMLElement
  private splitter: SplitType | null = null
  private originalChars: string[] = []
  private originalColors: string[] = []
  private variant: AnimationVariant
  private options: Required<Omit<AnimatorOptions, 'variant'>>
  
  constructor(element: HTMLElement, options: AnimatorOptions = {}) {
    this.element = element
    this.variant = options.variant || 'cursor'
    this.options = {
      scrambleSpeed: options.scrambleSpeed || 0.03,
      scrambleCount: options.scrambleCount || 3,
      staggerDelay: options.staggerDelay || 0.07,
      repeatDelay: options.repeatDelay || 0.04,
    }
    
    this.init()
  }
  
  private init() {
    // Split the text into characters
    this.splitter = new SplitType(this.element, {
      types: 'words,chars',
      tagName: 'span'
    })
    
    // Store original values for reset
    const chars = this.getChars()
    this.originalChars = chars.map(char => char.innerHTML)
    this.originalColors = chars.map(char => getComputedStyle(char).color)
    
    // Add necessary CSS classes based on variant
    this.element.classList.add('hover-effect')
    if (this.variant === 'cursor') {
      this.element.classList.add('hover-effect--cursor')
    } else if (this.variant === 'background') {
      this.element.classList.add('hover-effect--bg')
    } else if (this.variant === 'blur') {
      this.element.classList.add('hover-effect--blur')
    } else if (this.variant === 'glitch') {
      this.element.classList.add('hover-effect--glitch')
    }
  }
  
  private getChars(): HTMLElement[] {
    return this.splitter?.chars as HTMLElement[] || []
  }
  
  /**
   * Trigger the scramble animation
   */
  animate() {
    this.reset()
    
    const chars = this.getChars()
    const { scrambleSpeed, scrambleCount, staggerDelay, repeatDelay } = this.options
    
    chars.forEach((char, position) => {
      const initialHTML = char.innerHTML
      const initialColor = this.originalColors[position]
      let repeatCount = 0
      
      // Create the scramble timeline
      gsap.fromTo(
        char,
        { opacity: 0 },
        {
          duration: scrambleSpeed,
          opacity: 1,
          delay: (position + 1) * staggerDelay,
          repeat: scrambleCount,
          repeatDelay: repeatDelay,
          repeatRefresh: true,
          onStart: () => {
            // Show cursor indicator on first cycle (cursor variant)
            if (this.variant === 'cursor') {
              gsap.set(char, { '--cursor-opacity': 1 })
            }
          },
          onRepeat: () => {
            repeatCount++
            // Hide cursor after first repeat
            if (this.variant === 'cursor' && repeatCount === 1) {
              gsap.set(char, { '--cursor-opacity': 0 })
            }
          },
          onComplete: () => {
            // Restore original character
            gsap.set(char, { 
              innerHTML: initialHTML,
              color: initialColor,
              delay: scrambleSpeed 
            })
          },
          // Replace character with random one each cycle
          innerHTML: () => {
            const randomChar = CHARS[Math.floor(Math.random() * CHARS.length)]
            
            // Apply random color for color variant
            if (this.variant === 'color') {
              const randomColor = SCRAMBLE_COLORS[Math.floor(Math.random() * SCRAMBLE_COLORS.length)]
              gsap.set(char, { color: randomColor })
            }
            
            return randomChar
          },
        }
      )
    })
    
    // Animate background for background variant
    if (this.variant === 'background' || this.variant === 'blur') {
      gsap.fromTo(
        this.element,
        { '--bg-scale': 0 },
        {
          duration: 1,
          ease: 'expo.out',
          '--bg-scale': 1,
        }
      )
    }
    
    // Glitch effect: RGB split + displacement
    if (this.variant === 'glitch') {
      // Initial glitch burst
      gsap.to(this.element, {
        duration: 0.1,
        '--glitch-intensity': 1,
        ease: 'power2.out',
      })
      
      // Random displacement flickers
      const glitchTimeline = gsap.timeline({ repeat: 3 })
      glitchTimeline
        .to(this.element, {
          duration: 0.05,
          '--glitch-x': () => (Math.random() - 0.5) * 8,
          '--glitch-skew': () => (Math.random() - 0.5) * 5,
          ease: 'none',
        })
        .to(this.element, {
          duration: 0.05,
          '--glitch-x': 0,
          '--glitch-skew': 0,
          ease: 'none',
        })
      
      // Fade out glitch
      gsap.to(this.element, {
        duration: 0.3,
        delay: 0.4,
        '--glitch-intensity': 0,
        ease: 'power2.out',
      })
    }
  }
  
  /**
   * Animate out (for background/glitch variants)
   */
  animateOut() {
    if (this.variant === 'background' || this.variant === 'blur') {
      gsap.killTweensOf(this.element)
      gsap.to(this.element, {
        duration: 0.6,
        ease: 'power4.out',
        '--bg-scale': 0,
      })
    }
    if (this.variant === 'glitch') {
      gsap.killTweensOf(this.element)
      gsap.to(this.element, {
        duration: 0.2,
        '--glitch-intensity': 0,
        '--glitch-x': 0,
        '--glitch-skew': 0,
      })
    }
  }
  
  /**
   * Reset to original state
   */
  reset() {
    const chars = this.getChars()
    
    chars.forEach((char, index) => {
      gsap.killTweensOf(char)
      char.innerHTML = this.originalChars[index]
      char.style.color = this.originalColors[index]
    })
    
    gsap.killTweensOf(this.element)
    gsap.set(this.element, { '--bg-scale': 0 })
  }
  
  /**
   * Clean up split text
   */
  destroy() {
    this.reset()
    this.splitter?.revert()
    this.element.classList.remove('hover-effect', 'hover-effect--cursor', 'hover-effect--bg', 'hover-effect--blur', 'hover-effect--glitch')
  }
}
