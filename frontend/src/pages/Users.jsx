import { useState, useEffect } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../services/api";
import { MdAdd, MdEdit, MdDelete, MdSearch } from "react-icons/md";

function Users() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null); // null = adding, object = editing
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [toast, setToast] = useState("");
  const [deleteId, setDeleteId] = useState(null); // id to confirm delete

  const LIMIT = 10;

  // Load users whenever search or page changes
  useEffect(() => {
    loadUsers();
  }, [search, page]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers({ search, page, limit: LIMIT });
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Show a toast message for 3 seconds
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Open modal for adding a new user
  const openAdd = () => {
    setEditUser(null);
    setForm({ name: "", email: "", password: "", role: "user" });
    setShowModal(true);
  };

  // Open modal for editing an existing user
  const openEdit = (user) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
    setShowModal(true);
  };

  // Handle form submit (add or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        await updateUser(editUser._id, { name: form.name, email: form.email, role: form.role });
        showToast("User updated successfully");
      } else {
        await createUser(form);
        showToast("User created successfully");
      }
      setShowModal(false);
      loadUsers();
    } catch (err) {
      showToast(err.response?.data?.message || "Error saving user");
    }
  };

  // Confirm and execute delete
  const handleDelete = async () => {
    try {
      await deleteUser(deleteId);
      showToast("User deleted");
      setDeleteId(null);
      loadUsers();
    } catch (err) {
      showToast("Error deleting user");
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="page">
      {/* Toast Notification */}
      {toast && <div className="toast">{toast}</div>}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this user?</p>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Top bar: search + add button */}
      <div className="page-header">
        <div className="search-box">
          <MdSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <MdAdd /> Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="table-card">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id}>
                    <td>{(page - 1) * LIMIT + i + 1}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${u.role === "admin" ? "badge-purple" : "badge-blue"}`}>{u.role}</span></td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-btns">
                        <button className="icon-btn edit" onClick={() => openEdit(u)}><MdEdit /></button>
                        <button className="icon-btn delete" onClick={() => setDeleteId(u._id)}><MdDelete /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next →</button>
          </div>
        )}
      </div>

      {/* Add / Edit User Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editUser ? "Edit User" : "Add New User"}</h3>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              {!editUser && (
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                </div>
              )}
              <div className="form-group">
                <label>Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">{editUser ? "Update" : "Create"}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
