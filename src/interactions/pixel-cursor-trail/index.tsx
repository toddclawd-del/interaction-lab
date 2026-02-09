import { useState } from 'react'
import { PixelCursorTrail } from './PixelCursorTrail'
import './demo.css'

type ColorMode = 'mono' | 'rainbow' | 'gradient'

const PRESETS = {
  mono: { label: 'Mono', color: '#ffffff' },
  cyan: { label: 'Cyan', color: '#00ffff' },
  magenta: { label: 'Magenta', color: '#ff00ff' },
  lime: { label: 'Lime', color: '#00ff00' },
  orange: { label: 'Orange', color: '#ff6600' },
}

export default function PixelCursorTrailDemo() {
  const [colorMode, setColorMode] = useState<ColorMode>('mono')
  const [baseColor, setBaseColor] = useState('#ffffff')
  const [columns, setColumns] = useState(50)
  const [fadeDuration, setFadeDuration] = useState(800)
  const [showControls, setShowControls] = useState(true)
  const [key, setKey] = useState(0)

  const applyPreset = (preset: keyof typeof PRESETS) => {
    setBaseColor(PRESETS[preset].color)
    setColorMode('mono')
  }

  return (
    <div className="demo-container">
      <PixelCursorTrail
        key={key}
        columns={columns}
        fadeDuration={fadeDuration}
        colorMode={colorMode}
        baseColor={baseColor}
        text="PIXELS"
        subText="move your cursor"
      />

      {/* Back button */}
      <a href="#/" className="back-button">
        ← Back
      </a>

      {/* Toggle controls button */}
      <button 
        className="toggle-controls"
        onClick={() => setShowControls(!showControls)}
      >
        {showControls ? '✕' : '⚙'}
      </button>

      {/* Control panel */}
      {showControls && (
        <div className="control-panel">
          <h3>Pixel Trail</h3>
          
          <div className="control-group">
            <label>Color Mode</label>
            <div className="button-group">
              {(['mono', 'rainbow', 'gradient'] as ColorMode[]).map(mode => (
                <button
                  key={mode}
                  className={colorMode === mode ? 'active' : ''}
                  onClick={() => setColorMode(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {colorMode === 'mono' && (
            <div className="control-group">
              <label>Presets</label>
              <div className="button-group presets">
                {Object.entries(PRESETS).map(([key, { label, color }]) => (
                  <button
                    key={key}
                    className={baseColor === color ? 'active' : ''}
                    style={{ 
                      '--preset-color': color,
                      background: color === '#ffffff' ? undefined : color
                    } as React.CSSProperties}
                    onClick={() => applyPreset(key as keyof typeof PRESETS)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="control-group">
            <label>Grid Density: {columns}</label>
            <input
              type="range"
              min="20"
              max="80"
              value={columns}
              onChange={(e) => {
                setColumns(parseInt(e.target.value))
                setKey(k => k + 1)
              }}
            />
          </div>

          <div className="control-group">
            <label>Fade Duration: {fadeDuration}ms</label>
            <input
              type="range"
              min="200"
              max="2000"
              step="100"
              value={fadeDuration}
              onChange={(e) => {
                setFadeDuration(parseInt(e.target.value))
                setKey(k => k + 1)
              }}
            />
          </div>

          <button 
            className="reset-button"
            onClick={() => setKey(k => k + 1)}
          >
            Reset Grid
          </button>
        </div>
      )}
    </div>
  )
}
