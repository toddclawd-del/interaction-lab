import { useRef, useState, useEffect, useCallback } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { WebGLCanvas } from './WebGLCanvas'
import './styles.css'

gsap.registerPlugin(ScrollTrigger)

// Sample images - using picsum for variety
const GALLERY_IMAGES = [
  { id: 1, src: 'https://picsum.photos/seed/reveal1/800/1000', title: 'Northern Light I' },
  { id: 2, src: 'https://picsum.photos/seed/reveal2/700/900', title: 'Arctic Dawn' },
  { id: 3, src: 'https://picsum.photos/seed/reveal3/600/800', title: 'Frozen Tundra' },
  { id: 4, src: 'https://picsum.photos/seed/reveal4/800/600', title: 'Mountain Pass' },
  { id: 5, src: 'https://picsum.photos/seed/reveal5/900/700', title: 'Ice Formations' },
  { id: 6, src: 'https://picsum.photos/seed/reveal6/700/1000', title: 'Midnight Sun' },
  { id: 7, src: 'https://picsum.photos/seed/reveal7/800/900', title: 'Glacier Valley' },
  { id: 8, src: 'https://picsum.photos/seed/reveal8/600/700', title: 'Aurora Borealis' },
]

export default function ShaderRevealGallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const imageRefs = useRef<(HTMLImageElement | null)[]>([])
  
  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    
    setLenis(lenisInstance)
    
    return () => {
      lenisInstance.destroy()
    }
  }, [])
  
  // Collect image refs after they load
  const handleImageLoad = useCallback(() => {
    const loadedImages = imageRefs.current.filter((img): img is HTMLImageElement => img !== null)
    if (loadedImages.length === GALLERY_IMAGES.length) {
      setImages(loadedImages)
      setImagesLoaded(true)
      // Refresh ScrollTrigger after images load
      setTimeout(() => ScrollTrigger.refresh(), 100)
    }
  }, [])
  
  // Set image ref
  const setImageRef = useCallback((index: number) => (el: HTMLImageElement | null) => {
    imageRefs.current[index] = el
  }, [])
  
  return (
    <div ref={containerRef} className="srg-container">
      {/* WebGL Overlay - renders shader reveal effect */}
      {imagesLoaded && images.length > 0 && (
        <WebGLCanvas images={images} lenis={lenis} gridSize={25} />
      )}
      
      {/* Header */}
      <header className="srg-header">
        <h1 className="srg-title">
          Northern<br />Expeditions<br />
          <span className="srg-title-year">1970–1978</span>
        </h1>
      </header>
      
      {/* Grid Gallery */}
      <main className="srg-gallery">
        <div className="srg-grid">
          {GALLERY_IMAGES.map((image, index) => (
            <div 
              key={image.id} 
              className={`srg-grid-item srg-grid-item--${index + 1}`}
            >
              <img
                ref={setImageRef(index)}
                src={image.src}
                alt={image.title}
                className="srg-image"
                onLoad={handleImageLoad}
                crossOrigin="anonymous"
                style={{ opacity: 0 }} // Hide DOM images, WebGL renders them
              />
              <p className="srg-image-title">{image.title}</p>
            </div>
          ))}
        </div>
        
        {/* Prose sections for scroll length */}
        <div className="srg-prose">
          <p>
            Dark spruce forest frowned on either side the frozen waterway. 
            The trees had been stripped by a recent wind of their white covering 
            of frost, and they seemed to lean toward each other, black and ominous, 
            in the fading light.
          </p>
        </div>
        
        <div className="srg-prose">
          <p>
            A vast silence reigned over the land. The land itself was a desolation, 
            lifeless, without movement, so lonely and cold that the spirit of it 
            was not even that of sadness.
          </p>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="srg-footer">
        <p>Scroll to reveal • WebGL Shader Gallery</p>
      </footer>
    </div>
  )
}
