import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantById } from '../api';

const StarIcon = ({ filled }) => (
  <svg
    className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <StarIcon key={index} filled={index < fullStars || (index === fullStars && hasHalfStar)} />
      ))}
    </div>
  );
};

const CuisineIcon = () => (
  <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRestaurantById(id);
      setRestaurant(data);
    };

    fetchData();
  }, [id]);

  if (!restaurant) return <div className="text-center p-8">Loading...</div>;

  const rating = parseFloat(restaurant.user_rating.aggregate_rating);
  const ratingColor = rating >= 4 ? 'bg-green-500' : rating >= 3 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="restaurant-detail container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <img src={restaurant.featured_image} alt={restaurant.name} className="w-full h-80 object-cover" />
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{restaurant.name}</h1>
            <div className="flex flex-col items-end">
              <span className={`${ratingColor} text-white px-3 py-1 rounded-full text-lg font-bold mb-1`}>
                {rating}
              </span>
              <RatingStars rating={rating} />
            </div>
          </div>
          <p className="text-gray-600 mb-2">
            <CuisineIcon />
            {restaurant.cuisines.join(', ')}
          </p>
          <p className="text-gray-700 mb-4">
            <LocationIcon />
            {restaurant.location.address}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Details</h2>
              <p className="mb-2">
                <span className="font-medium">Average cost for two:</span> {restaurant.currency} {restaurant.average_cost_for_two}
              </p>
              <p className="mb-2">
                <span className="font-medium">User Rating:</span> {restaurant.user_rating.rating_text}
              </p>
              <div className="flex space-x-2">
                {restaurant.has_online_delivery === 1 && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    Online Delivery
                  </span>
                )}
                {restaurant.has_table_booking === 1 && (
                  <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    Table Booking
                  </span>
                )}
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Photos</h2>
              <a 
                href={restaurant.photos_url} 
                target="_blank" 
                rel="noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors inline-block text-center"
              >
                View Full Gallery
              </a>
            </div>
          </div>
          
          <div className="flex gap-4 mb-6">
            <a
              href={restaurant.book_url}
              target="_blank"
              rel="noreferrer"
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-block flex-1 text-center font-semibold"
            >
              Book a Table
            </a>
            <a
              href={restaurant.menu_url}
              target="_blank"
              rel="noreferrer"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors inline-block flex-1 text-center font-semibold"
            >
              View Menu
            </a>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-gray-700">
              Explore the delightful cuisine at {restaurant.name}. With a wide range of {restaurant.cuisines.join(', ')} dishes, 
              we offer a unique dining experience. Our restaurant is known for its {restaurant.user_rating.rating_text} ratings 
              and affordable prices, with an average cost of {restaurant.currency} {restaurant.average_cost_for_two} for two.
              {restaurant.has_online_delivery === 1 && " We also offer convenient online delivery service."}
              {restaurant.has_table_booking === 1 && " For a more personal experience, you can book a table in advance."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;