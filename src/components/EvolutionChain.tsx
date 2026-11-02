import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { artworkUrl, idFromUrl } from '../api/pokeapi'
import { useEvolutionChain } from '../hooks/usePokemon'
import { capitalize } from '../lib/typeColors'
import type { ChainLink, NamedResource } from '../types/pokemon'
import { RetryButton } from './ErrorMessage'
import { Skeleton } from './Skeleton'

/** Flattens the chain into stages; each stage lists every species at that depth. */
function toStages(link: ChainLink): NamedResource[][] {
  const stages: NamedResource[][] = []
  let level: ChainLink[] = [link]
  while (level.length) {
    stages.push(level.map((l) => l.species))
    level = level.flatMap((l) => l.evolves_to)
  }
  return stages
}

export function EvolutionChain({
  url,
  current,
  speciesFailed = false,
  onRetrySpecies,
}: {
  url: string | undefined
  current: string
  /** The species request (which provides `url`) failed, so the URL will never arrive. */
  speciesFailed?: boolean
  onRetrySpecies?: () => void
}) {
  const { data, isError, refetch } = useEvolutionChain(url)

  if (speciesFailed || isError) {
    return (
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-slate-600 dark:text-slate-400">Couldn't load evolution data.</p>
        <RetryButton onClick={() => (speciesFailed ? onRetrySpecies?.() : refetch())} />
      </div>
    )
  }
  if (!data) return <Skeleton className="h-36 w-full" />

  const stages = toStages(data.chain)
  if (stages.length === 1) {
    return <p className="text-slate-600 dark:text-slate-400">This Pokémon does not evolve.</p>
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
      {stages.map((stage, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="text-2xl text-slate-600 dark:text-slate-400">→</span>}
          <div className="flex flex-wrap justify-center gap-2">
            {stage.map((s) => (
              <Link
                key={s.name}
                to={`/pokemon/${s.name}`}
                className={`flex w-24 flex-col items-center rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  s.name === current ? 'bg-slate-100 ring-2 ring-red-600 dark:ring-red-400 dark:bg-slate-800' : ''
                }`}
              >
                <img src={artworkUrl(idFromUrl(s.url))} alt={s.name} loading="lazy" className="size-20 object-contain" />
                <span className="mt-1 text-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {capitalize(s.name)}
                </span>
              </Link>
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  )
}
