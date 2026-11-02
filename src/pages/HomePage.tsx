import { useDeferredValue, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MAX_DEX_ID, idFromUrl } from '../api/pokeapi'
import { PokemonCard } from '../components/PokemonCard'
import { SearchBar } from '../components/SearchBar'
import { CardSkeleton } from '../components/Skeleton'
import { TypeFilter } from '../components/TypeFilter'
import { useAllNames, usePokemonList, useTypeMembers } from '../hooks/usePokemon'
import type { NamedResource } from '../types/pokemon'

const PAGE_SIZE = 20

export function HomePage() {
  const [params, setParams] = useSearchParams()
  const search = params.get('q') ?? ''
  const type = params.get('type') ?? ''
  const deferredSearch = useDeferredValue(search.trim().toLowerCase())
  const isFiltering = deferredSearch !== '' || type !== ''

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <SearchBar value={search} onChange={(v) => updateParam('q', v)} />
        <TypeFilter value={type} onChange={(v) => updateParam('type', v)} />
      </div>
      {isFiltering ? (
        <FilteredGrid key={`${deferredSearch}|${type}`} search={deferredSearch} type={type} />
      ) : (
        <BrowseGrid />
      )}
    </div>
  )
}

function BrowseGrid() {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = usePokemonList()
  const pokemon =
    data?.pages.flatMap((p) => p.results).filter((p) => idFromUrl(p.url) <= MAX_DEX_ID) ?? []

  if (isError) return <ErrorMessage />

  return (
    <>
      <Grid pokemon={pokemon} loading={isLoading} />
      {hasNextPage && (
        <LoadMoreButton onClick={() => fetchNextPage()} loading={isFetchingNextPage} />
      )}
    </>
  )
}

function FilteredGrid({ search, type }: { search: string; type: string }) {
  const [visible, setVisible] = useState(PAGE_SIZE)
  const names = useAllNames()
  const members = useTypeMembers(type)

  const results = useMemo(() => {
    let list: NamedResource[] | undefined = type ? members.data : names.data
    if (!list) return undefined
    if (search) {
      const asNumber = search.replace(/^#?0*/, '')
      list = list.filter((p) => p.name.includes(search) || String(idFromUrl(p.url)) === asNumber)
    }
    return list
  }, [type, search, members.data, names.data])

  if (names.isError || members.isError) return <ErrorMessage />
  if (!results) return <Grid pokemon={[]} loading />
  if (results.length === 0) {
    return (
      <div className="py-24 text-center text-slate-600 dark:text-slate-400">
        <p className="text-5xl">🔍</p>
        <p className="mt-4 text-lg">No Pokémon found.</p>
      </div>
    )
  }

  return (
    <>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">{results.length} Pokémon found</p>
      <Grid pokemon={results.slice(0, visible)} loading={false} />
      {visible < results.length && <LoadMoreButton onClick={() => setVisible((v) => v + PAGE_SIZE)} />}
    </>
  )
}

function Grid({ pokemon, loading }: { pokemon: NamedResource[]; loading: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {pokemon.map((p) => (
        <PokemonCard key={p.name} pokemon={p} />
      ))}
      {loading && Array.from({ length: PAGE_SIZE }, (_, i) => <CardSkeleton key={i} />)}
    </div>
  )
}

function LoadMoreButton({ onClick, loading = false }: { onClick: () => void; loading?: boolean }) {
  return (
    <div className="mt-10 flex justify-center">
      <button
        onClick={onClick}
        disabled={loading}
        className="rounded-full bg-red-600 px-8 py-3 font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-700 disabled:opacity-60"
      >
        {loading ? 'Loading…' : 'Load more'}
      </button>
    </div>
  )
}

export function ErrorMessage() {
  return (
    <div className="py-24 text-center text-slate-600 dark:text-slate-400">
      <p className="text-5xl">⚠️</p>
      <p className="mt-4 text-lg">Something went wrong talking to PokéAPI. Please try again.</p>
    </div>
  )
}
