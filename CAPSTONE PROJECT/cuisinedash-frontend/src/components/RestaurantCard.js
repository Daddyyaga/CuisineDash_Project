import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Col } from 'react-bootstrap';
import './RestaurantCard.css';  // Import the CSS file

function RestaurantCard({ restaurant }) {
  return (
    <Col md={4} className="mb-4">
      <Card>
        <Card.Img
          variant="top"
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="restaurant-card-img"  // Apply the CSS class
        />
        <Card.Body>
          <Card.Title>{restaurant.name}</Card.Title>
          <Card.Text>{restaurant.location}</Card.Text>
          <Card.Text>Rating: {restaurant.rating}</Card.Text>
          <Button variant="primary" as={Link} to={`/restaurants/${restaurant.id}`}>
            View Details
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default RestaurantCard;
