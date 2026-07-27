import { useState } from "react";
import "./PackingSection.css";

const defaultPackingItems = [
  { id: 1, text: "Passport & Identity Cards", category: "Essentials", checked: true },
  { id: 2, text: "Flight Tickets & Hotel Vouchers", category: "Documents", checked: true },
  { id: 3, text: "Sunscreen & Sunglasses", category: "Personal Care", checked: false },
  { id: 4, text: "Universal Power Adapter & Chargers", category: "Electronics", checked: false },
  { id: 5, text: "First Aid & Prescription Medicines", category: "Health", checked: true },
  { id: 6, text: "Comfortable Walking Shoes", category: "Apparel", checked: false },
];

function PackingSection() {
  const [items, setItems] = useState(defaultPackingItems);
  const [newItemText, setNewItemText] = useState("");
  const [category, setCategory] = useState("Essentials");

  const toggleCheck = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem = {
      id: Date.now(),
      text: newItemText.trim(),
      category,
      checked: false,
    };

    setItems([newItem, ...items]);
    setNewItemText("");
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const completedCount = items.filter((i) => i.checked).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="packing-card-wrapper">
      <div className="packing-header">
        <div>
          <h3>Trip Packing Checklist</h3>
          <p>Organize essential items before you take off</p>
        </div>

        <div className="packing-progress-box">
          <div className="progress-text">
            <span>{completedCount} of {items.length} items packed</span>
            <strong>{progressPercent}%</strong>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      <form onSubmit={addItem} className="packing-add-form">
        <input
          type="text"
          placeholder="Add new item (e.g. Camera, Swimwear, Jacket)..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Essentials">Essentials</option>
          <option value="Documents">Documents</option>
          <option value="Electronics">Electronics</option>
          <option value="Apparel">Apparel</option>
          <option value="Personal Care">Personal Care</option>
        </select>
        <button type="submit" className="add-item-btn">+ Add Item</button>
      </form>

      <div className="packing-items-grid">
        {items.map((item) => (
          <div key={item.id} className={`packing-item-row ${item.checked ? "checked" : ""}`}>
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleCheck(item.id)}
              />
              <span className="checkmark"></span>
            </label>

            <span className="item-text">{item.text}</span>
            <span className="item-badge">{item.category}</span>

            <button className="item-delete-btn" onClick={() => deleteItem(item.id)}>✖</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PackingSection;
