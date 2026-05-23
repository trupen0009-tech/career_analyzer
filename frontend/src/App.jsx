import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const API_URL = "https://career-analyzer-nma6.onrender.com/analyze";

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hey! Ask me your career question and I’ll guide you step by step."
    }
  ]);
  const [loading, setLoading] = useState(false);

  async function askAI() {
    if (question.trim() === "") return;

    const userQuestion = question;
    setQuestion("");

    setMessages((prev) => [...prev, { role: "user", text: userQuestion }]);
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: userQuestion })
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.answer || data.error || "No answer received." }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Backend connection failed. Check Render link." }
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="page">
      <div className="app-box">
        <div className="header">
          <h1>AI Career Analyzer</h1>
          <p>Career guidance powered by AI</p>
        </div>

        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message-row ${msg.role}`}>
              <div className={`message ${msg.role}`}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row ai">
              <div className="message ai">Thinking...</div>
            </div>
          )}
        </div>

        <div className="input-box">
          <textarea
            placeholder="Example: I want job in AI industry"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button onClick={askAI}>
            Ask AI
          </button>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
