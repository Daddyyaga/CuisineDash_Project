import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Container, Button } from 'react-bootstrap';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not an admin
    if (!user || user.role !== 'Admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <Container className="mt-5">
      <h1>Admin Dashboard</h1>
      <div className="mt-4">
        <ul>
          <li>
            <Button as={Link} to="/admin/restaurants" variant="primary" className="mb-3">
              Manage Restaurants
            </Button>
          </li>
          <li>
            <Button as={Link} to="/admin/menu-items" variant="primary" className="mb-3">
              Manage Menu Items
            </Button>
          </li>
          <li>
            <Button as={Link} to="/admin/orders" variant="primary" className="mb-3">
              Manage Orders
            </Button>
          </li>
        </ul>
      </div>
    </Container>
  );
};

export default AdminDashboard;
