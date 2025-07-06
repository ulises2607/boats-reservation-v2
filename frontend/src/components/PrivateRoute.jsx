import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsAuthenticated, selectUser } from '../redux/auth/authSlice';

// Componente para proteger rutas que requieren autenticación
const PrivateRoute = ({ children, requireAuth = true, allowedRoles = null }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  // Si requiere autenticación y no está autenticado, redirigir a login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si no requiere autenticación pero está autenticado, permitir acceso
  if (!requireAuth) {
    return children;
  }

  // Si se especifican roles permitidos, verificar que el usuario tenga el rol correcto
  if (allowedRoles && user) {
    const userRole = user.role || 'renter'; // default role
    if (!allowedRoles.includes(userRole)) {
      // Si no tiene el rol correcto, redirigir a página principal
      return <Navigate to="/explore" replace />;
    }
  }

  // Si todas las verificaciones pasan, mostrar el contenido
  return children;
};

// Componente específico para rutas que requieren autenticación
export const RequireAuth = ({ children, allowedRoles = null }) => (
  <PrivateRoute requireAuth={true} allowedRoles={allowedRoles}>
    {children}
  </PrivateRoute>
);

// Componente específico para rutas solo para invitados (no autenticados)
export const GuestOnly = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Si está autenticado, redirigir a página principal
  if (isAuthenticated) {
    return <Navigate to="/explore" replace />;
  }
  
  // Si no está autenticado, mostrar el contenido
  return children;
};

// Componente específico para rutas de propietarios
export const OwnerOnly = ({ children }) => (
  <RequireAuth allowedRoles={['owner', 'admin']}>
    {children}
  </RequireAuth>
);

// Componente específico para rutas de administradores
export const AdminOnly = ({ children }) => (
  <RequireAuth allowedRoles={['admin']}>
    {children}
  </RequireAuth>
);

export default PrivateRoute;
