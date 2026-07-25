/**
 * seed.js - Run this script ONCE to create:
 *   1. An admin user (email: admin@incargo.com, password: admin123)
 *   2. Some sample destinations, bookings, and itineraries
 *
 * Usage: node seed.js
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Destination = require("./models/Destination");
const Booking = require("./models/Booking");
const Itinerary = require("./models/Itinerary");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
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

  // Create sample destinations
  const destinations = await Destination.insertMany([
    { title: "Taj Mahal", location: "Agra, India", description: "One of the Seven Wonders of the World.", price: 5000, category: "Heritage", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/800px-Taj_Mahal_%28Edited%29.jpeg" },
    { title: "Goa Beaches", location: "Goa, India", description: "Beautiful sandy beaches with clear water.", price: 8000, category: "Beach", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Candolim-beach-Goa-India.jpg/800px-Candolim-beach-Goa-India.jpg" },
    { title: "Manali Hills", location: "Himachal Pradesh, India", description: "Snow-capped mountains and adventure sports.", price: 12000, category: "Adventure", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Manali.jpg/800px-Manali.jpg" },
    { title: "Kerala Backwaters", location: "Kerala, India", description: "Serene houseboats and lush greenery.", price: 10000, category: "Nature", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Houseboats_on_Kerala_backwaters.jpg/800px-Houseboats_on_Kerala_backwaters.jpg" },
    { title: "Jaipur Fort", location: "Jaipur, India", description: "Majestic forts and palaces of the Pink City.", price: 6000, category: "Heritage", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Amer_Fort%2C_Jaipur.jpg/800px-Amer_Fort%2C_Jaipur.jpg" },
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
