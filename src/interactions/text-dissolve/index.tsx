/**
 * Text Dissolve - WebGPU Gommage Effect
 * 
 * A dramatic text disintegration effect using Three.js WebGPU renderer and TSL shaders.
 * MSDF text dissolves with noise-driven particles (dust + petals) and selective bloom.
 * 
 * Inspired by the "Gommage" effect from Clair Obscur: Expedition 33
 * Based on Codrops tutorial by Thibault Introvigne
 * 
 * Requirements:
 * - Browser with WebGPU support (Chrome 113+, Edge 113+, Firefox behind flag)
 * - three.js 0.181.0+ with WebGPU renderer
 * 
 * @source https://tympanus.net/codrops/2026/01/28/webgpu-gommage-effect-dissolving-msdf-text-into-dust-and-petals-with-three-js-tsl/
 */

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Experience interface
interface ITextDissolveExperience {
  initialize(container: HTMLElement): Promise<void>
  dispose(): void
}

// Dynamically import to avoid SSR issues with WebGPU
let TextDissolveExperienceClass: { new(): ITextDissolveExperience } | null = null

export function TextDissolve() {
  const containerRef = useRef<HTMLDivElement>(null)
  const experienceRef = useRef<ITextDissolveExperience | null>(null)
  const [webgpuSupported, setWebgpuSupported] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      // Check WebGPU support
      if (!navigator.gpu) {
        setWebgpuSupported(false)
        setLoading(false)
        return
      }
      
      try {
        const adapter = await navigator.gpu.requestAdapter()
        if (!adapter) {
          setWebgpuSupported(false)
          setLoading(false)
          return
        }
        setWebgpuSupported(true)
        
        // Dynamically import the experience module
        const module = await import('./experience')
        TextDissolveExperienceClass = module.TextDissolveExperience
        
        if (containerRef.current && TextDissolveExperienceClass) {
          experienceRef.current = new TextDissolveExperienceClass()
          await experienceRef.current.initialize(containerRef.current)
        }
        
        setLoading(false)
      } catch (err) {
        console.error('WebGPU initialization failed:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    init()

    return () => {
      if (experienceRef.current) {
        experienceRef.current.dispose()
      }
    }
  }, [])

  if (webgpuSupported === false) {
    return (
      <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center text-white p-8">
        <h1 className="text-3xl font-bold mb-4">WebGPU Not Supported</h1>
        <p className="text-gray-400 text-center max-w-md mb-6">
          This effect requires WebGPU, which isn't available in your browser yet.
        </p>
        <ul className="text-sm text-gray-500 mb-8 space-y-1">
          <li>✓ Chrome 113+ (enabled by default)</li>
          <li>✓ Edge 113+ (enabled by default)</li>
          <li>○ Firefox (behind flag)</li>
          <li>○ Safari (experimental)</li>
        </ul>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center text-white p-8">
        <h1 className="text-3xl font-bold mb-4 text-red-400">Error</h1>
        <p className="text-gray-400 text-center max-w-md mb-6">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#111111]">
      {/* Canvas container */}
      <div ref={containerRef} className="fixed inset-0" />
      
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-[#111111] flex items-center justify-center z-50">
          <div className="text-white text-xl">Loading WebGPU experience...</div>
        </div>
      )}
      
      {/* UI overlay */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="pointer-events-auto absolute top-6 left-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
        >
          ← Back
        </button>
        
        {/* Title and info */}
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-2xl font-bold mb-1">Text Dissolve</h1>
          <p className="text-gray-400 text-sm">WebGPU + TSL Shaders</p>
        </div>
        
        {/* Trigger button */}
        <button
          id="dissolve-trigger"
          className="pointer-events-auto absolute bottom-6 right-6 px-8 py-4 bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          DISSOLVE
        </button>
      </div>
    </div>
  )
}

export default TextDissolve
