import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Layout from './components/Layout';
import LandingPage from './components/pages/LandingPage';
import ExplorePage from './components/pages/ExplorePage';
import TestPage from './components/pages/TestPage';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import Boats from './components/pages/Boats';
import BoatDetails from './components/pages/BoatDetails';
import AddBoat from './components/pages/AddBoat';
import DeleteBoat from './components/pages/DeleteBoat';
import Reserve from './components/pages/Reserve';
import MyReservations from './components/pages/MyReservations';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="test" element={<TestPage />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="boats" element={<Boats />} />
            <Route path="boats/:id" element={<BoatDetails />} />
            <Route path="add-boat" element={<AddBoat />} />
            <Route path="delete-boat" element={<DeleteBoat />} />
            <Route path="reserve/:id" element={<Reserve />} />
            <Route path="my-reservations" element={<MyReservations />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
