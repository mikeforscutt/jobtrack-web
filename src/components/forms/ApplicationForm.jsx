import { useState } from "react";

function ApplicationForm({ token, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("applied");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const response = await fetch("http://localhost:3000/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, status }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      return;
    }

    setName("");
    setDescription("");
    setStatus("applied");
    onCreated(data);
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-3 mt-3'>
      <input
        type='text'
        placeholder='Company name'
        value={name}
        onChange={(e) => setName(e.target.value)}
        className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors'
      />
      <input
        type='text'
        placeholder='Role / description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors'
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors'
      >
        <option value='applied'>Applied</option>
        <option value='interviewing'>Interviewing</option>
        <option value='offered'>Offered</option>
        <option value='rejected'>Rejected</option>
      </select>
      {error && <p className='text-red-400 text-sm'>{error}</p>}
      <button
        type='submit'
        className='bg-blue-600 hover:bg-blue-700 rounded-md py-2 font-medium transition-colors'
      >
        Add Application
      </button>
    </form>
  );
}

export default ApplicationForm;
