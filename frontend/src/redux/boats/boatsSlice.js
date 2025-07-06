import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  boats: [],
  pagination: {
    page: 1,
    per_page: 20,
    total: 0
  },
  filters: {
    boat_type: '',
    min_capacity: '',
    max_capacity: '',
    location: '',
    min_price: '',
    max_price: '',
    search: '',
    available: true,
    sort_by: 'created_at',
    sort_direction: 'desc'
  },
  isLoading: false,
  errors: null,
};

export const fetchBoats = createAsyncThunk('boats/fetchBoats', async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    
    const url = `http://localhost:3001/api/v1/boats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch boats');
  }
});

export const fetchBoatById = createAsyncThunk('boats/fetchBoatById', async (id) => {
  try {
    const response = await axios.get(`http://localhost:3001/api/v1/boats/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch boat');
  }
});

export const createBoat = createAsyncThunk(
  'boat/createBoat',
  async (boatData) => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/boats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(boatData),
      });

      if (response.ok) {
        const boat = await response.json();
        return boat;
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create boat');
    } catch (error) {
      throw new Error(error.message || 'Failed to create boat');
    }
  },
);

export const deleteBoat = createAsyncThunk('boat/deleteboat', async (id) => {
  try {
    const response = await fetch(`http://127.0.0.1:3001/api/v1/boats/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      return { id };
    }
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete post');
  } catch (error) {
    throw new Error(error.message || 'Failed to delete boat');
  }
});

const boatsSlice = createSlice({
  name: 'boats',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    clearFilters: (state) => {
      state.filters = {
        boat_type: '',
        min_capacity: '',
        max_capacity: '',
        location: '',
        min_price: '',
        max_price: '',
        search: '',
        available: true,
        sort_by: 'created_at',
        sort_direction: 'desc'
      };
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoats.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(fetchBoats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.boats = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
        state.errors = null;
      })
      .addCase(fetchBoats.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.error.message;
      })
      .addCase(fetchBoatById.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(fetchBoatById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errors = null;
        // Update the boat in the boats array if it exists
        const index = state.boats.findIndex(boat => boat.id === action.payload.id);
        if (index !== -1) {
          state.boats[index] = action.payload;
        }
      })
      .addCase(fetchBoatById.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.error.message;
      })
      .addCase(deleteBoat.fulfilled, (state, action) => {
        const boatId = action.payload.id;
        state.boats = state.boats.filter((boat) => boat.id !== boatId);
      })
      .addCase(createBoat.fulfilled, (state, action) => {
        state.boats.push(action.payload);
      });
  },
});

export const { setFilter, clearFilters, setPage } = boatsSlice.actions;

export default boatsSlice.reducer;

export const selectAllBoats = (state) => state.boats.boats;
export const selectBoatsLoading = (state) => state.boats.isLoading;
export const selectBoatsErrors = (state) => state.boats.errors;
export const selectPagination = (state) => state.boats.pagination;
export const selectFilters = (state) => state.boats.filters;
