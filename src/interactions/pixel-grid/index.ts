// Core components
export { PixelText, type PixelTextProps } from './components/PixelText'
export { PixelMorph, type PixelMorphProps } from './components/PixelMorph'
export { PixelReveal, type PixelRevealProps } from './components/PixelReveal'
export { PixelScramble, type PixelScrambleProps } from './components/PixelScramble'
export { PixelHover, type PixelHoverProps } from './components/PixelHover'

// Types
export type { PixelVariant, FontState } from './components/PixelMorph'

// Hooks
export { useReducedMotion } from './hooks/use-reduced-motion'
export { useInView } from './hooks/use-in-view'

// Legacy exports (for backward compatibility)
export { PixelGrid } from './PixelGrid'
export { PixelGridDemo } from './PixelGridDemo'
export { GeistPixelDemo } from './GeistPixelDemo'
