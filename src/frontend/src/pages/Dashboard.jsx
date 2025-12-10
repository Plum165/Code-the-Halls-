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

const mockClients = [
  {
    id: 1,
    name: "Alex Smith",
    age: 29,
    gender: "Male",
    email: "alex@example.com",
    contact: "555-123-4567",
    urgency: "red",
    diagnosis: "Generalized Anxiety Disorder, PTSD",
    treatmentPlan: "Weekly CBT sessions, daily journaling, breathing exercises",
    medication: "Sertraline 50mg",
    lastSession: "2025-12-01",
    nextSession: "2025-12-15",
    sessions: [
      { date: "2025-11-01", summary: "Initial assessment" },
      { date: "2025-11-15", summary: "Follow-up session" }
    ]
  },
  {
    id: 2,
    name: "Jamie Lee",
    age: 34,
    gender: "Female",
    email: "jamie@example.com",
    contact: "555-987-6543",
    urgency: "yellow",
    diagnosis: "Major Depressive Disorder",
    treatmentPlan: "Bi-weekly therapy and lifestyle monitoring",
    medication: "None",
    lastSession: "2025-12-05",
    nextSession: "2025-12-20",
    sessions: [
      { date: "2025-11-05", summary: "Initial assessment" },
      { date: "2025-11-22", summary: "Therapy session" }
    ]
  },
  {
    id: 3,
    name: "Taylor Morgan",
    age: 41,
    gender: "Non-binary",
    email: "taylor@example.com",
    contact: "555-222-1111",
    urgency: "green",
    diagnosis: "General Anxiety",
    treatmentPlan: "Monthly sessions and long-term coping strategies",
    medication: "None",
    lastSession: "2025-12-03",
    nextSession: "2025-12-18",
    sessions: [
      { date: "2025-11-10", summary: "Check-in" }
    ]
  },
  {
    id: 4,
    name: "Casey Jordan",
    age: 22,
    gender: "Female",
    email: "casey@example.com",
    contact: "555-777-3333",
    urgency: "red",
    diagnosis: "Severe Depression, PTSD",
    treatmentPlan: "Emergency check-ins, weekly therapy, grounding techniques",
    medication: "Fluoxetine 20mg",
    lastSession: "2025-12-07",
    nextSession: "2025-12-21",
    sessions: [
      { date: "2025-11-12", summary: "Emergency consultation" }
    ]
  }
];


export default function Dashboard() {
  const [selectedClient, setSelectedClient] = useState(null);
  const { request, acceptRequest, declineRequest } = useServiceRequest();
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  const handleAcceptRequest = () => {
    acceptRequest();
    navigate("/chat-with-annie");
  };

  const handleDeclineRequest = () => declineRequest();

  return (
    <div className="dashboard" style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      <div className="sidebar"  >
        <h2> Current Clients</h2>
        <div className="sidebar-line"></div>
        {mockClients.map(client => (
          <div
            key={client.id}
            className={`client-item   ${client.urgency} ${selectedClient?.id === client.id ? "selected" : ""}`}
            onClick={() => setSelectedClient(client)}
          >
          <span className={`urgency-dot ${client.urgency}`}></span>
          <div>
            <strong>{client.name}</strong>
            <div className="client-info">{client.lastSession}</div>
            <div className="client-info">{client.email}</div>
          </div>
            
          </div>
        ))}
      </div>

      {/* Main Panel */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <h1>Welcome back, Bob</h1>

        {/* Incoming Service Request */}
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

       
        {selectedClient ? (
  <div className="client-details">

    {/* TAB BUTTONS */}
    <div className="tabs">
      <button 
        className={activeTab === "profile" ? "active-tab" : ""} 
        onClick={() => setActiveTab("profile")}
      >
        Profile
      </button>

      <button 
        className={activeTab === "diagnosis" ? "active-tab" : ""} 
        onClick={() => setActiveTab("diagnosis")}
      >
        Diagnosis & Treatment
      </button>

      <button 
        className={activeTab === "sessions" ? "active-tab" : ""} 
        onClick={() => setActiveTab("sessions")}
      >
        Sessions
      </button>
    </div>

    {/* PROFILE TAB */}
    {activeTab === "profile" && (
      <div className="section">
        <h3>Profile Information</h3>
        <table>
          <tbody>
            <tr><td>Name</td><td>{selectedClient.name}</td></tr>
            <tr><td>Age</td><td>{selectedClient.age}</td></tr>
            <tr><td>Gender</td><td>{selectedClient.gender}</td></tr>
            <tr><td>Email</td><td>{selectedClient.email}</td></tr>
            <tr><td>Contact</td><td>{selectedClient.contact}</td></tr>
          </tbody>
        </table>
      </div>
    )}

    {/* DIAGNOSIS & TREATMENT TAB */}
    {activeTab === "diagnosis" && (
      <div className="section">
        <h3>Diagnosis & Treatment</h3>
        <table>
          <tbody>
            <tr><td>Diagnosis</td><td>{selectedClient.diagnosis}</td></tr>
            <tr><td>Treatment Plan</td><td>{selectedClient.treatmentPlan}</td></tr>
            <tr><td>Medication</td><td>{selectedClient.medication}</td></tr>
          </tbody>
        </table>
      </div>
    )}

    {/* SESSIONS TAB */}
    {activeTab === "sessions" && (
      <div className="section">
        <h3>Sessions</h3>

        <table className="session-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            {selectedClient.sessions.map((s, i) => (
              <tr key={i}>
                <td>{s.date}</td>
                <td>{s.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h4 style={{ marginTop: "15px" }}>
          Next Session: {selectedClient.nextSession}
        </h4>
      </div>
    )}

  </div>
) : (
  <p>No Current Updates.</p>
)}

      </div>
    </div>
  );
}
