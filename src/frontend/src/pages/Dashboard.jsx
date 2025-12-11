
import { useState } from "react";
import { useServiceRequest } from "../context/ServiceRequest";
import { useNavigate } from "react-router-dom";
import Protea from "../components/Assets/Protea.jpg";



const mockClients = [
  { id: 1, name: "Alex Smith", age: 29, gender: "Male", email: "alex@example.com", contact: "555-123-4567", urgency: "red", diagnosis: "Generalized Anxiety Disorder, PTSD", treatmentPlan: "Weekly CBT sessions, daily journaling, breathing exercises", medication: "Sertraline 50mg", lastSession: "2025-12-01", nextSession: "2025-12-15", sessions: [{ date: "2025-11-01", summary: "Initial assessment" }, { date: "2025-11-15", summary: "Follow-up session" }] },
  { id: 2, name: "Jamie Lee", age: 34, gender: "Female", email: "jamie@example.com", contact: "555-987-6543", urgency: "yellow", diagnosis: "Major Depressive Disorder", treatmentPlan: "Bi-weekly therapy and lifestyle monitoring", medication: "None", lastSession: "2025-12-05", nextSession: "2025-12-20", sessions: [{ date: "2025-11-05", summary: "Initial assessment" }, { date: "2025-11-22", summary: "Therapy session" }] },
  { id: 3, name: "Taylor Morgan", age: 41, gender: "Non-binary", email: "taylor@example.com", contact: "555-222-1111", urgency: "green", diagnosis: "General Anxiety", treatmentPlan: "Monthly sessions and long-term coping strategies", medication: "None", lastSession: "2025-12-03", nextSession: "2025-12-18", sessions: [{ date: "2025-11-10", summary: "Check-in" }] },
  { id: 4, name: "Casey Jordan", age: 22, gender: "Female", email: "casey@example.com", contact: "555-777-3333", urgency: "red", diagnosis: "Severe Depression, PTSD", treatmentPlan: "Emergency check-ins, weekly therapy, grounding techniques", medication: "Fluoxetine 20mg", lastSession: "2025-12-07", nextSession: "2025-12-21", sessions: [{ date: "2025-11-12", summary: "Emergency consultation" }] }
];

