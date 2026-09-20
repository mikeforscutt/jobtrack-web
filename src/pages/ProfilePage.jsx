import Layout from "../components/layout/Layout.jsx";

function decodeToken(token) {
  if (!token) return null;
  return JSON.parse(atob(token.split(".")[1]));
}

function ProfilePage({
  token,
  onLogout,
  applications,
  error,
  editingApplication,
  editStatus,
  setEditStatus,
  handleEditClick,
  handleEditSave,
  handleEditCancel,
  handleDelete,
}) {
  const user = decodeToken(token);
  const interviewingCount = applications.filter((a) => a.status === "interviewing").length;
  const offeredCount = applications.filter((a) => a.status === "offered").length;

  return (
    <Layout token={token} onLogout={onLogout}>
      <div className="w-full max-w-lg mt-12">
        <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-slate-900/50 px-8 py-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-400 font-semibold text-2xl">
                {user?.email ? user.email.charAt(0).toUpperCase() : "?"}
              </span>
            </div>
            <div>
              <p className="font-semibold text-lg">{user?.email || "Unknown"}</p>
              <p className="text-sm text-slate-400 capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-slate-700 border-b border-slate-700">
            <div className="px-6 py-4 text-center">
              <p className="text-2xl font-semibold">{applications.length}</p>
              <p className="text-xs text-slate-400 mt-1">Applications</p>
            </div>
            <div className="px-6 py-4 text-center">
              <p className="text-2xl font-semibold">{interviewingCount}</p>
              <p className="text-xs text-slate-400 mt-1">Interviewing</p>
            </div>
            <div className="px-6 py-4 text-center">
              <p className="text-2xl font-semibold">{offeredCount}</p>
              <p className="text-xs text-slate-400 mt-1">Offered</p>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-lg font-semibold mb-4">My applications</h2>

            {applications.length === 0 ? (
              <p className="text-slate-400 text-sm">No applications yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {applications.map((app) => (
                  <li
                    key={app.id}
                    className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-blue-500/50 transition-colors"
                  >
                    {editingApplication === app.id ? (
                      <form onSubmit={handleEditSave} className="flex flex-col gap-3">
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
                        >
                          <option value="applied">Applied</option>
                          <option value="interviewing">Interviewing</option>
                          <option value="offered">Offered</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 rounded-md py-2 px-4 text-sm font-medium transition-colors"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={handleEditCancel}
                            className="text-sm text-slate-400 hover:text-slate-200 px-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-400 font-semibold text-xs">
                              {app.company_name.charAt(0)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{app.company_name}</p>
                            <p className="text-sm text-slate-400 truncate">{app.job_title}</p>
                            <p className="text-xs text-slate-500 capitalize mt-0.5">
                              {app.status}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3 flex-shrink-0">
                          <button
                            onClick={() => handleEditClick(app)}
                            className="text-sm border border-slate-600 rounded-md px-3 py-1.5 hover:bg-slate-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="text-sm text-red-400 border border-red-900/50 rounded-md px-3 py-1.5 hover:bg-red-950/50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProfilePage;