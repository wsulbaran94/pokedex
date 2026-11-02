import { Link, useParams } from 'react-router-dom'
import { MAX_DEX_ID } from '../api/pokeapi'
import { EvolutionChain } from '../components/EvolutionChain'
import { Skeleton } from '../components/Skeleton'
import { StatBar } from '../components/StatBar'
import { TypeBadge } from '../components/TypeBadge'
import { usePokemon, useSpecies } from '../hooks/usePokemon'
import { badgeColors, capitalize, colorFor, darken, lighten, padId } from '../lib/typeColors'
import { NotFound } from './NotFound'

export function PokemonDetailPage() {
  const { name = '' } = useParams()
  const { data: pokemon, isLoading, isError } = usePokemon(name.toLowerCase())
  const { data: species } = useSpecies(pokemon?.species.name)

  if (isError) return <NotFound />
  if (isLoading || !pokemon) return <DetailSkeleton />

  const accent = colorFor(pokemon.types[0].type.name)
  // Hero colors meet WCAG AA; the gradient only moves *away* from the text color, so contrast never drops.
  const hero = badgeColors(pokemon.types[0].type.name)
  const lightText = hero.fg === '#ffffff'
  const heroEnd = lightText ? darken(hero.bg, 0.25) : lighten(hero.bg, 0.35)
  const artwork = pokemon.sprites.other?.['official-artwork']?.front_default ?? pokemon.sprites.front_default
  const flavor = species?.flavor_text_entries
    .find((f) => f.language.name === 'en')
    ?.flavor_text.replace(/[\f\n\r]/g, ' ')
  const genus = species?.genera.find((g) => g.language.name === 'en')?.genus
  const total = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-2">
        <Link to="/" className="text-sm font-medium text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400">
          ← Back to Pokédex
        </Link>
        <div className="flex gap-2">
          {pokemon.id > 1 && <NavButton id={pokemon.id - 1} label="← Prev" />}
          {pokemon.id < MAX_DEX_ID && <NavButton id={pokemon.id + 1} label="Next →" />}
        </div>
      </div>

      <section
        className="relative overflow-hidden rounded-3xl p-6 shadow-xl sm:p-10"
        style={{ background: `linear-gradient(135deg, ${hero.bg}, ${heroEnd})`, color: hero.fg }}
      >
        <span className="pointer-events-none absolute -right-4 -bottom-10 text-[9rem] font-black opacity-10 select-none sm:text-[12rem]">
          {padId(pokemon.id)}
        </span>
        <div className="relative grid items-center gap-6 md:grid-cols-2">
          <div>
            <p className="font-semibold">{padId(pokemon.id)}</p>
            <h1 className="text-4xl font-black sm:text-5xl">{capitalize(pokemon.name)}</h1>
            {genus && <p className="mt-1 font-medium">{genus}</p>}
            <div className="mt-4 flex gap-2">
              {pokemon.types.map((t) => (
                <span
                  key={t.type.name}
                  className={`rounded-full ring-2 ${lightText ? 'ring-white/70' : 'ring-slate-900/40'}`}
                >
                  <TypeBadge type={t.type.name} size="md" />
                </span>
              ))}
            </div>
            {flavor && <p className="mt-6 max-w-md leading-relaxed">{flavor}</p>}
          </div>
          {artwork && (
            <img src={artwork} alt={pokemon.name} className="mx-auto w-64 drop-shadow-2xl sm:w-80" />
          )}
        </div>
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Panel title="About">
          <dl className="grid grid-cols-2 gap-4">
            <Info label="Height" value={`${pokemon.height / 10} m`} />
            <Info label="Weight" value={`${pokemon.weight / 10} kg`} />
            <Info label="Base XP" value={pokemon.base_experience ?? '—'} />
            <Info label="Species" value={capitalize(pokemon.species.name)} />
          </dl>
          <h3 className="mt-6 mb-2 text-sm font-semibold text-slate-600 dark:text-slate-400">Abilities</h3>
          <div className="flex flex-wrap gap-2">
            {pokemon.abilities.map((a) => (
              <span
                key={a.ability.name}
                className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {capitalize(a.ability.name)}
                {a.is_hidden && <span className="ml-1 text-xs text-slate-600 dark:text-slate-400">(hidden)</span>}
              </span>
            ))}
          </div>
        </Panel>

        <Panel title="Base stats">
          <div className="space-y-3">
            {pokemon.stats.map((s) => (
              <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} color={accent} />
            ))}
            <div className="flex items-center gap-3 border-t border-slate-200 pt-3 dark:border-slate-800">
              <span className="w-20 text-sm font-medium text-slate-600 dark:text-slate-400">Total</span>
              <span className="w-9 text-right text-sm font-black text-slate-800 dark:text-slate-100">{total}</span>
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Evolution chain">
          <EvolutionChain url={species?.evolution_chain.url} current={pokemon.species.name} />
        </Panel>
      </div>
    </div>
  )
}

function NavButton({ id, label }: { id: number; label: string }) {
  return (
    <Link
      to={`/pokemon/${id}`}
      className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:ring-red-500 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700"
    >
      {label}
    </Link>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
      <h2 className="mb-4 text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h2>
      {children}
    </section>
  )
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-sm text-slate-600 dark:text-slate-400">{label}</dt>
      <dd className="font-semibold text-slate-800 dark:text-slate-100">{value}</dd>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Skeleton className="mb-6 h-8 w-40" />
      <Skeleton className="h-96 w-full rounded-3xl" />
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    </div>
  )
}
