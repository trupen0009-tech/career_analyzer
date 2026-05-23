import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const API_URL = "https://career-analyzer-nma6.onrender.com/analyze";

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  async function askAI() {
    if (question.trim() === "") return;

    const userQuestion = question;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userQuestion
      }
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: userQuestion
        })
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            data.answer ||
            data.error ||
            "No answer received."
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Backend connection failed."
        }
      ]);
    }

    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  }

  const conversationStarted = messages.length > 0;

  return (
    <div className="page">

      <div className="background"></div>

      <div
        className={
          conversationStarted
            ? "chat-layout active"
            : "chat-layout"
        }
      >

        <div className="messages">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-row ${msg.role}`}
            >
              <div className={`message ${msg.role}`}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row ai">
              <div className="message ai">
                Thinking...
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {!conversationStarted && (
          <div className="hero">
            <h1>AI Career Analyzer</h1>
            <p>Ask Anything</p>
          </div>
        )}

        <div
          className={
            conversationStarted
              ? "input-wrapper bottom"
              : "input-wrapper center"
          }
        >

          <div className="input-box">

            <textarea
              placeholder="Ask Anything"
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              onKeyDown={handleKeyDown}
            />

            <button onClick={askAI}>
              ↑
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

createRoot(
  document.getElementById("root")
).render(<App />);
