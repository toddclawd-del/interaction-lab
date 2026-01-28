/**
 * DualWaveAnimation - Scroll-driven dual-column wave text animation
 * 
 * Reference: https://tympanus.net/codrops/2026/01/15/building-a-scroll-driven-dual-wave-text-animation-with-gsap/
 * 
 * Core concepts:
 * - Sine wave mathematics to position text along a wave pattern
 * - Scroll progress drives the wave phase animation
 * - Dual columns move in opposite directions (multiplier: 1 vs -1)
 * - quickTo for performant 60fps updates
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface DualWaveConfig {
  waveNumber: number  // How many wave cycles across all elements
  waveSpeed: number   // How fast the wave animates during scroll
}

interface Range {
  minX: number
  maxX: number
}

export class DualWaveAnimation {
  private wrapper: HTMLElement | null
  private config: DualWaveConfig
  private currentImage: string | null = null
  
  private leftColumn: HTMLElement | null = null
  private rightColumn: HTMLElement | null = null
  private leftTexts: HTMLElement[] = []
  private rightTexts: HTMLElement[] = []
  private thumbnail: HTMLImageElement | null = null
  
  private leftQuickSetters: gsap.QuickToFunc[] = []
  private rightQuickSetters: gsap.QuickToFunc[] = []
  
  private leftRange: Range = { minX: 0, maxX: 0 }
  private rightRange: Range = { minX: 0, maxX: 0 }
  
  private scrollTrigger: ScrollTrigger | null = null
  private resizeHandler: (() => void) | null = null
  
  constructor(wrapper: HTMLElement | string, options: Partial<DualWaveConfig> = {}) {
    this.wrapper = wrapper instanceof HTMLElement 
      ? wrapper 
      : document.querySelector(wrapper)
    
    // Read config from data attributes with fallbacks
    const waveNumber = this.wrapper?.dataset.waveNumber
      ? parseFloat(this.wrapper.dataset.waveNumber)
      : 12
    
    const waveSpeed = this.wrapper?.dataset.waveSpeed
      ? parseFloat(this.wrapper.dataset.waveSpeed)
      : 1
    
    this.config = {
      waveNumber,
      waveSpeed,
      ...options,
    }
  }
  
  init(): void {
    if (!this.wrapper) {
      console.warn('[DualWaveAnimation] Wrapper not found')
      return
    }
    
    this.leftColumn = this.wrapper.querySelector('.wave-column-left')
    this.rightColumn = this.wrapper.querySelector('.wave-column-right')
    
    if (!this.leftColumn || !this.rightColumn) {
      console.warn('[DualWaveAnimation] Columns not found')
      return
    }
    
    this.setupAnimation()
  }
  
  private setupAnimation(): void {
    // Collect text elements
    this.leftTexts = gsap.utils.toArray(
      this.leftColumn!.querySelectorAll('.animated-text')
    ) as HTMLElement[]
    
    this.rightTexts = gsap.utils.toArray(
      this.rightColumn!.querySelectorAll('.animated-text')
    ) as HTMLElement[]
    
    this.thumbnail = this.wrapper!.querySelector('.image-thumbnail')
    
    if (this.leftTexts.length === 0 || this.rightTexts.length === 0) {
      console.warn('[DualWaveAnimation] No text elements found')
      return
    }
    
    // Create quickTo setters for performant animation
    // quickTo pre-creates tweens that can be updated instantly
    this.leftQuickSetters = this.leftTexts.map((text) =>
      gsap.quickTo(text, 'x', { duration: 0.6, ease: 'power4.out' })
    )
    
    this.rightQuickSetters = this.rightTexts.map((text) =>
      gsap.quickTo(text, 'x', { duration: 0.6, ease: 'power4.out' })
    )
    
    // Calculate ranges and set initial positions
    this.calculateRanges()
    this.setInitialPositions(this.leftTexts, this.leftRange, 1)
    this.setInitialPositions(this.rightTexts, this.rightRange, -1)
    
    // Setup scroll trigger
    this.setupScrollTrigger()
    
    // Handle resize
    this.resizeHandler = () => this.calculateRanges()
    window.addEventListener('resize', this.resizeHandler)
  }
  
  /**
   * Calculate how far each column's text can move horizontally
   * Based on column width minus the widest text element
   */
  private calculateRanges(): void {
    const maxLeftTextWidth = Math.max(
      ...this.leftTexts.map((t) => t.offsetWidth)
    )
    const maxRightTextWidth = Math.max(
      ...this.rightTexts.map((t) => t.offsetWidth)
    )
    
    this.leftRange = {
      minX: 0,
      maxX: this.leftColumn!.offsetWidth - maxLeftTextWidth,
    }
    
    this.rightRange = {
      minX: 0,
      maxX: this.rightColumn!.offsetWidth - maxRightTextWidth,
    }
  }
  
  /**
   * Position each text element along the initial wave
   * Uses sine function to create wave distribution
   */
  private setInitialPositions(
    texts: HTMLElement[],
    range: Range,
    multiplier: number
  ): void {
    const rangeSize = range.maxX - range.minX
    
    texts.forEach((text, index) => {
      // Calculate where this element sits on the wave
      // Phase offset by -π/2 to start at wave midpoint
      const initialPhase = this.config.waveNumber * index - Math.PI / 2
      
      // Sine gives -1 to 1, normalize to 0 to 1
      const initialWave = Math.sin(initialPhase)
      const initialProgress = (initialWave + 1) / 2
      
      // Convert to pixel position
      const startX = (range.minX + initialProgress * rangeSize) * multiplier
      
      gsap.set(text, { x: startX })
    })
  }
  
  private setupScrollTrigger(): void {
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.wrapper!,
      start: 'top bottom',  // Start when top of wrapper hits bottom of viewport
      end: 'bottom top',    // End when bottom of wrapper exits top of viewport
      onUpdate: (self) => this.handleScroll(self),
    })
  }
  
  /**
   * Main scroll handler - called on every scroll update
   */
  private handleScroll(self: ScrollTrigger): void {
    const globalProgress = self.progress
    
    // Find which text is closest to viewport center
    const closestIndex = this.findClosestToViewportCenter()
    
    // Update both columns (1 = right direction, -1 = left direction)
    this.updateColumn(
      this.leftTexts,
      this.leftQuickSetters,
      this.leftRange,
      globalProgress,
      closestIndex,
      1
    )
    
    this.updateColumn(
      this.rightTexts,
      this.rightQuickSetters,
      this.rightRange,
      globalProgress,
      closestIndex,
      -1
    )
    
    // Update thumbnail image and position
    const focusedText = this.leftTexts[closestIndex]
    this.updateThumbnail(focusedText)
  }
  
  /**
   * Update all text positions in a column
   */
  private updateColumn(
    texts: HTMLElement[],
    setters: gsap.QuickToFunc[],
    range: Range,
    progress: number,
    focusedIndex: number,
    multiplier: number
  ): void {
    const rangeSize = range.maxX - range.minX
    
    texts.forEach((text, index) => {
      const finalX = this.calculateWavePosition(
        index,
        progress,
        range.minX,
        rangeSize
      ) * multiplier
      
      // Use quickTo setter for 60fps performance
      setters[index](finalX)
      
      // Toggle focused state
      if (index === focusedIndex) {
        text.classList.add('focused')
      } else {
        text.classList.remove('focused')
      }
    })
  }
  
  /**
   * The core wave math
   * 
   * phase = waveNumber × index + waveSpeed × progress × 2π - π/2
   *         └─────┬─────┘   └──────────┬──────────┘   └─┬─┘
   *              │                    │                │
   *        Wave frequency      Scroll-driven      Starting
   *        distribution          offset            offset
   */
  private calculateWavePosition(
    index: number,
    globalProgress: number,
    minX: number,
    range: number
  ): number {
    const phase =
      this.config.waveNumber * index +
      this.config.waveSpeed * globalProgress * Math.PI * 2 -
      Math.PI / 2
    
    const wave = Math.sin(phase)
    const cycleProgress = (wave + 1) / 2
    
    return minX + cycleProgress * range
  }
  
  /**
   * Find which text element is closest to viewport center
   */
  private findClosestToViewportCenter(): number {
    const viewportCenter = window.innerHeight / 2
    let closestIndex = 0
    let minDistance = Infinity
    
    this.leftTexts.forEach((text, index) => {
      const rect = text.getBoundingClientRect()
      const elementCenter = rect.top + rect.height / 2
      const distance = Math.abs(elementCenter - viewportCenter)
      
      if (distance < minDistance) {
        minDistance = distance
        closestIndex = index
      }
    })
    
    return closestIndex
  }
  
  /**
   * Update thumbnail image source and vertical position
   */
  private updateThumbnail(focusedText: HTMLElement): void {
    if (!this.thumbnail || !focusedText) return
    
    // Get image from focused text's data attribute
    const newImage = focusedText.dataset.image
    
    // Only update if different (prevents flicker)
    if (newImage && this.currentImage !== newImage) {
      this.currentImage = newImage
      this.thumbnail.src = newImage
    }
    
    // Position thumbnail centered in viewport, clamped to wrapper bounds
    const wrapperRect = this.wrapper!.getBoundingClientRect()
    const viewportCenter = window.innerHeight / 2
    const thumbnailHeight = this.thumbnail.offsetHeight
    const wrapperHeight = this.wrapper!.offsetHeight
    
    // Ideal Y position (centered in viewport)
    const idealY = viewportCenter - wrapperRect.top - thumbnailHeight / 2
    
    // Clamp with overflow allowance for first/last text centering
    const minY = -thumbnailHeight / 2
    const maxY = wrapperHeight - thumbnailHeight / 2
    const clampedY = Math.max(minY, Math.min(maxY, idealY))
    
    // Instant update for perfect scroll sync
    gsap.set(this.thumbnail, { y: clampedY })
  }
  
  /**
   * Cleanup - call when destroying the instance
   */
  destroy(): void {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill()
    }
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler)
    }
  }
}

export default DualWaveAnimation
