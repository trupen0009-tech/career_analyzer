import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const API_URL = "https://career-analyzer-nma6.onrender.com/analyze";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAI() {
    if (question.trim() === "") {
      setAnswer("Please write a question first.");
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: question
        })
      });

      const data = await response.json();

      if (data.answer) {
        setAnswer(data.answer);
      } else {
        setAnswer(data.error || "Something went wrong.");
      }
    } catch (error) {
      setAnswer("Backend connection failed. Check Render link.");
    }

    setLoading(false);
  }

  return (
    <div className="container">
      <h1>AI Career Analyzer</h1>

      <textarea
        placeholder="Write your career question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button onClick={askAI}>
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      <div className="answer-box">
        {answer}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
