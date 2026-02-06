import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollStack.css';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface StackCard {
  title: string;
  description: string;
  tags: string[];
  image?: string;
  icon?: string;
  cta?: { label: string; href?: string };
  gradient: string;
  glow: string;
}

interface ScrollStackProps {
  /** Card data — provide your own or use defaults */
  cards?: StackCard[];
  /** Scale factor applied to background cards (0-1). Default 0.04 */
  scaleStep?: number;
  /** Y offset in pixels between stacked cards. Default 40 */
  offsetStep?: number;
  /** Enable blur on background cards. Default true */
  enableBlur?: boolean;
  /** Show intro hero section. Default true */
  showHero?: boolean;
  /** Show outro section. Default true */
  showOutro?: boolean;
  /** Show right-side progress dots. Default true */
  showProgress?: boolean;
}

// ═══════════════════════════════════════════════════════════
// DEFAULT CARD DATA
// ═══════════════════════════════════════════════════════════

const defaultCards: StackCard[] = [
  {
    title: 'Design Systems\nthat Scale',
    description: 'Build consistent, composable interfaces with tokens, components, and documentation that grow with your product.',
    tags: ['Design', 'Tokens', 'Figma'],
    icon: '◆',
    cta: { label: 'Explore' },
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    glow: 'rgba(15, 52, 96, 0.25)',
  },
  {
    title: 'Interactions\nthat Delight',
    description: 'Micro-animations and transitions that make every click, hover, and scroll feel intentional and smooth.',
    tags: ['Motion', 'GSAP', 'CSS'],
    icon: '✦',
    cta: { label: 'Discover' },
    gradient: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b69 50%, #5b21b6 100%)',
    glow: 'rgba(91, 33, 182, 0.25)',
  },
  {
    title: 'Performance\nby Default',
    description: 'Every animation runs at 60fps. GPU-accelerated transforms, will-change hints, and zero layout thrashing.',
    tags: ['Performance', '60fps', 'GPU'],
    icon: '⚡',
    cta: { label: 'Benchmark' },
    gradient: 'linear-gradient(135deg, #0a1628 0%, #0c4a6e 50%, #0891b2 100%)',
    glow: 'rgba(8, 145, 178, 0.25)',
  },
  {
    title: 'Responsive\nEverywhere',
    description: 'From 375px phones to ultrawide monitors. Fluid typography, adaptive layouts, and touch-first interactions.',
    tags: ['Responsive', 'Mobile', 'Touch'],
    icon: '◈',
    cta: { label: 'Resize' },
    gradient: 'linear-gradient(135deg, #1a0f0a 0%, #7c2d12 50%, #ea580c 100%)',
    glow: 'rgba(234, 88, 12, 0.25)',
  },
  {
    title: 'Open Source\n& Portable',
    description: 'Copy the component into your project. No vendor lock-in, no complex setup. Just clean React + GSAP.',
    tags: ['React', 'TypeScript', 'MIT'],
    icon: '✧',
    cta: { label: 'Get the Code' },
    gradient: 'linear-gradient(135deg, #0a1a0a 0%, #14532d 50%, #16a34a 100%)',
    glow: 'rgba(22, 163, 74, 0.25)',
  },
];

// Sample images from picsum
const sampleImages = [
  'https://picsum.photos/seed/stack1/600/800',
  'https://picsum.photos/seed/stack2/600/800',
  'https://picsum.photos/seed/stack3/600/800',
  'https://picsum.photos/seed/stack4/600/800',
  'https://picsum.photos/seed/stack5/600/800',
];

// ═══════════════════════════════════════════════════════════
// ARROW ICON
// ═══════════════════════════════════════════════════════════

