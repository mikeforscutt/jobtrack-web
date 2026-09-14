import React, { useState, useEffect } from "react";
import RegisterForm from "./components/forms/RegisterForm.jsx";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [error, setError] = useState("");
  const [applications, setApplications] = useState([]);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  function handleRegisterClick() {
    setShowRegisterForm(true);
  }

  function handleBackToLoginClick() {
    setShowRegisterForm(false);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      return;
    }

    localStorage.setItem("token", data.token);
    setToken(data.token);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  async function fetchApplications(authToken) {
    const response = await fetch("http://localhost:3000/applications", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const data = await response.json();
    setApplications(data);
  }

  useEffect(() => {
    if (token) {
      fetchApplications(token);
    }
  }, [token]);

  if (token) {
    return (
      <div>
        <h1>Job Track</h1>
        <button onClick={handleLogout}>Log out</button>
        <ul>
          {applications.map((app) => (
            <li key={app.id}>
              {app.name} — {app.description}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (showRegisterForm) {
    return (
      <div>
        <h1>Job Track</h1>
        <RegisterForm onSuccess={handleBackToLoginClick} />
        <button type='button' onClick={handleBackToLoginClick}>
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Job Track</h1>
      <form onSubmit={handleLogin}>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type='submit'>Log in</button>
      </form>
      <button type='button' onClick={handleRegisterClick}>
        Register
      </button>
    </div>
  );
}

export default App;
