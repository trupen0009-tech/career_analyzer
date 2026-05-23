import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const API_URL = "https://career-analyzer-nma6.onrender.com/analyze";

function App() {
  return (
    <div>
      <h1>AI Career Analyzer</h1>

      <p>Frontend is working 😄🔥</p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
