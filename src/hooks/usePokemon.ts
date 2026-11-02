import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
  MAX_DEX_ID,
  getAllNames,
  getEvolutionChain,
  getPokemon,
  getPokemonList,
  getSpecies,
  getType,
  idFromUrl,
} from '../api/pokeapi'

const PAGE_SIZE = 20

export function usePokemonList() {
  return useInfiniteQuery({
    queryKey: ['pokemon-list'],
    queryFn: ({ pageParam }) => getPokemonList(pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (_last, pages) => {
      const next = pages.length * PAGE_SIZE
      return next < MAX_DEX_ID ? next : undefined
    },
  })
}

export function useAllNames() {
  return useQuery({ queryKey: ['all-names'], queryFn: getAllNames, staleTime: Infinity })
}

export function useTypeMembers(type: string) {
  return useQuery({
    queryKey: ['type', type],
    queryFn: () => getType(type),
    enabled: type !== '',
    staleTime: Infinity,
    select: (data) =>
      data.pokemon.map((p) => p.pokemon).filter((p) => idFromUrl(p.url) <= MAX_DEX_ID),
  })
}

export function usePokemon(nameOrId: string | number) {
  return useQuery({
    queryKey: ['pokemon', String(nameOrId)],
    queryFn: () => getPokemon(nameOrId),
    staleTime: Infinity,
  })
}

export function useSpecies(nameOrId: string | number | undefined) {
  return useQuery({
    queryKey: ['species', String(nameOrId)],
    queryFn: () => getSpecies(nameOrId!),
    enabled: nameOrId !== undefined,
    staleTime: Infinity,
  })
}

export function useEvolutionChain(url: string | undefined) {
  return useQuery({
    queryKey: ['evolution', url],
    queryFn: () => getEvolutionChain(url!),
    enabled: !!url,
    staleTime: Infinity,
  })
}
