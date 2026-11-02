import { POKEMON_TYPES, capitalize } from '../lib/typeColors'

export function TypeFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Filter by type"
      className="rounded-full border-0 bg-white px-5 py-3 text-slate-800 shadow-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-400 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700"
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
