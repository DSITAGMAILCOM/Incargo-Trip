import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdExplore,
  MdBookOnline,
  MdSettings,
  MdLogout,
  MdClose,
  MdFlight,
} from "react-icons/md";

// Sidebar receives isOpen and onClose as props for mobile toggle
function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  // Logout: remove token and redirect to login
  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  // All navigation links in one array - easy to add more
  const links = [
    { to: "/dashboard", icon: <MdDashboard />, label: "Dashboard" },
    { to: "/users", icon: <MdPeople />, label: "Users" },
    { to: "/destinations", icon: <MdExplore />, label: "Destinations" },
    { to: "/bookings", icon: <MdBookOnline />, label: "Bookings" },
    { to: "/settings", icon: <MdSettings />, label: "Settings" },
  ];

  return (
    <>
      {/* Dark overlay on mobile when sidebar is open */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        {/* Logo / Brand */}
        <div className="sidebar-logo">
          <MdFlight className="logo-icon" />
          <span>Incargo Admin</span>
          {/* Close button — only visible on mobile */}
          <button className="sidebar-close" onClick={onClose}>
            <MdClose />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
              onClick={onClose} // close sidebar on mobile when a link is clicked
            >
              <span className="nav-icon">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout button at the bottom */}
        <button className="logout-btn" onClick={logout}>
          <MdLogout />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
