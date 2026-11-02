import { fieldClass } from '../lib/styles'
import { POKEMON_TYPES, capitalize } from '../lib/typeColors'

export function TypeFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Filter by type"
      className={`${fieldClass} px-5`}
    >
      <option value="">All types</option>
      {POKEMON_TYPES.map((t) => (
        <option key={t} value={t}>
          {capitalize(t)}
        </option>
      ))}
    </select>
  )
}
