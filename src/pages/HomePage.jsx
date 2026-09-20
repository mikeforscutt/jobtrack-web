import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";

function HomePage({ token, onLogout }) {
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    async function fetchRecentJobs() {
      try {
        const response = await fetch("http://localhost:3000/jobs/recent");
        const data = await response.json();
        setRecentJobs(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchRecentJobs();
  }, []);

  return (
    <Layout token={token} onLogout={onLogout}>
      <div className="w-full max-w-4xl mt-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold mb-3">Find your next role</h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Job Track is a simple way to browse open positions and keep every
            application you've made in one place — no more losing track of
            what you applied to and when.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <Link
              to="/jobs"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-6 py-3 transition-colors"
            >
              Browse jobs
            </Link>
            {!token && (
              <Link
                to="/register"
                className="border border-slate-600 hover:bg-slate-700 text-white font-medium rounded-md px-6 py-3 transition-colors"
              >
                Create an account
              </Link>
            )}
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Recently added</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentJobs.map((job) => (
            <div
              key={job.id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <span className="text-blue-400 font-semibold text-sm">
                  {job.company_name.charAt(0)}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-1">{job.company_name}</h3>
              <p className="text-sm text-slate-400">{job.job_title}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;