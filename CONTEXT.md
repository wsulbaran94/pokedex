# Project context

Running log of work on the Pokédex. Read it at the start of each session, and add an entry after every finished task (see `CLAUDE.md`).

## Current state

- `main` (`41d7149`): the full app, with the dark mode toggle and WCAG AA colors.
- `fix/code-review-findings` (`61ab536`, pushed): code-review fixes. **Pending:** a pull request into `main`. The `gh` command-line tool isn't installed, so open it in the browser: https://github.com/wsulbaran94/pokedex/pull/new/fix/code-review-findings
- Known open item: each grid card fetches the full `/pokemon/{name}` record just to read its types (review finding #9, skipped on purpose).
- The app has not been tested by clicking through it in a browser. Checks so far are build, lint, curl against PokéAPI, and contrast scripts.

## Log

### 2026-11-02 — Remove duplicated button and field styles
- **Done:**
  - New `src/components/Button.tsx`: one red primary action that renders a router link when given `to`, or a button when given `onClick`; sizes `md`/`lg`; adds a keyboard focus ring the old buttons were missing. "Load more", `RetryButton` and the 404 page link now use it.
  - New `src/lib/styles.ts` with `fieldClass`, shared by `SearchBar` and `TypeFilter`.
  - `RetryButton` moved to its own file (one component per file).
  - `CLAUDE.md` rules updated to match: related variants like `Skeleton`/`CardSkeleton` may share a file; shared class constants go in `lib/styles.ts` when one component doesn't fit.
- **Branch / commit:** `fix/code-review-findings`, committed together with `CLAUDE.md` and `CONTEXT.md`.
- **Verified:** build and lint pass; grep confirms the red-button and field class lists now exist only in `Button.tsx` and `styles.ts`. Not checked in a browser. Spacing changes slightly: the 404 link's padding went from `py-3` to `py-2.5`.
- **Pending / next:** open and merge the pull request for `fix/code-review-findings`.

### 2026-11-02 — Add code standards to CLAUDE.md
- **Done:** added a "Code standards" section to `CLAUDE.md`:
  - SOLID and clean code, applied to this project's folders.
  - Clarity rules for components, hooks and styles.
  - Don't-repeat-yourself rules: search before creating, abstract on the second use, design for variation, one home per constant.
- **Branch / commit:** `fix/code-review-findings`, uncommitted.
- **Verified:** docs only, so nothing to run. Examples cited in the rules exist in the code (`RetryButton`, `CardSkeleton`, `badgeColors`, `PAGE_SIZE`).
- **Pending / next:** commit `CLAUDE.md` and `CONTEXT.md`. Known spots that don't follow the new rules yet:
  - The same input "pill" class list is repeated in `SearchBar` and `TypeFilter`.
  - The red primary-button classes are repeated in `LoadMoreButton` (`HomePage.tsx`), `RetryButton` and the `NotFound` link. These are candidates for a shared `Button` component.

### 2026-11-02 — Add CLAUDE.md and session context rule
- **Done:** created `CLAUDE.md` (commands, architecture, theming and contrast rules, git setup), plus a rule to read and update `CONTEXT.md` every session and after every task; created this file.
- **Branch / commit:** `fix/code-review-findings`, uncommitted.
- **Verified:** docs only, so nothing to run.
- **Pending / next:** commit these files; open and merge the pull request for `fix/code-review-findings`.

### 2026-11-02 — Fix code-review findings
- **Done:**
  - Error handling: 404 is now told apart from network errors (`HttpError`, `isNotFound`); retryable `ErrorMessage`; real 404s are no longer retried.
  - Evolution panel shows an error state instead of loading forever.
  - Prev/Next use the dex number and link by name.
  - Search with spaces works ("mr mime").
  - Color helpers: 6-digit fallback, integer darkening loop, `isLightText` flag.
  - `PAGE_SIZE` is defined once.
- **Branch / commit:** `fix/code-review-findings` @ `61ab536`, pushed.
- **Verified:** build, lint, contrast script (lowest ratio 4.61:1), and curl checks (charizard-mega-x → dex #6, Prev = charmeleon, Next = squirtle; unknown name returns 404). Not tested in a browser.
- **Pending / next:** pull request into `main`; finding #9 skipped.

### 2026-11-02 — Git setup and first push
- **Done:**
  - `git init`; repo-local `user.email` set to the personal gmail.
  - Repo-local `core.sshCommand` uses `~/.ssh/id_ed25519_personal`, because the default `id_rsa` key logs in as the work account `wasn-ep`.
  - README rewritten.
- **Branch / commit:** `main` @ `41d7149`, pushed to `git@github.com:wsulbaran94/pokedex.git`.
- **Verified:** `git ls-remote` shows `main` at the local commit.
- **Pending / next:** none.

### 2026-11-02 — Dark mode toggle and contrast pass
- **Done:**
  - Class-based dark mode, with an inline script so the theme is applied before the page appears; `useTheme` and `ThemeToggle` added.
  - `badgeColors` and the contrast helpers added.
  - Text, button and link colors fixed to meet WCAG AA.
- **Branch / commit:** included in `41d7149`.
- **Verified:** build, lint, contrast script (all 18 types ≥ 4.5:1).
- **Pending / next:** check it in a browser.

### 2026-11-02 — Initial Pokédex app
- **Done:**
  - Scaffolded with Vite + React 19 + TS + Tailwind v4 + TanStack Query + React Router.
  - Home page: browse, search and type filter.
  - Detail page: stats, evolution chain, Prev/Next.
- **Branch / commit:** included in `41d7149`.
- **Verified:** build, lint, dev server responds, PokéAPI endpoints checked.
- **Pending / next:** none.
