# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Session context (always follow)

`CONTEXT.md` is the running log of work on this project.
- **Start of every session:** read `CONTEXT.md` before doing anything else, so you know the current state, open branches and pending work.
- **After every finished task:** add an entry at the top of the log in `CONTEXT.md`, and update the "Current state" section if anything there changed. Use this format:
  ```
  ### YYYY-MM-DD — <short task title>
  - **Done:** what changed and why (files/areas, not a diff)
  - **Branch / commit:** branch name and short hash, or "uncommitted"
  - **Verified:** what was checked (build, lint, curl, browser) and what was NOT
  - **Pending / next:** follow-ups, open decisions, known issues
  ```
- Keep entries short, use real dates, and never rewrite past entries; add a correction instead.

## Code standards (always follow)

### SOLID and clean code
- **Single responsibility:** each module does one job. API calls belong in `src/api/`, data fetching and state in `src/hooks/`, pure logic (formatting, colors, math) in `src/lib/`, and rendering in `src/components/` and `src/pages/`. A component that both fetches and holds complex logic should be split: move the logic into a hook or `lib/` function.
- **Open/closed:** extend through props, variants and configuration maps instead of editing a component for each new case. Example: `TypeBadge`'s `size` prop, and the `typeColors` map instead of a `switch`.
- **Liskov substitution:** variants of a component accept the same props and behave the same way, so they can be swapped.
- **Interface segregation:** keep props small and specific. Pass what the component needs (`name`, `url`), not whole API objects "just in case".
- **Dependency inversion:** components depend on hooks, never on `fetch` or raw URLs. Swapping the data source should only touch `src/api/`.
- **Clean code:**
  - Use descriptive names. Hooks start with `use…`; event props are `on…`; booleans are `is…`/`has…`.
  - Keep functions small, prefer early returns, and avoid magic numbers: name constants (`MAX_DEX_ID`, `PAGE_SIZE`, `MIN_CONTRAST`).
  - Don't leave dead code, commented-out code or unused exports.
  - Comments explain *why*, not *what*.

### Components, hooks and styles must be easy to understand
- **Components:**
  - One exported component per file, with a file name that matches the component (`PokemonCard.tsx`). Closely related variants of the same component may share a file (`Skeleton`/`CardSkeleton`).
  - Type props inline or with a named `…Props` type.
  - Split a component once it does more than one job or reaches about 150 lines.
  - Small helpers used by only one component, like `Panel` in `PokemonDetailPage`, may stay in that file. Move them to `src/components/` as soon as a second file needs them.
- **Hooks:**
  - Each hook has one purpose, and its name says what it returns (`useAllNames`, `useTheme`).
  - Wrap TanStack Query in a hook in `src/hooks/` instead of calling `useQuery` inside components.
  - Return a clear shape, either the query result or a small named object like `{ theme, toggle }`.
- **Styles:**
  - Use Tailwind utilities, ordered as layout → spacing → typography → color → states → `dark:`.
  - Every color class needs its `dark:` pair, and must meet the contrast rules below.
  - Use inline `style` only for values computed at runtime, such as type colors.
  - When the same class list appears in more than one place, turn it into a component instead of copying the string. Example: `Button` covers every red primary action, and accepts `to` (renders a link) or `onClick`, plus `size`.
  - If the shared styling spans different element types and one component doesn't fit, use a named class constant in `src/lib/styles.ts`. Example: `fieldClass`, used by both the search `<input>` and the type `<select>`.

### Don't repeat yourself: build reusable features
- **Search first:** before creating a component, hook, constant or helper, check `src/components/`, `src/hooks/` and `src/lib/` for one that already exists. Reuse it or extend it.
- **Two-use rule:** as soon as a UI pattern or piece of logic appears a second time, abstract it instead of copying it.
  - Components: e.g. `Button`, `ErrorMessage`/`RetryButton`, `Skeleton`/`CardSkeleton`, `TypeBadge`.
  - Hooks: e.g. the `usePokemon.ts` family.
  - Pure functions: e.g. `idFromUrl`, `capitalize`, `badgeColors`.
- **Design for variation:** build the shared version around props or config (`size`, `message`, `onRetry`, `variant`) so new cases need no new copy. Don't add options nobody uses yet.
- **One home per constant:** define shared values in one place and import them. For example, `PAGE_SIZE` lives in `usePokemon.ts` and `MAX_DEX_ID` in `pokeapi.ts`.
- **Clean up while you work:** if a task reveals existing duplication, consolidate it as part of the task and mention it in the `CONTEXT.md` entry.

## Commands

```bash
npm run dev      # Vite dev server on http://localhost:5173
npm run build    # tsc -b (type-check) + vite build — the main correctness check
npm run lint     # oxlint (config: .oxlintrc.json)
npm run preview  # serve the production build
```

There is no test suite. Verify changes with `npm run build` + `npm run lint`, and check data assumptions directly against PokéAPI with `curl` (e.g. `curl -s https://pokeapi.co/api/v2/pokemon/charizard-mega-x`).

## Stack

