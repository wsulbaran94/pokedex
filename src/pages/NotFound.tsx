import { Button } from '../components/Button'

export function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-7xl font-black text-red-600 dark:text-red-400">404</p>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
        A wild page didn't appear. This Pokémon (or page) doesn't exist.
      </p>
      <Button to="/" className="mt-8">
        Back to Pokédex
      </Button>
    </div>
  )
}
