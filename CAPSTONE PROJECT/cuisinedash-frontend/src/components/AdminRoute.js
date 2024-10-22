import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== 'Admin') {
    return <Navigate to="/login" />; // Redirect to login if not admin
  }

  return children; // Render admin components if the user is admin
}

export default AdminRoute;