Vite + React 19 + TypeScript (`verbatimModuleSyntax` is on, so type-only imports must use `import type`), Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config`; config lives in `src/index.css`), TanStack Query, React Router. All data comes from the public PokéAPI (`https://pokeapi.co/api/v2`); there is no backend.

## Architecture

**Data flow:** `src/api/pokeapi.ts` (typed fetchers) → `src/hooks/usePokemon.ts` (TanStack Query hooks) → pages/components. Components never call `fetch` directly.

- `fetchJson` throws `HttpError` (with `status`). Use `isNotFound(err)` to tell a real 404 from network/server errors: the detail page shows `NotFound` only for 404 and a retryable `ErrorMessage` otherwise, and the global `retry` in `src/main.tsx` skips 404s.
- Query keys use the Pokémon **name** (`['pokemon', name]`). Link to `/pokemon/<name>`, not `/pokemon/<id>`, or the same Pokémon is cached and fetched twice. `useAllNames()` (the full name list, index = dex number − 1) maps a number to a name.
- Static data uses `staleTime: Infinity`.

**National Dex vs. Pokémon id:** `MAX_DEX_ID = 1025`. `/pokemon` ids above that are alternate forms (megas, regional forms, ids 10001+), and the code filters them out of lists. For dex-order logic (Prev/Next), use `idFromUrl(pokemon.species.url)` instead of `pokemon.id`.

**Home page (`src/pages/HomePage.tsx`) has two modes:**
- Browse: `usePokemonList` (`useInfiniteQuery`, server-side paging by `PAGE_SIZE`).
- Filter (search `q` and/or `type`): client-side filtering of `useAllNames()` or `useTypeMembers(type)`, paged locally.
- Search and type live in the URL search params, so they survive navigating back. Search turns spaces into hyphens because API names are hyphenated (`mr-mime`) while the UI shows `capitalize()`d names ("Mr Mime").

**Grid cards** take only `{ name, url }`: artwork comes from `artworkUrl(id)` (a GitHub sprites URL), and each card runs its own `usePokemon(name)` just to get its types.

## Theming and color contrast

- Dark mode is class-based: `@custom-variant dark` in `src/index.css` makes `dark:` follow `.dark` on `<html>`. An inline script in `index.html` applies the saved or system theme before first paint, and `useTheme` / `ThemeToggle` toggle it and save it to `localStorage.theme`.
- Text colors follow WCAG AA (≥ 4.5:1). Secondary text is `text-slate-600 dark:text-slate-400`. Avoid `slate-400`/`slate-500` text on light backgrounds and white text on `red-500`; use `red-600`.
- Type colors live in `src/lib/typeColors.ts`. Never put text directly on a raw `colorFor(type)` background: use `badgeColors(type)` → `{ bg, fg, isLightText }`. It picks white or dark text and darkens mid-tone colors until they pass. The contrast helpers only parse 6-digit hex colors.

## Git

- The remote is `git@github.com:wsulbaran94/pokedex.git`. This repo uses a personal SSH key through the repo-local `core.sshCommand`, and the repo-local `user.email` is the personal gmail. The machine's default key belongs to a different (work) GitHub account, so don't change these settings.
### Branching: Gitflow (always follow)
**Every change gets its own branch.** Never commit directly to `main` or `develop`, not even for docs or one-line fixes.

| Branch | Created from | Merged into | Purpose |
|---|---|---|---|
| `main` | — | — | Production. Only receives `release/*` and `hotfix/*` merges; every merge is tagged `vX.Y.Z`. |
| `develop` | `main` | — | Integration branch for the next release. |
| `feature/<short-kebab-name>` | `develop` | `develop` | New features, refactors, docs, tooling. |
| `bugfix/<short-kebab-name>` | `develop` | `develop` | Fixes for bugs not yet in production. |
| `release/X.Y.Z` | `develop` | `main` **and** `develop` | Release prep only: version bump, last fixes, `CONTEXT.md` update. |
| `hotfix/<short-kebab-name>` | `main` | `main` **and** `develop` | Urgent fixes to production. Bump the patch version. |

- **Before starting any task:** run `git status` and `git branch --show-current`.
  - If you're on `main` or `develop`, or on a branch that belongs to another task, create the right branch first. Example: `git checkout develop && git pull && git checkout -b feature/<name>`.
  - If the working tree has uncommitted changes from something else, stop and ask.
- **Branch names:** lowercase kebab-case that describes the change, e.g. `feature/shared-button`, `bugfix/search-spaces`, `release/1.1.0`.
- **Commits:** small and focused, with an imperative subject line ("Add …", "Fix …").
- **Merging:**
  - Changes reach `develop` and `main` only through pull requests. Don't merge locally unless the user asks.
  - After a `release/*` or `hotfix/*` merges into `main`, tag it (`vX.Y.Z`) and merge the same branch back into `develop`.
  - Delete the branch once it's merged.
- **Versions:** follow SemVer in `package.json`: feature releases bump MINOR, hotfixes bump PATCH, breaking changes bump MAJOR.
- **Pushing:** push the branch with `git push -u origin <branch>` when the task is done. Never force-push to `main` or `develop`.
- Record the branch name in the `CONTEXT.md` entry for each task.
