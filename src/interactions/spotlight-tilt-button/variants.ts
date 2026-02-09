// Spotlight Tilt Button — Variant configurations
// Each variant defines the spotlight appearance and optional border glow

export interface VariantConfig {
  // Spotlight gradient colors (from center outward)
  spotlightGradient: string
  // Active/pressed state gradient (brighter, tighter)
  activeGradient: string
  // Focus state gradient (centered, keyboard)
  focusGradient: string
  // Border glow gradient (optional)
  borderGlow?: string
  // Base button styles
  baseStyles: {
    background: string
    color: string
    border: string
  }
}

export const variants: Record<string, VariantConfig> = {
  subtle: {
    spotlightGradient: `radial-gradient(
      circle at var(--spotlight-x) var(--spotlight-y),
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.1) 30%,
      transparent 60%
    )`,
    activeGradient: `radial-gradient(
      circle at var(--spotlight-x) var(--spotlight-y),
      rgba(255, 255, 255, 0.45) 0%,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 50%
    )`,
    focusGradient: `radial-gradient(
      circle at 50% 50%,
      rgba(255, 255, 255, 0.35) 0%,
      rgba(255, 255, 255, 0.1) 40%,
      transparent 70%
    )`,
    baseStyles: {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
  },

  glossy: {
    spotlightGradient: `radial-gradient(
      circle at var(--spotlight-x) var(--spotlight-y),
      rgba(255, 255, 255, 0.5) 0%,
      rgba(255, 255, 255, 0.2) 20%,
      rgba(255, 255, 255, 0.05) 40%,
      transparent 60%
    )`,
    activeGradient: `radial-gradient(
      circle at var(--spotlight-x) var(--spotlight-y),
      rgba(255, 255, 255, 0.7) 0%,
      rgba(255, 255, 255, 0.3) 15%,
      rgba(255, 255, 255, 0.1) 35%,
      transparent 50%
    )`,
    focusGradient: `radial-gradient(
      circle at 50% 50%,
      rgba(255, 255, 255, 0.5) 0%,
      rgba(255, 255, 255, 0.15) 35%,
      transparent 60%
    )`,
    borderGlow: `linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.3) 100%
    )`,
    baseStyles: {
      background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
      color: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.15)',
    },
  },

  neon: {
    spotlightGradient: `radial-gradient(
      circle at var(--spotlight-x) var(--spotlight-y),
      rgba(102, 126, 234, 0.6) 0%,
      rgba(118, 75, 162, 0.3) 25%,
      rgba(240, 147, 251, 0.1) 45%,
      transparent 65%
    )`,
    activeGradient: `radial-gradient(
      circle at var(--spotlight-x) var(--spotlight-y),
      rgba(102, 126, 234, 0.85) 0%,
      rgba(118, 75, 162, 0.5) 20%,
      rgba(240, 147, 251, 0.2) 40%,
      transparent 55%
    )`,
    focusGradient: `radial-gradient(
      circle at 50% 50%,
      rgba(102, 126, 234, 0.6) 0%,
      rgba(118, 75, 162, 0.25) 35%,
      transparent 60%
    )`,
    borderGlow: `linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.6) 0%,
      rgba(118, 75, 162, 0.4) 50%,
      rgba(240, 147, 251, 0.6) 100%
    )`,
    baseStyles: {
      background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a2e 100%)',
      color: '#ffffff',
      border: '1px solid rgba(102, 126, 234, 0.3)',
    },
  },

  glass: {
    spotlightGradient: `radial-gradient(
      circle at var(--spotlight-x) var(--spotlight-y),
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0.15) 30%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 70%
    )`,
    activeGradient: `radial-gradient(
      circle at var(--spotlight-x) var(--spotlight-y),
      rgba(255, 255, 255, 0.55) 0%,
      rgba(255, 255, 255, 0.25) 25%,
      rgba(255, 255, 255, 0.1) 45%,
      transparent 60%
    )`,
    focusGradient: `radial-gradient(
      circle at 50% 50%,
      rgba(255, 255, 255, 0.45) 0%,
      rgba(255, 255, 255, 0.15) 40%,
      transparent 65%
    )`,
    borderGlow: `linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.25) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.25) 100%
    )`,
    baseStyles: {
      background: 'rgba(255, 255, 255, 0.08)',
      color: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.18)',
    },
  },
}
