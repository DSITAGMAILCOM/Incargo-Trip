import { useState, useEffect } from "react";
import { getProfile, updateProfile, changePassword } from "../services/api";
import { MdPerson, MdLock } from "react-icons/md";

function Settings() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [loading, setLoading] = useState(false);

  // Load admin profile on mount
  useEffect(() => {
    getProfile()
      .then((res) => setProfile({ name: res.data.name, email: res.data.email }))
      .catch((err) => console.error(err));
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  // Save profile changes
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(profile);
      // Update stored name in localStorage
      localStorage.setItem("adminName", res.data.name);
      showToast("Profile updated successfully");
    } catch (err) {
      showToast(err.response?.data?.message || "Error updating profile", "error");
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Check new password matches confirm password
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      showToast("Password changed successfully");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showToast(err.response?.data?.message || "Error changing password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page settings-page">
      {toast.msg && (
        <div className={`toast ${toast.type === "error" ? "toast-error" : ""}`}>{toast.msg}</div>
      )}

      {/* Profile Settings Card */}
      <div className="settings-card">
        <div className="settings-card-header">
          <MdPerson className="settings-icon" />
          <h2>Admin Profile</h2>
        </div>
        <form onSubmit={handleProfileSubmit} className="modal-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="settings-card">
        <div className="settings-card-header">
          <MdLock className="settings-icon" />
          <h2>Change Password</h2>
        </div>
        <form onSubmit={handlePasswordSubmit} className="modal-form">
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
