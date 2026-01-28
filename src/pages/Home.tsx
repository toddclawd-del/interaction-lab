import { Link } from 'react-router-dom'

interface Experiment {
  slug: string
  title: string
  description: string
  date: string
}

const experiments: Experiment[] = [
  {
    slug: 'cylinder-text',
    title: '3D Cylinder Text',
    description: 'Scroll-driven 3D text rotation with CSS perspective transforms',
    date: '2026-01-28'
  },
  {
    slug: 'dual-wave-text',
    title: 'Dual Wave Text',
    description: 'Scroll-driven opposing wave columns with synced center image',
    date: '2026-01-28'
  },
  {
    slug: 'infinite-canvas',
    title: 'Infinite Canvas',
    description: 'Pannable, zoomable infinite canvas with smooth controls',
    date: '2026-01-27'
  }
]

export function Home() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Interaction Lab</h1>
        <p style={styles.subtitle}>Recreating interesting UI interactions from the wild</p>
      </header>
      
      <div style={styles.grid}>
        {experiments.map((exp) => (
          <Link key={exp.slug} to={`/${exp.slug}`} style={styles.card}>
            <div style={styles.cardContent}>
              <span style={styles.date}>{exp.date}</span>
              <h2 style={styles.cardTitle}>{exp.title}</h2>
              <p style={styles.cardDesc}>{exp.description}</p>
            </div>
            <div style={styles.arrow}>→</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#fff',
    fontFamily: 'Inter, -apple-system, sans-serif',
    padding: '4rem 2rem'
  },
  header: {
    maxWidth: '800px',
    margin: '0 auto 4rem',
    textAlign: 'center'
  },
  title: {
    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '1.25rem',
    color: 'rgba(255,255,255,0.6)'
  },
  grid: {
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    textDecoration: 'none',
    color: '#fff',
    transition: 'all 0.2s ease'
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  date: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'monospace'
  },
  cardTitle: {
    fontSize: '1.35rem',
    fontWeight: 600
  },
  cardDesc: {
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.6)'
  },
  arrow: {
    fontSize: '1.5rem',
    color: 'rgba(255,255,255,0.4)'
  }
}
