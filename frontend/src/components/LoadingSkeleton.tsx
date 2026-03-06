const LoadingSkeleton = ({ type = 'card' }: { type?: 'card' | 'detail' | 'table' }) => {
  if (type === 'detail') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 animate-pulse">
        <div className="skeleton h-[400px] w-full rounded-2xl" />
        <div className="skeleton h-8 w-2/3" />
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton h-4 w-1/2" />
        <div className="space-y-3">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-3 animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-14 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card overflow-hidden animate-pulse">
          <div className="skeleton h-48 w-full rounded-none" />
          <div className="p-5 space-y-3">
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-4 w-2/3" />
            <div className="skeleton h-2 w-full mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
