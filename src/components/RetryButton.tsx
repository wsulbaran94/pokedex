import { Button } from './Button'

export function RetryButton({ onClick, className = '' }: { onClick: () => void; className?: string }) {
  return (
    <Button onClick={onClick} className={className}>
      Try again
    </Button>
  )
}
