import { useState, useEffect } from "react";
import { FaExchangeAlt, FaCoins, FaSync } from "react-icons/fa";
import "./CurrencyConverter.css";

const currencies = [
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "AED", name: "UAE Dirham", symbol: "AED", flag: "🇦🇪" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
];

const fallbackRates = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  AED: 0.044,
  IDR: 190.5,
  JPY: 1.82,
  AUD: 0.018,
  THB: 0.42,
};

function CurrencyConverter() {
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState("INR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [rates, setRates] = useState(fallbackRates);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchLiveRates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.rates) {
          setRates(data.rates);
          setLastUpdated(new Date().toLocaleTimeString());
        }
      }
    } catch (err) {
      console.log("Using built-in real-time rates fallback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveRates();
  }, [fromCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Convert calculation
  const rateFrom = rates[fromCurrency] || 1;
  const rateTo = rates[toCurrency] || fallbackRates[toCurrency] || 1;
  
  // If base rate is fromCurrency, rateTo gives direct multiplier
  const conversionRate = rateTo / rateFrom;
  const convertedAmount = (Number(amount) || 0) * conversionRate;

  const fromSymbol = currencies.find(c => c.code === fromCurrency)?.symbol || "";
  const toSymbol = currencies.find(c => c.code === toCurrency)?.symbol || "";

  return (
    <div className="currency-card-wrapper">
      <div className="currency-header-row">
        <div className="currency-header-title">
          <div className="currency-icon-badge">
            <FaCoins />
          </div>
          <div>
            <h3>Live Travel Currency Converter</h3>
            <p>Real-time exchange rates for effortless trip budgeting</p>
          </div>
        </div>

        <button className="refresh-rates-btn" onClick={fetchLiveRates} disabled={loading}>
          <FaSync className={loading ? "spin" : ""} />
          <span>{loading ? "Updating..." : "Refresh Rates"}</span>
        </button>
      </div>

      <div className="converter-box-grid">
        <div className="input-group-box">
          <label>Amount</label>
          <div className="amount-input-wrapper">
            <span className="currency-symbol">{fromSymbol}</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              placeholder="Enter amount..."
            />
          </div>
        </div>

        <div className="select-group-box">
          <label>From Currency</label>
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="swap-btn-container">
          <button className="swap-currency-btn" onClick={handleSwap} title="Swap Currencies">
            <FaExchangeAlt />
          </button>
        </div>

        <div className="select-group-box">
          <label>To Currency</label>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="conversion-result-banner">
        <div className="result-amount-display">
          <span className="from-val">{fromSymbol} {Number(amount).toLocaleString()} {fromCurrency} =</span>
          <h2 className="to-val">{toSymbol} {convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCurrency}</h2>
        </div>
        <div className="rate-info-tag">
          1 {fromCurrency} = {conversionRate.toFixed(4)} {toCurrency}
          {lastUpdated && <small> (Updated at {lastUpdated})</small>}
        </div>
      </div>

      {/* Quick Reference Table */}
      <div className="quick-rates-strip">
        <span className="strip-label">Quick Reference:</span>
        <div className="strip-pills">
          <span className="pill">₹1,000 = ${(1000 * (rates["USD"] || 0.012)).toFixed(2)} USD</span>
          <span className="pill">₹1,000 = €{(1000 * (rates["EUR"] || 0.011)).toFixed(2)} EUR</span>
          <span className="pill">₹1,000 = {(1000 * (rates["AED"] || 0.044)).toFixed(1)} AED</span>
          <span className="pill">₹1,000 = Rp{(1000 * (rates["IDR"] || 190.5)).toLocaleString()} IDR</span>
        </div>
      </div>
    </div>
  );
}

export default CurrencyConverter;
