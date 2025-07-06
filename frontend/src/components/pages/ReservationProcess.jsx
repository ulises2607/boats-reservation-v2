import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { selectUser } from '../../redux/usersession/usersessionsSlice';
import { 
  createReservation, 
  checkAvailability,
  clearError,
  selectReservationsLoading,
  selectReservationsError,
  selectCurrentReservation
} from '../../redux/reservations/reservationsSlice';
import { fetchBoatById, selectBoatById } from '../../redux/boatDetails/boatDetailsSlice';
import DateRangePicker from '../common/DateRangePicker';
import LoadingSpinner from '../common/LoadingSpinner';

function ReservationProcess() {
  const { boatId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const user = useSelector(selectUser);
  const boat = useSelector(selectBoatById);
  const loading = useSelector(selectReservationsLoading);
  const error = useSelector(selectReservationsError);
  const currentReservation = useSelector(selectCurrentReservation);
  
  const [step, setStep] = useState(1); // 1: Dates, 2: Details, 3: Confirmation
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    notes: '',
  });
  const [priceDetails, setPriceDetails] = useState(null);
  const [isAvailable, setIsAvailable] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Required',
        text: 'Please log in to make a reservation.',
      }).then(() => {
        navigate('/login');
      });
    }
  }, [user, navigate]);

  // Fetch boat details
  useEffect(() => {
    if (boatId) {
      dispatch(fetchBoatById(boatId));
    }
  }, [dispatch, boatId]);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Calculate days and price when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate && boat) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      
      if (days > 0) {
        const totalAmount = days * boat.rent_price;
        setPriceDetails({
          days,
          dailyRate: boat.rent_price,
          totalAmount,
        });
      }
    }
  }, [formData.startDate, formData.endDate, boat]);

  const handleDateChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsAvailable(null); // Reset availability when dates change
  };

  const handleCheckAvailability = async () => {
    if (!formData.startDate || !formData.endDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Dates',
        text: 'Please select both start and end dates.',
      });
      return;
    }

    try {
      const result = await dispatch(checkAvailability({
        boatId,
        startDate: formData.startDate,
        endDate: formData.endDate,
      })).unwrap();
      
      setIsAvailable(result.available);
      
      if (result.available) {
        Swal.fire({
          icon: 'success',
          title: 'Available!',
          text: 'The boat is available for your selected dates.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Not Available',
          text: result.message || 'The boat is not available for the selected dates.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to check availability. Please try again.',
      });
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.startDate || !formData.endDate) {
        Swal.fire({
          icon: 'warning',
          title: 'Missing Dates',
          text: 'Please select both start and end dates.',
        });
        return;
      }
      
      if (!isAvailable) {
        Swal.fire({
          icon: 'warning',
          title: 'Check Availability',
          text: 'Please check availability for your selected dates first.',
        });
        return;
      }
    }
    
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmitReservation = async () => {
    try {
      const reservationData = {
        boat_id: parseInt(boatId),
        start_date: formData.startDate,
        end_date: formData.endDate,
        notes: formData.notes,
      };

      await dispatch(createReservation(reservationData)).unwrap();
      
      Swal.fire({
        icon: 'success',
        title: 'Reservation Created!',
        text: 'Your reservation has been submitted and is pending approval.',
      }).then(() => {
        navigate('/my-reservations');
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Reservation Failed',
        text: error || 'Failed to create reservation. Please try again.',
      });
    }
  };

  if (!user) {
    return null; // Will redirect
  }

  if (!boat) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Reserve {boat.name}</h1>
            <div className="flex space-x-2">
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= stepNumber
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNumber}
                </div>
              ))}
            </div>
          </div>
          
          {/* Boat Info */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <img
                src={boat.picture || '/placeholder-boat.jpg'}
                alt={boat.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">{boat.name}</h2>
              <p className="text-gray-600 mb-2">{boat.description}</p>
              <p className="text-2xl font-bold text-blue-600">${boat.rent_price}/day</p>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Select Your Dates</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {priceDetails && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Price Breakdown</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>${priceDetails.dailyRate}/day × {priceDetails.days} days</span>
                      <span>${priceDetails.totalAmount}</span>
                    </div>
                    <div className="border-t pt-1 font-semibold">
                      <div className="flex justify-between">
                        <span>Total</span>
                        <span>${priceDetails.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleCheckAvailability}
                  disabled={loading || !formData.startDate || !formData.endDate}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Checking...' : 'Check Availability'}
                </button>
                
                {isAvailable && (
                  <button
                    onClick={handleNextStep}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Additional Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests or Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special requests or additional information..."
                  />
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handlePreviousStep}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Review Reservation
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Review Your Reservation</h2>
              
              <div className="space-y-6">
                {/* Reservation Summary */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Reservation Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Boat:</strong> {boat.name}</p>
                      <p><strong>Check-in:</strong> {new Date(formData.startDate).toLocaleDateString()}</p>
                      <p><strong>Check-out:</strong> {new Date(formData.endDate).toLocaleDateString()}</p>
                      <p><strong>Duration:</strong> {priceDetails?.days} days</p>
                    </div>
                    <div>
                      <p><strong>Daily Rate:</strong> ${priceDetails?.dailyRate}</p>
                      <p><strong>Total Amount:</strong> ${priceDetails?.totalAmount}</p>
                      {formData.notes && (
                        <p><strong>Notes:</strong> {formData.notes}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Your reservation is pending approval from the boat owner</li>
                    <li>• You will be notified once the owner confirms or rejects your request</li>
                    <li>• Payment will be processed only after confirmation</li>
                    <li>• You can cancel your reservation before it's confirmed</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handlePreviousStep}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitReservation}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                >
                  {loading ? 'Creating Reservation...' : 'Confirm Reservation'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReservationProcess;
