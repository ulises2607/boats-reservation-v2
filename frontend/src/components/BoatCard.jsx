import React from 'react';
import { Link } from 'react-router-dom';

const BoatCard = ({ boat }) => {
  const {
    id,
    name,
    description,
    rent_price,
    boat_type_display,
    capacity_text,
    location_display,
    primary_image,
    rating_stars,
    amenities_list,
    price_per_day,
    user
  } = boat;

  // Fallback image if primary_image is not available or is default
  const defaultImage = '/images/default-boat.svg';
  const imageUrl = primary_image && primary_image !== '/default-boat.jpg' 
    ? primary_image 
    : boat.picture || defaultImage;

  // Limit amenities to first 3 for card display
  const displayAmenities = amenities_list?.slice(0, 3) || [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
            {boat_type_display}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-green-600 text-white px-2 py-1 rounded-md text-xs font-medium">
            ${price_per_day}/day
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location_display}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              {capacity_text}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <span className="text-yellow-400 text-sm mr-1">
            {rating_stars}
          </span>
          <span className="text-gray-600 text-sm">
            ({boat.total_reviews || 0} reviews)
          </span>
        </div>

        {/* Amenities */}
        {displayAmenities.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {displayAmenities.map((amenity, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                >
                  {amenity}
                </span>
              ))}
              {amenities_list?.length > 3 && (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                  +{amenities_list.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Owner */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Hosted by {user?.name}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/boats/${id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm font-medium"
          >
            View Details
          </Link>
          <Link
            to={`/boats/${id}/reserve`}
            className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-sm font-medium"
          >
            Reserve Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BoatCard;
