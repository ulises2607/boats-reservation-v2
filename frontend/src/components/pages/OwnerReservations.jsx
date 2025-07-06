import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { selectUser } from '../../redux/auth/authSlice';
import { 
  getOwnerReservations,
  updateReservationStatus,
  selectOwnerReservations,
  selectReservationsLoading,
  selectReservationsError,
  clearError
} from '../../redux/reservations/reservationsSlice';
import LoadingSpinner from '../common/LoadingSpinner';

function OwnerReservations() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const reservations = useSelector(selectOwnerReservations);
  const loading = useSelector(selectReservationsLoading);
  const error = useSelector(selectReservationsError);
  
  const [filter, setFilter] = useState('pending');

  // Debug logging
  console.log('OwnerReservations - User:', user);
  console.log('OwnerReservations - User role:', user?.role);
  console.log('OwnerReservations - Reservations:', reservations);
  console.log('OwnerReservations - Error:', error);

  useEffect(() => {
    if (user && (user.role === 'owner' || user.role === 'admin')) {
      console.log('OwnerReservations - Dispatching getOwnerReservations');
      dispatch(getOwnerReservations());
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

  const handleStatusUpdate = async (reservationId, newStatus, currentStatus) => {
    let swalConfig = {
      title: `${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} Reservation`,
      showCancelButton: true,
      confirmButtonColor: newStatus === 'confirmed' ? '#10b981' : '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${newStatus}!`,
    };

    if (newStatus === 'confirmed') {
      swalConfig = {
        ...swalConfig,
        text: 'Are you sure you want to confirm this reservation?',
        icon: 'question',
        input: 'textarea',
        inputPlaceholder: 'Confirmation message for the guest (optional)',
      };
    } else if (newStatus === 'rejected') {
      swalConfig = {
        ...swalConfig,
        text: 'Please provide a reason for rejecting this reservation.',
        icon: 'warning',
        input: 'textarea',
        inputPlaceholder: 'Reason for rejection (required)',
        inputValidator: (value) => {
          if (!value) {
            return 'You need to provide a reason for rejection!';
          }
        },
      };
    }

    const result = await Swal.fire(swalConfig);

    if (result.isConfirmed) {
      try {
        await dispatch(updateReservationStatus({
          id: reservationId,
          status: newStatus,
          notes: result.value || `Reservation ${newStatus} by owner`
        })).unwrap();
        
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `Reservation has been ${newStatus}.`,
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update reservation. Please try again.',
        });
      }
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    if (filter === 'all') return true;
    return reservation.status === filter;
  });

  const canUpdateStatus = (reservation) => {
    return reservation.status === 'pending' || reservation.status === 'confirmed';
  };

  if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
    return (
      <section className="h-full flex justify-center items-center">
        <article className="flex flex-col gap-4 border border-slate-950 rounded-md p-4 mx-auto max-w-xs lg:max-w-lg">
          <h2 className="font-black uppercase text-4xl text-center">Access Denied</h2>
          <p className="text-center text-md">You need to be a boat owner to access this page.</p>
        </article>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Manage Reservations</h1>
          <p className="text-gray-600 mb-4">Review and manage reservations for your boats</p>
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'pending', label: 'Pending Approval' },
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'completed', label: 'Completed' },
              { key: 'cancelled', label: 'Cancelled' },
              { key: 'rejected', label: 'Rejected' },
              { key: 'all', label: 'All' },
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
        {loading && <LoadingSpinner text="Loading reservations..." />}

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
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? "No one has made reservations for your boats yet." 
                    : `No ${filter} reservations found.`
                  }
                </p>
              </div>
            ) : (
              filteredReservations.map((reservation) => (
                <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Guest Info */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Guest Information</h4>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{reservation.user?.name || 'Guest'}</p>
                      <p className="text-sm text-gray-600 mt-2">Email</p>
                      <p className="text-sm">{reservation.user?.email || 'Not provided'}</p>
                    </div>

                    {/* Boat Info */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Boat</h4>
                      <div className="flex items-center space-x-3">
                        <img
                          src={reservation.boat?.picture || '/placeholder-boat.jpg'}
                          alt={reservation.boat?.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium">{reservation.boat?.name || 'Boat'}</p>
                          <p className="text-sm text-gray-600">ID: {reservation.boat_id}</p>
                        </div>
                      </div>
                    </div>

                    {/* Reservation Details */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Reservation Details</h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-600">Dates</p>
                          <p className="text-sm font-medium">
                            {new Date(reservation.start_date).toLocaleDateString()} - {new Date(reservation.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="font-medium text-lg">${reservation.total_amount}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                            {getStatusText(reservation.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Actions</h4>
                      <div className="space-y-2">
                        {reservation.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(reservation.id, 'confirmed', reservation.status)}
                              className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(reservation.id, 'rejected', reservation.status)}
                              className="w-full px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        
                        {reservation.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusUpdate(reservation.id, 'completed', reservation.status)}
                            className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Mark Completed
                          </button>
                        )}
                        
                        <a
                          href={`/boats/${reservation.boat_id}`}
                          className="block w-full px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors text-center"
                        >
                          View Boat
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  {(reservation.notes || reservation.owner_notes) && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reservation.notes && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Guest Notes</h5>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                              {reservation.notes}
                            </p>
                          </div>
                        )}
                        
                        {reservation.owner_notes && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Your Notes</h5>
                            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                              {reservation.owner_notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerReservations;
