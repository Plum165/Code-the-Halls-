import { useState, useRef, useEffect } from "react";
import AgentMessage from "../components/AgentMessage";
import AgentInput from "../components/AgentInput";
import { jsPDF } from "jspdf";

export default function ChatAgent() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" }
  ]);
  
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [isInProfessionalMode, setIsInProfessionalMode] = useState(false);
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  
  const fileInputRef = useRef(null);

  // Crisis keywords to detect
  const crisisKeywords = [
    'kill',
    'suicide',
    'want to die',
    'end my life',
    'kill myself',
    'i don\'t know what to do',
    'i feel hopeless',
    'i can\'t go on',
    'life is not worth living',
    'i want to disappear',
    'nothing matters anymore',
    'end it all',
    'give up',
    'no hope',
    'feel empty',
    'can\'t take it anymore',
    'tired of living',
    'better off dead'
  ];

  // Check if message contains crisis keywords
  const containsCrisisKeywords = (text) => {
    const lowerText = text.toLowerCase();
    return crisisKeywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
  };

  // Create initial chat when component mounts
  useEffect(() => {
    if (chats.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      const firstChat = {
        id: 1,
        title: "New Chat",
        date: today
      };
      setChats([firstChat]);
      setCurrentChatId(1);
    }
  }, []);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const fileObj = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        file: file,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      // Add a message showing the file was uploaded
      setMessages(prev => [...prev, { 
        sender: "user", 
        text: `Uploaded file: ${file.name}`,
        file: fileObj
      }]);
      
      // Bot acknowledges the upload
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          sender: isInProfessionalMode ? "professional" : "bot", 
          text: `I've received your file "${file.name}". I can help you analyze its contents.`
        }]);
      }, 500);
    });
    
    // Reset file input
    e.target.value = null;
  };

  const handleHelpClick = () => {
    console.log("Help button clicked (decorative only)");
  };

  const handleSupportResponse = (response) => {
    if (response === 'yes') {
      setIsInProfessionalMode(true);
      setShowSupportDialog(false);
      
      // Add professional response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          sender: "professional", 
          text: "Thank you for reaching out. I'm here to listen and support you. You've shown great courage by asking for help. Would you like to talk about what's bothering you?"
        }]);
      }, 500);
    } else {
      setShowSupportDialog(false);
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          sender: "bot", 
          text: "That's okay. Remember, I'm here if you change your mind. In the meantime, is there anything else I can help you with?"
        }]);
      }, 500);
    }
  };

  const sendMessage = (text) => {
    const updatedMessages = [...messages, { sender: "user", text }];
    setMessages(updatedMessages);

    // Update current chat title if it's the first user message
    if (messages.filter(m => m.sender === "user").length === 0) {
      setChats(chats.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, title: text.length > 30 ? text.substring(0, 30) + "..." : text }
          : chat
      ));
    }

    // Check for crisis keywords
    if (containsCrisisKeywords(text) && !isInProfessionalMode) {
      // Show support dialog after a short delay
      setTimeout(() => {
        setShowSupportDialog(true);
      }, 800);
      
      // Don't send regular bot response
      return;
    }

    // Regular bot or professional response
    setTimeout(() => {
      if (isInProfessionalMode) {
        // Professional responses
        const professionalResponses = [
          "I hear you. It takes strength to share these feelings. Can you tell me more about what you're experiencing?",
          "Thank you for trusting me with this. Your feelings are valid and important. Would you like to explore coping strategies together?",
          "I'm here with you. Let's take this one step at a time. What's been most difficult for you recently?",
          "It sounds like you're going through a very challenging time. Remember, you don't have to face this alone. Would it help to talk about what support might look like for you?",
          "I appreciate you sharing this with me. Let's work together to find ways to help you feel better. What do you think might help right now?"
        ];
        
        const randomResponse = professionalResponses[Math.floor(Math.random() * professionalResponses.length)];
        setMessages(prev => [...prev, { sender: "professional", text: randomResponse }]);
      } else {
        // Regular bot responses
        const regularResponses = [
          "Okay! Let me check that.",
          "I understand. Let me help you with that.",
          "Thanks for sharing. Let me see what I can do.",
          "I'm on it! Give me a moment to process that.",
          "Got it! Let me work on finding the best solution."
        ];
        
        const randomResponse = regularResponses[Math.floor(Math.random() * regularResponses.length)];
        setMessages(prev => [...prev, { sender: "bot", text: randomResponse }]);
      }
    }, 800);
  };

  const exportChatAsPDF = () => {
    const doc = new jsPDF();
    
    // Set document properties
    const chatTitle = chats.find(c => c.id === currentChatId)?.title || 'New Chat';
    const today = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add header
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185); // Blue color
    doc.text("Chat Agent Conversation", 105, 20, { align: 'center' });
    
    // Add crisis mode indicator if active
    if (isInProfessionalMode) {
      doc.setFontSize(12);
      doc.setTextColor(138, 43, 226); // Purple color
      doc.text("Professional Support Mode Active", 105, 30, { align: 'center' });
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Export Date: ${today} ${currentTime}`, 105, 37, { align: 'center' });
    } else {
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Export Date: ${today} ${currentTime}`, 105, 30, { align: 'center' });
    }
    
    // Add chat info
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Chat Title: ${chatTitle}`, 20, isInProfessionalMode ? 50 : 45);
    doc.text(`Chat ID: ${currentChatId || 'N/A'}`, 20, isInProfessionalMode ? 60 : 55);
    
    // Draw a separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, isInProfessionalMode ? 70 : 65, 190, isInProfessionalMode ? 70 : 65);
    
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
      let sender = '';
      if (msg.sender === 'user') {
        sender = 'You';
      } else if (msg.sender === 'professional') {
        sender = 'Professional Support';
      } else {
        sender = 'Assistant';
      }
      
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      
      if (msg.sender === 'user') {
        doc.setTextColor(41, 128, 185); // Blue for user
      } else if (msg.sender === 'professional') {
        doc.setTextColor(138, 43, 226); // Purple for professional
      } else {
        doc.setTextColor(46, 204, 113); // Green for bot
      }
      
      doc.text(`${sender} • ${timestamp}`, 20, yPosition);
      yPosition += lineHeight;
      
      // Message text
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      
      // Split long messages into multiple lines
      const messageLines = doc.splitTextToSize(msg.text, maxWidth);
      messageLines.forEach(line => {
        doc.text(line, 25, yPosition);
        yPosition += lineHeight;
      });
      
      // Add file info if exists
      if (msg.file) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        
        const fileInfo = `📎 ${msg.file.name} (${formatFileSize(msg.file.size)}) - Uploaded at ${msg.file.uploadedAt}`;
        const fileLines = doc.splitTextToSize(fileInfo, maxWidth - 5);
        fileLines.forEach(line => {
          doc.text(line, 30, yPosition);
          yPosition += lineHeight;
        });
        
        doc.setFont('helvetica', 'normal');
      }
      
      yPosition += lineHeight * 1.5;
    });
    
    // Add page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageCount}`, 105, 287, { align: 'center' });
      doc.text(`Exported from Chat Agent`, 105, 292, { align: 'center' });
    }
    
    // Generate filename and save
    const safeTitle = chatTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const modeSuffix = isInProfessionalMode ? '_support_mode' : '';
    const filename = `chat_${safeTitle}${modeSuffix}_${new Date().getTime()}.pdf`;
    
    doc.save(filename);
    
    // Show confirmation
    alert(`Chat exported successfully as ${filename}`);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const createNewChat = () => {
    const newId = chats.length > 0 ? Math.max(...chats.map(c => c.id)) + 1 : 1;
    const today = new Date().toISOString().split('T')[0];
    
    const newChat = {
      id: newId,
      title: newChatTitle || `New Chat ${newId}`,
      date: today
    };
    
    setChats([...chats, newChat]);
    setCurrentChatId(newId);
    setMessages([{ sender: "bot", text: "Hello! How can I assist you today?" }]);
    setNewChatTitle("");
    setIsInProfessionalMode(false);
    setShowSupportDialog(false);
  };

  const switchChat = (chatId) => {
    setCurrentChatId(chatId);
    setMessages([{ sender: "bot", text: `Hello! Welcome to chat ${chatId}. How can I help you?` }]);
    setIsInProfessionalMode(false);
    setShowSupportDialog(false);
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    if (chats.length <= 1) {
      alert("You must have at least one chat.");
      return;
    }
    
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    
    if (chatId === currentChatId) {
      setCurrentChatId(updatedChats[0].id);
      setIsInProfessionalMode(false);
      setShowSupportDialog(false);
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="chat-agent-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h3>Chat History</h3>
          <div className="new-chat-input">
            <input
              type="text"
              placeholder="New chat title..."
              value={newChatTitle}
              onChange={(e) => setNewChatTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  createNewChat();
                }
              }}
            />
            <button onClick={createNewChat}>+ New Chat</button>
          </div>
        </div>
        
        <div className="chat-list">
          {chats.length === 0 ? (
            <div className="no-chats">
              <p>No chats yet. Create your first chat!</p>
            </div>
          ) : (
            chats.map(chat => (
              <div 
                key={chat.id}
                className={`chat-item ${currentChatId === chat.id ? 'active' : ''} ${currentChatId === chat.id && isInProfessionalMode ? 'professional-chat' : ''}`}
                onClick={() => switchChat(chat.id)}
              >
                <div className="chat-item-content">
                  <span className="chat-title">{chat.title}</span>
                  <span className="chat-date">{chat.date}</span>
                </div>
                <button 
                  className="delete-chat"
                  onClick={(e) => deleteChat(chat.id, e)}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">U</div>
            <span className="username">User</span>
            {isInProfessionalMode && (
              <span style={{ fontSize: '12px', color: '#9370db', marginLeft: 'auto' }}>
                👨‍⚕️ Support Mode
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        <div className="chat-header">
          <div className="chat-header-left">
            <h3>Chat Agent {isInProfessionalMode && "👨‍⚕️ Professional Support"}</h3>
            <div className="chat-info">
              {currentChatId ? (
                <>
                  Chat ID: {currentChatId} • {chats.find(c => c.id === currentChatId)?.date || today}
                  {isInProfessionalMode && " • Professional Support Active"}
                </>
              ) : (
                `Today is ${today}`
              )}
            </div>
          </div>
          <div className="chat-header-right">
            <button className="help-btn" onClick={handleHelpClick}>
              Help
            </button>
            <button className="export-btn" onClick={exportChatAsPDF}>
              <span className="export-icon"></span> Export
            </button>
          </div>
        </div>
        
        <div className="chat-window">
          {messages.map((msg, i) => (
            <AgentMessage 
              key={i} 
              sender={msg.sender} 
              text={msg.text}
              file={msg.file}
            />
          ))}
          
          {showSupportDialog && (
            <div className="support-dialog">
              <h4>Support Available</h4>
              <p>I noticed you might be going through a difficult time. Would you like to talk to a professional who can provide support?</p>
              <p>This will switch you to a confidential support mode where you can speak freely about your concerns.</p>
              <div className="support-buttons">
                <button className="support-btn yes" onClick={() => handleSupportResponse('yes')}>
                  Yes, I'd like support
                </button>
                <button className="support-btn no" onClick={() => handleSupportResponse('no')}>
                  No, continue normally
                </button>
              </div>
            </div>
          )}
        </div>

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
          
          <AgentInput onSend={sendMessage} />
        </div>
      </div>
    </div>
  );
}