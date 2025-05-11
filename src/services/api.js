// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getPrediction = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/predict`, userData);
    return response.data;
  } catch (error) {
    console.error('Error getting prediction:', error);
    throw error;
  }
};