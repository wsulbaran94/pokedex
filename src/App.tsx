import { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { ThemeToggle } from './components/ThemeToggle'
import { HomePage } from './pages/HomePage'
import { NotFound } from './pages/NotFound'
import { PokemonDetailPage } from './pages/PokemonDetailPage'

function ScrollToTopOnDetail() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (pathname.startsWith('/pokemon/')) window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <ScrollToTopOnDetail />
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            <Pokeball />
            <span className="text-2xl font-black tracking-tight">Pokédex</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pokemon/:name" element={<PokemonDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="py-8 text-center text-sm text-slate-600 dark:text-slate-400">
        Data from{' '}
        <a href="https://pokeapi.co/" target="_blank" rel="noreferrer" className="underline hover:text-red-600 dark:hover:text-red-400">
          PokéAPI
        </a>
      </footer>
    </div>
  )
}

function Pokeball() {
  return (
    <svg viewBox="0 0 32 32" className="size-8">
      <circle cx="16" cy="16" r="15" fill="#fff" stroke="#1e293b" strokeWidth="2" />
      <path d="M1 16a15 15 0 0 1 30 0Z" fill="#ef4444" stroke="#1e293b" strokeWidth="2" />
      <circle cx="16" cy="16" r="4.5" fill="#fff" stroke="#1e293b" strokeWidth="2" />
    </svg>
  )
}
