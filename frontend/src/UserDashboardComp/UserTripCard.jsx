import "./UserTripCard.css";
import tripImages from "../utils/tripImages";

function UserTripCard({ trip, onView }) {
  const destName = (trip.destination || trip.title || "").toLowerCase();
  const matchedKey = Object.keys(tripImages).find(k => destName.includes(k) || k.includes(destName));
  const cardImage = tripImages[destName] || (matchedKey && tripImages[matchedKey]) || tripImages["goa"];

  const formattedStartDate = trip.startDate
    ? new Date(trip.startDate).toLocaleDateString()
    : "TBD";
  const formattedEndDate = trip.endDate
    ? new Date(trip.endDate).toLocaleDateString()
    : "TBD";

  return (
    <div className="trip-card">
      <div className="trip-image-container">
        <img
          src={cardImage}
          alt={trip.destination || "Trip"}
          className="trip-image"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = tripImages["goa"];
          }}
        />
      </div>

      <div className="trip-content">
        <div className="trip-header">
          <h3>{trip.title}</h3>
          <span className={`trip-status ${trip.status}`}>
            {trip.status}
          </span>
        </div>

        <p className="trip-location">
          📍 {trip.destination}
        </p>

        <div className="trip-details">
          <div>
            <small>Start</small>
            <p>{formattedStartDate}</p>
          </div>

          <div>
            <small>End</small>
            <p>{formattedEndDate}</p>
          </div>

          <div>
            <small>Budget</small>
            <p>₹{trip.budget ? Number(trip.budget).toLocaleString() : 0}</p>
          </div>
        </div>

        <button className="trip-btn" onClick={() => onView(trip)}>
          View Trip
        </button>
      </div>
    </div>
  );
}

export default UserTripCard;