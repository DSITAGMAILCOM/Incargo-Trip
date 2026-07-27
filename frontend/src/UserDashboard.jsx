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

export default function UserDashboard({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [trips, setTrips] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [showTripForm, setShowTripForm] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showTripDetails, setShowTripDetails] = useState(false);

  const [exploreDestination, setExploreDestination] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user")) || user || {};

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
        setTrips(tripsRes.value.data.trips || tripsRes.value.data || []);
      } else {
        setTrips([]);
      }

      if (destsRes.status === "fulfilled" && destsRes.value?.data) {
        setDestinations(destsRes.value.data.destinations || destsRes.value.data || []);
      } else {
        setDestinations([]);
      }

      if (bookingsRes.status === "fulfilled" && bookingsRes.value?.data) {
        setBookings(bookingsRes.value.data.bookings || bookingsRes.value.data || []);
      } else {
        setBookings([]);
      }

      setError("");
    } catch (err) {
      console.error("Dashboard data load error:", err);
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
      } else {
        await createTrip(tripData);
      }

      await loadDashboardData();
      setSelectedTrip(null);
      setShowTripForm(false);
    } catch (error) {
      console.error(error);
      alert("Failed to save trip.");
    }
  };

  const handleDeleteTrip = async (tripId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this trip?");
    if (!confirmDelete) return;

    try {
      await deleteTrip(tripId);
      await loadDashboardData();
      alert("Trip deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete trip.");
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
    return <h2>{error}</h2>;
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
            value={bookings.length}
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