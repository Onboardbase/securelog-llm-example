import React, { useState, useEffect } from "react";
import axios from "axios";

const SecureForm = () => {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      /**
       * this is assuming you have pulled the lastest backend updates and
       * its running on port 3000
       *
       * you can point this to https://api.securelog.com/mask-secret once the update is merged to live
       */

      const { data } = await axios.post("http://localhost:3000/mask-secret", {
        text: inputValue,
        maskedValue: "*",
        visibleChars: 5,
      });

      console.log("safeInput", data);
      if (data.secrets.length)
        setMessage("Warning: A new secret detected in text");
    } catch (error) {
      setMessage("Error processing submission");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your text here..."
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "8px 16px",
            backgroundColor: isSubmitting ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>

        {message && (
          <div
            style={{
              padding: "12px",
              borderRadius: "4px",
              backgroundColor: message.includes("Warning")
                ? "#fff3cd"
                : "#d4edda",
              border: `1px solid ${
                message.includes("Warning") ? "#ffeeba" : "#c3e6cb"
              }`,
              color: message.includes("Warning") ? "#856404" : "#155724",
            }}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

const App = () => (
  <div
    style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", padding: "20px" }}
  >
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "32px", color: "#333" }}>
        SecureLog Form Demo
      </h1>
      <SecureForm />
    </div>
  </div>
);

export default App;
