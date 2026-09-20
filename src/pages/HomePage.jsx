import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";

function HomePage({ token, onLogout }) {
  const [recentJobs, setRecentJobs] = useState([]);
  const [popularJobs, setPopularJobs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [recentResponse, popularResponse] = await Promise.all([
          fetch(import.meta.env.VITE_API_URL + "/jobs/recent"),
          fetch(import.meta.env.VITE_API_URL + "/jobs/popular"),
        ]);
        const [recentData, popularData] = await Promise.all([
          recentResponse.json(),
          popularResponse.json(),
        ]);
        setRecentJobs(recentData);
        setPopularJobs(popularData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  return (
    <Layout token={token} onLogout={onLogout}>
      <div className='w-full max-w-5xl mt-10 px-4 pb-16'>
        <div className='text-center mb-16'>
          <span className='inline-block text-xs font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-4'>
            Now tracking {recentJobs.length > 0 ? "live" : ""} listings
          </span>
          <h1 className='text-5xl font-semibold mb-4 tracking-tight'>
            Find your next role
          </h1>
          <p className='text-slate-400 max-w-lg mx-auto text-lg'>
            Browse open positions and keep every application in one place — no
            more losing track of what you applied to and when.
          </p>
          <div className='flex items-center justify-center gap-3 mt-8'>
            <Link
              to='/jobs'
              className='bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-6 py-3 transition-colors'
            >
              Browse jobs
            </Link>
            {!token && (
              <Link
                to='/register'
                className='border border-slate-600 hover:bg-slate-700 text-white font-medium rounded-md px-6 py-3 transition-colors'
              >
                Create an account
              </Link>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
          <div className='lg:col-span-3'>
            <h2 className='text-lg font-semibold mb-4'>Recently added</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className='bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-blue-500/50 transition-colors'
                >
                  <div className='flex items-start gap-3'>
                    <div className='w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0'>
                      <span className='text-blue-400 font-semibold text-xs'>
                        {job.company_name.charAt(0)}
                      </span>
                    </div>
                    <div className='min-w-0'>
                      <p className='font-medium text-sm truncate'>
                        {job.company_name}
                      </p>
                      <p className='text-sm text-slate-400 truncate'>
                        {job.job_title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='lg:col-span-2'>
            <h2 className='text-lg font-semibold mb-4'>Trending now</h2>
            <div className='bg-slate-800 border border-slate-700 rounded-xl divide-y divide-slate-700'>
              {popularJobs.map((job, index) => (
                <div key={job.id} className='flex items-center gap-4 p-4'>
                  <span className='text-2xl font-semibold text-slate-600 w-6 flex-shrink-0'>
                    {index + 1}
                  </span>
                  <div className='min-w-0 flex-1'>
                    <p className='font-medium text-sm truncate'>
                      {job.company_name}
                    </p>
                    <p className='text-sm text-slate-400 truncate'>
                      {job.job_title}
                    </p>
                  </div>
                  <span className='text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full flex-shrink-0'>
                    {job.application_count}{" "}
                    {job.application_count === 1 ? "applicant" : "applicants"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;