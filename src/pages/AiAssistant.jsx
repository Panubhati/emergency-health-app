import React, { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import styles from "../styles/AiAssistant.module.css";

export default function AiAssistant() {
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState([]);
  const chatWindowRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Load backend URL from environment

  const getBotResponse = useCallback(async (conversationHistory) => {
    if (!BACKEND_URL) {
      console.error("Backend URL not defined!");
      return "Backend URL missing. Please check configuration.";
    }

    try {
      setLoading(true);

      const latestUserMessage = conversationHistory[conversationHistory.length - 1]?.content;

      const response = await axios.post(
        `${BACKEND_URL}/api/openai`,  // ✅ changed from /api/grok to /api/openai
        { userMessage: latestUserMessage }, // ✅ changed body
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Response from server:", response.data);

      return response.data.message || "Sorry, I couldn't understand your question.";
    } catch (error) {
      console.error("Error fetching AI response:", error.response?.data || error.message);
      return "I'm facing technical issues. Please try again later.";
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL]);

  const handleSend = async () => {
    if (!query.trim()) return;

    // 1. Add user message
    const newUserMessage = { role: "user", content: query };
    const updatedConversation = [...responses, newUserMessage];
    setResponses(updatedConversation);
    setQuery("");

    // 2. Get bot response based on full conversation
    const botText = await getBotResponse(updatedConversation);
    const newBotMessage = { role: "assistant", content: botText };

    // 3. Add bot message
    setResponses((prev) => [...prev, newBotMessage]);
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [responses, loading]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🧠 AI Health Assistant</h1>
        <p>Ask about First Aid, Doctors, or any Medical Help!</p>
      </header>

      <div ref={chatWindowRef} className={styles.chatWindow}>
        {responses.length === 0 && (
          <div className={styles.welcomeMessage}>
            Hello! I'm your AI Health Assistant. How can I help you today?
          </div>
        )}
        {responses.map((res, index) => (
          <div key={index} className={res.role === "user" ? styles.userMessage : styles.botMessage}>
            {res.content}
          </div>
        ))}
        {loading && (
          <div className={styles.botMessage}>
            Typing...
          </div>
        )}
      </div>

      <div className={styles.inputArea}>
        <input
          type="text"
          placeholder="Describe your symptoms or ask a question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className={styles.input}
          aria-label="Enter your message"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          className={styles.sendButton}
          aria-label="Send message"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
