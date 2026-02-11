/**
 * Morphing Grid Gallery Demo
 * 
 * Showcases the MorphingGrid component with sample images.
 */

import { Link } from 'react-router-dom'
import { MorphingGrid, GridItem } from './MorphingGrid'

// Generate sample items using picsum.photos
const DEMO_ITEMS: GridItem[] = Array.from({ length: 24 }, (_, i) => ({
  id: `img-${i + 1}`,
  image: `https://picsum.photos/seed/morph${i + 1}/600/600`,
  aspectRatio: ['1/1', '4/5', '1/1', '5/4'][i % 4],
  label: String(i + 1).padStart(2, '0'),
}))

export default function MorphingGridDemo() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '2rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Link
          to="/"
          style={{
            color: '#666',
            textDecoration: 'none',
            fontSize: '0.875rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          ← Back to Lab
        </Link>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>
          Morphing Grid
        </h1>
        <p style={{ color: '#888', margin: '0.5rem 0 0', maxWidth: '600px' }}>
          Click the density controls and watch items flow to their new positions. 
          Uses GSAP Flip plugin for layout animations.
        </p>
      </header>

      {/* Main Demo */}
      <main style={{ padding: '2rem' }}>
        <MorphingGrid
          items={DEMO_ITEMS}
          defaultDensity={75}
          enhancedTransition={true}
          gap="1rem"
          onDensityChange={(d) => console.log(`Density: ${d}%`)}
        />
      </main>

      {/* Custom Render Example */}
      <section
        style={{
          padding: '2rem',
          marginTop: '4rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
          Custom Renderer Example
        </h2>
        <p style={{ color: '#888', marginBottom: '1.5rem' }}>
          Using the <code style={{ background: '#222', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>renderItem</code> prop for custom item styling:
        </p>

        <MorphingGrid
          items={DEMO_ITEMS.slice(0, 12)}
          defaultDensity={100}
          enhancedTransition={false}
          gap="0.5rem"
          renderItem={(_item, index) => (
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                background: `hsl(${index * 30}, 60%, 20%)`,
                borderRadius: '12px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.3)',
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          )}
        />
      </section>

      {/* Usage Code */}
      <section
        style={{
          padding: '2rem',
          marginTop: '4rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
          Usage
        </h2>
        <pre
          style={{
            background: '#111',
            padding: '1.5rem',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '0.875rem',
            lineHeight: 1.6,
          }}
        >
{`import { MorphingGrid } from './interactions/morphing-grid/MorphingGrid'

const items = [
  { id: '1', image: '/img1.jpg', aspectRatio: '4/5' },
  { id: '2', image: '/img2.jpg', aspectRatio: '1/1' },
  // ...
]

<MorphingGrid
  items={items}
  defaultDensity={75}
  enhancedTransition={true}
  onDensityChange={(d) => console.log(d)}
  renderItem={(item, i) => (
    <img src={item.image} alt="" />
  )}
/>`}
        </pre>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          marginTop: '4rem',
          color: '#666',
          fontSize: '0.875rem',
        }}
      >
        Interaction Lab • Reference:{' '}
        <a
          href="https://tympanus.net/Tutorials/GridLayoutTransitions/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#888' }}
        >
          Codrops Grid Layout Transitions
        </a>
      </footer>
    </div>
  )
}
