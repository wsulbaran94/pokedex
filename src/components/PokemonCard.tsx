import { Link } from 'react-router-dom'
import { artworkUrl, idFromUrl } from '../api/pokeapi'
import { usePokemon } from '../hooks/usePokemon'
import { capitalize, colorFor, padId } from '../lib/typeColors'
import type { NamedResource } from '../types/pokemon'
import { TypeBadge } from './TypeBadge'

export function PokemonCard({ pokemon }: { pokemon: NamedResource }) {
  const id = idFromUrl(pokemon.url)
  const { data } = usePokemon(pokemon.name)
  const mainType = data?.types[0]?.type.name
  const accent = mainType ? colorFor(mainType) : '#94a3b8'

  return (
    <Link
      to={`/pokemon/${pokemon.name}`}
      className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 dark:ring-slate-700"
    >
      <div
        className="absolute inset-x-0 top-0 h-2/3 opacity-15 transition group-hover:opacity-25"
        style={{ background: `radial-gradient(circle at 50% 40%, ${accent}, transparent 70%)` }}
      />
      <img
        src={artworkUrl(id)}
        alt={pokemon.name}
        loading="lazy"
        className="relative mx-auto aspect-square w-full object-contain drop-shadow-md transition group-hover:scale-110"
      />
      <p className="relative mt-3 text-xs font-medium text-slate-600 dark:text-slate-400">{padId(id)}</p>
      <h3 className="relative text-lg font-bold text-slate-800 dark:text-slate-100">
        {capitalize(pokemon.name)}
      </h3>
      <div className="relative mt-2 flex min-h-6 flex-wrap gap-1.5">
        {data?.types.map((t) => <TypeBadge key={t.type.name} type={t.type.name} />)}
      </div>
    </Link>
  )
}
