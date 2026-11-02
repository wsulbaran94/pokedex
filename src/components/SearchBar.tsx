import { fieldClass } from '../lib/styles'

export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative flex-1">
      <svg
        className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-600 dark:text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search Pokémon by name or number…"
        className={`${fieldClass} w-full pr-4 pl-12 placeholder:text-slate-500 dark:placeholder:text-slate-400`}
      />
    </div>
  )
}
