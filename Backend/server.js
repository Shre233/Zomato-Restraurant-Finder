const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const prisma = new PrismaClient();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const multer = require('multer'); // For handling file uploads
const upload = multer({ dest: 'uploads/' }); // Save uploaded images to 'uploads/' directory
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const fileManager=new GoogleAIFileManager(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });



app.use(cors());
app.use(bodyParser.json());


// Route to get a list of restaurants 
app.get('/api/restaurants', async (req, res) => {
  const { page = 1, pageSize = 12 } = req.query;

  try {
    const restaurants = await prisma.restaurant.findMany({
      skip: (page - 1) * pageSize,
      take: parseInt(pageSize, 10),
    });

    res.json(restaurants);
  } catch (error) {
        console.error('Error retrieving list of restaurants:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// Route to get a restaurant by ID
app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { restaurant_id: req.params.id },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
        console.error('Error retrieving restaurant by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance; // distance in km
}

app.get('/api/restaurants/search/location', async (req, res) => {

  const { latitude, longitude} = req.query;
  const radius=3;
  console.log(latitude,longitude);
  
  if (!latitude || !longitude || !radius) {
    return res.status(400).json({ message: 'Latitude, longitude, and radius are required' });
  }

  try {
    const restaurants = await prisma.restaurant.findMany();
    const radiusInKm = parseFloat(radius);
    const filteredRestaurants = restaurants.filter((restaurant) => {
      const { latitude: restaurantLat, longitude: restaurantLng } = restaurant.location;
      if (restaurantLat && restaurantLng) {
        const distance = calculateDistance(latitude, longitude, restaurantLat, restaurantLng);
        return distance <= radiusInKm;
      }
      return false;
    });
    console.log("Done");
    res.json(filteredRestaurants);
  } catch (error) {
    console.error('Error searching restaurants by location:', error);
    res.status(500).json({ error: 'Error searching restaurants by location' });
  }
});



app.get('/api/advance', async (req, res) => {
  const { country, name, maxSpend, cuisine } = req.query;
  try {
    let query = {};
    
    if (name && name !== '') {
      query.name = { contains: name, mode: 'insensitive' };
    }

    if (maxSpend && maxSpend !== '') {
      query.average_cost_for_two = { lte: parseInt(maxSpend) };
    }

    if (cuisine && cuisine !== '') {
      query.cuisines = { hasSome: [cuisine] };
    }
    
    let restaurants=[]
    if(cuisine !== ''||name !== ''||maxSpend !== '')
     restaurants = await prisma.restaurant.findMany({
      where: query
    });

    if (country && country !== '') {
      if(cuisine === ''&& name === ''&& maxSpend === '')
      {
        restaurants = await prisma.restaurant.findMany();
      }
      const countryCode = parseInt(country);
      restaurants = restaurants.filter((restaurant) => {
        const { country_id } = restaurant.location || {};
        return country_id === countryCode;
      });
    }
    query={};
    res.json(restaurants);
  } catch (error) {
    console.error('Error searching restaurants:', error);
    res.status(500).json({ error: 'Error searching restaurants' });
  }
});

app.post('/api/search/image', upload.single('image'), async (req, res) => {
  try {
      //Upload the image to the Google API
      console.log(req.file.path)
      const uploadResult = await fileManager.uploadFile(req.file.path, {
          mimeType: req.file.mimetype,
          displayName: req.file.originalname,
      });

      // Use the uploaded image to classify cuisine
      const result = await model.generateContent([
          "Identify the given dish and check if its a dessert , if it is then just return dessert, and if not then return the cuisine which that dish belongs too [Italian, Continental,European,North Indian,South Indian, Japanese,American] just return the cuisine name for example if the answer is Japanese cuisine return Japanese . Also classify the Indian cuisine as North Indian or South Indian",
          {
              fileData: {
                  fileUri: uploadResult.file.uri,
                  mimeType: uploadResult.file.mimeType,
              },
          },
      ]);

      const detectedCuisine = result.response.text().trim(); // Get the classified cuisine
      console.log(detectedCuisine);
      // Find restaurants that serve the detected cuisine
      const restaurants = await prisma.restaurant.findMany({
        where: {
          cuisines: {
            has: detectedCuisine,
          },
        },
      });

      // Optionally delete the uploaded file from local storage after processing
      const fs = require('fs');
      fs.unlinkSync(req.file.path); // Delete the file after processing
      
      
      // Return the found restaurants
      res.json({cuisine:detectedCuisine,restaurants:restaurants});

  } catch (error) {
      console.error("Error during image search:", error);
      res.status(500).json({ message: error.message });
  }
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
