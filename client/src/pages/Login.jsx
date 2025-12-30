import { useState } from "react";
import { loginUser } from "../services/auth";

export default function Login({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(email, password);
      onAuth(user);
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <form className="vuexy-form" onSubmit={submit}>
      {error && <div className="error-box">{error}</div>}

      <div className="hint-box">
        <strong>Demo:</strong> admin@example.com / admin123
      </div>

      <label>Email</label>
      <input
        type="email"
        placeholder="admin@example.com"
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

      <div className="remember-row">
        <input type="checkbox" />
        <span>Remember me</span>
      </div>

      <button className="primary-btn">Sign in</button>
    </form>
  );
}

