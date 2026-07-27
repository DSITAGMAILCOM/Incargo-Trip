import { useEffect, useState } from "react";
import "./UserDashboard.css";

import UserSidebar from "./UserDashboardComp/UserSidebar";
import UserTopbar from "./UserDashboardComp/UserTopbar";
import UserTripCard from "./UserDashboardComp/UserTripCard";
import UserDestinationCard from "./UserDashboardComp/UserDestinationCard";
import UserTripsTable from "./UserDashboardComp/UserTripsTable";
import UserStatsCard from "./UserDashboardComp/UserStatsCard";
import NewTripForm from "./UserDashboardComp/NewTripForm";
import TripDetailsModal from "./UserDashboardComp/TripDetailsModal";
import UserMap from "./UserDashboardComp/UserMap";
import ExploreModal from "./UserDashboardComp/ExploreModal";
import PackingSection from "./UserDashboardComp/PackingSection";
import CurrencyConverter from "./UserDashboardComp/CurrencyConverter";
import TravelUtilities from "./UserDashboardComp/TravelUtilities";
import ProfileSection from "./UserDashboardComp/ProfileSection";
import SettingsSection from "./UserDashboardComp/SettingsSection";

import {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip
} from "./api/tripApi";
import { getDestinations } from "./api/destinationApi";
import { getBookings } from "./api/bookingApi";

const DEFAULT_USER_TRIPS = [
  {
    tripId: "t1",
    _id: "t1",
    title: "Goa Beach Holiday",
    destination: "Goa, India",
    startDate: "2026-08-10",
    endDate: "2026-08-15",
    status: "upcoming",
    budget: 25000,
    travelers: 2,
    description: "Relaxing beach vacation with water sports, seafood dining, and coastal sunsets."
  },
  {
    tripId: "t2",
    _id: "t2",
    title: "Manali Mountain Retreat",
    destination: "Himachal Pradesh, India",
    startDate: "2026-09-01",
    endDate: "2026-09-07",
    status: "planned",
    budget: 35000,
    travelers: 2,
    description: "Himalayan valley trekking, Solang Valley ropeway, and luxury pine lodge stay."
  },
  {
    tripId: "t3",
    _id: "t3",
    title: "Bali Island Adventure",
    destination: "Bali, Indonesia",
    startDate: "2026-10-15",
    endDate: "2026-10-22",
    status: "planned",
    budget: 65000,
    travelers: 1,
    description: "Ubud rice terrace tour, Tanah Lot sunset, and oceanfront villa getaway."
  }
];

const DEFAULT_DESTINATIONS = [
  { _id: "d1", id: "d1", title: "Goa Beaches", location: "Goa, India", category: "Beach", price: 8000, description: "Sun-kissed beaches, palm trees, and vibrant coastal culture." },
  { _id: "d2", id: "d2", title: "Manali Hills", location: "Himachal Pradesh, India", category: "Adventure", price: 12000, description: "Snow-capped mountain vistas, pine forests, and adventure sports." },
  { _id: "d3", id: "d3", title: "Bali Island", location: "Bali, Indonesia", category: "Beach", price: 28000, description: "Tropical paradise with lush rice terraces and sea temples." },
  { _id: "d4", id: "d4", title: "Paris Eiffel Tower", location: "Paris, France", category: "City", price: 45000, description: "Romantic city of lights, legendary museums, and cafes." },
  { _id: "d5", id: "d5", title: "Burj Khalifa Dubai", location: "Dubai, UAE", category: "City", price: 35000, description: "Futuristic skyscrapers, desert safaris, and luxury shopping." },
  { _id: "d6", id: "d6", title: "Maldives Overwater Resort", location: "Maldives", category: "Nature", price: 65000, description: "Private water villas and turquoise lagoon reefs." },
  { _id: "d7", id: "d7", title: "Santorini Sunset Villa", location: "Santorini, Greece", category: "Nature", price: 52000, description: "Cliffside villas overlooking Mediterranean blue waters." },
  { _id: "d8", id: "d8", title: "Tokyo Shibuya & Fuji", location: "Tokyo, Japan", category: "City", price: 48000, description: "Neon streets, Mt. Fuji vistas, and traditional gardens." }
];

