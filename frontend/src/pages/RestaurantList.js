import React, { useEffect, useState } from 'react';
import { getRestaurants } from '../api';
import RestaurantCard from '../components/RestaurantCard';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const itemsPerPage = 12; // Number of restaurants per page

  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await getRestaurants(page, itemsPerPage); //to api.js
      setRestaurants(data);
      setHasMore(data.length === itemsPerPage);
    };

    fetchRestaurants();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Restaurant List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {restaurants.map(restaurant => (
          <RestaurantCard key={restaurant.restaurant_id} restaurant={restaurant} />
        ))}
      </div>
      <div className="text-center flex justify-center space-x-4">
        <button
          onClick={handlePreviousPage}
          className={`bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors ${page === 1 && 'opacity-50 cursor-not-allowed'}`}
          disabled={page === 1} // Disable the "Previous" button on the first page
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className={`bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors ${!hasMore && 'opacity-50 cursor-not-allowed'}`}
          disabled={!hasMore} // Disable the "Next" button when there are no more restaurants
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RestaurantList;
