import { RetryButton } from './RetryButton'

export function ErrorMessage({
  message = 'Something went wrong talking to PokéAPI. Please try again.',
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="py-24 text-center text-slate-600 dark:text-slate-400">
      <p className="text-5xl">⚠️</p>
      <p className="mt-4 text-lg">{message}</p>
      {onRetry && <RetryButton onClick={onRetry} className="mt-6" />}
    </div>
  )
}
