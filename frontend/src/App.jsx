import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Layout from "./components/Layout";
import AuthChecker from "./components/AuthChecker";
import { RequireAuth, GuestOnly, OwnerOnly, AdminOnly } from "./components/PrivateRoute";
import LandingPage from "./components/pages/LandingPage";
import ExplorePage from "./components/pages/ExplorePage";
import TestPage from "./components/pages/TestPage";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import UserProfile from "./components/pages/UserProfile";
import Boats from "./components/pages/Boats";
import BoatDetails from "./components/pages/BoatDetails";
import AddBoat from "./components/pages/AddBoat";
import DeleteBoat from "./components/pages/DeleteBoat";
import Reserve from "./components/pages/Reserve";
import MyReservations from "./components/pages/MyReservations";
import AdminDashboard from "./components/pages/AdminDashboard";
import AdminUsers from "./components/pages/AdminUsers";
import AdminBoats from "./components/pages/AdminBoats";
import "./index.css";

function App() {
  return (
    <Provider store={store}>
      <AuthChecker>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Rutas públicas */}
              <Route index element={<LandingPage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="test" element={<TestPage />} />
              
              {/* Rutas solo para invitados (no autenticados) */}
              <Route path="login" element={<GuestOnly><Login /></GuestOnly>} />
              <Route path="signup" element={<GuestOnly><Signup /></GuestOnly>} />
              
              {/* Rutas que requieren autenticación */}
              <Route path="profile" element={<RequireAuth><UserProfile /></RequireAuth>} />
              <Route path="boats" element={<RequireAuth><Boats /></RequireAuth>} />
              <Route path="boats/:id" element={<RequireAuth><BoatDetails /></RequireAuth>} />
              <Route path="reserve/:id" element={<RequireAuth><Reserve /></RequireAuth>} />
              <Route path="my-reservations" element={<RequireAuth><MyReservations /></RequireAuth>} />
              
              {/* Rutas solo para propietarios */}
              <Route path="add-boat" element={<OwnerOnly><AddBoat /></OwnerOnly>} />
              <Route path="delete-boat" element={<OwnerOnly><DeleteBoat /></OwnerOnly>} />
              
              {/* Rutas solo para administradores */}
              <Route path="admin" element={<AdminOnly><AdminDashboard /></AdminOnly>} />
              <Route path="admin/users" element={<AdminOnly><AdminUsers /></AdminOnly>} />
              <Route path="admin/boats" element={<AdminOnly><AdminBoats /></AdminOnly>} />
            </Route>
          </Routes>
        </Router>
      </AuthChecker>
    </Provider>
  );
}

export default App;
