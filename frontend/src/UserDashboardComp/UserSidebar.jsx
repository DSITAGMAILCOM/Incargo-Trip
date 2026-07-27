import "./UserSidebar.css";

import {
  FaHome,
  FaPlaneDeparture,
  FaGlobeAmericas,
  FaMapMarkedAlt,
  FaCoins,
  FaCloudSun,
  FaClipboardList,
  FaSuitcaseRolling,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

function UserSidebar({ user, onLogout }) {
  return (
    <aside className="user-sidebar">
      <div className="sidebar-logo">
        <h1>Incargo</h1>
        <span>Travel Planner</span>
      </div>

      <div className="sidebar-profile">
        <div className="avatar">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <h3>{user?.name || "Traveller"}</h3>
        <p>{user?.email || "user@email.com"}</p>
      </div>

      <nav className="sidebar-nav">
        <a href="#dashboard" className="active">
          <FaHome />
          <span>Dashboard</span>
        </a>

        <a href="#trips">
          <FaPlaneDeparture />
          <span>My Trips</span>
        </a>

        <a href="#destinations">
          <FaGlobeAmericas />
          <span>Destinations</span>
        </a>

        <a href="#currency">
          <FaCoins />
          <span>Currency Converter</span>
        </a>

        <a href="#map">
          <FaMapMarkedAlt />
          <span>Travel Map</span>
        </a>

        <a href="#packing">
          <FaSuitcaseRolling />
          <span>Packing List</span>
        </a>

        <a href="#tools">
          <FaCloudSun />
          <span>Weather & Flight</span>
        </a>

        <a href="#bookings">
          <FaClipboardList />
          <span>Bookings</span>
        </a>

        <a href="#profile">
          <FaUser />
          <span>Profile</span>
        </a>

        <a href="#settings">
          <FaCog />
          <span>Settings</span>
        </a>
      </nav>

      <button className="logout-btn" onClick={onLogout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default UserSidebar;