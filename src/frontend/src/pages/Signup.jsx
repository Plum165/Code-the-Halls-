
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";


export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    gender: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (form.username && form.email && form.password ) {
      alert("Account created!");
      navigate("/chat");
    }
    else {
    alert("Please fill in all fields");}
  };


  return (
    <div className="signup-container">
      <form className="signup-box" onSubmit={handleSignup}>
        <h2>Join a community of love and support</h2>

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
          type="age"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />  
         <input
          type="gender"
          name="gender"
          placeholder="Gender"
          value={form.gender}
          onChange={handleChange}
        />  

         <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />  


         <p style={{ marginTop: "10px" }}>
          For additional support submit  <text className="login-link"> Health Form</text>
        </p>

        <button type="submit" >Sign Up</button>

        <p style={{ marginTop: "20px" }}>
          Already have an account? <Link to="/" className="login-link">Login</Link>
        </p>
      </form>
    </div>
  );
}

