import { useState } from "react";

export default function AgentInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { // Enter without Shift
      e.preventDefault(); // Prevent newline in input
      handleSend();
    }
  };

  return (
    <div className="chat-input">
    
      <input
        type="text"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown} // <-- added this
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
