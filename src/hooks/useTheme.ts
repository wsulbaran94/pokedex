import { useCallback, useState } from 'react'

export type Theme = 'light' | 'dark'

const currentTheme = (): Theme =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light'

/** The initial theme is applied by the inline script in index.html before first paint. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(currentTheme)

  const toggle = useCallback(() => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Storage unavailable (private mode etc.): the theme still applies for this visit.
    }
    setTheme(next)
  }, [])

  return { theme, toggle }
}
