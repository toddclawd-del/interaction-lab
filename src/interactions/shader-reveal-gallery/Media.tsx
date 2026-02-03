import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import vertexShader from './shaders/vertex.glsl?raw'
import fragmentShader from './shaders/fragment.glsl?raw'

gsap.registerPlugin(ScrollTrigger)

interface MediaProps {
  element: HTMLImageElement
  gridSize?: number
  bgColor?: string
}

export function Media({ element, gridSize = 20, bgColor = '#1a1a1a' }: MediaProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  
  const { viewport, size } = useThree()
  
  // Load texture from image element
  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load(element.src, (tex) => {
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.generateMipmaps = false
      setTexture(tex)
    })
  }, [element.src])
  
  // Create shader material
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: null },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uContainerRes: { value: new THREE.Vector2(1, 1) },
        uProgress: { value: 0 },
        uGridSize: { value: gridSize },
        uColor: { value: new THREE.Color(bgColor) },
      },
      transparent: true,
    })
  }, [gridSize, bgColor])
  
  // Update texture uniform when loaded
  useEffect(() => {
    if (texture && shaderMaterial) {
      shaderMaterial.uniforms.uTexture.value = texture
      shaderMaterial.uniforms.uResolution.value.set(
        texture.image.naturalWidth,
        texture.image.naturalHeight
      )
    }
  }, [texture, shaderMaterial])
  
  // Setup ScrollTrigger for reveal animation
  useEffect(() => {
    if (!element || !shaderMaterial) return
    
    // Create ScrollTrigger that animates uProgress
    const tween = gsap.to(shaderMaterial.uniforms.uProgress, {
      value: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'center center',
        scrub: 0.5,
        toggleActions: 'play reset restart reset',
      },
    })
    
    scrollTriggerRef.current = tween.scrollTrigger as ScrollTrigger
    
    return () => {
      scrollTriggerRef.current?.kill()
      tween.kill()
    }
  }, [element, shaderMaterial])
  
  // Update mesh position and size to match DOM element
  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return
    
    const bounds = element.getBoundingClientRect()
    
    // Convert DOM coordinates to Three.js world coordinates
    // viewport.width/height are in Three.js units that match the visible area
    const meshWidth = (bounds.width / size.width) * viewport.width
    const meshHeight = (bounds.height / size.height) * viewport.height
    
    // Position: center of element relative to viewport center
    const meshX = ((bounds.left + bounds.width / 2) / size.width) * viewport.width - viewport.width / 2
    const meshY = -((bounds.top + bounds.height / 2) / size.height) * viewport.height + viewport.height / 2
    
    meshRef.current.scale.set(meshWidth, meshHeight, 1)
    meshRef.current.position.set(meshX, meshY, 0)
    
    // Update container resolution uniform
    materialRef.current.uniforms.uContainerRes.value.set(bounds.width, bounds.height)
  })
  
  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  )
}