const ArrowRight = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export function ScrollStack({
  cards = defaultCards,
  scaleStep = 0.04,
  offsetStep = 40,
  enableBlur = true,
  showHero = true,
  showOutro = true,
  showProgress = true,
}: ScrollStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const innerCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // ─── Progress dot click → scroll to card ──────────────
  const scrollToCard = useCallback((index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;
    const top = card.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  // ─── GSAP ScrollTrigger setup ─────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cardEls = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const innerEls = innerCardsRef.current.filter(Boolean) as HTMLDivElement[];
    const totalCards = cardEls.length;

    if (totalCards === 0) return;

    const ctx = gsap.context(() => {
      // ── Pin each card. All cards stay pinned until the end ──
      // This creates the "stacking" illusion: earlier cards are 
      // pinned behind later ones via z-index.
      cardEls.forEach((card, i) => {
        // Set z-index so later cards layer on top
        gsap.set(card, { zIndex: i + 1 });

        ScrollTrigger.create({
          trigger: card,
          start: 'top top',
          // Pin until end of scroll (all cards stay in place)
          endTrigger: '.scroll-stack__outro',
          end: 'top bottom',
          pin: true,
          pinSpacing: false,
          id: `pin-${i}`,
        });
      });

      // ── Scale/blur/offset as each new card overlaps ──
      cardEls.forEach((_, i) => {
        if (i >= totalCards - 1) return;

        const nextCard = cardEls[i + 1];
        const innerCard = innerEls[i];
        if (!nextCard || !innerCard) return;

        // Progressive depth: scale down, shift up, blur, fade
        const targetScale = 1 - scaleStep * 1; // one step per card overlap
        const targetY = -offsetStep;
        const targetBlur = enableBlur ? 3 : 0;
        const targetOpacity = 0.65;

        gsap.to(innerCard, {
          scale: targetScale,
          y: targetY,
          filter: `blur(${targetBlur}px)`,
          opacity: targetOpacity,
          ease: 'none',
          scrollTrigger: {
            trigger: nextCard,
            start: 'top bottom',
            end: 'top top',
            scrub: 0.3,
            id: `stack-${i}`,
            onEnter: () => setActiveIndex(i + 1),
            onLeaveBack: () => setActiveIndex(i),
          },
        });
      });

      // Hero parallax — move content up as user scrolls
      if (showHero) {
        const heroEl = container.querySelector('.scroll-stack__hero');
        if (heroEl) {
          gsap.to(heroEl, {
            y: -100,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: heroEl,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      }
    }, container);

    return () => ctx.revert();
  }, [cards.length, scaleStep, offsetStep, enableBlur, showHero]);

  return (
    <div ref={containerRef} className="scroll-stack">
      {/* Back link */}
      <a href="#/" className="scroll-stack__back">← Back</a>

      {/* Progress dots */}
      {showProgress && (
        <div className="scroll-stack__progress">
          {cards.map((_, i) => (
            <button
              key={i}
              className={`scroll-stack__progress-dot ${i === activeIndex ? 'scroll-stack__progress-dot--active' : ''}`}
              onClick={() => scrollToCard(i)}
              aria-label={`Scroll to card ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Hero */}
      {showHero && (
        <section className="scroll-stack__hero">
          <div className="scroll-stack__hero-label">
            <span className="scroll-stack__hero-dot" />
            Scroll to explore
          </div>
          <h1 className="scroll-stack__hero-title">
            Cards that <span>stack</span>
            <br />
            as you scroll
          </h1>
          <p className="scroll-stack__hero-subtitle">
            Each section pins to the viewport and stacks with depth,
            blur, and scale — creating a cinematic storytelling flow.
          </p>
          <div className="scroll-stack__scroll-cue">
            <span>Scroll</span>
            <div className="scroll-stack__scroll-line" />
          </div>
        </section>
      )}

      {/* Stacking Cards */}
      <div className="scroll-stack__cards">
        {cards.map((card, i) => (
          <div
            key={i}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="scroll-stack__card"
          >
            <div
              ref={(el) => { innerCardsRef.current[i] = el; }}
              className="scroll-stack__card-inner"
              style={{
                '--card-gradient': card.gradient,
                '--card-glow': card.glow,
              } as React.CSSProperties}
            >
              {/* Background */}
              <div className="scroll-stack__card-bg" />

              {/* Content side */}
              <div className="scroll-stack__content">
                <span className="scroll-stack__number">
                  {String(i + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}
                </span>

                <h2 className="scroll-stack__card-title">
                  {card.title.split('\n').map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < card.title.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </h2>

                <p className="scroll-stack__card-desc">{card.description}</p>

                <div className="scroll-stack__tags">
                  {card.tags.map((tag) => (
                    <span key={tag} className="scroll-stack__tag">{tag}</span>
                  ))}
                </div>

                {card.cta && (
                  <button className="scroll-stack__card-cta">
                    {card.cta.label}
                    <ArrowRight />
                  </button>
                )}
              </div>

              {/* Visual side */}
              <div className="scroll-stack__visual">
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.title}
                    className="scroll-stack__visual-img"
                    loading="lazy"
                  />
                ) : (
                  <img
                    src={sampleImages[i % sampleImages.length]}
                    alt={card.title.replace('\n', ' ')}
                    className="scroll-stack__visual-img"
                    loading="lazy"
                    crossOrigin="anonymous"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Outro */}
      {showOutro && (
        <section className="scroll-stack__outro">
          <h2 className="scroll-stack__outro-title">That's the stack.</h2>
          <p className="scroll-stack__outro-text">
            Scroll back up to reverse the effect — or grab the code and make it yours.
          </p>
        </section>
      )}
    </div>
  );
}

export default ScrollStack;
