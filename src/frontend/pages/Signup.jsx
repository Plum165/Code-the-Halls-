// import React from 'react'



// export const Signup = () => {
//   return (
//     <div>
//         <div className="container">
//         <div className='header'>Log-in</div>
//             <div className="inputs">
//                 <div className="input">
//                     <text className="Name">User</text>
//                     <input type="text" className="text" />
//                 </div>
//                 <div className="input">
//                     <text className="Name">Password</text>
//                     <input type="text" className="text" />
//                 </div>
//                 <div className="submit">Login</div>
//                  <div className="submit">Sign-up</div>
//             </div>
//         </div>
//     </div>
   
//   )
// }

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    // Prototype action: simply redirect to login
    if (form.username && form.email && form.password) {
      alert("Account created!");
      navigate("/");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSignup}>
        <h2>Create Account</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">Sign Up</button>

        <p style={{ marginTop: "10px" }}>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
}

