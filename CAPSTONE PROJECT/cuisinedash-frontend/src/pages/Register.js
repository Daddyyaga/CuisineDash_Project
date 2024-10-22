import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Register.css';

function Register() {
  const { handleRegister } = useContext(AuthContext); // Use handleRegister from AuthContext

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    address: ''
  });
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // State to show/hide the popup
  const [registeredUser, setRegisteredUser] = useState(''); // To store the registered user's name
  const [validationError, setValidationError] = useState(null); // Validation error for short username/password

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if username and password are at least 7 characters long
    if (formData.username.length < 7 || formData.password.length < 7) {
      setValidationError('Username and password must be at least 7 characters long.');
      return; // Stop submission if validation fails
    }

    try {
      const customerData = { ...formData, role: 'Customer' }; // Role is always 'Customer'
      await handleRegister(customerData); // Call handleRegister from context
      setRegisteredUser(formData.username); // Set the registered username

      // Show the toast success message and the popup
      toast.success(`Registered successfully as ${formData.username}!`);

      // Set popup visibility to true after successful registration
      setShowPopup(true);

      setValidationError(null); // Clear any validation error
    } catch (err) {
      setError(err.message); // Display error if registration fails
    }
  };

  const handleExplore = () => {
    setShowPopup(false); // Hide the popup before navigating
    window.location.href = '/restaurants'; // Navigate to restaurant list page only after clicking the button
  };

  return (
    <div className="register-page">
      <div className="form-container">
        <div className="card shadow-lg p-4 bg-white rounded" style={{ width: '400px' }}>
          <h2 className="text-center mb-4">Register as Customer</h2>
          {error && <p className="text-danger text-center">{error}</p>}
          {validationError && <p className="text-warning text-center">{validationError}</p>} {/* Validation error display */}
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="address" className="form-label">Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Register</button>
          </form>
        </div>
      </div>

      <ToastContainer /> {/* Toast container to show success message */}

      {/* Popup modal after successful registration */}
      {showPopup && (
        <div className="popup d-flex align-items-center justify-content-center">
          <div className="popup-content p-4 text-center bg-white rounded shadow-lg">
            <h3>Welcome, {registeredUser}!</h3>
            <p>You have registered successfully.</p>
            <button onClick={handleExplore} className="btn btn-success mt-3">
              Let's Explore
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
