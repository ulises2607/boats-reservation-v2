import { configureStore } from '@reduxjs/toolkit';
import usersessionReducer from './usersession/usersessionsSlice.js';
import reservationsReducer from './reservations/reservationsSlice.js';
import boatsReducer from './boats/boatsSlice.js';
import boatDetailsReducer from './boatDetails/boatDetailsSlice.js';

const store = configureStore({
  reducer: {
    usersession: usersessionReducer,
    boats: boatsReducer,
    reservations: reservationsReducer,
    boatDetails: boatDetailsReducer,
  },
});

export default store;
