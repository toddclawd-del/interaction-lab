export type RevealPattern = 'radial' | 'directional' | 'random' | 'typewriter'
export type DistortionMode = 'repel' | 'attract' | 'swirl' | 'none'

export interface GridConfig {
  width: number
  height: number
  pixelSize: number
  gap: number
}

export interface GridResult {
  rows: number
  cols: number
  totalPixels: number
  pixelPositions: Array<{ x: number; y: number; index: number }>
}

/**
 * Calculate grid dimensions and pixel positions
 */
export function calculateGrid(config: GridConfig): GridResult {
  const { width, height, pixelSize, gap } = config
  
  const cellSize = pixelSize + gap
  const cols = Math.ceil(width / cellSize)
  const rows = Math.ceil(height / cellSize)
  const totalPixels = rows * cols
  
  const pixelPositions: GridResult['pixelPositions'] = []
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col
      pixelPositions.push({
        x: col * cellSize + pixelSize / 2,
        y: row * cellSize + pixelSize / 2,
        index,
      })
    }
  }
  
  return { rows, cols, totalPixels, pixelPositions }
}

/**
 * Get reveal order based on pattern
 */
export function getRevealOrder(
  grid: GridResult,
  pattern: RevealPattern,
  direction: 'top' | 'bottom' | 'left' | 'right' = 'top'
): number[] {
  const { rows, cols, pixelPositions } = grid
  const centerX = (cols - 1) / 2
  const centerY = (rows - 1) / 2
  
  switch (pattern) {
    case 'radial': {
      // Sort by distance from center
      const sorted = [...pixelPositions].sort((a, b) => {
        const distA = Math.hypot(a.x - centerX * 10, a.y - centerY * 10)
        const distB = Math.hypot(b.x - centerX * 10, b.y - centerY * 10)
        return distA - distB
      })
      return sorted.map(p => p.index)
    }
    
    case 'directional': {
      const sorted = [...pixelPositions].sort((a, b) => {
        switch (direction) {
          case 'top':
            return a.y - b.y
          case 'bottom':
            return b.y - a.y
          case 'left':
            return a.x - b.x
          case 'right':
            return b.x - a.x
        }
      })
      return sorted.map(p => p.index)
    }
    
    case 'random': {
      const indices = pixelPositions.map(p => p.index)
      // Fisher-Yates shuffle
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]]
      }
      return indices
    }
    
    case 'typewriter': {
      // Row by row, left to right
      return pixelPositions.map(p => p.index)
    }
    
    default:
      return pixelPositions.map(p => p.index)
  }
}

/**
 * Calculate distortion offset for a pixel based on mouse position
 */
export function calculateDistortion(
  pixelX: number,
  pixelY: number,
  mouseX: number,
  mouseY: number,
  radius: number,
  strength: number,
  mode: DistortionMode
): { offsetX: number; offsetY: number } {
  if (mode === 'none') {
    return { offsetX: 0, offsetY: 0 }
  }
  
  const dx = pixelX - mouseX
  const dy = pixelY - mouseY
  const distance = Math.hypot(dx, dy)
  
  if (distance > radius) {
    return { offsetX: 0, offsetY: 0 }
  }
  
  const influence = Math.pow(1 - distance / radius, 2) // Quadratic falloff
  const normalizedDx = distance > 0 ? dx / distance : 0
  const normalizedDy = distance > 0 ? dy / distance : 0
  
  let offsetX = 0
  let offsetY = 0
  
  switch (mode) {
    case 'repel':
      // Push pixels away from cursor
      offsetX = normalizedDx * strength * influence * 10
      offsetY = normalizedDy * strength * influence * 10
      break
      
    case 'attract':
      // Pull pixels toward cursor
      offsetX = -normalizedDx * strength * influence * 10
      offsetY = -normalizedDy * strength * influence * 10
      break
      
    case 'swirl':
      // Rotate pixels around cursor
      const angle = influence * strength * 0.5
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      offsetX = (dx * cos - dy * sin - dx) * influence
      offsetY = (dx * sin + dy * cos - dy) * influence
      break
  }
  
  return { offsetX, offsetY }
}

/**
 * Sample colors from an image at grid positions
 * Used when rendering images as pixel grids
 */
export async function sampleImageColors(
  imageSrc: string,
  grid: GridResult,
  pixelSize: number,
  gap: number
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }
      
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      const colors: string[] = []
      const cellSize = pixelSize + gap
      
      for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
          // Sample center of each grid cell
          const sampleX = Math.floor((col * cellSize + pixelSize / 2) * (img.width / (grid.cols * cellSize)))
          const sampleY = Math.floor((row * cellSize + pixelSize / 2) * (img.height / (grid.rows * cellSize)))
          
          const pixel = ctx.getImageData(
            Math.min(sampleX, img.width - 1),
            Math.min(sampleY, img.height - 1),
            1,
            1
          ).data
          
          colors.push(`rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`)
        }
      }
      
      resolve(colors)
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = imageSrc
  })
}
