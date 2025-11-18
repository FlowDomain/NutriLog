import { Skeleton } from "../ui/skeleton";

export function ChartSkeleton({ height = "h-64" }: { height?: string }) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="space-y-2 mb-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className={`w-full ${height}`} />
    </div>
  )
}