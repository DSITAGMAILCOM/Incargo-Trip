import { useState } from "react";
import "./SettingsSection.css";

function SettingsSection() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [tripReminders, setTripReminders] = useState(true);

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="settings-card">

      <h3>Notifications</h3>

      <div className="setting-row">
        <span>Email Notifications</span>

        <input
          type="checkbox"
          checked={emailNotifications}
          onChange={() =>
            setEmailNotifications(!emailNotifications)
          }
        />
      </div>

      <div className="setting-row">
        <span>Trip Reminders</span>

        <input
          type="checkbox"
          checked={tripReminders}
          onChange={() =>
            setTripReminders(!tripReminders)
          }
        />
      </div>

      <hr />

      <h3>Account</h3>

      <div className="setting-info">
        <strong>User:</strong> {user?.name}
      </div>

      <div className="setting-info">
        <strong>Email:</strong> {user?.email}
      </div>

      <div className="setting-info">
        <strong>Role:</strong> {user?.role}
      </div>

      <button
        className="save-settings-btn"
        onClick={handleSave}
      >
        Save Settings
      </button>

    </div>
  );
}

export default SettingsSection;