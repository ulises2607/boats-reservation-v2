import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchBoats, 
  selectAllBoats, 
  selectBoatsLoading, 
  selectBoatsErrors, 
  selectPagination,
  selectFilters,
  setPage
} from '../../redux/boats/boatsSlice.js';
import BoatFilters from '../BoatFilters';
import BoatCard from '../BoatCard';

const ExplorePage = () => {
  const dispatch = useDispatch();
  const boats = useSelector(selectAllBoats);
  const isLoading = useSelector(selectBoatsLoading);
  const errors = useSelector(selectBoatsErrors);
  const pagination = useSelector(selectPagination);
  const filters = useSelector(selectFilters);

  useEffect(() => {
    // Load boats on component mount
    console.log('ExplorePage mounted, fetching boats...');
    dispatch(fetchBoats(filters))
      .then((result) => {
        console.log('Boats fetched successfully:', result);
      })
      .catch((error) => {
        console.error('Error fetching boats:', error);
      });
  }, [dispatch]);

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    const updatedFilters = { ...filters, page: newPage };
    dispatch(fetchBoats(updatedFilters));
    
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    const { page, per_page, total } = pagination;
    const totalPages = Math.ceil(total / per_page);
    
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (page > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(page - 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
        >
          Previous
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium border ${
            i === page
              ? 'bg-blue-600 text-white border-blue-600'
              : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (page < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(page + 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
        >
          Next
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">{(page - 1) * per_page + 1}</span>
              {' '}to{' '}
              <span className="font-medium">
                {Math.min(page * per_page, total)}
              </span>
              {' '}of{' '}
              <span className="font-medium">{total}</span>
              {' '}results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              {pages}
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Explore Boats
          </h1>
          <p className="text-gray-600">
            Find the perfect boat for your next adventure
          </p>
        </div>

        {/* Filters */}
        <BoatFilters />

        {/* Results */}
        <div className="mb-6">
          {errors && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error loading boats
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {errors}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading boats...</span>
            </div>
          ) : boats.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No boats found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search filters to find more boats.
              </p>
            </div>
          ) : (
            <>
              {/* Results count */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Found {pagination.total} boat{pagination.total !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Boats grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {boats.map((boat) => (
                  <BoatCard key={boat.id} boat={boat} />
                ))}
              </div>

              {/* Pagination */}
              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
