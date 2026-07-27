/**
 * seed.js - Run this script to seed initial database records with high-res Unsplash photography
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Destination = require("./models/Destination");
const Booking = require("./models/Booking");
const Itinerary = require("./models/Itinerary");

async function seed() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");

  // Clear old data
  await User.deleteMany({});
  await Destination.deleteMany({});
  await Booking.deleteMany({});
  await Itinerary.deleteMany({});

  // Create admin user
  const salt = await bcrypt.genSalt(10);
  const admin = await User.create({
    name: "Admin",
    email: "admin@incargo.com",
    password: await bcrypt.hash("admin123", salt),
    role: "admin",
  });
  console.log("Admin created:", admin.email);

  // Create sample regular users
  const users = await User.insertMany([
    { name: "Alice Smith", email: "alice@example.com", password: await bcrypt.hash("user123", salt), role: "user" },
    { name: "Bob Jones", email: "bob@example.com", password: await bcrypt.hash("user123", salt), role: "user" },
    { name: "Carol White", email: "carol@example.com", password: await bcrypt.hash("user123", salt), role: "user" },
    { name: "David Brown", email: "david@example.com", password: await bcrypt.hash("user123", salt), role: "user" },
    { name: "Eva Green", email: "eva@example.com", password: await bcrypt.hash("user123", salt), role: "user" },
  ]);
  console.log("Sample users created:", users.length);

  // Create sample destinations with reliable Unsplash photography
  const destinations = await Destination.insertMany([
    {
      title: "Taj Mahal",
      location: "Agra, India",
      description: "One of the Seven Wonders of the World, an iconic marble mausoleum.",
      price: 5000,
      category: "Heritage",
      imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Goa Beaches",
      location: "Goa, India",
      description: "Beautiful sandy beaches with clear water, palm trees, and vibrant nightlife.",
      price: 8000,
      category: "Beach",
      imageUrl: "https://images.unsplash.com/photo-1512343800234-882532367801?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Manali Hills",
      location: "Himachal Pradesh, India",
      description: "Snow-capped mountains, scenic pine valleys, and thrilling adventure sports.",
      price: 12000,
      category: "Adventure",
      imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Kerala Backwaters",
      location: "Kerala, India",
      description: "Serene luxury houseboats, emerald palm groves, and quiet canals.",
      price: 10000,
      category: "Nature",
      imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Jaipur Fort",
      location: "Jaipur, India",
      description: "Majestic forts, grand palaces, and royal heritage of the Pink City.",
      price: 6000,
      category: "Heritage",
      imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Paris Eiffel Tower",
      location: "Paris, France",
      description: "Romantic city of lights, legendary art museums, and gourmet dining.",
      price: 45000,
      category: "City",
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Burj Khalifa Dubai",
      location: "Dubai, UAE",
      description: "Futuristic skyscrapers, luxury shopping, and golden desert safaris.",
      price: 35000,
      category: "City",
      imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Bali Island",
      location: "Bali, Indonesia",
      description: "Tropical island paradise with lush rice terraces and ancient sea temples.",
      price: 28000,
      category: "Beach",
      imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    },
  ]);
  console.log("Sample destinations created:", destinations.length);

  // Create sample bookings spread across last 6 months
  const statuses = ["Pending", "Confirmed", "Cancelled"];
  const bookingsData = [];
  for (let i = 0; i < 20; i++) {
    const monthsAgo = Math.floor(Math.random() * 6);
    const bookingDate = new Date();
    bookingDate.setMonth(bookingDate.getMonth() - monthsAgo);

    bookingsData.push({
      user: users[i % users.length]._id,
      destination: destinations[i % destinations.length]._id,
      bookingDate,
      status: statuses[i % 3],
      totalAmount: destinations[i % destinations.length].price * (Math.floor(Math.random() * 3) + 1),
      createdAt: bookingDate,
    });
  }
  await Booking.insertMany(bookingsData);
  console.log("Sample bookings created: 20");

  // Create sample itineraries
  await Itinerary.insertMany([
    { user: users[0]._id, title: "3 Days in Goa", destination: "Goa", days: 3 },
    { user: users[1]._id, title: "Manali Adventure Week", destination: "Manali", days: 7 },
    { user: users[2]._id, title: "Kerala Backwater Tour", destination: "Kerala", days: 5 },
  ]);
  console.log("Sample itineraries created: 3");

  console.log("\n✅ Seed complete!");
  console.log("Admin login: admin@incargo.com / admin123");
  mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed error:", err);
  mongoose.disconnect();
});
