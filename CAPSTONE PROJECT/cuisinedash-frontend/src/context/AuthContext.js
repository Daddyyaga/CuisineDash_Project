import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Use navigate within the Router context

  useEffect(() => {
    // Retrieve saved user and token from localStorage on app load
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser) {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
      }
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const data = await login(username, password);
      if (data && data.user && data.token) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user)); // Save user data to localStorage
        localStorage.setItem('token', data.token); // Save JWT token for future requests

        console.log(`Login successful: Welcome ${data.user.username}!`); // Log successful login

      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await register(userData);
      const { token, user } = response;
      localStorage.setItem('token', token); // Save JWT token
      localStorage.setItem('user', JSON.stringify(user)); // Save user data to localStorage
      setUser(user);

      console.log(`Registration successful: Welcome ${user.username}!`); // Log successful registration

    
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Remove token on logout
    console.log('Logout successful');
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleRegister, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
