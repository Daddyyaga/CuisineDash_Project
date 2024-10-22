import axios from 'axios';

const API_URL = 'https://localhost:7228/api/';

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}account/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to login');
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}account/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to register');
  }
};
