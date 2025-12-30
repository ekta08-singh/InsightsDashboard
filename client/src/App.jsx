import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import "./styles/global.css";
import { getUser } from "./services/auth";

function App() {
  const [user, setUser] = useState(getUser());

  if (!user) return <Auth onAuth={setUser} />;
  return <Dashboard />;
}

export default App;

