import { useState, useEffect } from "react";
import { getBookings, updateBookingStatus, deleteBooking } from "../services/api";
import { MdDelete } from "react-icons/md";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const LIMIT = 10;

  useEffect(() => {
    loadBookings();
  }, [page]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await getBookings({ page, limit: LIMIT });
      setBookings(res.data.bookings);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Update status directly from a dropdown in the table row
  const handleStatusChange = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      showToast("Status updated");
      // Update locally so we don't need to re-fetch
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)));
    } catch (err) {
      showToast("Error updating status");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBooking(deleteId);
      showToast("Booking deleted");
      setDeleteId(null);
      loadBookings();
    } catch (err) {
      showToast("Error deleting booking");
    }
  };

  // Badge color based on booking status
  const statusClass = (s) =>
    s === "Confirmed" ? "badge-green" : s === "Cancelled" ? "badge-red" : "badge-yellow";

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="page">
      {toast && <div className="toast">{toast}</div>}

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this booking?</p>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="table-card">
        <h2 className="section-title">All Bookings ({total})</h2>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Destination</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={b._id}>
                    <td>{(page - 1) * LIMIT + i + 1}</td>
                    <td>
                      <div>{b.user?.name || "N/A"}</div>
                      <small className="text-muted">{b.user?.email}</small>
                    </td>
                    <td>{b.destination?.title || "N/A"}</td>
                    <td>₹{b.totalAmount?.toLocaleString()}</td>
                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td>
                      {/* Dropdown to change status directly in table */}
                      <select
                        className={`status-select ${statusClass(b.status)}`}
                        value={b.status}
                        onChange={(e) => handleStatusChange(b._id, e.target.value)}
                      >
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button className="icon-btn delete" onClick={() => setDeleteId(b._id)}><MdDelete /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookings;
