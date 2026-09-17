import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ApplicationsPage from "./pages/ApplicationsPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [error, setError] = useState("");
  const [applications, setApplications] = useState([]);
  const [editStatus, setEditStatus] = useState("applied");
  const navigate = useNavigate();

  const [editingApplication, setEditingApplication] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  function handleRegisterClick() {
    navigate("/register");
  }

  function handleBackToLoginClick() {
    navigate("/login");
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
    navigate("/applications");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
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

  return (
    <Routes>
      <Route
        path='/login'
        element={
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
        }
      />
      <Route
        path='/register'
        element={
          <RegisterPage
            onSuccess={handleBackToLoginClick}
            handleBackToLoginClick={handleBackToLoginClick}
            token={token}
            onLogout={handleLogout}
          />
        }
      />
      <Route
        path='/applications'
        element={
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
        }
      />
      <Route
        path='/admin'
        element={<AdminPage token={token} onLogout={handleLogout} />}
      />
      <Route
        path='*'
        element={<Navigate to={token ? "/applications" : "/login"} />}
      />
    </Routes>
  );
}

export default App;
