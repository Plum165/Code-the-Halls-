import { createContext, useContext, useState } from "react";

const ServiceRequestContext = createContext();

export function ServiceRequestProvider({ children }) {
  // Initial incoming request
  const [request, setRequest] = useState({
    from: "Annie",
    summary: "User seems to have suicidal tendencies resulting from multiple forms of abuse",
    status: "pending"
  });

  // NEW: a list of assisted clients
  const [assistedClients, setAssistedClients] = useState([]);

  const acceptRequest = () => {
    setRequest(prev => ({ ...prev, status: "accepted" }));

    // Add Annie to assisted list (only once)
    setAssistedClients(prev => {
      if (!prev.some(c => c.name === request.from)) {
        return [...prev, { name: request.from, time: new Date().toLocaleTimeString() }];
      }
      return prev;
    });
  };

  const declineRequest = () =>
    setRequest(prev => ({ ...prev, status: "declined" }));

  return (
    <ServiceRequestContext.Provider
      value={{ request, acceptRequest, declineRequest, assistedClients }}
    >
      {children}
    </ServiceRequestContext.Provider>
  );
}

export const useServiceRequest = () => useContext(ServiceRequestContext);
