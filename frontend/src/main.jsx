import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./LoginPage.css";
import "./App.css"; // import all our custom styles
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
