/**
 * Parallax Tilt Card
 * 
 * Premium 3D cards that tilt toward the cursor with internal parallax layers.
 * Uses Framer Motion springs for natural physics-based return animations.
 * 
 * Features:
 * - Configurable max tilt angle
 * - Multiple parallax layers with independent depth
 * - Shine/glare effect following cursor
 * - Optional magnetic pull toward cursor
 * - Full reduced-motion support
 * - Spring-based physics for organic feel
 */

export { 
  ParallaxTiltCard, 
  ParallaxLayer,
  useParallaxContext,
  type ParallaxTiltCardProps,
  type ParallaxLayerProps,
  type SpringConfig,
} from './ParallaxTiltCard'

// Demo component for the showcase
import { ParallaxTiltCard, ParallaxLayer } from './ParallaxTiltCard'

export default function ParallaxTiltCardDemo() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a', 
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '4rem',
    }}>
      {/* Header */}
      <div>
        <a 
          href="#/" 
          style={{ 
            color: '#667eea', 
            marginBottom: '1rem', 
            display: 'inline-block',
            fontSize: '0.875rem',
          }}
        >
          ← Back to Home
        </a>
        <h1 style={{ color: 'white', fontSize: '2.5rem', margin: 0 }}>
          Parallax Tilt Cards
        </h1>
        <p style={{ color: '#888', marginTop: '0.5rem', fontSize: '1rem' }}>
          Hover over the cards to see the 3D tilt and parallax effect
        </p>
      </div>

      {/* Demo Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
      }}>
        
        {/* Card 1: Project Card */}
        <ParallaxTiltCard
          maxTilt={12}
          shine
          magnetic
          magneticStrength={0.05}
          style={{ height: '400px' }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            position: 'relative',
          }}>
            {/* Background layer - depth 0 (no movement) */}
            <ParallaxLayer depth={0} style={{ 
              position: 'absolute', 
              inset: 0 
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at 30% 30%, #2d3748 0%, transparent 50%)',
              }} />
            </ParallaxLayer>
            
            {/* Main content - depth 0.5 (subtle movement) */}
            <ParallaxLayer depth={0.5} style={{ 
              position: 'absolute', 
              inset: 0,
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}>
              <span style={{ 
                color: '#667eea', 
                fontSize: '0.75rem', 
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '0.5rem',
              }}>
                Featured Project
              </span>
              <h3 style={{ 
                color: 'white', 
                fontSize: '1.5rem', 
                margin: 0, 
                marginBottom: '0.75rem' 
              }}>
                3D Product Configurator
              </h3>
              <p style={{ 
                color: '#a0aec0', 
                fontSize: '0.875rem',
                lineHeight: 1.6,
                margin: 0,
              }}>
                Real-time WebGL visualization with customizable materials and lighting.
              </p>
            </ParallaxLayer>
            
            {/* Floating badge - depth 1.5 (more movement) */}
            <ParallaxLayer depth={1.5} style={{ 
              position: 'absolute', 
              top: '1.5rem', 
              right: '1.5rem',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '0.375rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              }}>
                React + Three.js
              </div>
            </ParallaxLayer>
            
            {/* Decorative element - depth 2 (extreme movement) */}
            <ParallaxLayer depth={2} style={{ 
              position: 'absolute', 
              bottom: '3rem', 
              right: '2rem',
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                border: '2px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '12px',
                transform: 'rotate(15deg)',
              }} />
            </ParallaxLayer>
          </div>
        </ParallaxTiltCard>

        {/* Card 2: Image Card with Gradient Overlay */}
        <ParallaxTiltCard
          maxTilt={15}
          shine
          shineOpacity={0.2}
          style={{ height: '400px' }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            background: '#000',
          }}>
            {/* Background image layer */}
            <ParallaxLayer depth={0.3} style={{ 
              position: 'absolute', 
              inset: '-20px',
            }}>
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80" 
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.7)',
                }}
              />
            </ParallaxLayer>
            
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
              pointerEvents: 'none',
            }} />
            
            {/* Content */}
            <ParallaxLayer depth={0.8} style={{ 
              position: 'absolute', 
              bottom: '2rem',
              left: '2rem',
              right: '2rem',
            }}>
              <h3 style={{ 
                color: 'white', 
                fontSize: '1.75rem', 
                margin: 0, 
                marginBottom: '0.5rem',
                fontWeight: 600,
              }}>
                Abstract Gradients
              </h3>
              <p style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '0.875rem',
                margin: 0,
              }}>
                Generative art collection
              </p>
            </ParallaxLayer>
            
            {/* Floating number */}
            <ParallaxLayer depth={2} style={{ 
              position: 'absolute', 
              top: '1.5rem', 
              left: '1.5rem',
            }}>
              <span style={{
                color: 'white',
                fontSize: '4rem',
                fontWeight: 800,
                opacity: 0.15,
                lineHeight: 1,
              }}>
                01
              </span>
            </ParallaxLayer>
          </div>
        </ParallaxTiltCard>

        {/* Card 3: Glass Card with Reverse Tilt */}
        <ParallaxTiltCard
          maxTilt={10}
          tiltReverse
          shine
          shineColor="rgba(255,255,255,0.3)"
          style={{ height: '400px' }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            {/* Decorative blobs */}
            <ParallaxLayer depth={0.5} style={{ 
              position: 'absolute', 
              top: '-50px', 
              right: '-50px',
            }}>
              <div style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }} />
            </ParallaxLayer>
            
            <ParallaxLayer depth={0.8} style={{ 
              position: 'absolute', 
              bottom: '-30px', 
              left: '-30px',
            }}>
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }} />
            </ParallaxLayer>
            
            {/* Content */}
            <ParallaxLayer depth={1} style={{ 
              position: 'absolute', 
              inset: 0,
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                fontSize: '2rem',
              }}>
                ✦
              </div>
              <h3 style={{ 
                color: 'white', 
                fontSize: '1.5rem', 
                margin: 0, 
                marginBottom: '0.75rem' 
              }}>
                Glass Morphism
              </h3>
              <p style={{ 
                color: 'rgba(255,255,255,0.6)', 
                fontSize: '0.875rem',
                lineHeight: 1.6,
                margin: 0,
                maxWidth: '280px',
              }}>
                Reverse tilt creates an interesting "push away" effect. 
                Notice how the card tilts opposite to cursor movement.
              </p>
            </ParallaxLayer>
          </div>
        </ParallaxTiltCard>

        {/* Card 4: Minimal Card */}
        <ParallaxTiltCard
          maxTilt={8}
          shine={false}
          springConfig={{ damping: 30, stiffness: 200 }}
          style={{ height: '400px' }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            background: '#fff',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}>
            <ParallaxLayer depth={0.5} style={{ 
              position: 'absolute', 
              inset: 0,
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ 
                  color: '#1a1a2e', 
                  fontSize: '1.25rem', 
                  margin: 0, 
                  marginBottom: '0.5rem' 
                }}>
                  Minimal Style
                </h3>
                <p style={{ 
                  color: '#718096', 
                  fontSize: '0.875rem',
                  margin: 0,
                }}>
                  Shine disabled, stiffer spring
                </p>
              </div>
            </ParallaxLayer>
            
            {/* Floating decorations */}
            <ParallaxLayer depth={1.5} style={{ 
              position: 'absolute', 
              top: '2rem', 
              left: '2rem',
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#f093fb',
              }} />
            </ParallaxLayer>
            
            <ParallaxLayer depth={2.5} style={{ 
              position: 'absolute', 
              top: '3rem', 
              right: '3rem',
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#f5576c',
              }} />
            </ParallaxLayer>
          </div>
        </ParallaxTiltCard>
      </div>

      {/* Code Example */}
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
          Usage
        </h2>
        <pre style={{
          background: '#1a1a2e',
          padding: '1.5rem',
          borderRadius: '12px',
          overflow: 'auto',
          fontSize: '0.875rem',
          lineHeight: 1.7,
        }}>
          <code style={{ color: '#a0aec0' }}>{`import { ParallaxTiltCard, ParallaxLayer } from './parallax-tilt-card'

<ParallaxTiltCard maxTilt={12} shine magnetic>
  <ParallaxLayer depth={0}>
    {/* Background - no movement */}
    <img src="/bg.jpg" />
  </ParallaxLayer>
  
  <ParallaxLayer depth={0.5}>
    {/* Content - subtle movement */}
    <h3>Title</h3>
  </ParallaxLayer>
  
  <ParallaxLayer depth={1.5}>
    {/* Badge - more movement, appears closer */}
    <span className="badge">Featured</span>
  </ParallaxLayer>
</ParallaxTiltCard>`}</code>
        </pre>
      </div>

      {/* Props Reference */}
      <div style={{ maxWidth: '800px', margin: '0 auto 4rem', width: '100%' }}>
        <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
          Props
        </h2>
        <div style={{
          background: '#1a1a2e',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          {[
            ['maxTilt', '15', 'Maximum rotation in degrees'],
            ['tiltReverse', 'false', 'Tilt away from cursor instead of toward'],
            ['perspective', '1000', 'CSS perspective value (px)'],
            ['parallaxMultiplier', '10', 'Pixels of movement per depth unit'],
            ['shine', 'true', 'Enable shine/glare effect'],
            ['shineOpacity', '0.15', 'Shine overlay opacity'],
            ['magnetic', 'false', 'Enable magnetic pull toward cursor'],
            ['magneticStrength', '0.1', 'Strength of magnetic effect'],
            ['springConfig', '{ damping: 20, stiffness: 150 }', 'Framer Motion spring settings'],
          ].map(([prop, def, desc]) => (
            <div 
              key={prop}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 2fr',
                gap: '1rem',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                fontSize: '0.875rem',
              }}
            >
              <code style={{ color: '#667eea' }}>{prop}</code>
              <code style={{ color: '#a0aec0' }}>{def}</code>
              <span style={{ color: '#718096' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
