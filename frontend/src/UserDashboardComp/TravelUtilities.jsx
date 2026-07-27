import { useState } from "react";
import { FaCloudSun, FaPlane, FaSearch, FaCheckCircle } from "react-icons/fa";
import "./TravelUtilities.css";

const destinationWeather = [
  { city: "Agra (Taj Mahal)", temp: "31°C", cond: "Sunny", icon: "☀️" },
  { city: "Goa", temp: "29°C", cond: "Tropical Breeze", icon: "🏖️" },
  { city: "Manali", temp: "16°C", cond: "Cool & Mountain Mist", icon: "🏔️" },
  { city: "Kerala", temp: "28°C", cond: "Pleasant Showers", icon: "🌧️" },
  { city: "Jaipur", temp: "33°C", cond: "Clear Sky", icon: "🏰" },
  { city: "Paris", temp: "22°C", cond: "Mild & Sunny", icon: "🗼" },
  { city: "Dubai", temp: "36°C", cond: "Hot & Clear", icon: "🌇" },
  { city: "Bali", temp: "30°C", cond: "Tropical Sunshine", icon: "🌴" },
];

const mockFlightStatus = {
  "6E-204": { flight: "6E 204", airline: "IndiGo", from: "DEL", to: "GOI", status: "On Time", gate: "B4", term: "T3", dep: "10:30 AM" },
  "AI-101": { flight: "AI 101", airline: "Air India", from: "BOM", to: "CDG (Paris)", status: "Boarding", gate: "A12", term: "T2", dep: "02:15 PM" },
  "EK-505": { flight: "EK 505", airline: "Emirates", from: "DEL", to: "DXB (Dubai)", status: "On Time", gate: "C18", term: "T3", dep: "06:45 PM" },
  "UK-815": { flight: "UK 815", airline: "Vistara", from: "DEL", to: "KUU (Manali)", status: "Scheduled", gate: "B2", term: "T3", dep: "08:10 AM" },
};

function TravelUtilities() {
  const [flightQuery, setFlightQuery] = useState("6E-204");
  const [flightInfo, setFlightInfo] = useState(mockFlightStatus["6E-204"]);

  const handleFlightSearch = (e) => {
    e.preventDefault();
    const query = flightQuery.trim().toUpperCase();
    const match = mockFlightStatus[query] || mockFlightStatus[query.replace(/\s+/g, "-")];

    if (match) {
      setFlightInfo(match);
    } else {
      setFlightInfo({
        flight: query,
        airline: "International Partner",
        from: "DEL",
        to: "DEST",
        status: "On Time",
        gate: "Gate 5",
        term: "T3",
        dep: "Scheduled Today",
      });
    }
  };

  return (
    <div className="travel-utilities-grid">
      {/* Weather Forecast Widget */}
      <div className="utility-card weather-card">
        <div className="utility-card-header">
          <div className="utility-badge-icon weather-icon-bg">
            <FaCloudSun />
          </div>
          <div>
            <h3>Destination Weather Forecast</h3>
            <p>Live climate insights for your upcoming trips</p>
          </div>
        </div>

        <div className="weather-grid-list">
          {destinationWeather.map((w) => (
            <div key={w.city} className="weather-pill-item">
              <span className="weather-emoji">{w.icon}</span>
              <div className="weather-city-info">
                <strong>{w.city}</strong>
                <small>{w.cond}</small>
              </div>
              <span className="weather-temp-badge">{w.temp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Flight Status Tracker Widget */}
      <div className="utility-card flight-card">
        <div className="utility-card-header">
          <div className="utility-badge-icon flight-icon-bg">
            <FaPlane />
          </div>
          <div>
            <h3>Live Flight Status Tracker</h3>
            <p>Check gate, terminal & schedule details</p>
          </div>
        </div>

        <form onSubmit={handleFlightSearch} className="flight-search-bar">
          <input
            type="text"
            placeholder="Flight No. (e.g. 6E-204, AI-101, EK-505)..."
            value={flightQuery}
            onChange={(e) => setFlightQuery(e.target.value)}
          />
          <button type="submit" className="flight-search-btn">
            <FaSearch /> Check
          </button>
        </form>

        {flightInfo && (
          <div className="flight-result-box">
            <div className="flight-route-header">
              <div>
                <span className="airline-name">{flightInfo.airline} ({flightInfo.flight})</span>
                <h3 className="route-codes">{flightInfo.from} ✈️ {flightInfo.to}</h3>
              </div>
              <span className="flight-status-badge">
                <FaCheckCircle /> {flightInfo.status}
              </span>
            </div>

            <div className="flight-meta-details">
              <div>
                <small>Departure</small>
                <p>{flightInfo.dep}</p>
              </div>
              <div>
                <small>Terminal</small>
                <p>{flightInfo.term}</p>
              </div>
              <div>
                <small>Boarding Gate</small>
                <p>{flightInfo.gate}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TravelUtilities;
