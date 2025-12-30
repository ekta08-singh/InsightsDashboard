import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "../styles/auth-vuexy.css";

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState("login");

  return (
    <div className="vuexy-auth">
      {/* LEFT SECTION */}
      <div className="vuexy-left">
        <div className="vuexy-logo">Insights</div>

        <div className="vuexy-illustration">
          <div className="stat-card top">
            <h4>Profit</h4>
            <p>624k</p>
            <span>+8.24%</span>
          </div>

          <div className="avatar-circle"></div>

          <div className="stat-card bottom">
            <h4>Orders</h4>
            <p>124k</p>
            <span>+12.6%</span>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="vuexy-right">
        <div className="vuexy-card">
          <h2>
            Welcome to Insights! <span>👋</span>
          </h2>
          <p className="subtitle">
            {mode === "login"
              ? "Please sign-in to your account and start the adventure"
              : "Create an account to get started"}
          </p>

          {mode === "login" ? (
            <Login onAuth={onAuth} />
          ) : (
            <Register onAuth={onAuth} />
          )}

          <div className="auth-footer">
            {mode === "login" ? (
              <>
                New on our platform?{" "}
                <span onClick={() => setMode("register")}>
                  Create an account
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span onClick={() => setMode("login")}>
                  Sign in instead
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
