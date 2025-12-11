import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./frontend/pages/Login";
import Signup from "./frontend/pages/Signup";
import ChatAgent from "./frontend/pages/ChatAgent";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<ChatAgent />} />
      </Routes>
    </BrowserRouter>
  );
}
