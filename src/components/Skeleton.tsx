export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800 ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
      <Skeleton className="mx-auto aspect-square w-full" />
      <Skeleton className="mt-4 h-4 w-1/3" />
      <Skeleton className="mt-2 h-5 w-2/3" />
    </div>
  )
}
