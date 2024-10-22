import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate to handle navigation
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext'; // Import AuthContext for user orders
import axios from 'axios';
import { Button, ListGroup, Spinner, Card, Container, Row, Col, Table, Alert } from 'react-bootstrap'; // Import Bootstrap components

function Cart() {
  const { cartItems, removeFromCart, getTotalPrice, clearCart, fetchCartData } = useContext(CartContext);
  const { user } = useContext(AuthContext); // Use the user context to get the token
  const [loading, setLoading] = useState(true); // Add loading state to avoid rendering too soon
  const [showOrderHistory, setShowOrderHistory] = useState(false); // State to toggle order history
  const [orderHistory, setOrderHistory] = useState([]); // State to store order history
  const [loadingOrders, setLoadingOrders] = useState(false); // State to handle order history loading
  const navigate = useNavigate(); // useNavigate hook for navigation

  useEffect(() => {
    // Fetch the cart data when the component is mounted
    const fetchCart = async () => {
      setLoading(true);
      await fetchCartData();
      setLoading(false);
    };

    fetchCart();
  }, []); // Empty dependency array to fetch cart only on initial render

  const handleCheckout = () => {
    navigate('/checkout'); // Navigate to the checkout page
  };

  const fetchOrderHistory = async () => {
    setLoadingOrders(true);
    const token = localStorage.getItem('token'); // Get token from local storage
    try {
      const response = await axios.get('https://localhost:7228/api/order', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrderHistory(response.data.$values || []); // Store fetched order history
      setLoadingOrders(false);
    } catch (error) {
      console.error('Error fetching order history:', error);
      setLoadingOrders(false);
    }
  };

  const toggleOrderHistory = () => {
    if (!showOrderHistory) {
      // Fetch order history only when it's first toggled on
      fetchOrderHistory();
    }
    setShowOrderHistory(!showOrderHistory);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
        <p>Loading cart...</p>
      </Container>
    ); // Show a loading state with a spinner until data is fetched
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <Container className="text-center mt-5">
        <h3>Your cart is empty</h3>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4">Your Cart</Card.Title>

              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) =>
                    item?.menuItem ? (
                      <tr key={item.id}>
                        <td>{item.menuItem.name}</td>
                        <td>₹{item.menuItem.price}</td>
                        <td>{item.quantity}</td>
                        <td>₹{(item.menuItem.price * item.quantity).toFixed(2)}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ) : null
                  )}
                </tbody>
              </Table>

              <h3 className="text-right mt-4">Total Price: ₹{getTotalPrice().toFixed(2)}</h3>

              <div className="d-flex justify-content-between mt-4">
                <Button variant="outline-danger" onClick={clearCart}>
                  Clear Cart
                </Button>
                <Button variant="primary" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </div>

              {/* Order History Button */}
              <div className="text-center mt-4">
                <Button variant="info" onClick={toggleOrderHistory}>
                  {showOrderHistory ? 'Hide Order History' : 'Show Order History'}
                </Button>
              </div>

              {/* Order History Section */}
              {showOrderHistory && (
                <div className="mt-4">
                  <h4>Your Order History</h4>
                  {loadingOrders ? (
                    <Spinner animation="border" />
                  ) : orderHistory.length > 0 ? (
                    <Table responsive striped bordered hover>
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Items</th>
                          <th>Total Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderHistory.map((order) => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>
                              {order.orderItems?.$values?.map((item) => (
                                <div key={item.id}>
                                  {item.menuItem?.name || `Item ID: ${item.menuItemId}`} - ₹{item.price.toFixed(2)} x {item.quantity}
                                </div>
                              ))}
                            </td>
                            <td>₹{order.totalAmount.toFixed(2)}</td>
                            <td>{order.orderStatus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <Alert variant="info">No orders placed yet.</Alert>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Cart;
