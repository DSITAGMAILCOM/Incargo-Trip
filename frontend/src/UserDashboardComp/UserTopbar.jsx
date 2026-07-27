import "./UserTopbar.css";

function UserTopbar({ user,onMenuClick, searchTerm, setSearchTerm }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const hour = new Date().getHours();

  let greeting = "Good Morning";

  if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour >= 17) {
    greeting = "Good Evening";
  }

  return (
    <header className="user-topbar">
      <div className="topbar-left">
        <h1>
          {greeting}, {user?.name || "Traveller"} 👋
        </h1>

        <p>{today}</p>
      </div>

      <div className="topbar-right">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search trips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="icon-btn">
          🔔
        </button>

        <div className="topbar-avatar">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}

export default UserTopbar;