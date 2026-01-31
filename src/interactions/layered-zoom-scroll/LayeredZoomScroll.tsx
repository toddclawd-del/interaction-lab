import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LayeredZoomScroll.css';

gsap.registerPlugin(ScrollTrigger);

// Sample images from picsum for the floating grid
const floatingImages = [
  'https://picsum.photos/seed/zoom1/300/400',
  'https://picsum.photos/seed/zoom2/300/400',
  'https://picsum.photos/seed/zoom3/300/400',
  'https://picsum.photos/seed/zoom4/300/400',
  'https://picsum.photos/seed/zoom5/300/400',
  'https://picsum.photos/seed/zoom6/300/400',
  'https://picsum.photos/seed/zoom7/300/400',
  'https://picsum.photos/seed/zoom8/300/400',
  'https://picsum.photos/seed/zoom9/300/400',
  'https://picsum.photos/seed/zoom10/300/400',
];

// Main hero image
const mainImage = 'https://picsum.photos/seed/telescope-main/1920/1080';

interface LayeredZoomScrollProps {
  leftText?: string;
  rightText?: string;
  layerCount?: number;
}

export function LayeredZoomScroll({
  leftText = 'explore the',
  rightText = 'unknown',
  layerCount = 6,
}: LayeredZoomScrollProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const smallImagesRef = useRef<HTMLImageElement[]>([]);
  const frontLayersRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const smallImages = smallImagesRef.current.filter(Boolean);
    const frontLayers = frontLayersRef.current.filter(Boolean);

    // Create the main timeline with ScrollTrigger
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        pin: true,
      },
    });

    // Animate floating images along Z-axis (fly toward camera)
    timeline.to(smallImages, {
      z: '100vh',
      opacity: 0,
      duration: 1,
      ease: 'power1.inOut',
      stagger: {
        amount: 0.2,
        from: 'center',
      },
    }, 0);

    // Animate CSS variable for main image scale and text movement
    timeline.to(section, {
      '--progress': 1,
      duration: 1,
      ease: 'power1.inOut',
    }, 0);

    // Animate front layers back to scale 1 (trailing zoom effect)
    timeline.to(frontLayers, {
      scale: 1,
      duration: 1,
      ease: 'power1.inOut',
    }, 0.4);

    // Remove blur from front layers
    timeline.to(frontLayers, {
      filter: 'blur(0px)',
      duration: 1,
      ease: 'power1.inOut',
      stagger: {
        amount: 0.2,
        from: 'end',
      },
    }, 0.6);

    return () => {
      timeline.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Generate scale values for each layer (decreasing)
  const getLayerScale = (index: number, total: number) => {
    const scales = [1, 0.85, 0.6, 0.45, 0.3, 0.15];
    return scales[index] || 1 - (index / total) * 0.85;
  };

  return (
    <div 
      className="layered-zoom-section" 
      ref={sectionRef}
      style={{ '--progress': 0 } as React.CSSProperties}
    >
      {/* Floating small images */}
      <div className="floating-images">
        {floatingImages.map((src, index) => (
          <img
            key={index}
            ref={(el) => {
              if (el) smallImagesRef.current[index] = el;
            }}
            src={src}
            alt={`Floating ${index + 1}`}
            className={`floating-img floating-img-${index + 1}`}
            loading="lazy"
          />
        ))}
      </div>

      {/* Main media container */}
      <div className="media-container">
        {/* Background image */}
        <div className="media-back">
          <img src={mainImage} alt="Main visual" />
        </div>

        {/* Front layers for trailing zoom effect */}
        {Array.from({ length: layerCount }).map((_, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) frontLayersRef.current[index] = el;
            }}
            className="media-front"
            style={{
              transform: `scale(${getLayerScale(index, layerCount)})`,
              zIndex: layerCount - index,
            }}
          >
            <img src={mainImage} alt={`Layer ${index + 1}`} />
          </div>
        ))}
      </div>

      {/* Split text overlay */}
      <h1 className="split-text">
        <span className="text-left">{leftText}</span>
        <span className="text-right">{rightText}</span>
      </h1>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <span>Scroll to explore</span>
        <div className="scroll-arrow">↓</div>
      </div>
    </div>
  );
}

export default LayeredZoomScroll;
