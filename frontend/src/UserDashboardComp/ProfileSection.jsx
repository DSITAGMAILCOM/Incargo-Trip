import { useState } from "react";
import "./ProfileSection.css";

function ProfileSection() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "User",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name: profile.name,
      email: profile.email,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("Profile updated successfully!");
  };

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.name.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2>My Profile</h2>
          <p>Manage your personal information</p>
        </div>
      </div>

      <div className="profile-form">

        <label>Full Name</label>
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
        />

        <label>Email Address</label>
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
        />

        <label>Role</label>
        <input
          type="text"
          value={profile.role}
          disabled
        />

        <button
          className="save-profile-btn"
          onClick={handleSave}
        >
          Save Changes
        </button>

      </div>
    </div>
  );
}

export default ProfileSection;