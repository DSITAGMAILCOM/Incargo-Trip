import { useState, useEffect } from "react";
import "./NewTripForm.css";

function NewTripForm({
  onSubmit,
  onCancel,
  initialData = null,
}) {
  const emptyTrip = {
    tripId: "",
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    description: "",
    budget: "",
    travelers: 1,
    status: "planned",
    createdBy: "",
    tags: "",
  };

  const [trip, setTrip] = useState(emptyTrip);

  useEffect(() => {
    if (initialData) {
      setTrip({
        ...initialData,
        tags: Array.isArray(initialData.tags)
          ? initialData.tags.join(", ")
          : initialData.tags || "",
      });
    } else {
      setTrip(emptyTrip);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTrip((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...trip,
      budget: Number(trip.budget),
      travelers: Number(trip.travelers),
      tags: trip.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="trip-modal">
      <div className="trip-modal-content">

        <h2>
          {initialData ? "Edit Trip" : "Create New Trip"}
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            name="tripId"
            value={trip.tripId}
            placeholder="Trip ID"
            onChange={handleChange}
            required
          />

          <input
            name="title"
            value={trip.title}
            placeholder="Trip Title"
            onChange={handleChange}
            required
          />

          <input
            name="destination"
            value={trip.destination}
            placeholder="Destination"
            onChange={handleChange}
            required
          />

          <label>Start Date</label>

          <input
            type="date"
            name="startDate"
            value={
              trip.startDate
                ? new Date(trip.startDate)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={handleChange}
            required
          />

          <label>End Date</label>

          <input
            type="date"
            name="endDate"
            value={
              trip.endDate
                ? new Date(trip.endDate)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            value={trip.description}
            placeholder="Description"
            onChange={handleChange}
          />

          <input
            type="number"
            name="budget"
            value={trip.budget}
            placeholder="Budget"
            onChange={handleChange}
          />

          <input
            type="number"
            name="travelers"
            value={trip.travelers}
            placeholder="Travelers"
            onChange={handleChange}
          />

          <select
            name="status"
            value={trip.status}
            onChange={handleChange}
          >
            <option value="planned">Planned</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input
            name="createdBy"
            value={trip.createdBy}
            placeholder="User ID"
            onChange={handleChange}
            required
          />

          <input
            name="tags"
            value={trip.tags}
            placeholder="Tags (comma separated)"
            onChange={handleChange}
          />

          <div className="form-buttons">

            <button type="submit">
              {initialData ? "Update Trip" : "Create Trip"}
            </button>

            <button
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default NewTripForm;