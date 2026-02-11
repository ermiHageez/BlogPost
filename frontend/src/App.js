import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const [messages, setMessages] = useState([]);

  // NEW STATE for AI Image
  const [blogImage, setBlogImage] = useState(null);

  // Example blog data (replace with real data later)
  const blog = {
    id: 1,
    title: "The Future of Web Development",
    content:
      "Web development is evolving rapidly with AI, WebSockets, and modern frameworks shaping the future.",
  };

  useEffect(() => {
    // Connect to your backend socket server
    const socket = io("http://localhost:8080");

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("new-comment", (data) => {
      console.log("New comment received:", data);
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // NEW: Generate image using Puter AI (FREE)
  const generateImage = async () => {
    if (!window.puter) {
      alert("Puter AI not loaded");
      return;
    }

    const prompt = `
Create a professional blog cover image.
Title: "${blog.title}"
Content: ${blog.content}
Style: modern, clean, blog cover
`;

    const image = await window.puter.ai.txt2img(prompt);
    setBlogImage(image.src);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>WebSocket Demo</h1>

      {/* BLOG CARD */}
      <div
        style={{
          maxWidth: "600px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "2rem",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        {blogImage && (
          <img
            src={blogImage}
            alt="Blog Cover"
            style={{
              width: "100%",
              borderRadius: "6px",
              marginBottom: "1rem",
            }}
          />
        )}

        <h2>{blog.title}</h2>
        <p>{blog.content}</p>

        <button
          onClick={generateImage}
          style={{
            padding: "0.6rem 1rem",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          Generate AI Image (Free)
        </button>
      </div>

      {/* SOCKET COMMENTS */}
      <h2>Incoming Comments:</h2>

      {messages.map((msg, index) => (
        <div
          key={index}
          style={{
            marginBottom: "1rem",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <p>
            <strong>{msg.blogId}</strong>: {msg.comment}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
