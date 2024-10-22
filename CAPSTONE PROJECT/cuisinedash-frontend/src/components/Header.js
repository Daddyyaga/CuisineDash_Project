import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../context/AuthContext';
import './Header.css'; // For popup styling

function Header() {
  const { user, handleLogout } = useContext(AuthContext); // Get user and logout function from context
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const navigate = useNavigate(); // Hook for navigation

  const handleLogoutClick = () => {
    handleLogout(); // Call the logout function to clear session and log out
    setShowPopup(true); // Show the popup with custom message
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Hide the popup when clicking "Close" button
    navigate('/'); // Redirect to homepage
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="/">CuisineDash</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>

            {/* Conditionally render Restaurants link: Show for no login and customer, hide for admin */}
            {(!user || user.role === 'Customer') && (
              <Nav.Link as={Link} to="/restaurants">Restaurants</Nav.Link>
            )}

            {/* Conditionally render links based on user state */}
            {user ? (
              <>
                {/* Show Cart link only if the user is a Customer */}
                {user.role === 'Customer' && (
                  <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
                )}
                {/* Show Admin Dashboard only if the user is an admin */}
                {user.role === 'Admin' && (
                  <Nav.Link as={Link} to="/admin">Admin Dashboard</Nav.Link>
                )}
                <Nav.Link as={Link} to="#" onClick={handleLogoutClick}>Logout</Nav.Link> {/* Logout button */}
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Toast container for success message */}
      <ToastContainer /> {/* This should always be present, and it will display toasts if needed */}

      {/* Popup modal after logout */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            {user && user.role === 'Admin' ? (
              <>
                <h3>Admin Logged Out</h3>
                <p>You have successfully logged out as an Admin.</p>
              </>
            ) : (
              <>
                <h3>Hope You Come Back Soon!</h3>
                <p>We're sad to see you go. Hope to see you again soon!</p>
              </>
            )}
            <button onClick={handleClosePopup}>Go to Homepage</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
