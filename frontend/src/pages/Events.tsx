import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { eventService } from '../services/eventService';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { EventFilters } from '../types';
import { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { Sparkles, CalendarDays, Search } from 'lucide-react';

const Events = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<EventFilters>({ page: 1, limit: 12, category: searchParams.get('category') || '' });
  const debouncedSearch = useDebounce(filters.search, 500);

  // Sync category from URL when navigating via footer/home category links
  useEffect(() => {
    const urlCategory = searchParams.get('category') || '';
    if (urlCategory !== filters.category) {
      setFilters((prev) => ({ ...prev, category: urlCategory, page: 1 }));
    }
  }, [searchParams]);

  const hasActiveFilters = !!(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.startDate || filters.endDate);

  // Filtered / all events
  const { data: allData, isLoading: allLoading } = useQuery({
    queryKey: ['events', 'browse', { ...filters, search: debouncedSearch }],
    queryFn: () => eventService.getEvents({ ...filters, search: debouncedSearch }),
  });

  // Featured events (shown when no filters active)
  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['events', 'featured'],
    queryFn: () => eventService.getEvents({ featured: true, limit: 6 }),
    enabled: !hasActiveFilters,
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-black">Explore Events</h1>
          <p className="mt-2 text-primary-100">Discover amazing experiences happening near you</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Filters */}
        <div className="mb-10">
          <SearchBar filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Featured Events (when no filters) */}
        {!hasActiveFilters && featuredData?.events && featuredData.events.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Featured Events</h2>
            </div>
            {featuredLoading ? (
              <LoadingSkeleton type="card" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredData.events.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* All / Filtered Events */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
              {hasActiveFilters
                ? allData?.total ? `${allData.total} events found` : 'Searching...'
                : 'All Events'}
            </h2>
          </div>

          {allLoading ? (
            <LoadingSkeleton type="card" />
          ) : allData?.events.length ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allData.events.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
              {/* Pagination */}
              {allData.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: allData.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setFilters({ ...filters, page })}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        filters.page === page
                          ? 'bg-primary-600 text-white'
                          : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <Search className="w-16 h-16 mx-auto text-surface-300 dark:text-surface-600 mb-4" />
              <h3 className="text-xl font-semibold text-surface-500">No events found</h3>
              <p className="text-surface-400 mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Events;
