import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext'; // Import AuthContext to check user role
import { useNavigate } from 'react-router-dom'; // For redirection
import { Table, Form, Button } from 'react-bootstrap'; // Import Bootstrap components for better UI

const AdminOrders = () => {
  const [orders, setOrders] = useState([]); // Ensure it's initialized as an empty array
  const { user } = useContext(AuthContext); // Get the user from AuthContext
  const navigate = useNavigate(); // For redirection

  useEffect(() => {
    // Redirect to login if the user is not an admin
    if (!user || user.role !== 'Admin') {
      navigate('/login');
    } else {
      fetchOrders();
    }
  }, [user, navigate]);

  const fetchOrders = () => {
    const token = localStorage.getItem('token');
    axios
      .get('https://localhost:7228/api/admin/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        // Extract the orders from the $values property
        const extractedOrders = response.data?.$values || []; // Handle if response contains $values
        setOrders(extractedOrders);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        setOrders([]); // Set an empty array in case of error
      });
  };

  const handleUpdateOrder = (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    axios
      .put(
        `https://localhost:7228/api/admin/update-order/${orderId}`,
        { orderStatus: newStatus }, // Send only orderStatus
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        // Update the order status in the local state
        setOrders(
          orders.map(order =>
            order.id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
      })
      .catch(error => console.error('Error updating order:', error));
  };

  const handleSoftDeleteOrder = (orderId) => {
    const token = localStorage.getItem('token');
    axios
      .delete(`https://localhost:7228/api/admin/delete-order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        // Remove the soft deleted order from the local state
        setOrders(orders.filter(order => order.id !== orderId));
      })
      .catch(error => console.error('Error deleting order:', error));
  };

  if (!user || user.role !== 'Admin') {
    return null; // Don't render anything if the user is not an admin
  }

  return (
    <div className="container mt-4">
      <h1>Manage Orders</h1>
      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Name (Restaurant)</th> {/* Add column for Order Name */}
              <th>Total Amount</th>
              <th>Status</th>
              <th>Update Status</th>
              <th>Delete Order</th> {/* New column for soft delete */}
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.restaurant?.name || 'Unknown'}</td> {/* Display restaurant name */}
                <td>₹{order.totalAmount}</td>
                <td>{order.orderStatus}</td>
                <td>
                  <Form.Select
                    value={order.orderStatus}
                    onChange={(e) => handleUpdateOrder(order.id, e.target.value)}
                  >
                    <option value="Food Processing">Food Processing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </Form.Select>
                </td>
                <td>
                  <Button variant="danger" onClick={() => handleSoftDeleteOrder(order.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AdminOrders;
