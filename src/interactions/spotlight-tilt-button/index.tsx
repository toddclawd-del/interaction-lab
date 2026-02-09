import React, { forwardRef, useMemo } from 'react'
import { useSpotlightTilt } from './use-spotlight-tilt'
import { variants, type VariantConfig } from './variants'

// ============================================================================
// Spotlight Tilt Button
// ============================================================================
// Cursor-reactive buttons with radial highlight + 3D perspective tilt.
// Premium, tactile feel — like brushed metal responding to light and pressure.
// ============================================================================

export type SpotlightTiltVariant = 'subtle' | 'glossy' | 'neon' | 'glass'

interface BaseProps {
  children: React.ReactNode

  /** Visual variant (controls spotlight appearance) */
  variant?: SpotlightTiltVariant

  /** Enable 3D tilt effect (default: true) */
  enableTilt?: boolean

  /** Enable spotlight highlight (default: true) */
  enableSpotlight?: boolean

  /** Enable border glow effect (default: false) */
  enableBorderGlow?: boolean

  /** Tilt intensity 0-1 (default: 0.5, maps to max 15°) */
  tiltStrength?: number

  /** Spotlight diameter in px (default: 180) */
  spotlightSize?: number

  /** Spotlight opacity multiplier 0-1 (default: 0.5) */
  spotlightIntensity?: number

  /** Custom styles (merged with computed styles) */
  style?: React.CSSProperties

  /** Additional className */
  className?: string
}

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> & {
    as?: 'button'
    href?: never
  }

type ButtonAsAnchor = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'style'> & {
    as: 'a'
    href?: string
  }

export type SpotlightTiltButtonProps = ButtonAsButton | ButtonAsAnchor

// Spring-back easing for natural feel
const SPRING_EASING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

