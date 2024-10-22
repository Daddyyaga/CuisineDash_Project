import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext'; // Import AuthContext for user role
import { useNavigate } from 'react-router-dom'; // For redirection
import { Button, Form, Alert, Table } from 'react-bootstrap'; // Bootstrap components for better UI

const AdminMenuItem = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    restaurantId: '',
    imageUrl: '' // New Image URL field
  });
  const [editingMenuItemId, setEditingMenuItemId] = useState(null); // Track which item is being edited
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext); // Get user from AuthContext
  const navigate = useNavigate(); // For redirection

  useEffect(() => {
    // Redirect to login if the user is not an admin
    if (!user || user.role !== 'Admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Fetch all menu items if the user is an admin
    const fetchMenuItems = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from local storage
        const config = {
          headers: {
            Authorization: `Bearer ${token}` // Include token in Authorization header
          }
        };
        const response = await axios.get('https://localhost:7228/api/admin/menuitems', config);
        setMenuItems(response.data.$values); // Accessing the $values array
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    if (user && user.role === 'Admin') {
      fetchMenuItems();
    }
  }, [user]);

  const handleInputChange = (e) => {
    setNewMenuItem({
      ...newMenuItem,
      [e.target.name]: e.target.value
    });
  };

  const handleAddOrUpdateMenuItem = async () => {
    if (!newMenuItem.name || !newMenuItem.description || !newMenuItem.price || !newMenuItem.restaurantId || !newMenuItem.imageUrl) {
      setError('All fields, including Image URL, are required.');
      return;
    }
    setError('');
    try {
      const token = localStorage.getItem('token'); // Get the token from local storage
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      };

      // Ensure the price is converted to a number
      const menuItemData = {
        ...newMenuItem,
        price: parseFloat(newMenuItem.price), // Parse price to ensure it's a float
      };

      if (editingMenuItemId) {
        // If editing, update the menu item
        await axios.put(`https://localhost:7228/api/admin/update-menuitem/${editingMenuItemId}`, menuItemData, config);
        setMenuItems(menuItems.map(item => item.id === editingMenuItemId ? { ...item, ...menuItemData } : item));
        setEditingMenuItemId(null); // Reset after update
      } else {
        // Add a new menu item
        const response = await axios.post('https://localhost:7228/api/admin/add-menuitem', menuItemData, config);
        // After adding menu item, update the list
        setMenuItems([...menuItems, response.data]);
      }

      setNewMenuItem({ name: '', description: '', price: '', restaurantId: '', imageUrl: '' }); // Reset the form
    } catch (error) {
      console.error('Error adding/updating menu item:', error.response?.data || error.message);
    }
  };

  const handleEditMenuItem = (menuItem) => {
    setEditingMenuItemId(menuItem.id);
    setNewMenuItem({
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      restaurantId: menuItem.restaurantId,
      imageUrl: menuItem.imageUrl  // Set the image URL when editing
    });
  };

  const handleDeleteMenuItem = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Get the token from local storage
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      };
      await axios.delete(`https://localhost:7228/api/admin/delete-menuitem/${id}`, config);
      setMenuItems(menuItems.filter(item => item.id !== id)); // Remove from the list
    } catch (error) {
      console.error('Error deleting menu item:', error.response?.data || error.message);
    }
  };

  if (!user || user.role !== 'Admin') {
    return null; // Don't render anything if the user is not an admin
  }

  return (
    <div className="container mt-4">
      <h1>Manage Menu Items</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <h3 className="mt-4">{editingMenuItemId ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
      <Form>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={newMenuItem.name}
            onChange={handleInputChange}
            placeholder="Name"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={newMenuItem.description}
            onChange={handleInputChange}
            placeholder="Description"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={newMenuItem.price}
            onChange={handleInputChange}
            placeholder="Price"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formRestaurantId">
          <Form.Label>Restaurant ID</Form.Label>
          <Form.Control
            type="text"
            name="restaurantId"
            value={newMenuItem.restaurantId}
            onChange={handleInputChange}
            placeholder="Restaurant ID"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formImageUrl">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            name="imageUrl"
            value={newMenuItem.imageUrl}
            onChange={handleInputChange}
            placeholder="Image URL"
          />
        </Form.Group>

        <Button variant="primary" onClick={handleAddOrUpdateMenuItem}>
          {editingMenuItemId ? 'Update Menu Item' : 'Add Menu Item'}
        </Button>
      </Form>

      <h3 className="mt-4">Menu Item List</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Restaurant ID</th>
            <th>Image</th> {/* New column for image */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.price}</td>
              <td>{item.restaurantId}</td>
              <td>
                <img src={item.imageUrl} alt={item.name} style={{ width: '100px', height: 'auto' }} /> {/* Display image */}
              </td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEditMenuItem(item)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDeleteMenuItem(item.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminMenuItem;
