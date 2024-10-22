import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantById } from '../api/restaurants';
import { Container, Card, Button, Row, Col, Alert, Spinner } from 'react-bootstrap'; // Added Spinner for loading state
import CartContext from '../context/CartContext'; // Import CartContext for adding items to the cart
import AuthContext from '../context/AuthContext'; // Import AuthContext to check if the user is logged in
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext); // Get addToCart function from CartContext
  const { user } = useContext(AuthContext); // Get user details from AuthContext

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await getRestaurantById(id);
        console.log('Fetched restaurant:', data); // Debugging line

        // Handle menuItems based on backend response structure
        if (data.menuItems && Array.isArray(data.menuItems.$values)) {
          data.menuItems = data.menuItems.$values;
        }

        setRestaurant(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleAddToCart = (item) => {
    if (user) {
      // User is logged in
      addToCart(item); // Call the addToCart function
      toast.success(`${item.name} added to the cart!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      // User is not logged in
      toast.error("You need to log in to add items to the cart!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!restaurant) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading restaurant details...</p>
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <ToastContainer /> {/* Add ToastContainer here for displaying toasts */}
      <Card>
        <Card.Body>
          <Card.Title>{restaurant.name}</Card.Title>
          <Card.Text><strong>Location:</strong> {restaurant.location}</Card.Text>
          <Card.Text><strong>Description:</strong> {restaurant.description}</Card.Text>
          <Card.Text><strong>Rating:</strong> {restaurant.rating}</Card.Text>
        </Card.Body>
      </Card>

      <h3 className="mt-4">Menu</h3>
      <Row>
        {restaurant.menuItems && restaurant.menuItems.length > 0 ? (
          restaurant.menuItems.map((item) => (
            <Col md={4} key={item.id} className="mb-3">
              <Card className="h-100">
                <Card.Img 
                  variant="top" 
                  src={item.imageUrl || 'https://via.placeholder.com/150'} 
                  alt={item.name} 
                  style={{ height: '200px', objectFit: 'cover' }} 
                /> {/* Display item image */}
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Card.Text><strong>Price:</strong> ₹{item.price}</Card.Text>
                  <Button variant="primary" onClick={() => handleAddToCart(item)}>
                    Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No menu items available.</p>
        )}
      </Row>
    </Container>
  );
}

export default RestaurantDetail;
