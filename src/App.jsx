import React, { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ApplicationsPage from "./pages/ApplicationsPage.jsx";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [error, setError] = useState("");
  const [applications, setApplications] = useState([]);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [editStatus, setEditStatus] = useState("applied");

  const [editingApplication, setEditingApplication] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

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

  async function handleDelete(applicationId) {
    const response = await fetch(
      `http://localhost:3000/applications/${applicationId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (response.ok) {
      setApplications(applications.filter((app) => app.id !== applicationId));
    }
  }

  function handleEditClick(app) {
    setEditingApplication(app.id);
    setEditName(app.name);
    setEditDescription(app.description);
    setEditStatus(app.status);
  }

  async function handleEditSave(e) {
    e.preventDefault();
    setError("");

    const response = await fetch(
      `http://localhost:3000/applications/${editingApplication}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          description: editDescription,
          status: editStatus,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      return;
    }

    setApplications(
      applications.map((app) => (app.id === editingApplication ? data : app)),
    );
    setEditingApplication(null);
  }

  function handleEditCancel() {
    setEditingApplication(null);
  }

  async function handleCreated(newApplication) {
    setApplications([...applications, newApplication]);
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
      <ApplicationsPage
        token={token}
        onLogout={handleLogout}
        applications={applications}
        error={error}
        editingApplication={editingApplication}
        editName={editName}
        setEditName={setEditName}
        editDescription={editDescription}
        setEditDescription={setEditDescription}
        editStatus={editStatus}
        setEditStatus={setEditStatus}
        handleEditClick={handleEditClick}
        handleEditSave={handleEditSave}
        handleEditCancel={handleEditCancel}
        handleDelete={handleDelete}
        handleCreated={handleCreated}
      />
    );
  }

  if (showRegisterForm) {
    return (
      <RegisterPage
        onSuccess={handleBackToLoginClick}
        handleBackToLoginClick={handleBackToLoginClick}
        token={token}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <LoginPage
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      error={error}
      handleLogin={handleLogin}
      handleRegisterClick={handleRegisterClick}
      token={token}
      onLogout={handleLogout}
    />
  );
}

export default App;
