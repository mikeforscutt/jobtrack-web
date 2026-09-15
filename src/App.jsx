import React, { useState, useEffect } from "react";
import RegisterForm from "./components/forms/RegisterForm.jsx";
import ApplicationForm from "./components/forms/ApplicationForm.jsx";
import Layout from "./components/layout/Layout.jsx";

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
      <Layout token={token} onLogout={handleLogout}>
        <div className='w-full max-w-md bg-slate-800 rounded-xl shadow-lg p-8'>
          {applications.length === 0 ? (
            <p className='text-slate-400 text-sm'>No applications yet.</p>
          ) : (
            <ul className='flex flex-col gap-2'>
              {applications.map((app) => (
                <li
                  key={app.id}
                  className='bg-slate-900 border border-slate-700 rounded-md p-3'
                >
                  {editingApplication === app.id ? (
                    <form
                      onSubmit={handleEditSave}
                      className='flex flex-col gap-3'
                    >
                      <input
                        type='text'
                        placeholder='Company name'
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors'
                      />
                      <input
                        type='text'
                        placeholder='Role / description'
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors'
                      />
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors'
                      >
                        <option value='applied'>Applied</option>
                        <option value='interviewing'>Interviewing</option>
                        <option value='offered'>Offered</option>
                        <option value='rejected'>Rejected</option>
                      </select>
                      {error && <p className='text-red-400 text-sm'>{error}</p>}
                      <div className='flex gap-2'>
                        <button
                          type='submit'
                          className='bg-blue-600 hover:bg-blue-700 rounded-md py-2 px-4 font-medium transition-colors'
                        >
                          Save
                        </button>
                        <button
                          type='button'
                          onClick={handleEditCancel}
                          className='text-sm text-slate-400 hover:text-slate-200'
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p className='font-medium'>{app.name}</p>
                      <p className='text-sm text-slate-400'>
                        {app.description}
                      </p>
                      <p className='text-sm text-slate-400'>
                        Status: {app.status}
                      </p>
                      <div className='flex gap-3 mt-2'>
                        <button
                          onClick={() => handleEditClick(app)}
                          className='text-sm text-blue-400 hover:text-blue-500'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className='text-sm text-red-400 hover:text-red-500'
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div>
            <h2 className='text-lg font-medium mb-3 mt-6'>
              Add a New Application
            </h2>
            <ApplicationForm token={token} onCreated={handleCreated} />
          </div>
        </div>
      </Layout>
    );
  }

  if (showRegisterForm) {
    return (
      <Layout token={token} onLogout={handleLogout}>
        <div className='w-full max-w-md bg-slate-800 rounded-xl shadow-lg p-8'>
          <RegisterForm onSuccess={handleBackToLoginClick} />
          <button
            type='button'
            onClick={handleBackToLoginClick}
            className='w-full mt-3 text-sm text-slate-400 hover:text-slate-200 transition-colors'
          >
            Back to login
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout token={token} onLogout={handleLogout}>
      <div className='w-full max-w-md bg-slate-800 rounded-xl shadow-lg p-8'>
        <form onSubmit={handleLogin} className='flex flex-col gap-3'>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors'
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors'
          />
          {error && <p className='text-red-400 text-sm'>{error}</p>}
          <button
            type='submit'
            className='bg-blue-600 hover:bg-blue-700 rounded-md py-2 font-medium transition-colors'
          >
            Log in
          </button>
        </form>
        <button
          type='button'
          onClick={handleRegisterClick}
          className='w-full mt-3 text-sm text-slate-400 hover:text-slate-200 transition-colors'
        >
          Don't have an account? Register
        </button>
      </div>
    </Layout>
  );
}

export default App;