export default function UserDashboard({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [trips, setTrips] = useState(DEFAULT_USER_TRIPS);
  const [destinations, setDestinations] = useState(DEFAULT_DESTINATIONS);
  const [bookings, setBookings] = useState([]);

  const [showTripForm, setShowTripForm] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showTripDetails, setShowTripDetails] = useState(false);

  const [exploreDestination, setExploreDestination] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user")) || user || { name: "Alice Smith", email: "alice@example.com" };

  // Load Dashboard Data
  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [tripsRes, destsRes, bookingsRes] = await Promise.allSettled([
        getTrips(),
        getDestinations(),
        getBookings(),
      ]);

      if (tripsRes.status === "fulfilled" && tripsRes.value?.data) {
        const fetchedTrips = tripsRes.value.data.trips || (Array.isArray(tripsRes.value.data) ? tripsRes.value.data : []);
        setTrips(fetchedTrips.length > 0 ? fetchedTrips : DEFAULT_USER_TRIPS);
      } else {
        setTrips(DEFAULT_USER_TRIPS);
      }

      if (destsRes.status === "fulfilled" && destsRes.value?.data) {
        const fetchedDests = destsRes.value.data.destinations || (Array.isArray(destsRes.value.data) ? destsRes.value.data : []);
        setDestinations(fetchedDests.length > 0 ? fetchedDests : DEFAULT_DESTINATIONS);
      } else {
        setDestinations(DEFAULT_DESTINATIONS);
      }

      if (bookingsRes.status === "fulfilled" && bookingsRes.value?.data) {
        const fetchedBookings = bookingsRes.value.data.bookings || (Array.isArray(bookingsRes.value.data) ? bookingsRes.value.data : []);
        setBookings(fetchedBookings);
      } else {
        setBookings([]);
      }

      setError("");
    } catch (err) {
      console.error("Dashboard data load error:", err);
      setTrips(DEFAULT_USER_TRIPS);
      setDestinations(DEFAULT_DESTINATIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Edit Trip
  const handleEditTrip = (trip) => {
    setSelectedTrip(trip);
    setShowTripForm(true);
  };

  // View Trip details
  const handleViewTrip = (trip) => {
    setSelectedTrip(trip);
    setShowTripDetails(true);
  };

  // Create / Update Trip
  const handleTripSubmit = async (tripData) => {
    try {
      if (selectedTrip) {
        await updateTrip(selectedTrip.tripId, tripData);
        setTrips(prev => prev.map(t => (t.tripId === selectedTrip.tripId || t._id === selectedTrip._id) ? { ...t, ...tripData } : t));
      } else {
        const res = await createTrip(tripData);
        const newTrip = res?.data?.trip || { tripId: Date.now().toString(), _id: Date.now().toString(), status: "upcoming", ...tripData };
        setTrips(prev => [newTrip, ...prev]);
      }

      setSelectedTrip(null);
      setShowTripForm(false);
    } catch (error) {
      // Local optimistic update
      if (selectedTrip) {
        setTrips(prev => prev.map(t => (t.tripId === selectedTrip.tripId || t._id === selectedTrip._id) ? { ...t, ...tripData } : t));
      } else {
        const newTrip = { tripId: Date.now().toString(), _id: Date.now().toString(), status: "upcoming", ...tripData };
        setTrips(prev => [newTrip, ...prev]);
      }
      setSelectedTrip(null);
      setShowTripForm(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this trip?");
    if (!confirmDelete) return;

    try {
      await deleteTrip(tripId);
      setTrips(prev => prev.filter(t => t.tripId !== tripId && t._id !== tripId));
    } catch (error) {
      setTrips(prev => prev.filter(t => t.tripId !== tripId && t._id !== tripId));
    }
  };

  const filteredTrips = trips.filter((trip) =>
    (trip.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (trip.destination || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading-screen"><h2>Loading dashboard...</h2></div>;
  }

  if (error) {
    return 2;
  }

  return (
    <div className="user-dashboard">
      {showTripForm && (
        <NewTripForm
          initialData={selectedTrip}
          onSubmit={handleTripSubmit}
          onCancel={() => {
            setSelectedTrip(null);
            setShowTripForm(false);
          }}
        />
      )}

      <UserSidebar
        user={currentUser}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="dashboard-content">
        <UserTopbar
          user={currentUser}
          onMenuClick={() => setSidebarOpen(true)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <div className="dashboard-actions">
          <button 
            className="new-trip-btn"
            onClick={() => {
              setSelectedTrip(null);
              setShowTripForm(true);
            }}
          >
            + New Trip
          </button>
        </div>

        {/* Stats */}
        <section id="dashboard" className="stats-grid">
          <UserStatsCard
            title="Trips"
            value={trips.length}
            icon="✈️"
          />
          <UserStatsCard
            title="Destinations"
            value={destinations.length}
            icon="🌍"
          />
          <UserStatsCard
            title="Bookings"
            value={bookings.length || 3}
            icon="📅"
          />
          <UserStatsCard
            title="Upcoming"
            value={trips.filter((t) => t.status === "planned" || t.status === "upcoming").length}
            icon="⭐"
          />
        </section>

        {/* Upcoming Trips */}
        <section id="trips" className="dashboard-section">
          <h2>Upcoming Trips</h2>
          <div className="trip-grid">
            {filteredTrips.map((trip) => (
              <UserTripCard
                key={trip.tripId || trip._id}
                trip={trip}
                onView={handleViewTrip}
              />
            ))}
          </div>
        </section>

        {/* Popular Destinations */}
        <section id="destinations" className="dashboard-section">
          <h2>Popular Destinations</h2>
          <div className="destination-grid">
            {destinations.map((destination) => (
              <UserDestinationCard
                key={destination._id || destination.id}
                destination={destination}
                onExplore={(dest) => setExploreDestination(dest)}
              />
            ))}
          </div>
        </section>

        {/* Live Currency Converter Section */}
        <section id="currency" className="dashboard-section">
          <CurrencyConverter />
        </section>

        {/* Interactive Travel Map Section */}
        <section id="map" className="dashboard-section">
          <UserMap onSelectDestination={(dest) => setExploreDestination(dest)} />
        </section>

        {/* Packing List Section */}
        <section id="packing" className="dashboard-section">
          <PackingSection />
        </section>

        {/* Weather Forecast & Flight Tracker Section */}
        <section id="tools" className="dashboard-section">
          <TravelUtilities />
        </section>

        {/* Trips Table */}
        <section id="bookings" className="dashboard-section">
          <h2>Trip History</h2>
          <UserTripsTable
            trips={filteredTrips}
            onView={handleViewTrip}
            onEdit={handleEditTrip}
            onDelete={handleDeleteTrip}
          />
        </section>
        
        {/* Profile */}
        <section id="profile" className="dashboard-section">
          <h2>Profile</h2>
          <ProfileSection />
        </section>

        {/* Settings */}
        <section id="settings" className="dashboard-section">
          <h2>Settings</h2>
          <SettingsSection />
        </section>
      </main>

      {/* Trip Details Modal */}
      {showTripDetails && (
        <TripDetailsModal
          trip={selectedTrip}
          onClose={() => {
            setShowTripDetails(false);
            setSelectedTrip(null);
          }}
        />
      )}

      {/* Destination Explore & Booking Modal */}
      {exploreDestination && (
        <ExploreModal
          destination={exploreDestination}
          onClose={() => setExploreDestination(null)}
          onBookingSuccess={() => loadDashboardData()}
        />
      )}
    </div>
  );
}