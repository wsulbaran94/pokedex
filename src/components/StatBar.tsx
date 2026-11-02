import { useEffect, useState } from 'react'

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

const MAX_STAT = 255

export function StatBar({ name, value, color }: { name: string; value: number; color: string }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setWidth((value / MAX_STAT) * 100))
    return () => cancelAnimationFrame(frame)
  }, [value])

  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-sm font-medium text-slate-600 dark:text-slate-400">
        {STAT_LABELS[name] ?? name}
      </span>
      <span className="w-9 shrink-0 text-right text-sm font-bold text-slate-800 dark:text-slate-100">
        {value}
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full ring-1 ring-black/15 transition-[width] duration-700 ease-out ring-inset"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
