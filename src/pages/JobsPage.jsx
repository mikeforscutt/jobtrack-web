import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";

function JobsPage({ token, onLogout }) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("http://localhost:3000/jobs");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        setJobs(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ job_id: jobId }),
      });

      if (!response.ok) {
        throw new Error("Failed to apply for job");
      }

      setAppliedJobIds((prev) => [...prev, jobId]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout token={token} onLogout={onLogout}>
      <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold mb-6">Jobs</h1>
        <ul className="flex flex-col gap-2">
          {jobs.map((job) => (
            <li key={job.id} className="bg-slate-900 border border-slate-700 rounded-md p-3">
              <h2 className="text-lg font-semibold">{job.company_name}</h2>
              <p className="text-sm text-slate-400 mb-2">{job.job_title}</p>
              {appliedJobIds.includes(job.id) ? (
                <span className="text-sm text-green-400">Applied</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleApply(job.id)}
                  className="text-sm border border-slate-600 rounded-md px-3 py-1.5 hover:bg-slate-700 transition-colors"
                >
                  Apply
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}

export default JobsPage;