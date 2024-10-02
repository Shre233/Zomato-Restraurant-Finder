const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const loadRestaurantData = async () => {
  const filePath = path.join(__dirname, '../../Dataset/file1.json'); 
  const fileData = fs.readFileSync(filePath, 'utf-8');
  const jsonData = JSON.parse(fileData);
    // console.log(jsonData);
    
  for (const item of jsonData) {

    for (const i of item.restaurants) {
      
        const data = i.restaurant;

        const restaurantId = data.R.res_id.toString();
        const restaurantName = data.name;
      
        const resData = {
            restaurant_id: restaurantId,
            name: restaurantName,
            has_online_delivery: data.has_online_delivery ?? 0,
            photos_url: data.photos_url ?? '',
            url: data.url ?? '',
            user_rating: data.user_rating ?? {},
            cuisines: data.cuisines ? data.cuisines.split(',').map(cuisine => cuisine.trim()) : [],
            average_cost_for_two: data.average_cost_for_two ?? 0,
            has_table_booking: data.has_table_booking ?? 0,
            location: {
              latitude: data.location?.latitude ? parseFloat(data.location.latitude) : 0,
              longitude: data.location?.longitude ? parseFloat(data.location.longitude) : 0,
              address: data.location?.address ?? '',
              city: data.location?.city ?? '',
              country_id: data.location?.country_id ?? 0,
              locality: data.location?.locality ?? '',
            },
            featured_image: data.featured_image ?? '',
            currency: data.currency ?? '',
            book_url: data.book_url ?? '',
            menu_url: data.menu_url ?? '',
        }; 

        try {
            // Check if the restaurant with the same restaurant_id already exists
            const existingRestaurant = await prisma.restaurant.findFirst({
                where: {
                    restaurant_id: restaurantId ,
                }
            });

            if (existingRestaurant) {
                console.log(`Skipping duplicate restaurant: ${restaurantId}`);
                continue; 
            }

            // Create new restaurant entry 
            await prisma.restaurant.create({
                data: resData,
            });

        } catch (error) {
            console.error(`Error processing restaurant with id ${restaurantId}:`, error);
        }
    }
  }
};

loadRestaurantData()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
