import "./UserTripsTable.css";

function UserTripsTable({
  trips,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="trips-table-container">

      <div className="table-header">
        <h2>My Trips</h2>
        <p>Manage all your booked trips</p>
      </div>

      <table className="trips-table">

        <thead>
          <tr>
            <th>Destination</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Budget</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {trips.length > 0 ? (
            trips.map((trip) => (
              <tr key={trip.tripId}>

                <td>{trip.destination}</td>

                <td>
                  {new Date(trip.startDate).toLocaleDateString()}
                </td>

                <td>
                  {new Date(trip.endDate).toLocaleDateString()}
                </td>

                <td>${trip.budget}</td>

                <td>
                  <span className={`status ${trip.status}`}>
                    {trip.status}
                  </span>
                </td>

                <td>
                 <div className="action-buttons">
                  <button
                    className="view-btn"
                    onClick={() => onView(trip)}
                  >
                    View
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => onEdit(trip)} >
                    Edit
                    </button>

                  <button
                    className="delete-btn"
                    onClick={() => onDelete(trip.tripId)}>
                    Delete
                  </button>
                 </div>
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-trips">
                No trips available.
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
}

export default UserTripsTable;