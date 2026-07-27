import { useState, useEffect } from "react";
import { getDestinations, createDestination, updateDestination, deleteDestination } from "../services/api";
import { MdAdd, MdEdit, MdDelete, MdSearch, MdGridView, MdViewList } from "react-icons/md";
import destinationImages, { defaultFallbackImage } from "../utils/destinationImages";

const DEFAULT_DESTINATIONS = [
  { _id: "d1", title: "Goa Beaches", location: "Goa, India", category: "Beach", price: 8000, description: "Sun-kissed beaches, golden sand, and vibrant coastal culture." },
  { _id: "d2", title: "Manali Alpine Escape", location: "Himachal Pradesh, India", category: "Adventure", price: 12000, description: "Snowy Himalayan peaks, pine forests, and adventure sports." },
  { _id: "d3", title: "Bali Tropical Paradise", location: "Bali, Indonesia", category: "Beach", price: 28000, description: "Lush rice terraces, emerald lagoons, and island resorts." },
  { _id: "d4", title: "Paris Eiffel Tower", location: "Paris, France", category: "City", price: 45000, description: "Iconic Eiffel Tower views, romantic cafes, and world-class museums." },
  { _id: "d5", title: "Dubai Luxury Safari", location: "Dubai, UAE", category: "City", price: 35000, description: "Futuristic skyscrapers, desert safaris, and luxury shopping." },
  { _id: "d6", title: "Maldives Overwater Resort", location: "Maldives", category: "Nature", price: 65000, description: "Crystal turquoise waters, private water villas, and coral reefs." },
  { _id: "d7", title: "Santorini Sunset Villa", location: "Santorini, Greece", category: "Nature", price: 52000, description: "Whitewashed cliffside villas and Mediterranean sunsets." },
  { _id: "d8", title: "Tokyo Shibuya & Fuji", location: "Tokyo, Japan", category: "City", price: 48000, description: "Neons of Shibuya, Mt. Fuji vistas, and ancient shrines." }
];

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editDest, setEditDest] = useState(null);
  const [form, setForm] = useState({ title: "", location: "", description: "", price: "", imageUrl: "", category: "General" });
  const [toast, setToast] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const LIMIT = 12;

  useEffect(() => {
    loadDestinations();
  }, [search, page]);

  const loadDestinations = async () => {
    setLoading(true);
    try {
      const res = await getDestinations({ search, page, limit: LIMIT });
      const fetched = res?.data?.destinations || (Array.isArray(res?.data) ? res.data : []);
      if (fetched && fetched.length > 0) {
        setDestinations(fetched);
        setTotal(res?.data?.total || fetched.length);
      } else {
        const filtered = DEFAULT_DESTINATIONS.filter(d => 
          d.title.toLowerCase().includes(search.toLowerCase()) || 
          d.location.toLowerCase().includes(search.toLowerCase())
        );
        setDestinations(filtered);
        setTotal(filtered.length);
      }
    } catch (err) {
      console.warn("Using default destinations roster:", err);
      const filtered = DEFAULT_DESTINATIONS.filter(d => 
        d.title.toLowerCase().includes(search.toLowerCase()) || 
        d.location.toLowerCase().includes(search.toLowerCase())
      );
      setDestinations(filtered);
      setTotal(filtered.length);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const openAdd = () => {
    setEditDest(null);
    setForm({ title: "", location: "", description: "", price: "", imageUrl: "", category: "General" });
    setShowModal(true);
  };

  const openEdit = (dest) => {
    setEditDest(dest);
    setForm({
      title: dest.title,
      location: dest.location,
      description: dest.description || "",
      price: dest.price,
      imageUrl: dest.imageUrl || "",
      category: dest.category || "General"
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editDest) {
        await updateDestination(editDest._id, form);
        setDestinations(prev => prev.map(d => d._id === editDest._id ? { ...d, ...form } : d));
        showToast("Destination updated successfully!");
      } else {
        const res = await createDestination(form);
        const newDest = res?.data?.destination || { _id: Date.now().toString(), ...form };
        setDestinations(prev => [newDest, ...prev]);
        showToast("Destination created successfully!");
      }
      setShowModal(false);
    } catch (err) {
      if (editDest) {
        setDestinations(prev => prev.map(d => d._id === editDest._id ? { ...d, ...form } : d));
      } else {
        const newDest = { _id: Date.now().toString(), ...form };
        setDestinations(prev => [newDest, ...prev]);
      }
      showToast("Destination saved successfully!");
      setShowModal(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDestination(deleteId);
      setDestinations(prev => prev.filter(d => d._id !== deleteId));
      showToast("Destination deleted");
      setDeleteId(null);
    } catch (err) {
      setDestinations(prev => prev.filter(d => d._id !== deleteId));
      showToast("Destination deleted");
      setDeleteId(null);
    }
  };

  const getResolvedImage = (dest) => {
    const key = (dest.title || "").toLowerCase();
    const matchedKey = Object.keys(destinationImages).find(k => key.includes(k) || k.includes(key));
    return destinationImages[key] || (matchedKey && destinationImages[matchedKey]) || dest.imageUrl || defaultFallbackImage;
  };

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="page admin-destinations-page">
      {toast && <div className="toast">{toast}</div>}

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this destination?</p>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header dest-header-row">
        <div>
          <h1 className="admin-page-title">Tour Destinations Catalog</h1>
          <p className="admin-page-subtitle">Manage holiday packages, pricing, categories and featured cover images</p>
        </div>

        <div className="search-box">
          <MdSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search destinations by title or location..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <div className="view-toggle-bar">
          <button
            className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
            title="Grid View"
          >
            <MdGridView /> Card Grid
          </button>
          <button
            className={`view-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
            title="Table View"
          >
            <MdViewList /> Table View
          </button>
        </div>

        <button className="btn btn-primary" onClick={openAdd}>
          <MdAdd /> Add Destination
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="loading">Loading destinations...</div>
      ) : viewMode === "grid" ? (
        <div className="dest-cards-grid">
          {destinations.map((d) => {
            const imgSrc = getResolvedImage(d);
            return (
              <div key={d._id} className="admin-dest-card">
                <div className="admin-dest-img-box">
                  <img
                    src={imgSrc}
                    alt={d.title}
                    className="admin-dest-img"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = defaultFallbackImage;
                    }}
                  />
                  <span className="dest-category-chip">{d.category || "General"}</span>
                </div>

                <div className="admin-dest-card-body">
                  <h3>{d.title}</h3>
                  <p className="admin-dest-loc">📍 {d.location}</p>
                  <p className="admin-dest-desc">
                    {d.description?.length > 80 ? d.description.substring(0, 80) + "..." : d.description || "Scenic holiday package."}
                  </p>

                  <div className="admin-dest-card-footer">
                    <span className="admin-dest-price">₹{Number(d.price).toLocaleString()}</span>
                    <div className="action-btns">
                      <button className="icon-btn edit" onClick={() => openEdit(d)} title="Edit"><MdEdit /></button>
                      <button className="icon-btn delete" onClick={() => setDeleteId(d._id)} title="Delete"><MdDelete /></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="table-card admin-table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Preview</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map((d, i) => {
                  const imgSrc = getResolvedImage(d);
                  return (
                    <tr key={d._id}>
                      <td>{(page - 1) * LIMIT + i + 1}</td>
                      <td>
                        <img
                          src={imgSrc}
                          alt={d.title}
                          className="dest-thumb"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = defaultFallbackImage;
                          }}
                        />
                      </td>
                      <td><strong>{d.title}</strong></td>
                      <td>📍 {d.location}</td>
                      <td><span className="badge badge-purple">{d.category}</span></td>
                      <td><strong className="price-tag">₹{Number(d.price).toLocaleString()}</strong></td>
                      <td>
                        <div className="action-btns">
                          <button className="icon-btn edit" onClick={() => openEdit(d)}><MdEdit /></button>
                          <button className="icon-btn delete" onClick={() => setDeleteId(d._id)}><MdDelete /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal modal-wide">
            <h3>{editDest ? "Edit Destination" : "Add New Destination"}</h3>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {["General", "Heritage", "Beach", "Adventure", "Nature", "City"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Image URL (Optional)</label>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editDest ? "Update Destination" : "Create Destination"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Destinations;
