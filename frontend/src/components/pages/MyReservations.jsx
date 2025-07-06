import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { selectUser } from '../../redux/auth/authSlice'; // Corregido: usar authSlice
import { 
  getUserReservations,
  cancelReservation,
  selectUserReservations,
  selectReservationsLoading,
  selectReservationsError,
  clearError
} from '../../redux/reservations/reservationsSlice';
import LoadingSpinner from '../common/LoadingSpinner';

function MyReservations() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const reservations = useSelector(selectUserReservations);
  const loading = useSelector(selectReservationsLoading);
  const error = useSelector(selectReservationsError);
  
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      dispatch(getUserReservations());
    }
  }, [dispatch, user]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending: 'Pending Approval',
      confirmed: 'Confirmed',
      rejected: 'Rejected',
      cancelled: 'Cancelled',
      completed: 'Completed',
    };
    return statusTexts[status] || status;
  };

  const handleCancelReservation = async (reservationId) => {
    const result = await Swal.fire({
      title: 'Cancel Reservation',
      text: 'Are you sure you want to cancel this reservation?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
      input: 'textarea',
      inputPlaceholder: 'Reason for cancellation (optional)',
    });

    if (result.isConfirmed) {
      try {
        await dispatch(cancelReservation({
          id: reservationId,
          notes: result.value || 'Cancelled by user'
        })).unwrap();
        
        Swal.fire({
          icon: 'success',
          title: 'Cancelled!',
          text: 'Your reservation has been cancelled.',
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to cancel reservation. Please try again.',
        });
      }
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    if (filter === 'all') return true;
    return reservation.status === filter;
  });

  const canCancelReservation = (reservation) => {
    return reservation.status === 'pending' || reservation.status === 'confirmed';
  };

  if (!user) {
    return (
      <section className="h-full flex justify-center items-center">
        <article className="flex flex-col gap-4 border border-slate-950 rounded-md p-4 mx-auto max-w-xs lg:max-w-lg">
          <h2 className="font-black uppercase text-4xl text-center">Access Denied</h2>
          <p className="text-center text-md">Please log in first to view your reservations.</p>
        </article>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Reservations</h1>
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'pending', label: 'Pending' },
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'completed', label: 'Completed' },
              { key: 'cancelled', label: 'Cancelled' },
              { key: 'rejected', label: 'Rejected' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner text="Loading your reservations..." />}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Reservations List */}
        {!loading && (
          <div className="space-y-4">
            {filteredReservations.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
                <p className="text-gray-600 mb-4">
                  {filter === 'all' 
                    ? "You haven't made any reservations yet." 
                    : `No ${filter} reservations found.`
                  }
                </p>
                <a
                  href="/explore"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Explore Boats
                </a>
              </div>
            ) : (
              filteredReservations.map((reservation) => (
                <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Boat Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start space-x-4">
                        <img
                          src={reservation.boat?.picture || '/placeholder-boat.jpg'}
                          alt={reservation.boat?.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {reservation.boat?.name || 'Boat'}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            Reservation #{reservation.id}
                          </p>
                          
                          {/* Status Badge */}
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(reservation.status)}`}>
                            {getStatusText(reservation.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Reservation Details */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Dates</p>
                        <p className="font-medium">
                          {new Date(reservation.start_date).toLocaleDateString()} - {new Date(reservation.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="font-medium text-lg">
                          ${parseFloat(reservation.total_amount) || 'N/A'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Daily Rate</p>
                        <p className="font-medium">
                          ${parseFloat(reservation.daily_rate) || 'N/A'}/day
                        </p>
                      </div>

                      {reservation.notes && (
                        <div>
                          <p className="text-sm text-gray-600">Your Notes</p>
                          <p className="text-sm">{reservation.notes}</p>
                        </div>
                      )}

                      {reservation.owner_notes && (
                        <div>
                          <p className="text-sm text-gray-600">Owner Notes</p>
                          <p className="text-sm">{reservation.owner_notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex justify-end space-x-3">
                    {canCancelReservation(reservation) && (
                      <button
                        onClick={() => handleCancelReservation(reservation.id)}
                        className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Cancel Reservation
                      </button>
                    )}
                    
                    <a
                      href={`/boats/${reservation.boat?.id || reservation.boat_id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Boat
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyReservations;
