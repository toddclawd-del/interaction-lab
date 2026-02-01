import { createContext, useContext, useState, ReactNode } from 'react'

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
}

export const presets = {
  indigo: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#10b981' },
  rose: { primary: '#f43f5e', secondary: '#fb7185', accent: '#fbbf24' },
  cyan: { primary: '#06b6d4', secondary: '#22d3ee', accent: '#a855f7' },
  emerald: { primary: '#10b981', secondary: '#34d399', accent: '#6366f1' },
  orange: { primary: '#f97316', secondary: '#fb923c', accent: '#06b6d4' },
} as const

type PresetName = keyof typeof presets

interface ThemeContextType {
  colors: ThemeColors
  setColor: (key: keyof ThemeColors, value: string) => void
  setPreset: (preset: PresetName) => void
  currentPreset: PresetName | null
}

const ThemeContext = createContext<ThemeContextType>({
  colors: presets.indigo,
  setColor: () => {},
  setPreset: () => {},
  currentPreset: 'indigo',
})

// Helper to convert hex to RGB for use with rgba()
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '99, 102, 241'
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<ThemeColors>(presets.indigo)
  const [currentPreset, setCurrentPreset] = useState<PresetName | null>('indigo')

  const setColor = (key: keyof ThemeColors, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }))
    setCurrentPreset(null) // Custom color selected
  }

  const setPreset = (preset: PresetName) => {
    setColors(presets[preset])
    setCurrentPreset(preset)
  }

  return (
    <ThemeContext.Provider value={{ colors, setColor, setPreset, currentPreset }}>
      <div
        style={{
          '--color-primary': colors.primary,
          '--color-secondary': colors.secondary,
          '--color-accent': colors.accent,
          '--color-primary-rgb': hexToRgb(colors.primary),
          '--color-secondary-rgb': hexToRgb(colors.secondary),
          '--color-accent-rgb': hexToRgb(colors.accent),
          // Alpha variants for backgrounds
          '--color-primary-alpha-10': `rgba(${hexToRgb(colors.primary)}, 0.1)`,
          '--color-primary-alpha-15': `rgba(${hexToRgb(colors.primary)}, 0.15)`,
          '--color-primary-alpha-25': `rgba(${hexToRgb(colors.primary)}, 0.25)`,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
