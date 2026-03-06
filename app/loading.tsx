export default function Loading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Navbar skeleton */}
      <div className="h-20 border-b border-border/50 bg-card/50" />

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
        {/* Hero / Header skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-32 bg-muted rounded-full" />
          <div className="h-10 w-2/3 bg-muted rounded-xl" />
          <div className="h-4 w-1/2 bg-muted rounded-full" />
        </div>

        {/* Cards skeleton row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl border border-border/50 p-6 space-y-3"
            >
              <div className="h-4 w-24 bg-muted rounded-full" />
              <div className="h-8 w-20 bg-muted rounded-lg" />
              <div className="h-3 w-32 bg-muted rounded-full" />
            </div>
          ))}
        </div>

        {/* Product / content grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-xl border border-border/50 overflow-hidden"
            >
              <div className="aspect-[4/5] bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded-full" />
                <div className="h-3 w-1/2 bg-muted rounded-full" />
                <div className="h-6 w-1/3 bg-muted rounded-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
