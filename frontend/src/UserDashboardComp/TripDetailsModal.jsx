import "./TripDetailsModal.css";

function TripDetailsModal({ trip, onClose }) {
  if (!trip) return null;

  return (
    <div className="trip-details-overlay">
      <div className="trip-details-modal">

        <div className="trip-details-header">
          <h2>{trip.title}</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✖
          </button>
        </div>

        <div className="trip-details-body">

          <div className="detail-row">
            <strong>📍 Destination:</strong>
            <span>{trip.destination}</span>
          </div>

          <div className="detail-row">
            <strong>📝 Description:</strong>
            <span>{trip.description || "No description provided."}</span>
          </div>

          <div className="detail-row">
            <strong>📅 Start Date:</strong>
            <span>
              {new Date(trip.startDate).toLocaleDateString()}
            </span>
          </div>

          <div className="detail-row">
            <strong>📅 End Date:</strong>
            <span>
              {new Date(trip.endDate).toLocaleDateString()}
            </span>
          </div>

          <div className="detail-row">
            <strong>💰 Budget:</strong>
            <span>${trip.budget}</span>
          </div>

          <div className="detail-row">
            <strong>👥 Travelers:</strong>
            <span>{trip.travelers}</span>
          </div>

          <div className="detail-row">
            <strong>🚦 Status:</strong>

            <span className={`status ${trip.status}`}>
              {trip.status}
            </span>
          </div>

          <div className="detail-row">
            <strong>🏷 Tags:</strong>

            <div className="tag-container">
              {trip.tags?.length > 0 ? (
                trip.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="tag"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span>No tags</span>
              )}
            </div>
          </div>

          <div className="detail-row">
            <strong>Created By:</strong>

            <span>{trip.createdBy}</span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default TripDetailsModal;