import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { EventFilters } from '../types';

interface SearchBarProps {
  filters: EventFilters;
  onFilterChange: (filters: EventFilters) => void;
}

const categories = ['All', 'Music', 'Sports', 'Technology', 'Art', 'Food', 'Business', 'Health', 'Education'];

const SearchBar = ({ filters, onFilterChange }: SearchBarProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (search: string) => {
    onFilterChange({ ...filters, search, page: 1 });
  };

  const handleCategoryChange = (category: string) => {
    onFilterChange({ ...filters, category: category === 'All' ? '' : category, page: 1 });
  };

  const handlePriceChange = (key: 'minPrice' | 'maxPrice', value: string) => {
    onFilterChange({ ...filters, [key]: value ? Number(value) : undefined, page: 1 });
  };

  const clearFilters = () => {
    onFilterChange({ page: 1, limit: 12 });
  };

  const hasActiveFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice;

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input
            type="text"
            placeholder="Search events by name, location..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="input-field !pl-11"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary !px-4 flex items-center gap-2 ${showFilters ? '!border-primary-500 !text-primary-600' : ''}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="btn-secondary !px-4 flex items-center gap-2 text-red-500">
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
              ${(cat === 'All' && !filters.category) || filters.category === cat
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="card p-4 animate-slide-down">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">Min Price (₹)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice || ''}
                onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">Max Price (₹)</label>
              <input
                type="number"
                placeholder="10000"
                value={filters.maxPrice || ''}
                onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value, page: 1 })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value, page: 1 })}
                className="input-field"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
