import { MdMenu, MdPerson } from "react-icons/md";
import { useLocation } from "react-router-dom";

function Navbar({ onMenuClick }) {
  const location = useLocation();

  // Get the admin name from localStorage (saved during login)
  const adminName = localStorage.getItem("adminName") || "Admin";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: "Good Morning", icon: "🌅" };
    if (hour >= 12 && hour < 17) return { text: "Good Afternoon", icon: "☀️" };
    if (hour >= 17 && hour < 22) return { text: "Good Evening", icon: "🌆" };
    return { text: "Good Night", icon: "🌙" };
  };

  const greeting = getGreeting();

  const getPageTitle = () => {
    const path = location.pathname.replace("/", "");
    return path.charAt(0).toUpperCase() + path.slice(1) || "Dashboard";
  };

  return (
    <header className="navbar">
      {/* Hamburger menu button - only visible on mobile */}
      <button className="menu-btn" onClick={onMenuClick}>
        <MdMenu />
      </button>

      {/* Current page title */}
      <h1 className="navbar-title">{getPageTitle()}</h1>

      {/* Dynamic Greeting & Admin info */}
      <div className="navbar-user">
        <span className="greeting-badge">
          {greeting.text}, <strong>{adminName}</strong> {greeting.icon}
        </span>
        <MdPerson className="user-icon" />
      </div>
    </header>
  );
}

export default Navbar;
