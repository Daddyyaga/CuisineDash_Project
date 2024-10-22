import React, { useState, useEffect } from 'react';
import { getRestaurants } from '../api/restaurants';
import RestaurantCard from '../components/RestaurantCard';
import { Container, Row, Alert } from 'react-bootstrap';

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Restaurants</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </Row>
    </Container>
  );
}

export default RestaurantList;
