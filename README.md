# Pokédex

A fast, responsive Pokédex built with modern frontend tooling and data from [PokéAPI](https://pokeapi.co/).

## Features

- Browse all 1,025 National Dex Pokémon with "Load more" pagination
- Search by name or number (`pika`, `25`, `#025`) and filter by type
- Detail page: artwork, description, height/weight, abilities, animated base stats, evolution chain, prev/next navigation
- Light/dark mode toggle (remembers your choice, follows the system theme by default)
- WCAG AA color contrast for all type colors and text
- Loading skeletons, error and 404 states, mobile-first layout

## Tech stack

- [Vite](https://vite.dev/) + [React 19](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query) for fetching and caching
- [React Router](https://reactrouter.com/)

## Getting started

```bash
npm install
npm run dev      # start the dev server at http://localhost:5173
npm run build    # type-check and build for production into dist/
npm run preview  # serve the production build locally
npm run lint     # lint with oxlint
```

## Project structure

```
src/
  api/pokeapi.ts       # typed PokéAPI client
  hooks/               # data hooks (TanStack Query) and theme hook
  components/          # cards, badges, stat bars, search, filters, theme toggle
  pages/               # home, detail and 404 pages
  lib/typeColors.ts    # type colors and WCAG contrast helpers
  types/pokemon.ts     # API response types
```

## Credits

Pokémon data and images from [PokéAPI](https://pokeapi.co/). Pokémon and Pokémon character names are trademarks of Nintendo.
