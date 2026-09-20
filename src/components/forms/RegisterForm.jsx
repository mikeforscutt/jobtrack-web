import React, { useState } from "react";


function RegisterForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    const response = await fetch(import.meta.env.VITE_API_URL + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error);
      return;
    }

    setSuccessMessage("Account created! Redirecting to login...");
    setTimeout(() => onSuccess(), 1500);
  }

  return (
    <form onSubmit={handleRegister} className='flex flex-col gap-3'>
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
      {successMessage && (
        <p className='text-green-400 text-sm'>{successMessage}</p>
      )}
      <button
        type='submit'
        className='bg-blue-600 hover:bg-blue-700 rounded-md py-2 font-medium transition-colors'
      >
        Register
      </button>
    </form>
  );
}

export default RegisterForm;