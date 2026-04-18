import { cn } from '@/lib/utils'

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={cn('bg-muted animate-pulse rounded', className)} />
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <LoadingSkeleton className="h-40 w-full" />
      <LoadingSkeleton className="h-4 w-3/4" />
      <LoadingSkeleton className="h-3 w-1/2" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <LoadingSkeleton className="h-10 flex-1" />
        </div>
      ))}
    </div>
  )
}
