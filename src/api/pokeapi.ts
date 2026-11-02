import type {
  EvolutionChain,
  NamedResource,
  Pokemon,
  PokemonListResponse,
  PokemonSpecies,
  TypeResponse,
} from '../types/pokemon'

const BASE_URL = 'https://pokeapi.co/api/v2'

/** Highest National Dex number; ids above this are alternate forms. */
export const MAX_DEX_ID = 1025

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  return res.json() as Promise<T>
}

/** Extracts the numeric id from a PokéAPI resource URL. */
export function idFromUrl(url: string): number {
  return Number(url.split('/').filter(Boolean).pop())
}

export function artworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

export const getPokemonList = (offset: number, limit = 20) =>
  fetchJson<PokemonListResponse>(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)

export const getAllNames = async (): Promise<NamedResource[]> =>
  (await fetchJson<PokemonListResponse>(`${BASE_URL}/pokemon?limit=${MAX_DEX_ID}`)).results

export const getPokemon = (nameOrId: string | number) =>
  fetchJson<Pokemon>(`${BASE_URL}/pokemon/${nameOrId}`)

export const getSpecies = (nameOrId: string | number) =>
  fetchJson<PokemonSpecies>(`${BASE_URL}/pokemon-species/${nameOrId}`)

export const getEvolutionChain = (url: string) => fetchJson<EvolutionChain>(url)

export const getType = (name: string) => fetchJson<TypeResponse>(`${BASE_URL}/type/${name}`)
