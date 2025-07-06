import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBoatDetails } from '../../redux/boatDetails/boatDetailsSlice';
import { selectUser } from '../../redux/auth/authSlice';

const BoatDetails = () => {
  const boatDetailsState = useSelector((state) => state.boatDetails);
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const boat = boatDetailsState.boatDetails;

  useEffect(() => {
    dispatch(getBoatDetails(id));
  }, [dispatch, id]);

  const handleReserveClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/boats/${id}/reserve`);
  };

  const isOwner = user && boat && boat.user_id === user.id;

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/boats')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Boats
            </button>
            
            {isOwner && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Your Boat
              </span>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900">{boat.name}</h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <img
              className="w-full h-96 object-cover rounded-lg"
              src={boat.picture || '/placeholder-boat.jpg'}
              alt={boat.name}
            />
          </div>

          {/* Details Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">{boat.description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Color</h3>
                  <p className="text-gray-600">{boat.color}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Daily Rate</h3>
                  <p className="text-2xl font-bold text-blue-600">${boat.rent_price}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Purchase Price</h3>
                  <p className="text-xl font-semibold text-gray-900">${boat.price}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Owner</h3>
                  <p className="text-gray-600">{boat.user?.name || 'Boat Owner'}</p>
                </div>
              </div>

              {/* Availability Status */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-800 font-medium">Available for booking</span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Check specific dates in the reservation process
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {!isOwner && user && (
                  <button
                    onClick={handleReserveClick}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Reserve This Boat
                  </button>
                )}
                
                {!user && (
                  <div className="text-center">
                    <button
                      onClick={handleReserveClick}
                      className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
                    >
                      Log In to Reserve
                    </button>
                    <p className="text-gray-600 text-sm mt-2">
                      You need to be logged in to make a reservation
                    </p>
                  </div>
                )}

                {isOwner && (
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate(`/boats/${id}/edit`)}
                      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Edit Boat Details
                    </button>
                    <button
                      onClick={() => navigate('/owner/reservations')}
                      className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                      Manage Reservations
                    </button>
                  </div>
                )}
              </div>

              {/* Booking Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Booking Information</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Instant booking confirmation pending owner approval</li>
                  <li>• Free cancellation up to 24 hours before check-in</li>
                  <li>• Payment processed after owner confirmation</li>
                  <li>• Customer support available 24/7</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoatDetails;
