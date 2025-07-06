import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_BASE_URL = 'http://127.0.0.1:3001/api/v1';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

const initialState = {
  reservations: [],
  userReservations: [],
  ownerReservations: [],
  currentReservation: null,
  availableDates: [],
  loading: false,
  error: null,
};

// Get all reservations (admin only)
export const getAllReservations = createAsyncThunk(
  'reservations/getAllReservations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(data.error || 'Failed to fetch reservations');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get user's reservations
export const getUserReservations = createAsyncThunk(
  'reservations/getUserReservations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/my_reservations`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(data.error || 'Failed to fetch user reservations');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get owner's reservations
export const getOwnerReservations = createAsyncThunk(
  'reservations/getOwnerReservations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/owner_reservations`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(data.error || 'Failed to fetch owner reservations');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a new reservation
export const createReservation = createAsyncThunk(
  'reservations/createReservation',
  async (reservationData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reservation: reservationData }),
      });

      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(data.errors || data.error || 'Failed to create reservation');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update reservation status (owner/admin action)
export const updateReservationStatus = createAsyncThunk(
  'reservations/updateReservationStatus',
  async ({ id, status, notes }, { rejectWithValue }) => {
    try {
      const endpoint = status === 'confirmed' ? 'confirm' : 
                     status === 'rejected' ? 'reject' : 
                     status === 'cancelled' ? 'cancel' : 'complete';
      
      const response = await fetch(`${API_BASE_URL}/reservations/${id}/${endpoint}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(data.error || 'Failed to update reservation');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Cancel reservation (user action)
export const cancelReservation = createAsyncThunk(
  'reservations/cancelReservation',
  async ({ id, notes }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/${id}/cancel`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(data.error || 'Failed to cancel reservation');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Check boat availability
export const checkAvailability = createAsyncThunk(
  'reservations/checkAvailability',
  async ({ boatId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });
      
      const response = await fetch(`${API_BASE_URL}/boats/${boatId}/check_availability?${params}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(data.error || 'Failed to check availability');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentReservation: (state) => {
      state.currentReservation = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Get all reservations
    builder
      .addCase(getAllReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = action.payload;
      })
      .addCase(getAllReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get user reservations
    builder
      .addCase(getUserReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.userReservations = action.payload;
      })
      .addCase(getUserReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get owner reservations
    builder
      .addCase(getOwnerReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOwnerReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerReservations = action.payload;
      })
      .addCase(getOwnerReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create reservation
    builder
      .addCase(createReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReservation = action.payload;
        state.userReservations.push(action.payload);
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update reservation status
    builder
      .addCase(updateReservationStatus.fulfilled, (state, action) => {
        const updatedReservation = action.payload;
        
        // Update in all relevant arrays
        const updateArrays = [state.reservations, state.userReservations, state.ownerReservations];
        updateArrays.forEach(array => {
          const index = array.findIndex(r => r.id === updatedReservation.id);
          if (index !== -1) {
            array[index] = updatedReservation;
          }
        });
        
        if (state.currentReservation?.id === updatedReservation.id) {
          state.currentReservation = updatedReservation;
        }
      });

    // Cancel reservation
    builder
      .addCase(cancelReservation.fulfilled, (state, action) => {
        const updatedReservation = action.payload;
        
        // Update in all relevant arrays
        const updateArrays = [state.reservations, state.userReservations, state.ownerReservations];
        updateArrays.forEach(array => {
          const index = array.findIndex(r => r.id === updatedReservation.id);
          if (index !== -1) {
            array[index] = updatedReservation;
          }
        });
        
        if (state.currentReservation?.id === updatedReservation.id) {
          state.currentReservation = updatedReservation;
        }
      });

    // Check availability
    builder
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.availableDates = action.payload;
      });
  },
});

export const { clearError, clearCurrentReservation, setLoading } = reservationsSlice.actions;

// Selectors
export const selectAllReservations = (state) => state.reservations.reservations;
export const selectUserReservations = (state) => state.reservations.userReservations;
export const selectOwnerReservations = (state) => state.reservations.ownerReservations;
export const selectCurrentReservation = (state) => state.reservations.currentReservation;
export const selectReservationsLoading = (state) => state.reservations.loading;
export const selectReservationsError = (state) => state.reservations.error;
export const selectAvailableDates = (state) => state.reservations.availableDates;

export default reservationsSlice.reducer;
