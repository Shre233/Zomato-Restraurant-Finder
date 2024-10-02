import React, { useState } from "react";
import { searchImage } from "../api.js"; // Import the function from api.js
import RestaurantCard from "../components/RestaurantCard.js";

const SearchImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
 
  const [currentPage, setCurrentPage] = useState(1);

  const restaurantsPerPage = 12; // Number of restaurants per page

  const handleImageUpload = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    setIsLoading(true);

    try {
      const data = await searchImage(selectedImage, currentPage); 
      // console.log(data);

      setResult(data.cuisine); // Cuisine detected by Gemini API
      setRestaurants(data.restaurants); // Restaurants serving the cuisine
      setCurrentPage(1); 
    } catch (error) {
      console.error("Error uploading image:", error);
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
      <input type="file" onChange={handleImageUpload} />
      <button
        onClick={handleSubmit}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        {isLoading ? "Processing..." : "Identify Dish"}
      </button>

      {result && (
        <div className="mt-4 container mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4">Cuisine Type: {result}</h2>
          <div className="mt-4">
            {restaurants.length > 0 ? (
              <div>
                <h3 className="text-l font-bold mb-2">Restaurants Serving {result}:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {currentRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.restaurant_id}
                      restaurant={restaurant}
                    />
                  ))}
                </div>

                
                {restaurants.length > 0 && (
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded ${
                        currentPage === 1
                          ? "bg-gray-200"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      Previous
                    </button>

                    <button
                      onClick={handleNextPage}
                      disabled={
                        currentPage ===
                        Math.ceil(restaurants.length / restaurantsPerPage)
                      }
                      className={`px-3 py-1 rounded ${
                        currentPage ===
                        Math.ceil(restaurants.length / restaurantsPerPage)
                          ? "bg-gray-200"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p>No restaurants found for this cuisine.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchImage;
