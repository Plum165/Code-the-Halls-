import { useState, useRef, useEffect } from "react";
import AgentMessage from "../components/AgentMessage";
import AgentInput from "../components/AgentInput";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

export default function ChatWithAnnie() {
  const [messages, setMessages] = useState([
    { sender: "annie", text: "Hi… I don’t know if I’m doing this right." }
  ]);
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [isInProfessionalMode, setIsInProfessionalMode] = useState(false);
  const fileInputRef = useRef(null);
  const [popupNotification, setPopupNotification] = useState(null);
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);


  // Simulate Annie replying in a troubled way
  const handleSend = (text) => {
   
  setMessages(prev => [
    ...prev,
    { sender: "bob", text, recorded: isRecording }
  ]);

  setTimeout(() => {
    const troubledReplies = [
      "I… I just feel like nothing’s helping.",
      "Sometimes I don’t even know why I feel like this.",
      "I’m scared I’m going to mess everything up.",
      "I don’t know if I can handle this…"
    ];
    const reply = troubledReplies[Math.floor(Math.random() * troubledReplies.length)];
    setMessages(prev => [...prev, { sender: "annie", text: reply, recorded: false }]);
  }, 1000);
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
      setMessages((prev) => [...prev, { sender: "bob", text: `Uploaded file: ${file.name}`, file: fileObj }]);

      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "annie", text: `I see the file "${file.name}". Thank you for sharing.` }]);
      }, 500);
    });

    e.target.value = null;
  };

  const handleSupportResponse = (response) => {
    if (response === 'yes') {
      setIsInProfessionalMode(true);
      setShowSupportDialog(false);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          sender: "professional",
          text: "Thank you for reaching out. I'm here to listen and support you. Can you tell me more about what's troubling you?"
        }]);
      }, 500);
    } else {
      setShowSupportDialog(false);
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: "annie", text: "Okay… maybe later." }]);
      }, 500);
    }
  };

  const handleRecordSession = () => {
  // Bob requests to record
  setMessages(prev => [
    ...prev,
    { sender: "bob", text: "Requesting to record a session...", recorded: true }
  ]);

  // Mock Annie's consent message
  setTimeout(() => {
    setMessages(prev => [
      ...prev,
      { sender: "annie", text: "I understand. You may record this session.", recorded: false, mockConsent: true },
      { sender: "system", text: "📹 Session is now being recorded.", recorded: true } // <-- new notification
    ]);

    setIsRecording(true); // future messages are "recorded"
  }, 1000);
};

const handleExportPDF = () => {
  const doc = new jsPDF();
  let y = 10;

  messages.forEach(msg => {
    const prefix = msg.sender === "bob" ? "BOB: " : "ANNIE: ";
    const text = prefix + msg.text;

    // Color for PDF: recorded messages (after consent) are blue
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


useEffect(() => {
  // Trigger Jake alert after 6 seconds
  const timer = setTimeout(() => {
    setPopupNotification({
      from: "Jake",
      message: "AI detected unusual emotional patterns from Jake.",
      urgency: "yellow"
    });

    // Auto-dismiss after 5 sec
    setTimeout(() => {
      setPopupNotification(null);
    }, 10000);

  }, 6000);

  return () => clearTimeout(timer);
}, []);



  return (
      

    <div className="chat-agent-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h3>Conversation with Annie</h3>
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
     {popupNotification && (
      <div className={`popup-notification ${popupNotification.urgency}`}>
        <div>
          <strong>⚠ New Alert: {popupNotification.from}</strong>
          <p>{popupNotification.message}</p>
        </div>
        <button className="close-btn" onClick={() => setPopupNotification(null)}>✕</button>
      </div>
    )}
      <div className="chat-main">
        <div className="chat-header">
            <div className="chat-header-left">
              <h3>Annie Chat {isInProfessionalMode && "👨‍⚕️ Professional Support"}</h3>
            </div>

            <div className="chat-header-right">
              <div className="chat-header-right">
                <button className="home-button" onClick={() => navigate("/dashboard")}>
                  ⬅ Home
                </button>
                
                <button className="record-button" onClick={handleRecordSession}>
                  📹 Record Session
                </button>

                {isRecording && (
                  <button className="export-button" onClick={handleExportPDF}>
                    📄 Export PDF
                  </button>
                )}
              </div>

            </div>
          </div>

        <div className="chat-window">
       {messages.map((msg, i) => (
        <AgentMessage
          key={i}
          sender={msg.sender}
          text={msg.text}
          file={msg.file}
          recorded={msg.recorded}
          mockConsent={msg.mockConsent}
        />
      ))}



          {showSupportDialog && (
            <div className="support-dialog">
              <h4>Professional Support Available</h4>
              <p>Annie seems to be going through a difficult time. Would you like to enter support mode?</p>
              <div className="support-buttons">
                <button onClick={() => handleSupportResponse('yes')}>Yes</button>
                <button onClick={() => handleSupportResponse('no')}>No</button>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input-area">
          <div className="file-upload-container">
            <button onClick={() => fileInputRef.current.click()}>+</button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple style={{ display: 'none' }} />
          </div>
          <AgentInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
