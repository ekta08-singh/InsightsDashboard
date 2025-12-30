import { useState } from "react";
import axios from "axios";

export default function Register({ onAuth }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password }
      );
      localStorage.setItem("user", JSON.stringify(data));
      onAuth(data);
    } catch {
      setError("User already exists");
    }
  };

  return (
    <form className="vuexy-form" onSubmit={submit}>
      {error && <div className="error-box">{error}</div>}

      <label>Name</label>
      <input
        placeholder="John Doe"
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label>Email</label>
      <input
        type="email"
        placeholder="john@example.com"
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label>Password</label>
      <input
        type="password"
        placeholder="••••••••"
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button className="primary-btn">Create account</button>
    </form>
  );
}
