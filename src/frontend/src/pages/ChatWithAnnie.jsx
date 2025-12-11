import { useState, useRef, useEffect } from "react";
import AgentMessage from "../components/AgentMessage";
import AgentInput from "../components/AgentInput";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import Protea from "../components/Assets/Protea.jpg";

export default function ChatWithAnnie() {
  const [messages, setMessages] = useState([
    { sender: "annie", text: "Connected to Annie's chat" }
  ]);
  const [victimIndex, setVictimIndex] = useState(0);
  const fileInputRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  const victimScript = [
    { id: "victim_intro_response", sender: "victim", text: "Hi… I’m not really sure how to start. Things have just been really hard lately." },
    { id: "victim_safety_response_safe", sender: "victim", text: "No… I’m not in immediate danger right now. I’m safe at the moment." },
    { id: "victim_safe_followup", sender: "victim", text: "I just feel overwhelmed. I don’t know what’s normal anymore." },
    { id: "victim_support_choice_talk", sender: "victim", text: "I think… I just need to talk about what’s been happening." },
    { id: "victim_open_up", sender: "victim", text: "It’s been going on for a while. I’ve been feeling anxious all the time and I don’t feel like myself." },
    { id: "victim_follow_1_response", sender: "victim", text: "A few months ago, things started changing. I didn’t notice at first, but it’s been getting worse." },
    { id: "victim_not_safe_followup", sender: "victim", text: "I don’t want to call anyone yet… I just need help figuring out what to do." },
    { id: "victim_support_choice_options", sender: "victim", text: "Maybe we can look at support options first. I’m not sure where to even start." },
    { id: "victim_choose_option", sender: "victim", text: "Maybe we can talk through what I’m feeling first. I’m not ready for hotlines yet." }
  ];

  const handleSend = (text) => {
    // Add Bob message
    setMessages(prev => [
      ...prev,
      { sender: "bob", text, recorded: isRecording }
    ]);

    // Add next victim scripted message
    if (victimIndex < victimScript.length) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          victimScript[victimIndex]
        ]);
        setVictimIndex(victimIndex + 1);
      }, 700);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const fileObj = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        file
      };
      setMessages(prev => [...prev, { sender: "bob", text: `Uploaded file: ${file.name}`, file: fileObj }]);
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: "annie", text: `I see the file "${file.name}". Thank you for sharing.` }]);
      }, 500);
    });
    e.target.value = null;
  };

  const handleRecordSession = () => {
    setMessages(prev => [
      ...prev,
      { sender: "bob", text: "Requesting to record a session...", recorded: true }
    ]);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: "annie", text: "Annie gave Permission to record session", recorded: false, mockConsent: true },
        { sender: "system", text: "------------ Session is now being recorded -----------", recorded: true }
      ]);
      setIsRecording(true);
    }, 1000);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let y = 10;
    messages.forEach(msg => {
      const prefix = msg.sender === "bob" ? "BOB: " : msg.sender === "annie" || msg.sender === "victim" ? "VICTIM: " : "SYSTEM: ";
      const text = prefix + msg.text;
      const color = msg.recorded ? [0, 102, 204] : [0, 0, 0];
      doc.setTextColor(...color);
      doc.text(text, 10, y);
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save("chat_with_annie.pdf");
  };

  return (
    <div className="chat-agent-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h3>Conversations</h3>
        </div>
        <div className="chat-list">
          <div className="chat-item active">
            <span className="chat-title">Annie</span>
          </div>
        </div>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">B</div>
            <span className="username">Bob</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        <div className="chat-header">
          <div className="chat-header-left" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h3 style={{ margin: 0 }}>Annie Chat</h3>
            <img src={Protea} alt="VEA logo" style={{ width: "40px", transform: "rotate(55deg)" }} />
            <div className="chat-info" style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>
              {today}
            </div>
          </div>

          <div className="chat-header-right">
            <button className="home-button" onClick={() => navigate("/dashboard")}>⌂ Home</button>
            <button className="record-button" onClick={handleRecordSession}>🔴 Record</button>
            {isRecording && <button className="export-button" onClick={handleExportPDF}>📄 Export</button>}
          </div>
        </div>

        <div className="chat-window">
          {messages.map((msg, i) => (
            <AgentMessage
              key={i}
              sender={msg.sender === "bob" ? "user" : msg.sender === "annie" || msg.sender === "victim" ? "bot" : "system"}
              text={msg.text}
              file={msg.file}
              recorded={msg.recorded}
              mockConsent={msg.mockConsent}
            />
          ))}
        </div>

        {/* INPUT */}
        <div className="chat-input-area">
          <div className="file-upload-container">
            <button 
              className="file-upload-btn"
              onClick={() => fileInputRef.current.click()}
              title="Upload file"
            >
              <span className="plus-icon">+</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              style={{ display: 'none' }}
            />
          </div>
          <AgentInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
