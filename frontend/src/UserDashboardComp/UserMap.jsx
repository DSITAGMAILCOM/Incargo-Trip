import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./UserMap.css";

// Custom Leaflet Pin Icon
const pinIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Destination Coordinates & Details
const mapDestinations = [
  {
    id: "taj",
    title: "Taj Mahal",
    location: "Agra, India",
    lat: 27.1751,
    lng: 78.0421,
    category: "Heritage",
    price: 5000,
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80",
    description: "One of the Seven Wonders of the World, an iconic marble monument of eternal love.",
  },
  {
    id: "goa",
    title: "Goa Beaches",
    location: "Goa, India",
    lat: 15.2993,
    lng: 74.124,
    category: "Beach",
    price: 8000,
    imageUrl: "https://images.unsplash.com/photo-1512343800234-882532367801?auto=format&fit=crop&w=600&q=80",
    description: "Golden sandy shores, palm trees, seafood shacks, and sun-kissed waters.",
  },
  {
    id: "manali",
    title: "Manali Hills",
    location: "Himachal Pradesh, India",
    lat: 32.2432,
    lng: 77.1892,
    category: "Adventure",
    price: 12000,
    imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
    description: "Snow-dusted Himalayan peaks, rafting, paragliding, and pine valley views.",
  },
  {
    id: "kerala",
    title: "Kerala Backwaters",
    location: "Kerala, India",
    lat: 9.4981,
    lng: 76.3388,
    category: "Nature",
    price: 10000,
    imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80",
    description: "Lush green houseboats gliding along serene palm-fringed waterways.",
  },
  {
    id: "jaipur",
    title: "Jaipur Fort",
    location: "Jaipur, India",
    lat: 26.9124,
    lng: 75.7873,
    category: "Heritage",
    price: 6000,
    imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
    description: "Royal Amer Fort, pink sandstone palaces, and vibrant Rajasthani culture.",
  },
  {
    id: "paris",
    title: "Paris Eiffel Tower",
    location: "Paris, France",
    lat: 48.8566,
    lng: 2.3522,
    category: "City",
    price: 45000,
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
    description: "The city of romance, fine arts, high fashion, and culinary perfection.",
  },
  {
    id: "dubai",
    title: "Burj Khalifa Dubai",
    location: "Dubai, UAE",
    lat: 25.2048,
    lng: 55.2708,
    category: "City",
    price: 35000,
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",
    description: "Architectural marvels, luxury shopping, and golden desert adventures.",
  },
  {
    id: "bali",
    title: "Bali Island",
    location: "Bali, Indonesia",
    lat: -8.4095,
    lng: 115.1889,
    category: "Beach",
    price: 28000,
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
    description: "Spiritual sanctuary, cliffside temples, and green terraced hills.",
  },
];

function UserMap({ onSelectDestination }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredDestinations = selectedCategory === "All"
    ? mapDestinations
    : mapDestinations.filter(d => d.category === selectedCategory);

  const categories = ["All", "Heritage", "Beach", "Adventure", "Nature", "City"];

  return (
    <div className="map-card-wrapper">
      <div className="map-header-row">
        <div>
          <h3>Interactive Destination Map</h3>
          <p>Explore top travel spots around India and the globe</p>
        </div>

        <div className="category-filter-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`pill-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="map-container-box">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={4}
          scrollWheelZoom={false}
          className="leaflet-map-element"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredDestinations.map((dest) => (
            <Marker
              key={dest.id}
              position={[dest.lat, dest.lng]}
              icon={pinIcon}
            >
              <Popup className="custom-map-popup">
                <div className="popup-card-content">
                  <img src={dest.imageUrl} alt={dest.title} className="popup-img" />
                  <h4>{dest.title}</h4>
                  <p className="popup-loc">📍 {dest.location}</p>
                  <p className="popup-desc">{dest.description}</p>
                  <div className="popup-footer">
                    <span className="popup-price">₹{dest.price.toLocaleString()}</span>
                    <button
                      className="popup-book-btn"
                      onClick={() => onSelectDestination && onSelectDestination(dest)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default UserMap;
