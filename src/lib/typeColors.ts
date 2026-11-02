export const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
] as const

export const typeColors: Record<string, string> = {
  normal: '#9fa19f',
  fire: '#e62829',
  water: '#2980ef',
  electric: '#fac000',
  grass: '#3fa129',
  ice: '#3dcef3',
  fighting: '#ff8000',
  poison: '#9141cb',
  ground: '#915121',
  flying: '#81b9ef',
  psychic: '#ef4179',
  bug: '#91a119',
  rock: '#afa981',
  ghost: '#704170',
  dragon: '#5060e1',
  dark: '#624d4e',
  steel: '#60a1b8',
  fairy: '#ef70ef',
}

/** Always returns a 6-digit hex color (the contrast helpers below only parse that form). */
export const colorFor = (type: string) => typeColors[type] ?? '#888888'

const DARK_TEXT = '#0f172a'
const LIGHT_TEXT = '#ffffff'
const MIN_CONTRAST = 4.5

const toRgb = (hex: string) => hex.match(/\w\w/g)!.map((h) => parseInt(h, 16))

const toHex = (rgb: number[]) =>
  `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`

/** WCAG relative luminance. */
function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG contrast ratio between two hex colors (1–21). */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** Mixes a color toward black; amount 0 = unchanged, 1 = black. */
export const darken = (hex: string, amount: number) =>
  toHex(toRgb(hex).map((c) => c * (1 - amount)))

/** Mixes a color toward white; amount 0 = unchanged, 1 = white. */
export const lighten = (hex: string, amount: number) =>
  toHex(toRgb(hex).map((c) => c + (255 - c) * amount))

/** Picks whichever of white / near-black text reads better on `bg`. */
export const textColorFor = (bg: string) =>
  contrastRatio(bg, LIGHT_TEXT) >= contrastRatio(bg, DARK_TEXT) ? LIGHT_TEXT : DARK_TEXT

/**
 * Background + text colors for a type that meet WCAG AA (4.5:1).
 * Mid-tone colors where neither text color passes are darkened until white text does.
 */
export function badgeColors(type: string): { bg: string; fg: string; isLightText: boolean } {
  const base = colorFor(type)
  let bg = base
  let fg = textColorFor(bg)
  // Integer counter avoids float drift (0.05 * n) skipping the last step; at 100% it's black, which always passes.
  for (let i = 1; contrastRatio(bg, fg) < MIN_CONTRAST && i <= 20; i++) {
    bg = darken(base, i * 0.05)
    fg = LIGHT_TEXT
  }
  return { bg, fg, isLightText: fg === LIGHT_TEXT }
}

export const capitalize = (s: string) =>
  s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

export const padId = (id: number) => `#${String(id).padStart(4, '0')}`
