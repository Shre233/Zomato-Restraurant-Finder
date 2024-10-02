import React, { useState } from 'react';
import { advancedSearchRestaurants } from '../api';
import RestaurantCard from './RestaurantCard';

export default function AdvancedFilterSearch() {
  const [filters, setFilters] = useState({
    country: '',
    name: '',
    maxSpend: '',
    cuisine: '',
  });
  const [restaurants, setRestaurants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const restaurantsPerPage = 12;

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const results = await advancedSearchRestaurants(filters.country, filters.name, filters.maxSpend, filters.cuisine);
      setRestaurants(results);
      setIsLoading(false);
      setCurrentPage(1); 
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };


  const indexOfLastRestaurant = currentPage * restaurantsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
  const currentRestaurants = restaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);



  const handleNextPage = () => {
    if (currentPage < Math.ceil(restaurants.length / restaurantsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <select 
          name="country" 
          onChange={handleFilterChange} 
          className="p-2 border rounded"
          value={filters.country}
        >
          <option value="">All Countries</option>
          <option value="1">India</option>
          <option value="14">Australia</option>
          <option value="30">Brazil</option>
          <option value="37">Canada</option>
          <option value="94">Indonesia</option>
          <option value="148">New Zealand</option>
          <option value="162">Philippines</option>
          <option value="166">Qatar</option>
          <option value="184">Singapore</option>
          <option value="189">South Africa</option>
          <option value="191">Sri Lanka</option>
          <option value="208">Turkey</option>
          <option value="214">UAE</option>
          <option value="215">United Kingdom</option>
          <option value="216">United States</option>
        </select>
        <input
          type="text"
          name="name"
          placeholder="Restaurant Name"
          onChange={handleFilterChange}
          className="p-2 border rounded"
          value={filters.name}
        />
        <input
          type="number"
          name="maxSpend"
          placeholder="Max Average Spend for Two"
          onChange={handleFilterChange}
          className="p-2 border rounded"
          value={filters.maxSpend}
        />
        <input
          type="text"
          name="cuisine"
          placeholder="Cuisine"
          onChange={handleFilterChange}
          className="p-2 border rounded"
          value={filters.cuisine}
        />
      </div>

      <button
        onClick={handleSearch}
        className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors mb-4"
        disabled={isLoading}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {currentRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.restaurant_id} restaurant={restaurant} />
            ))}
          </div>

          {restaurants.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200' : 'bg-red-600 text-white hover:bg-red-700'}`}
              >
                Previous
              </button>

              <button
                onClick={handleNextPage}
                disabled={currentPage === Math.ceil(restaurants.length / restaurantsPerPage)}
                className={`px-3 py-1 rounded ${currentPage === Math.ceil(restaurants.length / restaurantsPerPage) ? 'bg-gray-200' : 'bg-red-600 text-white hover:bg-red-700'}`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
