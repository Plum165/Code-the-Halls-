import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Protea from "../components/Assets/Protea.jpg"
export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const user = username.trim().toLowerCase();

    if (!user) return;

    
   if (user === "bob") {
      navigate("/dashboard");  // Bob goes to the professional dashboard
    } else {
      navigate("/chat");       
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <div className="heading">
          <h2>Welcome to VEA</h2>
          <img src= {Protea} alt = "VEA logo" style ={{width: "40px"}}/>
        </div>
        <input 
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
         <input 
          type="text"
          placeholder="Enter Password"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">Login</button>
        <p style={{ marginTop: "10px" }}>
          Don’t have an account? <Link to="/signup" className="signup-link">Sign up</Link>
        </p>
      </form>

      
    </div>
  );
}