export const SpotlightTiltButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  SpotlightTiltButtonProps
>(function SpotlightTiltButton(props, forwardedRef) {
  const {
    children,
    variant = 'subtle',
    enableTilt = true,
    enableSpotlight = true,
    enableBorderGlow = false,
    tiltStrength = 0.5,
    spotlightSize = 180,
    spotlightIntensity = 0.5,
    className,
    style: customStyle,
    ...rest
  } = props

  const as = 'as' in props ? props.as : 'button'
  const href = 'href' in props ? props.href : undefined
  const disabled = 'disabled' in props ? props.disabled : false
  const onClick = 'onClick' in props ? props.onClick : undefined
  const {
    ref: internalRef,
    state,
    handlers,
    style: tiltStyle,
    prefersReducedMotion,
  } = useSpotlightTilt<HTMLButtonElement>({
    enableTilt: enableTilt && !disabled,
    enableSpotlight: enableSpotlight && !disabled,
    tiltStrength,
  })

  // Merge refs
  const mergedRef = useMemo(() => {
    return (node: HTMLButtonElement | HTMLAnchorElement | null) => {
      // Update internal ref
      (internalRef as React.MutableRefObject<HTMLButtonElement | null>).current =
        node as HTMLButtonElement | null

      // Update forwarded ref
      if (typeof forwardedRef === 'function') {
        forwardedRef(node)
      } else if (forwardedRef) {
        forwardedRef.current = node
      }
    }
  }, [forwardedRef, internalRef])

  const variantConfig: VariantConfig = variants[variant] || variants.subtle

  // Determine which gradient to show
  const spotlightGradient = useMemo(() => {
    if (disabled) return 'none'
    if (state.isPressed) return variantConfig.activeGradient
    if (state.isFocused && !state.isHovered) return variantConfig.focusGradient
    return variantConfig.spotlightGradient
  }, [disabled, state.isPressed, state.isFocused, state.isHovered, variantConfig])

  // Build computed styles
  const computedStyle: React.CSSProperties = {
    // CSS Variables for spotlight position
    ...tiltStyle,

    // Base button styles
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1.75rem',
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
    textDecoration: 'none',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',

    // Variant base styles
    background: variantConfig.baseStyles.background,
    color: variantConfig.baseStyles.color,
    border: variantConfig.baseStyles.border,

    // 3D Transform
    perspective: '1000px',
    transformStyle: 'preserve-3d',
    transform: prefersReducedMotion
      ? 'none'
      : `perspective(1000px) rotateX(var(--rotate-x)) rotateY(var(--rotate-y))${
          state.isPressed ? ' scale(0.98)' : ''
        }`,

    // Transitions
    transition: prefersReducedMotion
      ? 'none'
      : state.isHovered
      ? 'transform 100ms ease-out' // Quick response during hover
      : `transform 300ms ${SPRING_EASING}`, // Spring-back on leave

    // Disabled state
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? 'none' : 'auto',

    // Custom overrides
    ...customStyle,
  }

  // Border glow styles (pseudo-element would be better but inline styles limit us)
  const borderGlowStyle: React.CSSProperties | undefined =
    enableBorderGlow && variantConfig.borderGlow && !disabled
      ? {
          position: 'absolute',
          inset: '-1px',
          borderRadius: 'inherit',
          padding: '1px',
          background: variantConfig.borderGlow,
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: state.isHovered || state.isFocused ? 1 : 0,
          transition: 'opacity 200ms ease-out',
          pointerEvents: 'none',
        }
      : undefined

  // Spotlight overlay styles
  const spotlightStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    background: spotlightGradient,
    backgroundSize: `${spotlightSize}px ${spotlightSize}px`,
    opacity:
      disabled || (!state.isHovered && !state.isFocused) ? 0 : spotlightIntensity,
    transition: prefersReducedMotion ? 'none' : 'opacity 200ms ease-out',
    pointerEvents: 'none',
    zIndex: 1,
  }

  // Content wrapper (sits above spotlight)
  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'inherit',
  }

  // Event handlers (disabled buttons shouldn't fire events)
  const eventHandlers = disabled
    ? {}
    : {
        ...handlers,
        onClick: onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>,
      }

  // Filter out our custom props from rest
  const {
    as: _as,
    href: _href,
    disabled: _disabled,
    onClick: _onClick,
    ...nativeProps
  } = rest as Record<string, unknown>

  if (as === 'a') {
    return (
      <a
        ref={mergedRef as React.Ref<HTMLAnchorElement>}
        className={className}
        style={computedStyle}
        href={href}
        aria-disabled={disabled || undefined}
        {...eventHandlers}
        {...(nativeProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {/* Border glow layer */}
        {borderGlowStyle && <span style={borderGlowStyle} aria-hidden="true" />}
        {/* Spotlight layer */}
        <span style={spotlightStyle} aria-hidden="true" />
        {/* Content */}
        <span style={contentStyle}>{children}</span>
      </a>
    )
  }

  return (
    <button
      ref={mergedRef as React.Ref<HTMLButtonElement>}
      className={className}
      style={computedStyle}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      {...eventHandlers}
      {...(nativeProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {/* Border glow layer */}
      {borderGlowStyle && <span style={borderGlowStyle} aria-hidden="true" />}

      {/* Spotlight layer */}
      <span style={spotlightStyle} aria-hidden="true" />

      {/* Content */}
      <span style={contentStyle}>{children}</span>
    </button>
  )
})

// ============================================================================
// Demo Component for Interaction Lab
// ============================================================================

export function SpotlightTiltButtonDemo() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        padding: '4rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '4rem',
      }}
    >
      {/* Header */}
      <header style={{ maxWidth: '800px', margin: '0 auto' }}>
        <a
          href="#/"
          style={{
            color: '#667eea',
            marginBottom: '2rem',
            display: 'inline-block',
            textDecoration: 'none',
          }}
        >
          ← Back to Home
        </a>
        <h1
          style={{
            color: 'white',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            marginBottom: '1rem',
          }}
        >
          Spotlight Tilt Button
        </h1>
        <p style={{ color: '#888', fontSize: '1.125rem', lineHeight: 1.6 }}>
          Cursor-reactive buttons with radial highlight + 3D perspective tilt.
          Move your cursor across each button to see the effect.
        </p>
      </header>

      {/* Variants Showcase */}
      <section style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h2
          style={{
            color: 'white',
            fontSize: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          Variants
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <SpotlightTiltButton variant="subtle">Subtle</SpotlightTiltButton>
          <SpotlightTiltButton variant="glossy">Glossy</SpotlightTiltButton>
          <SpotlightTiltButton variant="neon">Neon</SpotlightTiltButton>
          <SpotlightTiltButton variant="glass">Glass</SpotlightTiltButton>
        </div>
      </section>

      {/* With Border Glow */}
      <section style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h2
          style={{
            color: 'white',
            fontSize: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          With Border Glow
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <SpotlightTiltButton variant="glossy" enableBorderGlow>
            Glossy + Glow
          </SpotlightTiltButton>
          <SpotlightTiltButton variant="neon" enableBorderGlow>
            Neon + Glow
          </SpotlightTiltButton>
          <SpotlightTiltButton variant="glass" enableBorderGlow>
            Glass + Glow
          </SpotlightTiltButton>
        </div>
      </section>

      {/* Effect Isolation */}
      <section style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h2
          style={{
            color: 'white',
            fontSize: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          Effect Isolation
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <SpotlightTiltButton variant="neon" enableTilt={false}>
            Spotlight Only
          </SpotlightTiltButton>
          <SpotlightTiltButton variant="neon" enableSpotlight={false}>
            Tilt Only
          </SpotlightTiltButton>
          <SpotlightTiltButton
            variant="neon"
            enableTilt={false}
            enableSpotlight={false}
          >
            None (static)
          </SpotlightTiltButton>
        </div>
      </section>

      {/* Intensity Controls */}
      <section style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h2
          style={{
            color: 'white',
            fontSize: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          Intensity Variations
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <SpotlightTiltButton variant="glossy" tiltStrength={0.2}>
            Gentle Tilt (0.2)
          </SpotlightTiltButton>
          <SpotlightTiltButton variant="glossy" tiltStrength={1}>
            Strong Tilt (1.0)
          </SpotlightTiltButton>
          <SpotlightTiltButton variant="glossy" spotlightIntensity={0.8}>
            Bright Spotlight
          </SpotlightTiltButton>
          <SpotlightTiltButton variant="glossy" spotlightSize={300}>
            Large Spotlight
          </SpotlightTiltButton>
        </div>
      </section>

      {/* States */}
      <section style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h2
          style={{
            color: 'white',
            fontSize: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          States
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <SpotlightTiltButton variant="neon">Normal</SpotlightTiltButton>
          <SpotlightTiltButton variant="neon" disabled>
            Disabled
          </SpotlightTiltButton>
        </div>
        <p style={{ color: '#666', marginTop: '1rem', fontSize: '0.875rem' }}>
          Tab to each button to see the keyboard focus state (centered
          spotlight, no tilt).
        </p>
      </section>

      {/* As Link */}
      <section style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h2
          style={{
            color: 'white',
            fontSize: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          Polymorphic (as Link)
        </h2>
        <SpotlightTiltButton
          as="a"
          href="https://github.com"
          variant="glossy"
          enableBorderGlow
        >
          View on GitHub →
        </SpotlightTiltButton>
      </section>

      {/* CTA Context Demo */}
      <section
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '1.5rem',
          padding: '3rem',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            color: 'white',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            marginBottom: '1rem',
          }}
        >
          Ready to get started?
        </h2>
        <p style={{ color: '#888', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
          The premium button interaction that makes users want to click.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <SpotlightTiltButton variant="neon" enableBorderGlow>
            Start Free Trial
          </SpotlightTiltButton>
          <SpotlightTiltButton variant="glass">
            Learn More
          </SpotlightTiltButton>
        </div>
      </section>

      {/* Code Preview */}
      <section style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h2
          style={{
            color: 'white',
            fontSize: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          Usage
        </h2>
        <pre
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            overflow: 'auto',
            fontSize: '0.875rem',
            color: '#a5d6ff',
          }}
        >
          {`import { SpotlightTiltButton } from './spotlight-tilt-button'

// Basic usage
<SpotlightTiltButton>
  Click me
</SpotlightTiltButton>

// With variant and border glow
<SpotlightTiltButton 
  variant="neon" 
  enableBorderGlow
>
  Premium CTA
</SpotlightTiltButton>

// Customize intensity
<SpotlightTiltButton
  variant="glossy"
  tiltStrength={0.8}
  spotlightIntensity={0.6}
  spotlightSize={200}
>
  Custom Settings
</SpotlightTiltButton>

// As a link
<SpotlightTiltButton as="a" href="/signup">
  Sign Up →
</SpotlightTiltButton>`}
        </pre>
      </section>
    </div>
  )
}

export default SpotlightTiltButtonDemo
