import { useState, useRef, useEffect } from "react";
import AgentMessage from "../components/AgentMessage";
import AgentInput from "../components/AgentInput";
import { jsPDF } from "jspdf";
import Protea from "../components/Assets/Protea.jpg";
import { PanicConfirmationModal } from "../components/PanicConfirmation";

export default function ChatAgent() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);

  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [isInProfessionalMode, setIsInProfessionalMode] = useState(false);
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [professionalStep, setProfessionalStep] = useState(0);

  const fileInputRef = useRef(null);

  // Crisis keywords
  const crisisKeywords = [
    "kill",
    "suicide",
    "want to die",
    "end my life",
    "kill myself",
    "i don't know what to do",
    "i feel hopeless",
    "i can't go on",
    "life is not worth living",
    "i want to disappear",
    "nothing matters anymore",
    "end it all",
    "give up",
    "no hope",
    "feel empty",
    "can't take it anymore",
    "tired of living",
    "better off dead",
  ];

  const containsCrisisKeywords = (text) => {
    const lower = text.toLowerCase();
    return crisisKeywords.some((kw) => lower.includes(kw.toLowerCase()));
  };

  // Initial chat
  useEffect(() => {
    if (chats.length === 0) {
      const today = new Date().toISOString().split("T")[0];
      const firstChat = { id: 1, title: "New Chat", date: today };
      setChats([firstChat]);
      setCurrentChatId(1);
    }
  }, []);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const fileObj = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        file: file,
        uploadedAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [
        ...prev,
        { sender: "user", text: `Uploaded file: ${file.name}`, file: fileObj },
      ]);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: isInProfessionalMode ? "professional" : "bot",
            text: `I've received your file "${file.name}".`,
          },
        ]);
      }, 500);
    });

    e.target.value = null;
  };

  const handleHelpClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSupportResponse = (response) => {
    if (response === "yes") {
      setIsInProfessionalMode(true);
      setShowSupportDialog(false);

      // Start the professional script
      setMessages((prev) => [...prev, professionalScript[0]]);
      // Move pointer to next script item (safety question)
      setProfessionalStep(0);
    } else {
      setShowSupportDialog(false);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "That's okay. Remember, I'm here if you change your mind. In the meantime, is there anything else I can help you with?",
          },
        ]);
      }, 500);
    }
  };

  // 1) PROFESSIONAL SCRIPT (unique ids)
  const professionalScript = [
    // INTRO
    {
      id: "intro",
      sender: "professional",
      text: "Hello, my name is Dr. Bob Snyman. I’m a counsellor specialising in supporting survivors of gender-based violence. Thank you for reaching out, that takes courage. This is a safe and confidential space. How can I support you today?",
    },

    // SAFETY CHECK
    {
      id: "safety_check",
      sender: "professional",
      text: "Before we continue, I want to gently check on your safety. Are you in immediate danger right now?",
      decision: "safety",
    },

    {
      id: "safety_yes",
      sender: "professional",
      text: "Thank you for telling me. Your safety matters. I can help you contact emergency services or guide you through a quick safety plan. Which option would you prefer?",
    },

    {
      id: "safety_no",
      sender: "professional",
      text: "I’m relieved you’re safe right now. We can focus on understanding what’s been happening and how I can help.",
    },

    // SUPPORT DIRECTION
    {
      id: "support_choice",
      sender: "professional",
      text: "Would you like to talk about what has been happening, or would you rather explore support options first?",
      decision: "support",
    },

    {
      id: "support_talk",
      sender: "professional",
      text: "I'm here to listen. You can share whatever feels comfortable.",
    },

    {
      id: "support_options",
      sender: "professional",
      text: "Here are some options: talking through what you're feeling, connecting to a hotline, creating a safety plan, or getting emergency support. Which feels right for you?",
    },

    // FOLLOW-UP
    {
      id: "follow_1",
      sender: "professional",
      text: "What you're going through sounds incredibly difficult. When did this begin?",
    },
  ];

  const isYes = (text) =>
    ["yes", "yeah", "yep", "sure", "ok", "okay", "please"].some((word) =>
      text.toLowerCase().includes(word)
    );

  const isNo = (text) =>
    ["no", "not now", "no thanks", "later"].some((word) =>
      text.toLowerCase().includes(word)
    );

  const sendMessage = async (text) => {
    // User message
    setMessages((prev) => [...prev, { sender: "user", text }]);

    // PROFESSIONAL MODE FLOW
    if (isInProfessionalMode) {
      // PROFESSIONAL MODE FLOW
      const currentScript = professionalScript[professionalStep];

      // Decision step
      if (currentScript?.decision) {
        let branchId = null;

        if (currentScript.decision === "safety") {
          branchId = isYes(text)
            ? "safety_yes"
            : isNo(text)
            ? "safety_no"
            : null;
        }

        if (currentScript.decision === "support") {
          branchId = isYes(text)
            ? "support_talk"
            : isNo(text)
            ? "support_options"
            : null;
        }

        if (!branchId) {
          setMessages((prev) => [
            ...prev,
            {
              sender: "professional",
              text: "Please reply with yes or no so I can guide you.",
            },
          ]);
          return;
        }

        const nextScript = professionalScript.find((s) => s.id === branchId);

        setMessages((prev) => [...prev, nextScript]);

        setProfessionalStep(
          professionalScript.findIndex((s) => s.id === branchId)
        );

        return;
      }

      // Normal scripted step
      const nextStep = professionalScript[professionalStep + 1];
      if (nextStep) {
        setMessages((prev) => [
          ...prev,
          { sender: "professional", text: nextStep.text },
        ]);
        setProfessionalStep((prev) => prev + 1);
      }

      return;
    }

    // Update current chat title if first message
    if (messages.filter((m) => m.sender === "user").length === 0) {
      setChats(
        chats.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                title: text.length > 30 ? text.substring(0, 30) + "..." : text,
              }
            : chat
        )
      );
    }
    // Crisis detection
    if (containsCrisisKeywords(text) && !isInProfessionalMode) {
      setTimeout(() => setShowSupportDialog(true), 800);
      return;
    }

    // AI Response
    setTimeout(() => {
      if (isInProfessionalMode) {
        const responses = [
          "I hear you. Can you tell me more?",
          "Thank you for sharing that. Your feelings matter.",
          "I'm here with you. What's weighing heaviest on your mind?",
          "You're not alone. Would you like to explore ways to cope together?",
          "That sounds really difficult. What do you feel you need right now?",
        ];
        const r = responses[Math.floor(Math.random() * responses.length)];
        setMessages((prev) => [...prev, { sender: "professional", text: r }]);
      } else {
        const responses = [
          "Okay! Let me check that.",
          "Sure, I can help with that.",
          "Thanks for sharing!",
          "I'm on it!",
          "Got it! Let me think.",
        ];
        const r = responses[Math.floor(Math.random() * responses.length)];
        setMessages((prev) => [...prev, { sender: "bot", text: r }]);
      }
    }, 800);
  };

  const exportChatAsPDF = () => {
    const doc = new jsPDF();

    // Set document properties
    const chatTitle =
      chats.find((c) => c.id === currentChatId)?.title || "New Chat";
    const today = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Add header
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185); // Blue color
    doc.text("Chat Agent Conversation", 105, 20, { align: "center" });

    // Add crisis mode indicator if active
    if (isInProfessionalMode) {
      doc.setFontSize(12);
      doc.setTextColor(138, 43, 226); // Purple color
      doc.text("Professional Support Mode Active", 105, 30, {
        align: "center",
      });
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Export Date: ${today} ${currentTime}`, 105, 37, {
        align: "center",
      });
    } else {
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Export Date: ${today} ${currentTime}`, 105, 30, {
        align: "center",
      });
    }

    // Add chat info
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Chat Title: ${chatTitle}`, 20, isInProfessionalMode ? 50 : 45);
    doc.text(
      `Chat ID: ${currentChatId || "N/A"}`,
      20,
      isInProfessionalMode ? 60 : 55
    );

    // Draw a separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(
      20,
      isInProfessionalMode ? 70 : 65,
      190,
      isInProfessionalMode ? 70 : 65
    );

    // Add messages
    let yPosition = isInProfessionalMode ? 85 : 80;
    const maxWidth = 170;
    const lineHeight = 7;

    messages.forEach((msg, index) => {
      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      // Sender label with color
      let sender = "";
      if (msg.sender === "user") {
        sender = "You";
      } else if (msg.sender === "professional") {
        sender = "Professional Support";
      } else {
        sender = "Assistant";
      }

      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");

      if (msg.sender === "user") {
        doc.setTextColor(41, 128, 185); // Blue for user
      } else if (msg.sender === "professional") {
        doc.setTextColor(138, 43, 226); // Purple for professional
      } else {
        doc.setTextColor(46, 204, 113); // Green for bot
      }

      doc.text(`${sender} • ${timestamp}`, 20, yPosition);
      yPosition += lineHeight;

      // Message text
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);

      // Split long messages into multiple lines
      const messageLines = doc.splitTextToSize(msg.text, maxWidth);
      messageLines.forEach((line) => {
        doc.text(line, 25, yPosition);
        yPosition += lineHeight;
      });

      // Add file info if exists
      if (msg.file) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100, 100, 100);

        const fileInfo = `📎 ${msg.file.name} (${formatFileSize(
          msg.file.size
        )}) - Uploaded at ${msg.file.uploadedAt}`;
        const fileLines = doc.splitTextToSize(fileInfo, maxWidth - 5);
        fileLines.forEach((line) => {
          doc.text(line, 30, yPosition);
          yPosition += lineHeight;
        });

        doc.setFont("helvetica", "normal");
      }

      yPosition += lineHeight * 1.5;
    });

    // Add page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageCount}`, 105, 287, { align: "center" });
      doc.text(`Exported from Chat Agent`, 105, 292, { align: "center" });
    }

    // Generate filename and save
    const safeTitle = chatTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const modeSuffix = isInProfessionalMode ? "_support_mode" : "";
    const filename = `chat_${safeTitle}${modeSuffix}_${new Date().getTime()}.pdf`;

    doc.save(filename);

    // Show confirmation
    alert(`Chat exported successfully as ${filename}`);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const createNewChat = () => {
    const newId =
      chats.length > 0 ? Math.max(...chats.map((c) => c.id)) + 1 : 1;
    const today = new Date().toISOString().split("T")[0];

    const newChat = {
      id: newId,
      title: newChatTitle || `New Chat ${newId}`,
      date: today,
    };

    setChats([...chats, newChat]);
    setCurrentChatId(newId);
    setMessages([
      { sender: "bot", text: "Hello! How can I assist you today?" },
    ]);
    setNewChatTitle("");
    setIsInProfessionalMode(false);
    setShowSupportDialog(false);
  };

  const switchChat = (chatId) => {
    setCurrentChatId(chatId);
    setMessages([
      {
        sender: "bot",
        text: `Hello! Welcome to chat ${chatId}. How can I help you?`,
      },
    ]);
    setIsInProfessionalMode(false);
    setShowSupportDialog(false);
  };

  return (
    <div className="chat-agent-container">
      {/* SIDEBAR */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h3>Chat History</h3>
          <div className="new-chat-input">
            <input
              type="text"
              value={newChatTitle}
              placeholder="New chat title..."
              onChange={(e) => setNewChatTitle(e.target.value)}
            />
            <button onClick={() => createNewChat()}>+ New Chat</button>
          </div>
        </div>

        <div className="chat-list">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${
                currentChatId === chat.id ? "active" : ""
              }`}
              onClick={() => switchChat(chat.id)}
            >
              <div className="chat-item-content">
                <span className="chat-title">{chat.title}</span>
                <span className="chat-date">{chat.date}</span>
              </div>
            </div>
          ))}
        </div>

        <button className="export-btn" onClick={exportChatAsPDF}>
          📄 Export chat
        </button>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">A</div>
            <span className="username">Annie</span>
            <div className="setting-icon">⋮</div>
            {/* ❌ Removed "chat with Dr Bob" */}
          </div>
        </div>
      </div>

      {/* MAIN CHAT */}
      <div className="chat-main">
        {/* HEADER */}
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="title-block">
              <h3>{isInProfessionalMode ? "Dr. Bob" : "VEA"}</h3>
              <img
                src={Protea}
                alt="VEA logo"
                style={{ width: "40px", transform: "rotate(55deg)" }}
              />
            </div>

            <div className="chat-info">
              Chat ID: {currentChatId} •{" "}
              {chats.find((c) => c.id === currentChatId)?.date || today}
              {isInProfessionalMode && " • Professional Support Active"}
            </div>
          </div>

          <div className="chat-header-right">
            <button className="help-btn" onClick={handleHelpClick}>
              SOS
            </button>
          </div>
        </div>

        {/* CHAT WINDOW */}
        <div className="chat-window">
          {messages.map((msg, i) => (
            <AgentMessage
              key={i}
              sender={msg.sender}
              text={msg.text}
              file={msg.file} // <--- pass the file here
            />
          ))}

          {/* Support popup */}
          {showSupportDialog && (
            <div className="support-dialog">
              <h4>Support Available</h4>
              <p>
                I noticed you might be going through a difficult time. Would you
                like to connect with a professional who can provide support?
              </p>
              <p>
                This will switch you to a confidential support mode where you
                can speak freely about your concerns and gain trusted
                professional supportt.
              </p>
              <div className="support-buttons">
                <button
                  className="support-btn yes"
                  onClick={() => handleSupportResponse("yes")}
                >
                  Conncet with professional support
                </button>
                <button
                  className="support-btn no"
                  onClick={() => handleSupportResponse("no")}
                >
                  Decline professional support
                </button>
              </div>
            </div>
          )}
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
              style={{ display: "none" }}
            />
          </div>

          <AgentInput onSend={sendMessage} />
        </div>
      </div>
      {isModalOpen && (
        <PanicConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

