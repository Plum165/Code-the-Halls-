import { useState } from "react";
import { useServiceRequest } from "../context/ServiceRequest";
import { useNavigate } from "react-router-dom";

const mockNotifications = [
  {
    id: 1,
    user: "Alex Smith",
    type: "alert",
    text: "AI suggests checking in — unusual emotional patterns detected.",
    time: "2 min ago"
  },
  {
    id: 2,
    user: "Jamie Lee",
    type: "info",
    text: "User completed coping exercise successfully.",
    time: "10 min ago"
  }
];

const mockUsers = ["Alex Smith", "Jamie Lee", "Taylor Morgan"];

export default function Dashboard() {
  const [selectedUser, setSelectedUser] = useState(null);
  const { request, acceptRequest, declineRequest } = useServiceRequest();
  const navigate = useNavigate();

  const handleAcceptRequest = () => {
    acceptRequest();
    navigate("/chat-with-annie"); // Route to chat page
  };

  const handleDeclineRequest = () => declineRequest();

  // Show notifications for all users, but highlight selected user's
  const filteredNotifications = selectedUser
    ? mockNotifications.filter(n => n.user === selectedUser)
    : mockNotifications;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: "240px", background: "#1F2937", color: "white", padding: "20px" }}>
        <h2>Users</h2>
        {mockUsers.map(u => (
          <div
            key={u}
            style={{ margin: "10px 0", cursor: "pointer" }}
            onClick={() => setSelectedUser(u)}
          >
            {u}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h1>Professional Dashboard (Prototype)</h1>

        {/* Incoming Service Request from Annie */}
        {request && request.status === "pending" && (
          <div style={{
            padding: "15px",
            marginBottom: "15px",
            borderLeft: "6px solid orange",
            background: "#fff3e0"
          }}>
            <h3>New Service Request from {request.from}</h3>
            <p><strong>Summary:</strong> {request.summary}</p>
            <button onClick={handleAcceptRequest} style={{ marginRight: "10px" }}>Accept</button>
            <button onClick={handleDeclineRequest}>Decline</button>
          </div>
        )}

        {/* Notifications */}
        <h2>Notifications</h2>
        {filteredNotifications.map(n => (
          <div
            key={n.id}
            style={{
              padding: "12px",
              marginBottom: "10px",
              borderLeft: `6px solid ${n.type === "alert" ? "red" : "blue"}`,
              background: "#f9f9f9"
            }}
          >
            <strong>{n.user}</strong> — <small>{n.time}</small>
            <p>{n.text}</p>
          </div>
        ))}

        {/* User Detail Panel */}
        {selectedUser && (
          <div style={{ marginTop: "20px", padding: "20px", border: "1px solid #ddd" }}>
            <h2>{selectedUser}</h2>
            <p><strong>Status:</strong> Stable (mock data)</p>
            <p><strong>AI Suggestion:</strong> Schedule a follow-up check-in.</p>
          </div>
        )}
      </div>
    </div>
  );
}
