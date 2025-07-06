import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilter,
  clearFilters,
  fetchBoats,
  selectFilters,
} from "../redux/boats/boatsSlice";

const BoatFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  const boatTypes = [
    { value: "", label: "All Types" },
    { value: "fishing", label: "Fishing Boats" },
    { value: "yacht", label: "Yachts" },
    { value: "sailboat", label: "Sailboats" },
    { value: "motorboat", label: "Motorboats" },
    { value: "pontoon", label: "Pontoon Boats" },
    { value: "houseboat", label: "Houseboats" },
    { value: "catamaran", label: "Catamarans" },
    { value: "speedboat", label: "Speedboats" },
  ];

  const sortOptions = [
    { value: "created_at", label: "Newest First" },
    { value: "price", label: "Price" },
    { value: "capacity", label: "Capacity" },
    { value: "rating", label: "Rating" },
  ];

  const handleFilterChange = (key, value) => {
    dispatch(setFilter({ key, value }));
  };

  const handleApplyFilters = () => {
    dispatch(fetchBoats(filters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(fetchBoats({}));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    handleFilterChange("search", value);
    // Auto-search with debounce could be added here
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filter Boats</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className={`${isExpanded ? "block" : "hidden"} lg:block`}>
        {/* Search Bar */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search boats, locations, amenities..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Boat Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Boat Type
            </label>
            <select
              value={filters.boat_type}
              onChange={(e) => handleFilterChange("boat_type", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {boatTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Capacity
            </label>
            <input
              type="number"
              value={filters.min_capacity}
              onChange={(e) =>
                handleFilterChange("min_capacity", e.target.value)
              }
              placeholder="e.g. 4"
              min="1"
              max="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              placeholder="e.g. California, Miami"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sort_by}
              onChange={(e) => handleFilterChange("sort_by", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Price ($/day)
            </label>
            <input
              type="number"
              value={filters.min_price}
              onChange={(e) => handleFilterChange("min_price", e.target.value)}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Price ($/day)
            </label>
            <input
              type="number"
              value={filters.max_price}
              onChange={(e) => handleFilterChange("max_price", e.target.value)}
              placeholder="10000"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Sort Direction and Available Toggle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort Direction
            </label>
            <select
              value={filters.sort_direction}
              onChange={(e) =>
                handleFilterChange("sort_direction", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.available}
                onChange={(e) =>
                  handleFilterChange("available", e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Available only</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleApplyFilters}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={handleClearFilters}
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoatFilters;
