import "./UserDestinationCard.css";
import destinationImages, { defaultFallbackImage } from "../utils/destinationImages";

function UserDestinationCard({ destination, onExplore }) {
  const title = destination.title || destination.name || "Destination";
  const location = destination.location || destination.country || "Location";
  const key = title.toLowerCase();
  
  const matchedKey = Object.keys(destinationImages).find(k => key.includes(k) || k.includes(key));
  const mappedLocalImage = destinationImages[key] || (matchedKey && destinationImages[matchedKey]);
  const cardImage = mappedLocalImage || destination.imageUrl || defaultFallbackImage;

  return (
    <div className="destination-card">
      <div className="destination-image-container">
        <img
          src={cardImage}
          alt={title}
          className="destination-image"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultFallbackImage;
          }}
        />
        {destination.category && (
          <span className="destination-badge">{destination.category}</span>
        )}
      </div>

      <div className="destination-content">
        <h3>{title}</h3>

        <p className="destination-country">
          📍 {location}
        </p>

        <p className="destination-description">
          {destination.description?.length > 90
            ? destination.description.substring(0, 90) + "..."
            : destination.description || "Explore this breathtaking travel spot."}
        </p>
        
        <div className="destination-footer">
          <span className="destination-price">
            ₹{destination.price ? Number(destination.price).toLocaleString() : "5,000"}
          </span>
          <button className="destination-btn" onClick={() => onExplore && onExplore({ ...destination, imageUrl: cardImage })}>
            Explore Destination
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDestinationCard;