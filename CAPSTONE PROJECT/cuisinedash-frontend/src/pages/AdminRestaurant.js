import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Image, Form, Row, Col } from 'react-bootstrap';  // Import Bootstrap components

const AdminRestaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    location: '',
    description: '',
    rating: '',
    address: '',
    imageUrl: ''  // Image URL field
  });
  const [editingRestaurantId, setEditingRestaurantId] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get('https://localhost:7228/api/admin/restaurants', config);
        setRestaurants(response.data.$values || response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error.response?.data || error.message);
      }
    };

    if (user && user.role === 'Admin') {
      fetchRestaurants();
    }
  }, [user]);

  const handleInputChange = (e) => {
    setNewRestaurant({
      ...newRestaurant,
      [e.target.name]: e.target.value
    });
  };

  const handleAddOrUpdateRestaurant = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const restaurantData = {
        name: newRestaurant.name,
        location: newRestaurant.location,
        description: newRestaurant.description,
        rating: parseFloat(newRestaurant.rating),
        address: newRestaurant.address,
        imageUrl: newRestaurant.imageUrl,  // Ensure image URL is included
        isDeleted: false,
      };

      if (editingRestaurantId) {
        const response = await axios.put(
          `https://localhost:7228/api/admin/update-restaurant/${editingRestaurantId}`,
          restaurantData,
          config
        );
        setRestaurants(restaurants.map(restaurant => restaurant.id === editingRestaurantId ? response.data : restaurant));
        setEditingRestaurantId(null);  // Reset after update
      } else {
        const response = await axios.post('https://localhost:7228/api/admin/add-restaurant', restaurantData, config);
        setRestaurants([...restaurants, response.data]);  // Update the list with the new restaurant
      }

      setNewRestaurant({ name: '', location: '', description: '', rating: '', address: '', imageUrl: '' });
    } catch (error) {
      console.error('Error adding/updating restaurant:', error.response?.data || error.message);
    }
  };

  const handleEditRestaurant = (restaurant) => {
    setEditingRestaurantId(restaurant.id);
    setNewRestaurant({
      name: restaurant.name,
      location: restaurant.location,
      description: restaurant.description,
      rating: restaurant.rating,
      address: restaurant.address,
      imageUrl: restaurant.imageUrl  // Set image URL when editing
    });
  };

  const handleDeleteRestaurant = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`https://localhost:7228/api/admin/delete-restaurant/${id}`, config);
      setRestaurants(restaurants.filter(restaurant => restaurant.id !== id));
    } catch (error) {
      console.error('Error deleting restaurant:', error.response?.data || error.message);
    }
  };

  const cancelEdit = () => {
    setEditingRestaurantId(null);
    setNewRestaurant({ name: '', location: '', description: '', rating: '', address: '', imageUrl: '' });
  };

  if (!user || user.role !== 'Admin') {
    return null;
  }

  return (
    <div>
      <h1 className="mb-4">Manage Restaurants</h1>

      <h3>{editingRestaurantId ? 'Edit Restaurant' : 'Add New Restaurant'}</h3>
      <Form className="mb-4">
        <Row>
          <Col>
            <Form.Control
              name="name"
              value={newRestaurant.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="mb-2"
            />
          </Col>
          <Col>
            <Form.Control
              name="location"
              value={newRestaurant.location}
              onChange={handleInputChange}
              placeholder="Location"
              className="mb-2"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Control
              name="description"
              value={newRestaurant.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="mb-2"
            />
          </Col>
          <Col>
            <Form.Control
              name="rating"
              value={newRestaurant.rating}
              onChange={handleInputChange}
              placeholder="Rating"
              type="number"
              className="mb-2"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Control
              name="address"
              value={newRestaurant.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="mb-2"
            />
          </Col>
          <Col>
            <Form.Control
              name="imageUrl"
              value={newRestaurant.imageUrl}
              onChange={handleInputChange}
              placeholder="Image URL"
              className="mb-2"
            />
          </Col>
        </Row>
        <div>
          <Button
            variant={editingRestaurantId ? "primary" : "success"}
            onClick={handleAddOrUpdateRestaurant}
            className="me-2"
          >
            {editingRestaurantId ? 'Update Restaurant' : 'Add Restaurant'}
          </Button>
          {editingRestaurantId && (
            <Button variant="secondary" onClick={cancelEdit}>
              Cancel Edit
            </Button>
          )}
        </div>
      </Form>

      <h3>Restaurant List</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Description</th>
            <th>Rating</th>
            <th>Address</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {restaurants && restaurants.length > 0 ? (
            restaurants.map(restaurant => (
              <tr key={restaurant.id}>
                <td>{restaurant.name}</td>
                <td>{restaurant.location}</td>
                <td>{restaurant.description}</td>
                <td>{restaurant.rating}</td>
                <td>{restaurant.address}</td>
                <td>
                  <Image src={restaurant.imageUrl} alt={restaurant.name} style={{ width: '100px', height: 'auto' }} />
                </td>
                <td>
                  <Button variant="warning" onClick={() => handleEditRestaurant(restaurant)} className="me-2">
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteRestaurant(restaurant.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No restaurants found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminRestaurant;
