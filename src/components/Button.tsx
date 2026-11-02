import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type ButtonSize = 'md' | 'lg'

const sizeClasses: Record<ButtonSize, string> = {
  md: 'px-6 py-2.5',
  lg: 'px-8 py-3 shadow-lg shadow-red-600/30',
}

type ButtonProps = {
  children: ReactNode
  size?: ButtonSize
  className?: string
} & (
  | { to: string; onClick?: never; disabled?: never }
  | { to?: never; onClick: () => void; disabled?: boolean }
)

/** Primary (red) action. Renders a router <Link> when `to` is given, otherwise a <button>. */
export function Button({ children, size = 'md', className = '', ...action }: ButtonProps) {
  const classes =
    `inline-block rounded-full bg-red-600 font-semibold text-white transition hover:bg-red-700 ` +
    `focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:outline-none ` +
    `disabled:opacity-60 dark:focus-visible:ring-red-400 dark:focus-visible:ring-offset-slate-950 ` +
    `${sizeClasses[size]} ${className}`

  if (action.to !== undefined) {
    return (
      <Link to={action.to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" onClick={action.onClick} disabled={action.disabled} className={classes}>
      {children}
    </button>
  )
}
