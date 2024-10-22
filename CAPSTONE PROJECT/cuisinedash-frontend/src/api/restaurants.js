import axios from 'axios';

//const API_URL = 'https://localhost:7228/api/';

export const getRestaurants = async () => {
  try {
    const response = await axios.get(`https://localhost:7228/api/Restaurant`);
    return response.data.$values; // Adjust this based on the API response
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch restaurants');
  }
};

// New function to get restaurant by ID
export const getRestaurantById = async (id) => {
  try {
    const response = await axios.get(`https://localhost:7228/api/Restaurant/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch restaurant details');
  }
};
