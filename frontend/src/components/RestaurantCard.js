import React from "react";
import { Link } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  const rating = restaurant.user_rating.aggregate_rating;
  const ratingColor =
    rating >= 4 ? "bg-green-500" : rating >= 3 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={restaurant.featured_image}
        alt={restaurant.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{restaurant.name}</h3>
          <span
            className={`${ratingColor} text-white px-2 py-1 rounded-full text-sm font-bold`}
          >
            {rating}
          </span>
        </div>
        <p className="text-gray-600 mb-2">{restaurant.cuisines.join(", ")}</p>
        <p className="text-gray-700 mb-2">{restaurant.location.address}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium">
            {restaurant.currency} {restaurant.average_cost_for_two} for two
          </span>
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
        <Link
          to={`/restaurants/${restaurant.restaurant_id}`}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors inline-block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;
