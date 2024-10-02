
import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; 

export const getRestaurants = async (page = 1, itemsPerPage = 10) => {
  const response = await axios.get(`${API_URL}/restaurants?page=${page}&limit=${itemsPerPage}`);
  return response.data;
};

export const getRestaurantById = async (id) => {
  const response = await axios.get(`${API_URL}/restaurants/${id}`);
  return response.data;
};

export const searchRestaurantsByLocation = async (latitude, longitude) => {
  const response = await axios.get(`${API_URL}/restaurants/search/location`, {
    params: { latitude, longitude }
  });
  return response.data;
};

export const advancedSearchRestaurants = async (country,name,maxSpend,cuisine) => {
  
  const response = await axios.get(`${API_URL}/advance`, { params: {country,name,maxSpend,cuisine }});
  return response.data;
  
};

export const searchImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await axios.post(`${API_URL}/search/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};