import { useState } from "react";
import RazorpayModal from "./RazorpayModal";
import "./ExploreModal.css";

function ExploreModal({ destination, onClose, onBookingSuccess }) {
  const [travelers, setTravelers] = useState(1);
  const [bookingDate, setBookingDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [showRazorpay, setShowRazorpay] = useState(false);

  if (!destination) return null;

  const price = destination.price || 5000;
  const totalAmount = price * travelers;

  const handleBookNow = (e) => {
    e.preventDefault();
    setShowRazorpay(true);
  };

  const title = destination.title || destination.name || "Destination";
  const location = destination.location || destination.country || "Location";

  return (
    <>
      <div className="explore-modal-overlay">
        <div className="explore-modal-card">
          <button className="explore-close-btn" onClick={onClose}>✖</button>

          <div className="explore-hero-img-box">
            <img src={destination.imageUrl} alt={title} className="explore-hero-img" />
            <div className="explore-badge-chip">{destination.category || "Featured"}</div>
          </div>

          <div className="explore-body">
            <h2>{title}</h2>
            <p className="explore-loc">📍 {location}</p>

            <p className="explore-desc">
              {destination.description || "Experience the breathtaking beauty, luxury accommodation, and unforgettable culture of this top travel destination."}
            </p>

            <form onSubmit={handleBookNow} className="explore-form">
              <div className="explore-form-row">
                <div className="explore-field">
                  <label>Travel Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </div>

                <div className="explore-field">
                  <label>Travelers</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={travelers}
                    onChange={(e) => setTravelers(Math.max(1, Number(e.target.value)))}
                    required
                  />
                </div>
              </div>

              <div className="explore-price-breakdown">
                <div>
                  <small>Price per person</small>
                  <p>₹{price.toLocaleString()}</p>
                </div>
                <div>
                  <small>Total Price ({travelers} {travelers === 1 ? 'person' : 'people'})</small>
                  <h3 className="total-price-text">₹{totalAmount.toLocaleString()}</h3>
                </div>
              </div>

              <button type="submit" className="confirm-booking-btn">
                Confirm & Book Destination
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Razorpay Gateway Modal */}
      {showRazorpay && (
        <RazorpayModal
          destination={destination}
          travelers={travelers}
          bookingDate={bookingDate}
          totalAmount={totalAmount}
          onClose={() => setShowRazorpay(false)}
          onSuccess={() => {
            onBookingSuccess && onBookingSuccess();
            onClose();
          }}
        />
      )}
    </>
  );
}

export default ExploreModal;
