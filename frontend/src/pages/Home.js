import React from 'react';
import RestaurantList from './RestaurantList';

const Home = () => (
  <div className="container mx-auto p-4">
    <h1 className="text-3xl font-bold mb-5 mt-5 text-center">Welcome to Zomato Restaurant Finder</h1>
    <RestaurantList />
  </div>
);

export default Home;