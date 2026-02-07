import { useState } from 'react'
import { PixelGrid } from './PixelGrid'

type Pattern = 'radial' | 'directional' | 'random' | 'typewriter'
type Distortion = 'repel' | 'attract' | 'swirl' | 'none'

export function PixelGridDemo() {
  const [pattern, setPattern] = useState<Pattern>('radial')
  const [distortion, setDistortion] = useState<Distortion>('repel')
  const [key, setKey] = useState(0)

  const reset = () => setKey(k => k + 1)

  return (
    <div className="pixel-grid-demo">
      <h1>Pixel Grid Reveal</h1>
      <a href="#/">← Back to Home</a>
      
      {/* Basic reveal */}
      <section className="demo-section">
        <h2>Text Reveal</h2>
        <p>Scroll into view or click to trigger. Move mouse for distortion.</p>
        <div className="demo-card" style={{ height: 300 }}>
          <PixelGrid
            key={`text-${key}`}
            text="PIXELS"
            pixelSize={6}
            gap={2}
            revealPattern="radial"
            distortionMode="repel"
            backgroundColor="#0a0a0a"
            pixelColor="#1a1a1a"
          />
        </div>
        <button 
          style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
          onClick={reset}
        >
          Reset All
        </button>
      </section>

      {/* Pattern comparison */}
      <section className="demo-section">
        <h2>Reveal Patterns</h2>
        <div className="demo-controls">
          {(['radial', 'directional', 'random', 'typewriter'] as Pattern[]).map(p => (
            <button
              key={p}
              className={pattern === p ? 'active' : ''}
              onClick={() => { setPattern(p); reset() }}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="demo-card" style={{ height: 250 }}>
          <PixelGrid
            key={`pattern-${pattern}-${key}`}
            text="HELLO"
            pixelSize={8}
            gap={2}
            revealPattern={pattern}
            revealDirection="left"
            interactive={false}
            autoPlay
            delay={300}
            backgroundColor="#111"
            pixelColor="#222"
          />
        </div>
      </section>

      {/* Distortion modes */}
      <section className="demo-section">
        <h2>Distortion Modes</h2>
        <p>Move your mouse over the grid after reveal.</p>
        <div className="demo-controls">
          {(['repel', 'attract', 'swirl', 'none'] as Distortion[]).map(d => (
            <button
              key={d}
              className={distortion === d ? 'active' : ''}
              onClick={() => setDistortion(d)}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="demo-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <div className="demo-card" style={{ height: 200, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <PixelGrid
              key={`distort-${distortion}-${key}`}
              pixelSize={10}
              gap={3}
              shape="circle"
              distortionMode={distortion}
              distortionStrength={5}
              distortionRadius={100}
              autoPlay
              delay={200}
              backgroundColor="transparent"
              pixelColor="#000"
            >
              <div style={{ 
                width: '100%', 
                height: '100%', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                CONTENT
              </div>
            </PixelGrid>
          </div>
          <div className="demo-card" style={{ height: 200 }}>
            <PixelGrid
              key={`distort2-${distortion}-${key}`}
              pixelSize={6}
              gap={1}
              shape="square"
              borderRadius={2}
              distortionMode={distortion}
              distortionStrength={3}
              distortionRadius={80}
              autoPlay
              delay={400}
              backgroundColor="#0a0a0a"
              pixelColor="#1a1a1a"
            >
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to right, #00c6ff, #0072ff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                HOVER ME
              </div>
            </PixelGrid>
          </div>
        </div>
      </section>

      {/* Pixel sizes */}
      <section className="demo-section">
        <h2>Pixel Size Comparison</h2>
        <div className="demo-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[4, 8, 16].map(size => (
            <div key={size} className="demo-card" style={{ height: 150 }}>
              <PixelGrid
                key={`size-${size}-${key}`}
                text={`${size}px`}
                pixelSize={size}
                gap={size / 4}
                autoPlay
                delay={size * 50}
                staggerDelay={size < 8 ? 5 : 15}
                backgroundColor="#111"
                pixelColor="#222"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Shapes */}
      <section className="demo-section">
        <h2>Pixel Shapes</h2>
        <div className="demo-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="demo-card" style={{ height: 150 }}>
            <PixelGrid
              key={`shape-square-${key}`}
              text="SQUARE"
              pixelSize={8}
              gap={2}
              shape="square"
              autoPlay
              delay={100}
              backgroundColor="#111"
              pixelColor="#222"
            />
          </div>
          <div className="demo-card" style={{ height: 150 }}>
            <PixelGrid
              key={`shape-rounded-${key}`}
              text="ROUNDED"
              pixelSize={8}
              gap={2}
              shape="square"
              borderRadius={3}
              autoPlay
              delay={200}
              backgroundColor="#111"
              pixelColor="#222"
            />
          </div>
          <div className="demo-card" style={{ height: 150 }}>
            <PixelGrid
              key={`shape-circle-${key}`}
              text="CIRCLE"
              pixelSize={8}
              gap={2}
              shape="circle"
              autoPlay
              delay={300}
              backgroundColor="#111"
              pixelColor="#222"
            />
          </div>
        </div>
      </section>

      {/* Animation speeds */}
      <section className="demo-section">
        <h2>Animation Speeds</h2>
        <div className="demo-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[0.5, 1, 2].map(speed => (
            <div key={speed} className="demo-card" style={{ height: 150 }}>
              <PixelGrid
                key={`speed-${speed}-${key}`}
                text={`${speed}x`}
                pixelSize={8}
                gap={2}
                animationSpeed={speed}
                autoPlay
                delay={500}
                backgroundColor="#111"
                pixelColor="#222"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Hero section demo */}
      <section className="demo-section">
        <h2>Hero Section Use Case</h2>
        <div style={{ height: 400, borderRadius: 12, overflow: 'hidden' }}>
          <PixelGrid
            key={`hero-${key}`}
            pixelSize={12}
            gap={3}
            revealPattern="radial"
            distortionMode="repel"
            distortionStrength={4}
            distortionRadius={120}
            staggerDelay={8}
            triggerOnView
            backgroundColor="#000"
            pixelColor="#111"
          >
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              gap: '1rem'
            }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 800, margin: 0 }}>PIXEL GRID</h2>
              <p style={{ fontSize: '1.25rem', opacity: 0.7, margin: 0 }}>Interactive reveal component</p>
            </div>
          </PixelGrid>
        </div>
      </section>

      {/* Accessibility note */}
      <section className="demo-section" style={{ marginBottom: '8rem' }}>
        <h2>Accessibility</h2>
        <ul style={{ color: '#888', lineHeight: 1.8 }}>
          <li>Tab to focus any grid — Enter/Space triggers reveal</li>
          <li>Reduced motion: animations skip, content shows immediately</li>
          <li>Screen readers: aria-busy during animation, aria-live for state changes</li>
          <li>Keyboard-navigable with visible focus ring</li>
        </ul>
      </section>
    </div>
  )
}

export default PixelGridDemo
