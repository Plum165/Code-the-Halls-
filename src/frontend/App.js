import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatAgent from "./pages/ChatAgent";
import Dashboard from "./pages/Dashboard";
import ChatWithAnnie from "./pages/ChatWithAnnie"; // new chat page for Bob
import { ServiceRequestProvider } from "./context/ServiceRequest";

import "./App.css";

export default function App() {
  return (
    <ServiceRequestProvider>
      <BrowserRouter>
        <Routes>

          {/* Login */}
          <Route path="/" element={<Login />} />

          {/* Signup */}
          <Route path="/signup" element={<Signup />} />

          {/* Annie + general users */}
          <Route path="/chat" element={<ChatAgent />} />

          {/* Bob only */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Chat with Annie (after Bob accepts request) */}
          <Route path="/chat-with-annie" element={<ChatWithAnnie />} />

        </Routes>
      </BrowserRouter>
    </ServiceRequestProvider>
  );
}
