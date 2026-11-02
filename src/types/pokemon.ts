export interface NamedResource {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: NamedResource[]
}

export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number | null
  types: { slot: number; type: NamedResource }[]
  abilities: { ability: NamedResource; is_hidden: boolean }[]
  stats: { base_stat: number; stat: NamedResource }[]
  sprites: {
    front_default: string | null
    other?: {
      'official-artwork'?: { front_default: string | null }
    }
  }
  species: NamedResource
}

export interface PokemonSpecies {
  id: number
  name: string
  genera: { genus: string; language: NamedResource }[]
  flavor_text_entries: { flavor_text: string; language: NamedResource }[]
  evolution_chain: { url: string }
}

export interface ChainLink {
  species: NamedResource
  evolves_to: ChainLink[]
}

export interface EvolutionChain {
  id: number
  chain: ChainLink
}

export interface TypeResponse {
  name: string
  pokemon: { pokemon: NamedResource }[]
}
