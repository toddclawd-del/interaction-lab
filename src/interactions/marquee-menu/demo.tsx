import { useState } from 'react'
import { MarqueeMenu, MarqueeMenuItem, MarqueeContent } from './index'

// Demo menu items with varied content
const menuItems: Array<{
  label: string
  href: string
  content: MarqueeContent[]
}> = [
  {
    label: 'About',
    href: '#about',
    content: [
      { type: 'text', content: 'Our Story' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=100&fit=crop' },
      { type: 'text', content: 'Since 2015' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=100&fit=crop' },
      { type: 'text', content: 'Our Mission' },
    ],
  },
  {
    label: 'Work',
    href: '#work',
    content: [
      { type: 'text', content: 'Featured Projects' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=100&fit=crop' },
      { type: 'text', content: 'Case Studies' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=100&fit=crop' },
      { type: 'text', content: 'Process' },
    ],
  },
  {
    label: 'Services',
    href: '#services',
    content: [
      { type: 'text', content: 'Design' },
      { type: 'text', content: 'Development' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=200&h=100&fit=crop' },
      { type: 'text', content: 'Strategy' },
      { type: 'text', content: 'Consulting' },
    ],
  },
  {
    label: 'Contact',
    href: '#contact',
    content: [
      { type: 'text', content: 'Get In Touch' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=100&fit=crop' },
      { type: 'text', content: "Let's Talk" },
      { type: 'text', content: 'Start a Project' },
    ],
  },
]

export default function MarqueeMenuDemo() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [speed, setSpeed] = useState(15)

  const handleClick = (e: React.MouseEvent, label: string) => {
    e.preventDefault()
    console.log(`Navigating to: ${label}`)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: theme === 'dark' ? '#0a0a0a' : '#f5f5f5',
      transition: 'background 0.3s ease',
    }}>
      {/* Header */}
      <header style={{
        padding: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      }}>
        <a 
          href="#/" 
          style={{ 
            color: theme === 'dark' ? '#667eea' : '#4c51bf',
            textDecoration: 'none',
            fontSize: '0.875rem',
          }}
        >
          ← Back to Home
        </a>
        
        <h1 style={{ 
          color: theme === 'dark' ? '#fff' : '#000',
          fontSize: 'clamp(1rem, 3vw, 1.5rem)',
          fontWeight: 600,
          margin: 0,
        }}>
          Direction-Aware Marquee Menu
        </h1>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ 
            color: theme === 'dark' ? '#888' : '#666',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            Speed:
            <input 
              type="range" 
              min="5" 
              max="30" 
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              style={{ width: '80px' }}
            />
            {speed}s
          </label>
          
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            style={{
              padding: '0.5rem 1rem',
              background: theme === 'dark' ? '#fff' : '#000',
              color: theme === 'dark' ? '#000' : '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      {/* Description */}
      <div style={{
        padding: '2rem',
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <p style={{ 
          color: theme === 'dark' ? '#888' : '#666',
          fontSize: '0.875rem',
          lineHeight: 1.6,
        }}>
          Hover over menu items to see the direction-aware reveal effect. 
          The marquee slides in from the edge your cursor enters. 
          Try entering from the top vs. the bottom.
        </p>
      </div>

      {/* Menu */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '2rem auto',
        padding: '0 2rem',
      }}>
        <MarqueeMenu theme={theme}>
          {menuItems.map((item) => (
            <MarqueeMenuItem
              key={item.label}
              label={item.label}
              href={item.href}
              marqueeContent={item.content}
              marqueeSpeed={speed}
              onClick={(e) => handleClick(e, item.label)}
            />
          ))}
        </MarqueeMenu>
      </div>

      {/* Usage Example */}
      <div style={{
        padding: '4rem 2rem',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <h2 style={{ 
          color: theme === 'dark' ? '#fff' : '#000',
          fontSize: '1.25rem',
          marginBottom: '1rem',
        }}>
          Usage
        </h2>
        <pre style={{
          background: theme === 'dark' ? '#1a1a1a' : '#e5e5e5',
          padding: '1.5rem',
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '0.75rem',
          lineHeight: 1.6,
          color: theme === 'dark' ? '#e0e0e0' : '#333',
        }}>
{`import { MarqueeMenu, MarqueeMenuItem } from '@/interactions/marquee-menu'

<MarqueeMenu theme="dark">
  <MarqueeMenuItem
    label="About"
    href="/about"
    marqueeContent={[
      { type: 'text', content: 'Our Story' },
      { type: 'image', src: '/team.jpg' },
      { type: 'text', content: 'Since 2015' },
    ]}
  />
  <MarqueeMenuItem
    label="Work"
    href="/work"
    marqueeContent={[
      { type: 'text', content: 'Featured' },
      { type: 'image', src: '/project.jpg' },
    ]}
    marqueeSpeed={10}
  />
</MarqueeMenu>`}
        </pre>
      </div>

      {/* Credits */}
      <footer style={{
        padding: '2rem',
        textAlign: 'center',
        borderTop: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      }}>
        <p style={{ 
          color: theme === 'dark' ? '#666' : '#888',
          fontSize: '0.75rem',
        }}>
          Inspired by{' '}
          <a 
            href="https://k72.ca/en" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: theme === 'dark' ? '#667eea' : '#4c51bf' }}
          >
            K72
          </a>
          {' • '}
          <a 
            href="https://tympanus.net/codrops/2021/06/30/how-to-code-the-k72-marquee-hover-animation/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: theme === 'dark' ? '#667eea' : '#4c51bf' }}
          >
            Codrops Tutorial
          </a>
        </p>
      </footer>
    </div>
  )
}
