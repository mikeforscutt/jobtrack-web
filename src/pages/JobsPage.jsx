import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";

function JobsPage({ token, onLogout, applications, onApplied }) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceTimeout = useRef(null);

  const appliedJobIds = applications.map((app) => app.job_id);

  useEffect(() => {
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(debounceTimeout.current);
  }, [searchInput]);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch(
          import.meta.env.VITE_API_URL +
            `/jobs?pageNumber=${currentPage}&pageSize=9&search=${encodeURIComponent(debouncedSearch)}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        setJobs(data.jobs);
        setTotalPages(Math.ceil(data.totalJobs / data.pageSize));
      } catch (error) {
        console.error(error);
      }
    }

    fetchJobs();
  }, [currentPage, debouncedSearch]);

  const handleApply = async (jobId) => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ job_id: jobId }),
        },
      );

      if (!response.ok) {
        return;
      }

      onApplied();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout token={token} onLogout={onLogout}>
      <div className='w-full max-w-6xl px-4 mt-12'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-3xl font-semibold'>Open positions</h1>
            <p className='text-slate-400 mt-1'>
              {totalPages > 0 ? `Page ${currentPage} of ${totalPages}` : ""}
            </p>
          </div>
        </div>

        <input
          type='text'
          placeholder='Search by company or role'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className='w-full max-w-sm px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors mb-6'
        />

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 items-start'>
          {jobs.map((job) => {
            const applied = appliedJobIds.includes(job.id);
            return (
              <div
                key={job.id}
                className='bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between hover:border-blue-500/50 transition-colors'
              >
                <div>
                  <div className='w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4'>
                    <span className='text-blue-400 font-semibold text-sm'>
                      {job.company_name.charAt(0)}
                    </span>
                  </div>
                  <h2 className='text-lg font-semibold mb-1'>
                    {job.company_name}
                  </h2>
                  <p className='text-sm text-slate-400 mb-4'>{job.job_title}</p>
                </div>

                {applied ? (
                  <span className='text-sm font-medium text-green-400 flex items-center gap-1.5'>
                    ✓ Applied
                  </span>
                ) : (
                  <button
                    type='button'
                    onClick={() => handleApply(job.id)}
                    className='bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md py-2 transition-colors'
                  >
                    Apply now
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {jobs.length === 0 && (
          <p className='text-slate-400 text-center mb-8'>
            No jobs match your search.
          </p>
        )}

        <div className='flex justify-center items-center gap-4'>
          <button
            type='button'
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className='text-sm border border-slate-600 rounded-md px-4 py-2 hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent'
          >
            Previous
          </button>
          <span className='text-sm text-slate-400'>
            Page {currentPage} of {totalPages}
          </span>
          <button
            type='button'
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className='text-sm border border-slate-600 rounded-md px-4 py-2 hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent'
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default JobsPage;
