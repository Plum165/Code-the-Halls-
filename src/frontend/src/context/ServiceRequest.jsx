import { createContext, useContext, useState } from "react";

const ServiceRequestContext = createContext();

export function ServiceRequestProvider({ children }) {
  // Initialize with a mock request from Annie
  const [request, setRequest] = useState({
    from: "Annie",
    summary: "I need help with my project",
    status: "pending"
  });

  const acceptRequest = () =>
    setRequest(prev => ({ ...prev, status: "accepted" }));

  const declineRequest = () =>
    setRequest(prev => ({ ...prev, status: "declined" }));

  return (
    <ServiceRequestContext.Provider
      value={{ request, acceptRequest, declineRequest }}
    >
      {children}
    </ServiceRequestContext.Provider>
  );
}

export const useServiceRequest = () => useContext(ServiceRequestContext);
