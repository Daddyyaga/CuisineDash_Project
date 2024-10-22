import React, { useContext, useEffect, useState } from 'react';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Button, ListGroup, Card, Container, Row, Col, Alert, Form, Table } from 'react-bootstrap';

function Checkout() {
  const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  const [orderHistory, setOrderHistory] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [addressError, setAddressError] = useState(null);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const placeOrder = async () => {
    if (!token) {
      alert('You need to be logged in to place an order.');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const isAddressComplete = Object.values(address).every((field) => field !== '');
    if (!isAddressComplete) {
      setAddressError('All address fields are required.');
      return;
    }

    try {
      const orderDto = {
        restaurantId: cartItems[0]?.menuItem?.restaurantId,
        orderItems: cartItems.map(item => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
        })),
        address,
      };

      const response = await axios.post('https://localhost:7228/api/order', orderDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Order placed successfully:', response.data);
      alert('Order placed successfully');
      clearCart();
      setOrderPlaced(true);
      fetchOrderHistory();
    } catch (error) {
      console.error('Error placing order:', error.response || error.message);
      alert('Failed to place order. Please try again.');
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get('https://localhost:7228/api/order', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const orders = response.data.$values || [];
      setOrderHistory(orders);
      console.log('Fetched order history:', orders);
    } catch (error) {
      console.error('Error fetching order history:', error.response || error.message);
    }
  };

  const handlePayment = () => {
    setPaymentStatus(true);
    console.log('Payment processed successfully');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
    setAddressError(null);
  };

  // Handle soft delete
  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await axios.delete(`https://localhost:7228/api/order/softdelete/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted order from the state
      setOrderHistory((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error.response || error.message);
      alert('Failed to delete order.');
    }
  };

  return (
    <Container className="checkout mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="text-center">Checkout</Card.Title>
              <h3>Order Summary</h3>

              {cartItems.length === 0 ? (
                <Alert variant="warning">Your cart is empty.</Alert>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map(item => (
                    <ListGroup.Item key={item.id}>
                      {item.menuItem.name} - ₹{item.menuItem.price} x {item.quantity}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}

              <h4 className="mt-4">Total Price: ₹{getTotalPrice().toFixed(2)}</h4>

              <h3 className="mt-4">Delivery Information</h3>
              <Form className="mt-4">
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="firstName">
                      <Form.Control
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        value={address.firstName}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="lastName">
                      <Form.Control
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        value={address.lastName}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <Form.Group controlId="email">
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={address.email}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <Form.Group controlId="street">
                      <Form.Control
                        type="text"
                        name="street"
                        placeholder="Street"
                        value={address.street}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <Form.Group controlId="city">
                      <Form.Control
                        type="text"
                        name="city"
                        placeholder="City"
                        value={address.city}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="state">
                      <Form.Control
                        type="text"
                        name="state"
                        placeholder="State"
                        value={address.state}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <Form.Group controlId="zipCode">
                      <Form.Control
                        type="text"
                        name="zipCode"
                        placeholder="Zip code"
                        value={address.zipCode}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="country">
                      <Form.Control
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={address.country}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <Form.Group controlId="phone">
                      <Form.Control
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={address.phone}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {addressError && (
                  <Alert variant="danger" className="mt-3">
                    {addressError}
                  </Alert>
                )}

                <Button variant="primary" className="mt-3" onClick={placeOrder}>
                  Place Order
                </Button>

                {orderPlaced && !paymentStatus && (
                  <Button variant="success" className="mt-3" onClick={handlePayment}>
                    Make Payment
                  </Button>
                )}

                {paymentStatus && (
                  <Alert variant="success" className="mt-3">
                    Payment successful! Your order will be delivered soon.
                  </Alert>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mt-5">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Your Order History</Card.Title>
              {orderHistory.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Items</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderHistory.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>
                          {order.orderItems?.$values?.map(item => (
                            <div key={item.id}>
                              {item.menuItem?.name || `Item ID: ${item.menuItemId}`} - ₹{item.price.toFixed(2)} x {item.quantity}
                            </div>
                          ))}
                        </td>
                        <td>₹{order.totalAmount.toFixed(2)}</td>
                        <td>{order.orderStatus}</td>
                        <td>
                          <Button variant="danger" onClick={() => handleDeleteOrder(order.id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">No orders placed yet.</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Checkout;
