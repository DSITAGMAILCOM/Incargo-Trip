import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Destinations from "./pages/Destinations";
import Bookings from "./pages/Bookings";
import Settings from "./pages/Settings";
import LoginPage from "./LoginPage";
import UserDashboard from "./UserDashboard";

// PrivateRoute - wraps a page and only shows it if the user is logged in
function PrivateRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/user-login" />;
}

// Layout - wraps all protected pages with Sidebar + Navbar
function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}

function UserPrivateRoute({ children }) {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/user-login" />;
}

function UserDashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("user");

    navigate("/user-login");
  };

  return <UserDashboard onLogout={handleLogout} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main landing & login page with video background */}
        <Route path="/user-login" element={<LoginPage />} />
        <Route path="/login" element={<Navigate to="/user-login" replace />} />

        {/* Protected Admin routes — all wrapped in Layout */}
        <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><Layout><Users /></Layout></PrivateRoute>} />
        <Route path="/destinations" element={<PrivateRoute><Layout><Destinations /></Layout></PrivateRoute>} />
        <Route path="/bookings" element={<PrivateRoute><Layout><Bookings /></Layout></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>} />

        {/* User Dashboard route */}
        <Route path="/user-dashboard" element={<UserPrivateRoute><UserDashboardPage /></UserPrivateRoute>} />

        {/* Default redirect to main landing page */}
        <Route path="*" element={<Navigate to="/user-login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
