import { badgeColors, capitalize } from '../lib/typeColors'

export function TypeBadge({ type, size = 'sm' }: { type: string; size?: 'sm' | 'md' }) {
  const { bg, fg } = badgeColors(type)
  return (
    <span
      className={`inline-block rounded-full font-semibold shadow-sm ${
        size === 'md' ? 'px-4 py-1 text-sm' : 'px-2.5 py-0.5 text-xs'
      }`}
      style={{ backgroundColor: bg, color: fg }}
    >
      {capitalize(type)}
    </span>
  )
}