export default function Dashboard() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const { request, acceptRequest, declineRequest, assistedClients = [] } = useServiceRequest();

  const handleAcceptRequest = () => { acceptRequest(); navigate("/chat-with-annie"); };
  const handleDeclineRequest = () => declineRequest();
  const [hoveredClientId, setHoveredClientId] = useState(null); 

  const urgencies = ["red", "yellow", "green"];
  const clientsByUrgency = urgencies.map(color => ({ color, clients: mockClients.filter(c => c.urgency === color) }));

  // Inline styles for .client-item matching your CSS
  const clientItemBaseStyle = {
    display: "flex",
    alignItems: "center",
    width: "90%",
    margin: "15px 10px 10px 10px",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "6px",
    borderLeft: "5px solid transparent",
    color: "black",
    backgroundColor: " #90e7aa42",
    transition: "all 0.3s ease"
  };

  const clientItemUrgency = {
    red: { borderLeftColor: "#fa0000" },
    yellow: { borderLeftColor: "yellow" },
    green: { borderLeftColor: "rgb(6, 253, 6)" }
  };

  const clientItemSelected = {
    backgroundColor: "rgba(30, 99, 44, 0.322)",
    transform: "scale(1.1)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    fontSize: "1.1rem"
  };
  const clientItemHovered = {
    backgroundColor: "#81868d8e",
    transform: "scale(1.05)"
  };

  return (
    <div className="dashboard" style={{ fontFamily: "sans-serif" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden"
        }}
      >
  {/* Background Image */}
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: '../components/Assets/Protea.jpg',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      transform: "rotate(60deg)",  // rotates the image
      opacity: 0.5,               // sets the opacity
      zIndex: -1                  // ensures content is above the background
    }}
  />
      {/* Navbar */}
      <div style={{ width: "100%", height: "80px", backgroundColor: "#ffffffd8", color: "green", display: "flex", alignItems: "center", padding: "0 20px", fontSize: "2rem", fontWeight: "100", borderBottom: "3px solid  #149e64ff" }}>
        Welcome back, Dr Bob
        
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>
        {/* Sidebar */}
        <div style={{ width: "250px", backgroundColor:  "#90e7aa60", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "20px", borderRight: "1px solid #ddd" }}>
          <div>
            <div style={{ padding: "20px 5px", borderBottom: "2px solid #1b6318ff", cursor: "pointer", fontSize: "1.2rem", fontFamily: "inherit", }}>Client Log        </div>
            <div style={{ padding: "20px 5px", borderBottom: "2px solid #1b6318ff", cursor: "pointer", fontSize: "1.2rem", fontFamily: "inherit" }}>Reminders        <span style={{ background: "white", color: "green", borderRadius: "50%", padding: "2px 6px", marginLeft: "5px" }}>2</span> </div>
            <div style={{ padding: "20px 5px", borderBottom: "2px solid #1b6318ff", cursor: "pointer", fontSize: "1.2rem", fontFamily: "inherit" }}>Upcoming Sessions </div>
            <div style={{ padding: "20px 5px", borderBottom: "2px solid #1b6318ff", cursor: "pointer", fontSize: "1.2rem", fontFamily: "inherit"   }}>Notes </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <span style={{ fontSize: "1.5rem" }}>👤</span>
            <span style={{ fontSize: "1.5rem" }}>⚙️</span>
          </div>
        </div>

        {/* Main Panel */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {/* Notifications */}
          <div>
            <h2 style={{fontSize: "1.5 rem", color: "green", fontWeight: "150"}}> New Notifications</h2>
          </div>

          {/* Incoming Service Request */}
          {request && request.status === "pending" && (
            <div style={{ padding: "15px", marginBottom: "15px", borderLeft: "6px solid orange", background: "#fff3e0" }}>
              <h3>New Service Request from {request.from}</h3>
              <p><strong>Summary:</strong> {request.summary}</p>
              <button onClick={handleAcceptRequest} style={{ marginRight: "10px" }}>Accept</button>
              <button onClick={handleDeclineRequest}>Decline</button>
            </div>
          )}

          {/* Clients grouped by urgency */}
         {/* Clients grouped by urgency as columns */}
          <div>
            <h2 style={{fontSize: "1.5 rem", color: "green", fontWeight: "150"}}> Clients</h2>
          </div>
           <div style={{ display: "flex", marginTop: "20px", gap: "20px" }}>
          
      {clientsByUrgency.map((group) => (
        <div
          key={group.color}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          {group.clients.map((client) => {
            const isSelected = selectedClient?.id === client.id;
            const isHovered = hoveredClientId === client.id;

            return (
              <div
                key={client.id}
                onClick={() => setSelectedClient(client)}
                onMouseEnter={() => setHoveredClientId(client.id)}
                onMouseLeave={() => setHoveredClientId(null)}
                style={{
                  ...clientItemBaseStyle,
                  ...clientItemUrgency[client.urgency],
                  ...(isSelected ? clientItemSelected : {}),
                  ...(isHovered && !isSelected ? clientItemHovered : {}),
                  width: "250px",
                  height: "100px"
                }}
              >
                <div>
                  <strong>{client.name}</strong>
                  <div style={{ fontSize: "0.8rem" }}>{client.lastSession}</div>
                  <div style={{ fontSize: "0.8rem" }}>{client.email}</div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>

          {/* Assisted Clients */}
          {assistedClients.length > 0 && (
            <div style={{ marginTop: "30px"  }}>
              <h2 style={{fontSize: "1.5 rem", color: "green", fontWeight: "150"}}>Previously Assisted Clients</h2>
              {assistedClients.map((client, index) => (
                <div key={index} style={{ padding: "10px", border: "1px solid #ccc", marginBottom: "5px", backgroundColor: "#d4edda" }}>
                  <strong>{client.name}</strong> — Assisted at: {client.time}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Client Popup */}
      {selectedClient && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          zIndex: 1000,
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          width: "400px",
          maxHeight: "80vh",
          overflowY: "auto"
        }}>
          <button onClick={() => setSelectedClient(null)} style={{ float: "right", cursor: "pointer" }}>X</button>

          <div style={{ marginBottom: "10px" }}>
            <button onClick={() => setActiveTab("profile")} style={{ marginRight: "5px", background: activeTab === "profile" ? "#2c3e50" : "#ccc", color: activeTab === "profile" ? "white" : "black" }}>Profile</button>
            <button onClick={() => setActiveTab("diagnosis")} style={{ marginRight: "5px", background: activeTab === "diagnosis" ? "#2c3e50" : "#ccc", color: activeTab === "diagnosis" ? "white" : "black" }}>Diagnosis & Treatment</button>
            <button onClick={() => setActiveTab("sessions")} style={{ background: activeTab === "sessions" ? "#2c3e50" : "#ccc", color: activeTab === "sessions" ? "white" : "black" }}>Sessions</button>
          </div>

          {activeTab === "profile" && (
            <div>
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

          {activeTab === "diagnosis" && (
            <div>
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

          {activeTab === "sessions" && (
            <div>
              <h3>Sessions</h3>
              <table>
                <thead>
                  <tr><th>Date</th><th>Summary</th></tr>
                </thead>
                <tbody>
                  {selectedClient.sessions.map((s, i) => (
                    <tr key={i}><td>{s.date}</td><td>{s.summary}</td></tr>
                  ))}
                </tbody>
              </table>
              <p>Next Session: {selectedClient.nextSession}</p>
            </div>
          )}
        </div>
      )}
      /</div>
    </div>
  );
}
